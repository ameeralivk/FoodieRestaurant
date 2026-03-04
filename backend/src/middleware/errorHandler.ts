import { Request, Response} from "express";

export const errorHandler = (err: any, req: Request, res: Response) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({
    success: false,
    message,
  });
};
