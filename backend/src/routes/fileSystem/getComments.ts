import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const getComments = async (req: Request, res: Response) => {
  const comments = await prisma.comment.findMany();

  res.status(200).json(comments);
};
