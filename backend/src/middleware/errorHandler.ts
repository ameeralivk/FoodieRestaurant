
import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: unknown, // ✅ use unknown instead of any
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof Error) {
    message = err.message;

    // narrow further for statusCode
    if ("statusCode" in err && typeof (err as any).statusCode === "number") {
      statusCode = (err as AppError).statusCode!;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};