import { Response } from "express";
import { AiAuthenticatedRequest } from "../middlewares";
import { SecureChat } from "../service/ai_service";

export const AiChat = async (req: AiAuthenticatedRequest, res: Response) => {
  const response = await SecureChat({
    message: req.body.message,
    userId: req?.user?.id || null,
    authToken: req?.token || "",
  });
  res.send(response);
};
