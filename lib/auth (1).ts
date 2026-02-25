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
          throw new Error("Invalid credentials");
        }

        const [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email))
          .limit(1);

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Handle Google sign-in: auto-create user if not exists
      if (account?.provider === "google" && user.email) {
        const [existingUser] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, user.email))
          .limit(1);

        if (!existingUser) {
          // Auto-create user from Google account
          const username = user.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
          await db.insert(usersTable).values({
            email: user.email,
            name: user.name || "User",
            username: `${username}-${Date.now().toString(36)}`,
            avatar: user.image || null,
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
