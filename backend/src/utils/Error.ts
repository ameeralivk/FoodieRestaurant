// // src/utils/AppError.ts
// export class AppError extends Error {
//   statusCode: number;
//   constructor(message: string, statusCode = 500) {
//     super(message);
//     this.statusCode = statusCode;
//     Object.setPrototypeOf(this, AppError.prototype);
//   }
// }

export class AppError extends Error {
  statusCode: number;

  constructor(error: unknown, statusCode = 500) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
