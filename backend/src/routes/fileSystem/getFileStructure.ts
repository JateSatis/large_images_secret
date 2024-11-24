import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const getFileStructure = async (req: Request, res: Response) => {
  let fileStructure;
  try {
    fileStructure = await prisma.folder.findFirst({
      where: {
        parentId: null,
      },
      include: {
        children: {
          include: {
            children: true,
            images: true,
          },
        },
        images: true,
      },
    });
  } catch (error) {
    res.status(200).json(error);
  }

  res.status(200).json(fileStructure);
};
