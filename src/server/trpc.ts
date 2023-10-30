import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth/next";
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";

export const createContext = async () => {
  const session = await getServerSession(authOptions);

  return {
    session: session,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(async (opts) => {
  const session = opts.ctx.session;
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return opts.next({
    ctx: {
      user: session.user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthed);
