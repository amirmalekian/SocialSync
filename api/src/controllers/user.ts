import { Request, Response } from "express";
import { db } from "../db";
import createError from "../utils/httpError";
import response from "../utils/response";
import { AuthRequest } from "../entities/auth.entity";

export const getUser = (req: Request, res: Response) => {
  const userId = req.params?.userId;
  const query = `SELECT * FROM users WHERE id = ?`;
  db.query(query, [userId], (err, data) => {
    if (err) return createError(500, err);
    const { password, ...info } = data[0];
    return response({ res, data: info, message: "User fetched successfully" });
  });
};

export const updateUser = (req: AuthRequest, res: Response, next: any) => {
  const userId = req.user?.id;
  if (userId !== req.params.userId) {
    return next(createError(401, "You are not authorized to update this user"));
  }
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
      userId,
    ],
    (err, data) => {
      if (err) createError(500, err);
      if (data.affectedRows > 0)
        return response({ res, message: "User updated" });
      return createError(403, "You can only update your own profile!");
    }
  );
};
