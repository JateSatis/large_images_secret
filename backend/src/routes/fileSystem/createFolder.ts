import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const createFolder = async (req: Request, res: Response) => {
  const requestBody = req.body;

  const parentPath: string | null = requestBody.parentPath;
  const name: string = requestBody.name;

  if (!name) {
    res.status(400).json({
      message: "Name of the folder not provided",
    });
  }

  let parent = null;
  if (parentPath) {
    parent = await prisma.folder.findFirst({
      where: {
        path: parentPath,
      },
    });
  }

  let parentId = parent?.id || null;

  let path: string = "";
  if (parentPath) {
    path = `${parentPath}/${name}`;
  } else {
    path = name;
  }

  let folder;
  try {
    folder = await prisma.folder.create({
      data: {
        parentId,
        name: name,
        path,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }

  res.status(200).json(folder);
};
