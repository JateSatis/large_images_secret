import sharp from "sharp";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { S3DataSource } from "../config/s3Config";
import { Request, Response } from "express";
import { prisma } from "../config/postgresConfig";

dotenv.config();

export const processImage = async (req: Request, res: Response) => {
  const pathToFile = path.join(__dirname, "../large_image.jpg");
  await divideImageToTiles(pathToFile, "processed_image");
  res.sendStatus(200);
};

const divideImageToTiles = async (filePath: string, fileName: string) => {
  const originalName = fileName;
  fileName = S3DataSource.generateUniqueImageName();
  const outputDir = path.join(__dirname, "../temp_tiles"); // Временная директория для хранения тайлов
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  console.log(fileName);

  const dziFilePath = path.join(outputDir, `${fileName}`);

  // Увеличение лимита на количество пикселей (например, до 1 миллиарда)
  sharp.concurrency(4); // Оптимизация использования CPU
  sharp.cache({ items: 100, memory: 1024, files: 20 }); // Увеличение лимитов кеша
  // Генерация тайлов
  await sharp(filePath, { limitInputPixels: 1e10 })
    .tile({
      size: 1080, // Размер тайлов
      layout: "dz", // Структура Deep Zoom
      overlap: 2, // Наложение между тайлами
    })
    .toFile(dziFilePath);

  // Загрузка .dzi файла в S3
  const dziKey = `tiles/${fileName}/${fileName}.dzi`;
  console.log(dziKey);
  const dziContent = fs.readFileSync(`${dziFilePath}.dzi`);
  await S3DataSource.uploadImageToS3(dziKey, dziContent, "application/xml");

  // Загрузка тайлов в S3
  const uploadTiles = async (dirPath: string, baseKey: string) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await uploadTiles(fullPath, `${baseKey}/${file}`);
      } else {
        const tileKey = `${baseKey}/${file}`;
        const tileContent = fs.readFileSync(fullPath);
        await S3DataSource.uploadImageToS3(tileKey, tileContent, "image/jpeg");
      }
    }
  };

  const tilesDir = path.join(outputDir, `${fileName}_files`);
  const baseTileKey = `tiles/${fileName}/${fileName}_files`;
  await uploadTiles(tilesDir, baseTileKey);

  await prisma.image.create({
    data: {
      originalName,
      dziKey,
    },
  });

  // Очистка временной директории
  fs.rmSync(outputDir, { recursive: true, force: true });
};
