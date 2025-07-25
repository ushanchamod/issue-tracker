import { Router } from "express";
import {
  GetMe,
  GetMyStatistic,
  GetUserIssues,
  UpdateUser,
  UserLogin,
  UserLogout,
  UserRegister,
} from "../controllers";
import { useGuard, validateData } from "../middlewares";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../validators/user.dto";

const router = Router();

router.post("/register", validateData(createUserSchema), UserRegister);
router.post("/login", validateData(loginUserSchema), UserLogin);
router.post("/logout", UserLogout);
router.get("/me", useGuard, GetMe);
router.get("/statistics", useGuard, GetMyStatistic);
router.put("/me", useGuard, validateData(updateUserSchema), UpdateUser);
router.get("/my-issues", useGuard, GetUserIssues);

export { router as userRouter };
