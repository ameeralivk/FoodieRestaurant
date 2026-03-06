import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../constants/messages";

export const authorizeRoles = (
  ...allowedRoles: string[]
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req, res, next) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: MESSAGES.ADMIN_UNAUTHERIZED_ERROR });
      return;
    }
    next();
  };
};
