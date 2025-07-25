import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  resultPageSize: number;
  databaseUrl: string;
  JWT_SECRET?: string;
  NODE_ENV?: string;
  CORS_ORIGIN?: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  resultPageSize: 10,
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "",
};

export default config;
