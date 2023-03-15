import { Request, Response } from "express";
import { db } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/httpError.js";
import response from "../utils/response.js";

export const register = (req: Request, res: Response) => {
  // CHECK USER IF EXIST
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [req.body.username], (err, data) => {
    if (err) return createError(500, err);
    if (data.length)
      response({ res, status: 409, message: "User already exists" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    const query =
      "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";

    db.query(query, [values], (err, data) => {
      if (err) return createError(500, err);
      return response({ res, status: 201, message: "User has been created" });
    });
  });
};

export const logIn = (req: Request, res: Response) => {
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [req.body.username], (err, data) => {
    if (err) return createError(500, err);
    if (data.length === 0)
      return response({ res, status: 404, message: "User not found" });

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return response({
        res,
        status: 400,
        message: "Wrong password or username!",
      });

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_KEY as string);

    const { password, ...others } = data[0];
    response({
      res: res.cookie("accessToken", token, { httpOnly: true }),
      message: "User has been logged in",
      data: others,
    });
  });
};

export const logOut = (req: Request, res: Response) => {
  response({
    res: res.clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    }),
    message: "User has been logged out",
  });
};
