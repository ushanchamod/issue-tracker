import axios from "axios";

export type AIRequestSecure = {
  message: string;
  userId: string;
  authToken: string; // Add authToken
};

export type AIResponse = {
  response: string;
};

export const SecureChat = async (
  request: AIRequestSecure
): Promise<AIResponse> => {
  const apiUrl = process.env.AI_SERVICE_URL;

  if (!apiUrl) {
    throw new Error("AI_SERVICE_URL is not defined in environment variables");
  }

  const requestPayload = {
    message: request.message,
    user_id: request.userId,
    auth_token: request.authToken, // Use provided token
  };

  console.log("Request Payload:", requestPayload);

  try {
    const response = await axios.post(`${apiUrl}/chat`, requestPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error communicating with AI service:", error.message);
    throw new Error("Failed to communicate with AI service");
  }
};
