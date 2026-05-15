import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email))
          .limit(1);

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      const allowedEmail = "rishabhnegi175@gmail.com";
      const incomingEmail =
        (user.email ?? (profile as { email?: string } | undefined)?.email)
          ?.toLowerCase()
          .trim();

      if (!incomingEmail || incomingEmail !== allowedEmail) {
        // Returning a URL blocks sign-in and redirects to our login page.
        return "/auth/login?error=available_soon";
      }

      // For Google sign-in, find or create the user in the database
      if (account?.provider === "google") {
        try {
          const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, incomingEmail))
            .limit(1);

          if (!existingUser) {
            // Generate a unique username from the email prefix
            const baseUsername = incomingEmail
              .split("@")[0]
              .replace(/[^a-z0-9]/gi, "")
              .toLowerCase();
            let username = baseUsername;
            let suffix = 1;

            // Ensure username uniqueness
            while (true) {
              const [conflict] = await db
                .select({ id: usersTable.id })
                .from(usersTable)
                .where(eq(usersTable.username, username))
                .limit(1);

              if (!conflict) break;
              username = `${baseUsername}${suffix++}`;
            }

            await db.insert(usersTable).values({
              email: incomingEmail,
              name: user.name ?? "User",
              username,
              avatar: user.image,
            });
          }

          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          // If the email is allowlisted, don't block sign-in due to a transient DB issue.
          return true;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // On initial sign-in, attach the DB user id
      if (user) {
        const email =
          user.email?.toLowerCase().trim() ??
          (typeof token.email === "string"
            ? token.email.toLowerCase().trim()
            : undefined);

        if (!email) return token;

        try {
          const [dbUser] = await db
            .select({ id: usersTable.id, username: usersTable.username })
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

          if (dbUser) {
            token.id = dbUser.id;
            token.username = dbUser.username;
          }
        } catch (error) {
          console.error("Error during jwt callback:", error);
          // Keep token without DB fields if DB is unavailable.
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
