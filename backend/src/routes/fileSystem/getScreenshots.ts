import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const getScreenshots = async (req: Request, res: Response) => {
  const screenshots = await prisma.screenshot.findMany();

  res.status(200).json(screenshots);
};
