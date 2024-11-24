import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const createComment = async (req: Request, res: Response) => {
  const { x, y, dziKey, text } = req.body;

  if (!x || !y || !dziKey || !text) {
    res.status(400).json({
      name: "Not all fields provided",
    });
    return;
  }

  let comment;
  try {
    comment = await prisma.comment.create({
      data: {
        text,
        dziKey,
        viewportX: x,
        viewportY: y,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }

  res.status(200).json(comment);
};
