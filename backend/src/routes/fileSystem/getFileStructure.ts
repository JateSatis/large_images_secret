import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const getFileStructure = async (req: Request, res: Response) => {
  let fileStructure;
  try {
    fileStructure = await prisma.folder.findFirst({
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
  } catch (error) {
    res.status(200).json(error);
  }

  res.status(200).json(fileStructure);
};
