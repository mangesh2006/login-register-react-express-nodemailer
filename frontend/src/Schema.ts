import { z } from "zod";

const validations = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$#&*?!%]/, {
      message: "Password must contain at least one special character (e.g. @)",
    }),
});

export default validations;
