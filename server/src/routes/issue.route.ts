import { Router } from "express";
import {
  CreateIssue,
  DeleteIssue,
  GetUserIssueByID,
  UpdateIssue,
} from "../controllers";
import {
  isAuthorizedToAccessIssue,
  useGuard,
  validateData,
} from "../middlewares";
import { createIssueSchema } from "../validators/issue.dto";

const router = Router();

router.post("/", useGuard, validateData(createIssueSchema), CreateIssue);
router.get("/:issueID", useGuard, isAuthorizedToAccessIssue, GetUserIssueByID);
router.patch(
  "/:issueID",
  useGuard,
  validateData(createIssueSchema),
  isAuthorizedToAccessIssue,
  UpdateIssue
);

router.delete("/:issueID", useGuard, isAuthorizedToAccessIssue, DeleteIssue);

export { router as issueRouter };
