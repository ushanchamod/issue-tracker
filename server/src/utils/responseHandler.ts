import { Request, Response, NextFunction } from "express";

export const sendSuccess = (
  res: Response,
  data: any,
  message = "Success",
  statusCode = 200
) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  errorMessage = "Error",
  statusCode = 500,
  error: any = null
) => {
  console.error(errorMessage, error);
  res.status(statusCode).json({
    status: "error",
    message: errorMessage,
    error,
  });
};
