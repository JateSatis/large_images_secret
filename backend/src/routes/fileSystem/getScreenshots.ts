import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const getScreenshots = async (req: Request, res: Response) => {
  let screenshots;
  try {
    screenshots = await prisma.screenshot.findMany();
  } catch (error) {
    res.status(400).json(error);
  }

  res.status(200).json(screenshots);
};
