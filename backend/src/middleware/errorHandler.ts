// import { Request, Response} from "express";

// export const errorHandler = (err: any, req: Request, res: Response) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Something went wrong";
//   res.status(statusCode).json({
//     success: false,
//     message,
//   });
// };

import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
