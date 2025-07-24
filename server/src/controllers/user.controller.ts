import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils";
import { CreateUserDto } from "../validators/user.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IssueModel, UserModel } from "../models";
import config from "../config/config";
import { AuthenticatedRequest } from "../middlewares";

export const UserRegister = async (req: Request, res: Response) => {
  const { username, email, firstName, lastName, password } = <CreateUserDto>(
    req.body
  );

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  const existingUsername = await UserModel.findOne({ username });

  if (existingUsername) {
    return sendError(res, "Username already exists", 400);
  }

  const existingEmail = await UserModel.findOne({ email });

  if (existingEmail) {
    return sendError(res, "Email already exists", 400);
  }

  try {
    await UserModel.create({
      username,
      email,
      firstName,
      lastName,
      hash: hashedPassword,
    });

    return sendSuccess(res, {
      message: "User registered successfully",
    });
  } catch (error) {
    return sendError(res, "Failed to register user", 500);
  }
};

export const UserLogin = async (req: Request, res: Response) => {
  console.log("UserLogin called with body:", req.body);
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (!user.hash) {
      return sendError(res, "Invalid password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.hash);
    if (!isPasswordValid) {
      return sendError(res, "Invalid password", 401);
    }

    if (!config.JWT_SECRET) {
      return sendError(res, "JWT secret is not configured", 500);
    }
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        id: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    return sendSuccess(res, {
      message: "User logged in successfully",
      data: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    return sendError(res, "Failed to log in user", 500);
  }
};

export const GetMe = async (req: AuthenticatedRequest, res: Response) => {
  const { username } = req.user;

  try {
    const userData = await UserModel.findOne({
      username,
    }).select("-hash");

    if (!userData) {
      return sendError(res, "User not found", 404);
    }
    return sendSuccess(res, {
      message: "User data retrieved successfully",
      data: userData,
    });
  } catch (error) {
    return sendError(res, "Failed to retrieve user data", 500);
  }
};

export const UpdateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { username } = req.user;
  const { firstName, lastName, email } = req.body;

  try {
    const existingUser = await UserModel.findOne({
      email,
    });

    if (existingUser) {
      return sendError(res, "Email already exists", 400);
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select("-hash");

    if (!updatedUser) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, {
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error updating user:", error);

    return sendError(res, "Failed to update user", 500);
  }
};

export const GetUserIssues = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { page, field, severity, priority, status } = req.query;

  try {
    const filter: any = {
      createdBy: req.user.id,
    };

    // Add text search filter if "field" exists
    if (field && typeof field === "string") {
      filter.$or = [
        { title: { $regex: field, $options: "i" } },
        { description: { $regex: field, $options: "i" } },
      ];
    }

    // Optional dropdown filters
    if (severity) filter.severity = severity;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const pageSize = config.resultPageSize || 10;

    if (page) {
      const pageNumber = parseInt(page as string, 10);

      if (isNaN(pageNumber) || pageNumber < 1) {
        return sendError(res, "Invalid page number", 400);
      }

      const totalCount = await IssueModel.countDocuments(filter);
      const pageCount = Math.ceil(totalCount / pageSize);
      const skip = (pageNumber - 1) * pageSize;

      const issues = await IssueModel.find(filter)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 });

      const response = {
        totalCount,
        pageCount,
        pageSize,
        page: pageNumber,
        issues,
      };

      return sendSuccess(res, response, "Issues retrieved successfully");
    }

    // If page is not defined → return all filtered issues
    const issues = await IssueModel.find(filter).sort({ createdAt: -1 });

    return sendSuccess(res, issues, "Issues retrieved successfully");
  } catch (error) {
    console.error("Error retrieving issues:", error);
    return sendError(res, "Failed to retrieve issues", 500);
  }
};
