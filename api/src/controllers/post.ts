import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { db } from "../db";
import moment from "moment";
import * as dotenv from "dotenv";

dotenv.config();

export const getPosts = (req: Request, res: Response) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profileImg FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profileImg FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
    ORDER BY p.createdAt DESC
    `;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(query, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created");
    });
  });
};

export const deletePost = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

    db.query(query, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};
