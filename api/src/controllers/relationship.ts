import { Request, Response } from "express";
import { db } from "../db";
import response from "../utils/response";
import createError from "../utils/httpError";
import { AuthRequest } from "../entities/auth.entity";

export const getRelationships = (req: Request, res: Response) => {
  const query = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;

  db.query(query, [req.query.followedUserId], (err, data) => {
    if (err) return createError(500, err);
    return response({
      res,
      data: data.map(
        (relationship: { followerUserId: any }) => relationship?.followerUserId
      ),
      message: "Relationships fetched successfully",
    });
  });
};

export const addRelationships = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const query =
    "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";

  const values = [userId, req.body.userId];
  db.query(query, [values], (err, data) => {
    if (err) return createError(500, err);
    return response({ res, data, message: "Relationship added successfully" });
  });
};

export const deleteRelationships = (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const query =
    "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

  db.query(query, [userId, req.query.userId], (err, data) => {
    if (err) return createError(500, err);
    return response({
      res,
      data,
      message: "Relationship deleted successfully",
    });
  });
};
