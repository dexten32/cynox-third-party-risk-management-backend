// middleware/verifyToken.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "./auth"; // Import your custom request type

const JWT_SECRET = process.env.JWT_SECRET!;

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as AuthenticatedRequest["user"];
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
