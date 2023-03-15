import { Request, Response } from "express";
import { db } from "../db";
import moment from "moment";
import createError from "../utils/httpError.js";
import response from "../utils/response.js";
import { AuthRequest } from "../entities/auth.entity";

export const getComments = (req: Request, res: Response) => {
  const query = `SELECT c.*, u.id AS userId, name, profileImg FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `;
  db.query(query, [req.query.postId], (err, data) => {
    if (err) return createError(500, err);
    return response({ res, data, message: "Comments fetched successfully" });
  });
};

export const addComment = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const query =
    "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";

  const values = [
    req.body.desc,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    userId,
    req.body.postId,
  ];
  db.query(query, [values], (err, data) => {
    if (err) return createError(500, err);
    return response({
      res,
      status: 201,
      message: "Comment has been added",
    });
  });
};

export const deleteComment = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const commentId = req.params.id;
  const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

  db.query(q, [commentId, userId], (err, data) => {
    if (err) return createError(500, err);
    if (data.affectedRows > 0)
      return response({ res, message: "Comment has been deleted" });
    return createError(403, "You can only delete your own comments!");
  });
};
