import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {findUserByEmail} from "../services/userService"
import {User} from "../models/user.model"

interface JwtPayload {
    userId: number;
    email: string;
}
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    if (user.account_status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};