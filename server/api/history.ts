import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { and, count, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "../db";
import { getAnswerStatistics } from "./answer";
import { getQuestionStatistics } from "./question";

const t_history = schema.history;
export type History = typeof t_history.$inferSelect;

export default createTRPCRouter({
    view: protectedProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ input, ctx }) => {
            const result = await db
                .select()
                .from(t_history)
                .where(
                    and(
                        eq(t_history.articleId, input.articleId),
                        eq(t_history.userId, ctx.session?.user.id)
                    )
                )
                .orderBy(desc(t_history.createAt))
                .limit(1);

            return result[0];
        }),
    listByIds: protectedProcedure
        .input(z.object({ articleIds: z.array(z.string()) }))
        .query(async ({ input, ctx }) => {
            const result = await db
                .select()
                .from(t_history)
                .where(
                    and(
                        inArray(t_history.articleId, input.articleIds),
                        eq(t_history.userId, ctx.session.user.id)
                    )
                )
                .orderBy(desc(t_history.createAt))
                .limit(100);

            return result;
        }),
    listByDateRange: protectedProcedure
        .input(z.object({ startDate: z.date(), endDate: z.date() }))
        .query(async ({ input, ctx }) => {
            const result = await db
                .select()
                .from(t_history)
                .where(
                    and(
                        eq(t_history.userId, ctx.session.user.id),
                        gte(t_history.createAt, input.startDate),
                        lte(t_history.createAt, input.endDate)
                    )
                );
            return result;
        }),
    //get user's submission count for last last 31days and All time (according to articleDate)
    badge: protectedProcedure.query(async ({ ctx }) => {
        const result = await db
            .select({
                count: count(),
            })
            .from(t_history)
            .where(
                and(
                    eq(t_history.userId, ctx.session.user.id),
                    gte(
                        t_history.createAt,
                        new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
                    ),
                    eq(t_history.userId, ctx.session.user.id)
                )
            );
        const result2 = await db
            .select({
                count: count(),
            })
            .from(t_history)
            .where(eq(t_history.userId, ctx.session.user.id));
        return {
            last31days: result[0].count,
            allTime: result2[0].count,
        };
    }),
});

export const updateHistoryByArticleId = async (
    articleId: string,
    userId: string,
    {
        questionsNum,
        answersNum,
        score,
    }: {
        questionsNum?: number;
        answersNum?: number;
        score?: number;
    } = {}
) => {
    if (questionsNum == undefined) {
        const questionStatistics = await getQuestionStatistics(articleId);
        questionsNum = questionStatistics.count;
    }
    if (answersNum == undefined || score == undefined) {
        const answerStatistics = await getAnswerStatistics(articleId, userId);
        answersNum = answerStatistics.count;
        score = answerStatistics.scoreAvg;
    }

    //save history
    let updateinfo = {
        questionsNum,
        answersNum,
        score: Math.floor(score),
        updateAt: new Date(),
    };

    await db
        .insert(t_history)
        .values({
            articleId,
            userId: userId,
            ...updateinfo,
        })
        .onConflictDoUpdate({
            target: [t_history.articleId, t_history.userId],
            set: updateinfo,
        });
    return updateinfo;
};
