import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const createFolder = async (req: Request, res: Response) => {
  const requestBody = req.body;

  console.log(JSON.stringify(requestBody));

  const parentPath: string | null = requestBody.parentPath;
  const name: string = requestBody.name;

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

  const folder = await prisma.folder.create({
    data: {
      parentId,
      name: name,
      path,
    },
  });

  res.status(200).json(folder);
};
