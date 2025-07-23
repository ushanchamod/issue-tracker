import express from "express";
import { errorHandler } from "./middlewares";

const app = express();

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Issue Tracker API");
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
