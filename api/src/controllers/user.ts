import { Request, Response } from "express";
import { db } from "../db";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const getUser = (req: Request, res: Response) => {
  const userId = req.params?.userId;
  const query = `SELECT * FROM users WHERE id = ?`;
  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.status(200).json(info);
  });
};

export const updateUser = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");
    const query =
      "UPDATE users SET `name` = ?, `city` = ?, `website` = ?, `profileImg` = ?, `coverImg` = ? WHERE id = ?";

    db.query(
      query,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profileImg,
        req.body.coverImg,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};
