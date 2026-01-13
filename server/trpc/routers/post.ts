import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.text}` };
    }),

  secret: protectedProcedure.query(({ ctx }) => {
    return {
      message: `Welcome ${ctx.session.user?.email}`,
    };
  }),
});
