const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
// const dotenv = require("dotenv");

// dotenv.config();

const processImageToS3 = async (filePath, fileName) => {
  const outputDir = path.join(__dirname, "/temp_tiles"); // Временная директория для хранения тайлов
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

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

  console.log(`Тайлы и .dzi файл сгенерированы в ${outputDir}`);

  // Загрузка .dzi файла в S3
  const dziContent = fs.readFileSync(dziFilePath);
  const dziKey = `tiles/${fileName}/${fileName}.dzi`;
  // await uploadToS3(dziContent, bucketName, dziKey);

  // Загрузка тайлов в S3
  // const tilesDir = path.join(outputDir, `${fileName}_files`);
  // const uploadTiles = async (dirPath, baseKey) => {
  //   const files = fs.readdirSync(dirPath);
  //   for (const file of files) {
  //     const fullPath = path.join(dirPath, file);
  //     const stat = fs.statSync(fullPath);

  //     if (stat.isDirectory()) {
  //       await uploadTiles(fullPath, `${baseKey}/${file}`);
  //     } else {
  //       const tileContent = fs.readFileSync(fullPath);
  //       const tileKey = `${baseKey}/${file}`;
  //       await uploadToS3(tileContent, bucketName, tileKey);
  //     }
  //   }
  // };

  const baseTileKey = `tiles/${fileName}/${fileName}_files`;
  // await uploadTiles(tilesDir, baseTileKey);

  // Очистка временной директории
  // fs.rmSync(outputDir, { recursive: true, force: true });

  console.log(`Тайлы и .dzi файл загружены в S3 под путём tiles/${fileName}/`);
};

processImageToS3("./1.tif", "processed_image");
