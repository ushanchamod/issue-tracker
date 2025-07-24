import z from "zod";

export const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  severity: z.enum(["low", "medium", "high"], {
    error: "Severity is required",
  }),
  priority: z.enum(["low", "normal", "high"], {
    error: "Priority is required",
  }),
  status: z.enum(["open", "in-progress", "testing", "resolved", "closed"], {
    error: "Status is required",
  }),
});

export type CreateIssueFormInputs = z.infer<typeof issueSchema>;
