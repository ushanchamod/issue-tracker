import jwt from "jsonwebtoken";
import config from "../config/config";
import { sendError } from "../utils";
import { NextFunction, Request, Response } from "express";
import { IssueModel } from "../models";

export interface AuthenticatedRequest extends Request {
  user?: any; // Define the user type as needed
}

export const useGuard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return sendError(res, "No token provided", 401);
  }

  try {
    if (!config.JWT_SECRET) {
      return sendError(res, "JWT secret is not configured", 500);
    }
    const decoded = jwt.verify(token, config.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, "Forbidden", 403);
  }
};

export const isAuthorizedToAccessIssue = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { issueID } = req.params;
  const { id } = req.user;

  try {
    const issue = await IssueModel.findById(issueID);

    if (!issue) {
      return sendError(res, "Issue not found", 404);
    }

    if (issue.createdBy!.toString() !== id) {
      return sendError(
        res,
        "You do not have permission to access this issue",
        403
      );
    }

    next();
  } catch (error) {
    return sendError(res, "Failed to authorize access", 500);
  }
};
