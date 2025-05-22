import {
    createCallerFactory,
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { auth } from "@/server/auth";

export const appRouter = createTRPCRouter({
    test: createTRPCRouter({
        foo: publicProcedure
            .input(z.object({ test: z.string() }))
            .query(({ input }) => {
                return {
                    input,
                };
            }),
    }),
    user: createTRPCRouter({
        info: publicProcedure.query(async () => {
            const session = await auth();
            return session?.user;
        }),
    }),
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
