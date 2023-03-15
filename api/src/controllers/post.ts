import { Response } from "express";
import { db } from "../db";
import moment from "moment";
import createError from "../utils/httpError.js";
import response from "../utils/response.js";
import { AuthRequest } from "../entities/auth.entity";

export const getPosts = (req: AuthRequest, res: Response) => {
  const userId = req.query.userId;
  const userInfoId = req.user?.id;
  const query =
    userId !== "undefined"
      ? `SELECT p.*, u.id AS userId, name, profileImg FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
      : `SELECT p.*, u.id AS userId, name, profileImg FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
    ORDER BY p.createdAt DESC
    `;

  const values = userId !== "undefined" ? [userId] : [userInfoId, userInfoId];

  db.query(query, values, (err, data) => {
    if (err) return createError(500, err);
    return response({ res, data, message: "Posts fetched successfully" });
  });
};

export const addPost = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const query =
    "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

  const values = [
    req.body.desc,
    req.body.img,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    userId,
  ];
  db.query(query, [values], (err, data) => {
    if (err) return createError(500, err);
    return response({ res, data, message: "Post added successfully" });
  });
};

export const deletePost = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const query = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

  db.query(query, [req.params.id, userId], (err, data) => {
    if (err) return createError(500, err);
    if (data.affectedRows > 0)
      return response({ res, data, message: "Post deleted successfully" });
    return createError(403, "You can delete only your post");
  });
};
