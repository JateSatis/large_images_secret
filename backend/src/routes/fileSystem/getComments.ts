import { Request, Response } from "express";
import { prisma } from "../../config/postgresConfig";

export const getComments = async (req: Request, res: Response) => {
  let comments;
  try {
    comments = await prisma.comment.findMany();
  } catch (error) {
    res.status(500).json(error);
  }

  res.status(200).json(comments || []);
};
