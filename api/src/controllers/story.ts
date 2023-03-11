import { db } from "../db";
import jwt from "jsonwebtoken";
import moment from "moment";
import { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

export const getStories = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  if (!process.env.JWT_KEY) {
    return res.status(500).json("Missing JWT secret key");
  }

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
    LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId= ?) LIMIT 4`;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addStory = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  if (!process.env.JWT_KEY) {
    return res.status(500).json("Missing JWT secret key");
  }

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Story has been created.");
    });
  });
};

export const deleteStory = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  if (!process.env.JWT_KEY) {
    return res.status(500).json("Missing JWT secret key");
  }

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM stories WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Story has been deleted.");
      return res.status(403).json("You can delete only your story!");
    });
  });
};
