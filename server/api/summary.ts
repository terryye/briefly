import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { and, count, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "../db";
import { askAI } from "../openai";
import { format } from "date-fns";
const t_article = schema.article;
const t_summary = schema.summary;

export type Summary = typeof t_summary.$inferSelect;
export default createTRPCRouter({
    submit: protectedProcedure
        .input(
            z.object({
                articleId: z.string(),
                summaryId: z.string().optional(),
                post: z
                    .string()
                    .min(30, "Summary should have at least 30 characters"),
            })
        )
        .mutation(async ({ input, ctx }) => {
            /*
            const countRes = await db
                .select({ count: count() })
                .from(t_summary)
                .where(
                    and(
                        eq(t_summary.userId, ctx.session?.user.id),
                        eq(t_summary.articleId, input.articleId)
                    )
                )
                .limit(1);
            if (countRes[0].count > 10) {
                throw new Error(
                    "You can only submit 10 summaries for this article"
                );
            }
            */
            /*
            if (input.summaryId) {
                const result = await db
                    .select()
                    .from(t_summary)
                    .where(
                        and(
                            eq(t_summary.summaryId, input.summaryId),
                            eq(t_summary.userId, ctx.session?.user.id)
                        )
                    );
                if (result.length === 0) {
                    throw new Error("You do not have access to this summary");
                }
            }
            */
            const result = await db
                .select()
                .from(t_article)
                .where(eq(t_article.articleId, input.articleId))
                .limit(1);
            const article = result[0];

            const feedback = await askAI(
                article.title,
                article.content,
                input.post
            );

            const score =
                feedback.accuracy.score +
                feedback.clarity.score +
                feedback.language.score +
                feedback.paraphrasing.score;

            const summary = {
                articleId: article.articleId,
                score: score,
                post: input.post,
                userId: ctx.session?.user.id,
                feedback: feedback,
                articleDate: article.date,
            };

            const respond = await db
                .insert(t_summary)
                .values(summary)
                .onConflictDoUpdate({
                    target: [t_summary.articleId, t_summary.userId],
                    set: summary,
                })
                .returning();

            return respond[0];
        }),
    view: protectedProcedure
        .input(z.object({ summaryId: z.string() }))
        .query(async ({ input, ctx }) => {
            const result = await db
                .select()
                .from(t_summary)
                .where(
                    and(
                        eq(t_summary.summaryId, input.summaryId),
                        eq(t_summary.userId, ctx.session?.user.id)
                    )
                )
                .orderBy(desc(t_summary.createAt))
                .limit(1);

            return result[0];
        }),
    listByIds: protectedProcedure
        .input(z.object({ articleIds: z.array(z.string()) }))
        .query(async ({ input, ctx }) => {
            const result = await db
                .select()
                .from(t_summary)
                .where(
                    and(
                        inArray(t_summary.articleId, input.articleIds),
                        eq(t_summary.userId, ctx.session.user.id)
                    )
                )
                .orderBy(desc(t_summary.createAt))
                .limit(100);

            return result;
        }),
    listByDateRange: protectedProcedure
        .input(z.object({ startDate: z.date(), endDate: z.date() }))
        .query(async ({ input, ctx }) => {
            const result = await db
                .select()
                .from(t_summary)
                .where(
                    and(
                        eq(t_summary.userId, ctx.session.user.id),
                        gte(
                            t_summary.articleDate,
                            format(input.startDate, "yyyy-MM-dd")
                        ),
                        lte(
                            t_summary.articleDate,
                            format(input.endDate, "yyyy-MM-dd")
                        )
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
            .from(t_summary)
            .where(
                and(
                    eq(t_summary.userId, ctx.session.user.id),
                    gte(
                        t_summary.articleDate,
                        format(
                            new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), //31 days ago
                            "yyyy-MM-dd"
                        )
                    ),
                    eq(t_summary.userId, ctx.session.user.id)
                )
            );
        const result2 = await db
            .select({
                count: count(),
            })
            .from(t_summary)
            .where(eq(t_summary.userId, ctx.session.user.id));
        return {
            last31days: result[0].count,
            allTime: result2[0].count,
        };
    }),
});
