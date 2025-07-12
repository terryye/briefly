import {
    createCallerFactory,
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import { auth } from "@/server/auth";
import { z } from "zod";
import answerRouter from "./answer";
import articleRouter from "./article";
import historyRouter from "./history";
import questionRouter from "./question";
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
    question: questionRouter,
    answer: answerRouter,
    history: historyRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
