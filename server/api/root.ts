import {
    createCallerFactory,
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { auth } from "@/server/auth";
import articleRouter from "./article";
import summaryRouter from "./summary";

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
    article: articleRouter,
    summary: summaryRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
