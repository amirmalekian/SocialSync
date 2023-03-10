import { Request, Response } from "express";
import { db } from "../db";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const getLikes = (req: Request, res: Response) => {
  const query = `SELECT userId FROM likes WHERE postId = ?`;

  db.query(query, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((like: { userId: any }) => like.userId));
  });
};

export const addLike = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query = "INSERT INTO likes (`userId`, `postId`) VALUES (?)";

    const values = [userInfo.id, req.body.postId];
    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been liked.");
    });
  });
};

export const deleteLike = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

    db.query(query, [userInfo?.id, req.query?.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been disliked.");
    });
  });
};
