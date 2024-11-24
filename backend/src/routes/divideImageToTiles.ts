import sharp from "sharp";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { S3DataSource } from "../config/s3Config";

dotenv.config();

export const divideImageToTiles = async (
  fileBuffer: Buffer<ArrayBufferLike>,
  fileName: string
) => {
  fileName = S3DataSource.generateUniqueImageName();
  const outputDir = path.join(__dirname, "../temp_tiles");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const dziFilePath = path.join(outputDir, `${fileName}`);

  console.log("Image is being tiled");

  sharp.cache({ items: 100, memory: 1024, files: 20 });
  // Генерация тайлов
  await sharp(fileBuffer, { limitInputPixels: 1e10 })
    .tile({
      size: 1080,
      layout: "dz",
			overlap: 2,
    })
    .toFile(dziFilePath);

  console.log("Image is being uploaded to S3");

  // Загрузка .dzi файла в S3
  const dziKey = `tiles/${fileName}/${fileName}.dzi`;
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

  // Очистка временной директории
  fs.rmSync(outputDir, { recursive: true, force: true });

  return dziKey;
};
