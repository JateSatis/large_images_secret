import { Request, Response } from "express";
import { prisma } from "../config/postgresConfig";

export const getImagesInfo = async (req: Request, res: Response) => {
  let imagesInfo;
  try {
    imagesInfo = await prisma.image.findMany();
  } catch (error) {
    res.status(500).json(error);
  }

  res.status(200).json(imagesInfo);
  return;
};
