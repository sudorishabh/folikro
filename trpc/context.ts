import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createTRPCContext() {
  const session = await getServerSession(authOptions);

  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
