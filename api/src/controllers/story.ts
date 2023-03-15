import { db } from "../db";
import moment from "moment";
import { Response } from "express";
import { AuthRequest } from "../entities/auth.entity";
import createError from "../utils/httpError";
import response from "../utils/response";

export const getStories = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const q = `SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
    LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId= ?) LIMIT 4`;

  db.query(q, [userId], (err, data) => {
    if (err) return createError(500, err);
    return response({ res, data, message: "Stories fetched successfully" });
  });
};

export const addStory = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";
  const values = [
    req.body.img,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    userId,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return createError(500, err);
    return response({ res, data, message: "Story added successfully" });
  });
};

export const deleteStory = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const q = "DELETE FROM stories WHERE `id`=? AND `userId` = ?";

  db.query(q, [req.params.id, userId], (err, data) => {
    if (err) return createError(500, err);
    if (data.affectedRows > 0)
      return response({ res, message: "Story deleted successfully" });
    return createError(403, "You can only delete your own stories!");
  });
};
