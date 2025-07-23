// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "../config/config";

dotenv.config();

const mongoURL = config.databaseUrl;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
