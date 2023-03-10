import { Request, Response } from "express";
import { db } from "../db";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const getRelationships = (req: Request, res: Response) => {
  const query = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;

  db.query(query, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(
        data.map(
          (relationship: { followerUserId: any }) =>
            relationship?.followerUserId
        )
      );
  });
};

export const addRelationships = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query =
      "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";

    const values = [userInfo.id, req.body.userId];
    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationships = (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY || "defaultSecret", (err: any, userInfo: any) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(query, [userInfo?.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};
