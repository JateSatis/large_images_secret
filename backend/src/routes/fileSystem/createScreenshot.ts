import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const createScreenshot = async (req: Request, res: Response) => {
  const { x, y, zoom, dziKey, originalName } = req.body;

  const screenshot = await prisma.screenshot.create({
    data: {
      originalName,
      dziKey,
      viewportX: x,
      viewportY: y,
      viewportZoom: zoom,
    },
  });

  res.status(200).json(screenshot);
};
