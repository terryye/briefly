import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
//import { format } from "date-fns";

import { and, count, desc, eq } from "drizzle-orm";
import { db, schema } from "../db";
import { z } from "zod";
import { askAI } from "../openai";

const t_article = schema.article;
const t_summary = schema.summary;

export type Summary = typeof t_summary.$inferSelect;
export default createTRPCRouter({
    submit: protectedProcedure
        .input(
            z.object({
                articleId: z.number(),
                post: z
                    .string()
                    .min(30, "Summary should have at least 30 characters"),
            })
        )
        .mutation(async ({ input, ctx }) => {
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

            // const { article_id, summary } = input;
            const result = await db
                .select()
                .from(t_article)
                .where(eq(t_article.id, input.articleId))
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
                articleId: article.id,
                score: score,
                post: input.post,
                userId: ctx.session?.user.id,
                feedback: feedback,
            };

            const respond = await db
                .insert(t_summary)
                .values(summary)
                .returning();

            return respond[0];
        }),
    view: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const result = await db
                .select()
                .from(t_article)
                .where(eq(t_article.id, input.id))
                .orderBy(desc(t_article.date))
                .limit(1);

            return result[0];
        }),
    list: publicProcedure.query(async () => {
        const result = await db
            .select()
            .from(t_article)
            .orderBy(desc(t_article.date))
            .limit(100);

        return result;
    }),
});
