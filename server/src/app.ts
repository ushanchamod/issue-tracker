import express from "express";
import { errorHandler } from "./middlewares";
import { UserModel } from "./models";
import { sendSuccess } from "./utils";
import { issueRouter, userRouter } from "./routes";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method}, Request URL: ${req.url}`);
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/issue", issueRouter);
app.use("/api/user", userRouter);

app.use(errorHandler);

export default app;
