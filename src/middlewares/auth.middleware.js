import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).send({
        message: "Unauthorized request",
      });
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findByPk(decodeToken?.user_id, {
      attributes: { exclude: ["password_hash", "refreshToken"] },
    });

    if (!user) {
      res.status(401).send({
        message: "Invalid Access Token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      error: error,
      message: "Invalid or expired token",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin privileges required",
    });
  }
  next();
};
