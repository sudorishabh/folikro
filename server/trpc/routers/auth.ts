import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Validation schema for registration
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const { name, email, password } = input;

      // TODO: Check if user already exists in your database
      // Example:
      // const existingUser = await db.user.findUnique({ where: { email } });
      // if (existingUser) {
      //   throw new Error("User already exists");
      // }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // TODO: Create user in your database
      // Example:
      // const user = await db.user.create({
      //   data: {
      //     name,
      //     email,
      //     password: hashedPassword, // Use the hashed password here
      //   },
      // });

      // For now, return a success message
      // In production, you would return the created user
      return {
        success: true,
        message: "User registered successfully",
        user: {
          name,
          email,
        },
      };
    }),
});
