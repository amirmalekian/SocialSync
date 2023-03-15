import { Request, Response } from "express";
import { db } from "../db";
import createError from "../utils/httpError.js";
import response from "../utils/response.js";
import { AuthRequest } from "../entities/auth.entity";

export const getLikes = (req: Request, res: Response) => {
  const query = `SELECT userId FROM likes WHERE postId = ?`;

  db.query(query, [req.query.postId], (err, data) => {
    if (err) return createError(500, err);
    return response({
      res,
      data: data.map((like: { userId: any }) => like.userId),
      message: "Likes fetched successfully",
    });
  });
};

export const addLike = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const query = "INSERT INTO likes (`userId`, `postId`) VALUES (?)";

  const values = [userId, req.body.postId];
  db.query(query, [values], (err, data) => {
    if (err) return createError(500, err);
    return response({ res, status: 201, message: "Post has been liked." });
  });
};

export const deleteLike = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const query = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

  db.query(query, [userId, req.query?.postId], (err, data) => {
    if (err) return createError(500, err);
    return response({ res, message: "Post has been unliked." });
  });
};
