import { Response } from "express";
import { sendError, sendSuccess } from "../utils";
import { AuthenticatedRequest } from "../middlewares";
import { IssueModel } from "../models";
import { generateFiveDigitNumber } from "../utils/helper";

export const CreateIssue = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;

  const { title, description, severity, priority, status } = req.body;

  const id = generateFiveDigitNumber();
  try {
    const newIssue = await IssueModel.create({
      issueId: id,
      title,
      description,
      severity,
      priority,
      status,
      createdBy: user.id,
    });

    return sendSuccess(res, newIssue, "Issue created successfully", 201);
  } catch (error) {
    return sendError(res, "Failed to create issue", 500, null);
  }
};

export const GetUserIssueByID = async (
  req: AuthenticatedRequest,
  res: Response
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
        "You do not have permission to view this issue",
        403
      );
    }

    return sendSuccess(res, {
      message: "Issue retrieved successfully",
      data: issue,
    });
  } catch (error) {
    return sendError(res, "Failed to retrieve issue", 500);
  }
};

export const UpdateIssue = async (req: AuthenticatedRequest, res: Response) => {
  const { issueID } = req.params;
  const { title, description, severity, priority, status } = req.body;

  try {
    const updatedIssue = await IssueModel.findByIdAndUpdate(
      issueID,
      {
        title,
        description,
        severity,
        priority,
        status,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      return sendError(res, "Issue not found", 404);
    }

    return sendSuccess(res, updatedIssue, "Issue updated successfully");
  } catch (error) {
    return sendError(res, "Failed to update issue", 500);
  }
};

export const DeleteIssue = async (req: AuthenticatedRequest, res: Response) => {
  const { issueID } = req.params;

  try {
    const deletedIssue = await IssueModel.findByIdAndDelete(issueID);

    if (!deletedIssue) {
      return sendError(res, "Issue not found", 404);
    }

    return sendSuccess(res, null, "Issue deleted successfully");
  } catch (error) {
    return sendError(res, "Failed to delete issue", 500);
  }
};
