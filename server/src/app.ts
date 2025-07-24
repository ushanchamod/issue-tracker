import express from "express";
import { errorHandler } from "./middlewares";
import cookieParser from "cookie-parser";
import { issueRouter, userRouter } from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import config from "./config/config";

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method}, Request URL: ${req.url}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/api/issue", issueRouter);
app.use("/api/user", userRouter);

app.use(errorHandler);

export default app;
