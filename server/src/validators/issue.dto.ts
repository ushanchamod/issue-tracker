import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string("Title is required").min(1, "Title must not be empty"),
  description: z
    .string("Description is required")
    .min(1, "Description must not be empty"),
  severity: z.enum(["low", "medium", "high"]).default("medium"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  status: z
    .enum(["open", "in-progress", "testing", "resolved", "closed"])
    .default("open"),
});
