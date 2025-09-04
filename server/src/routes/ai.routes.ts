import { Router } from "express";
import { AiChat } from "../controllers";
import { AiGuard } from "../middlewares";

const router = Router();

router.post("/chat", AiGuard, AiChat);

export { router as AiRouter };
