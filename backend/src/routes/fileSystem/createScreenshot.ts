import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const createScreenshot = async (req: Request, res: Response) => {
  const { x, y, zoom, dziKey, originalName } = req.body;

  if (!x || !y || !dziKey || !originalName) {
    res.status(400).json({
      name: "Not all fields provided",
    });
    return;
  }

  let screenshot;
  try {
    screenshot = await prisma.screenshot.create({
      data: {
        originalName,
        dziKey,
        viewportX: x,
        viewportY: y,
        viewportZoom: zoom,
      },
    });
  } catch (error) {
    res.status(400).json(error);
    return;
  }

  res.status(200).json(screenshot);
};
