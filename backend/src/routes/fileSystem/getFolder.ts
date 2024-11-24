import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const getFolder = async (req: Request, res: Response) => {
  const requestBody = req.body;

  if (!requestBody) {
    res.sendStatus(200);
    return;
  }

  const path = requestBody.path;

  if (!path) {
    res.status(400).json({
      name: "Path not provided",
    });
  }

  let folder;
  try {
    folder = await prisma.folder.findFirst({
      where: {
        path,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }

  res.status(200).json(folder);
};
