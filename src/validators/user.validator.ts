import { z } from "zod";

export const userIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId"),
});

export const createUserSchema = z.object({
  fullName: z.string().trim().min(1, "fullName is required"),
  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address")),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9]{10,15}$/,
      "phone must be 10 to 15 digits, optionally starting with +",
    ),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
