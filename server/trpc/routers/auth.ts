import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input }) => {
      // Check if user already exists
      const [existing] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, input.email))
        .limit(1);

      if (existing) {
        throw new Error("A user with this email already exists");
      }

      // Generate unique username from email
      const baseUsername = input.email
        .split("@")[0]
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase();
      let username = baseUsername;
      let suffix = 1;

      while (true) {
        const [conflict] = await db
          .select({ id: usersTable.id })
          .from(usersTable)
          .where(eq(usersTable.username, username))
          .limit(1);

        if (!conflict) break;
        username = `${baseUsername}${suffix++}`;
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(input.password, 12);

      await db.insert(usersTable).values({
        email: input.email,
        name: input.name,
        username,
        password: hashedPassword,
      });

      return { message: "Account created successfully" };
    }),
});
