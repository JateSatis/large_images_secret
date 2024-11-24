import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const createComment = async (req: Request, res: Response) => {
  const { x, y, dziKey, text } = req.body;

  const comment = await prisma.comment.create({
    data: {
      text,
      dziKey,
      viewportX: x,
      viewportY: y,
    },
  });

  res.status(200).json(comment);
};
