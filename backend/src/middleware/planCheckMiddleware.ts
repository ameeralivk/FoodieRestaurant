import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/Error";
import HttpStatus from "../constants/htttpStatusCode";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { SubscriptionRepo } from "../Repositories/Subscription/Implimentation/SubscriptionRepo";

const PlanRepository = container.get<SubscriptionRepo>(TYPES.SubcriptionRepo);

export const checkActivePlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return next(
        new AppError("Access token missing", HttpStatus.UNAUTHORIZED)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };
    const activePlan = await PlanRepository.findActivePlanByAdminId(decoded.id);
    if (!activePlan) {
      return next(
        new AppError("No active subscription plan", HttpStatus.FORBIDDEN)
      );
    }
    req.activePlan = activePlan
    next();
  } catch (error) {
    console.error(error)
    next(new AppError("Invalid or expired token", HttpStatus.UNAUTHORIZED));
  }
};
