import { getServerSession } from "next-auth";

export async function createTRPCContext() {
  const session = await getServerSession();

  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
