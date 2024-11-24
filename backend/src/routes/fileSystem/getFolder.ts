import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const getFolder = async (req: Request, res: Response) => {
  const requestBody = req.body;

  if (!requestBody) {
    res.sendStatus(200);
    return;
  }

  const path = requestBody.path;

  const folder = await prisma.folder.findFirst({
    where: {
      path,
    },
  });

  res.status(200).json(folder);
};