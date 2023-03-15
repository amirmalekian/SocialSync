import jwt from "jsonwebtoken";
import createError from "../utils/httpError";
import * as dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
      if (err) return next(createError(401, "Token is not valid!"));
      req.user = user;
      next();
    });
  } catch (err) {
    return next(createError(403, "Authentication failed!"));
  }
};

export const verifyUser = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.userId) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  } catch (err) {
    return next(createError(403, "Authentication failed!"));
  }
};
