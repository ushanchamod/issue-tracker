import mongoose, { Document, Schema, Types } from "mongoose";

export interface IssueType extends Document {
  issueId: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  priority: "low" | "normal" | "high";
  status: "open" | "in-progress" | "testing" | "resolved" | "closed";
  createdBy?: Types.ObjectId | IssueType;
  createdAt: Date;
  updatedAt?: Date;
}

const IssueSchema: Schema = new Schema<IssueType>({
  issueId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  priority: {
    type: String,
    enum: ["low", "normal", "high"],
    default: "normal",
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "testing", "resolved", "closed"],
    default: "open",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export const IssueModel = mongoose.model<IssueType>("Issue", IssueSchema);
