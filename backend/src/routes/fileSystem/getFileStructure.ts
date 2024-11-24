import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const getFileStructure = async (req: Request, res: Response) => {
  const fileStructure = await prisma.folder.findFirst({
    where: {
      parentId: null, // Только корневые папки
    },
    include: {
      children: {
        include: {
          children: true, // Рекурсивно вложенные папки
          images: true, // Включаем изображения в папках
        },
      },
      images: true, // Изображения в текущей папке
    },
  });

  res.status(200).json(fileStructure);
};
