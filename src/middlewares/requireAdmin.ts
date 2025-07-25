import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user || user.role !== "COMPANY") {
    return res.status(403).json({ message: "Admin (Company) access required" });
  }

  next();
};
