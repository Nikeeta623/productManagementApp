import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role?.name !== "ADMIN") {
    res.status(403).json({ message: "Admin access only" });
    return;
  }

  next();
};
