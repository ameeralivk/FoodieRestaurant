import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../constants/messages";

// export const authorizeRoles = (
//   ...allowedRoles: string[]
// ): ((req: Request, res: Response, next: NextFunction) => void) => {
//   return (req, res, next) => {
//     const user = (req as any).user;
//     if (!user || !allowedRoles.includes(user.role)) {
//       res.status(403).json({ message: MESSAGES.ADMIN_UNAUTHERIZED_ERROR });
//       return;
//     }
//     next();
//   };
// };

export const authorizeRoles = (
  ...allowedRoles: string[]
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user) {
      res.status(403).json({ message: MESSAGES.ADMIN_UNAUTHERIZED_ERROR });
      return;
    }

    const userRole = user.role?.toLowerCase();
    const roles = allowedRoles.map(role => role.toLowerCase());

    if (!roles.includes(userRole)) {
      res.status(403).json({ message: MESSAGES.ADMIN_UNAUTHERIZED_ERROR });
      return;
    }

    next();
  };
};