import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

// register
export const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Invalid email address"),
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be at most 20 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type registerFormInputs = z.infer<typeof registerSchema>;
