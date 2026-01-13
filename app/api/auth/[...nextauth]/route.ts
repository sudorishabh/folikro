import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs"; // Uncomment when implementing database integration

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

        // TODO: Fetch user from your database
        // Example:
        // const user = await db.user.findUnique({
        //   where: { email: credentials.email },
        // });
        //
        // if (!user || !user.password) {
        //   throw new Error("Invalid credentials");
        // }
        //
        // const isPasswordValid = await bcrypt.compare(
        //   credentials.password,
        //   user.password
        // );
        //
        // if (!isPasswordValid) {
        //   throw new Error("Invalid credentials");
        // }
        //
        // return {
        //   id: user.id,
        //   email: user.email,
        //   name: user.name,
        // };

        // For now, return null (no user found)
        // Replace this with actual database logic
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
