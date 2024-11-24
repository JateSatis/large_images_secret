import { Request, Response } from "express";
import { prisma } from "../config/postgresConfig";

export const getImagesInfo = async (req: Request, res: Response) => {
  const imagesInfo = await prisma.image.findMany();

  res.status(200).json(imagesInfo);
  return;
};
