import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";

export const requireCompany = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user || user.role !== "COMPANY") {
    return res.status(403).json({ message: "Company access required" });
  }

  next();
};
