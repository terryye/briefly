import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
//import { format } from "date-fns";

import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "../db";

const t_article = schema.article;
export type Article = typeof t_article.$inferSelect;

export default createTRPCRouter({
    latest: publicProcedure.query(async () => {
        const result = await db
            .select()
            .from(t_article)
            .orderBy(desc(t_article.date))
            .limit(1);
        const data = result[0];
        return data;
    }),
    view: publicProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ input }) => {
            const result = await db
                .select()
                .from(t_article)
                .where(eq(t_article.articleId, input.articleId))
                .orderBy(desc(t_article.date))
                .limit(1);

            const data = result[0];
            return data;
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

export const getArticleById = async (articleId: string) => {
    const result = await db
        .select()
        .from(t_article)
        .where(eq(t_article.articleId, articleId))
        .orderBy(desc(t_article.date))
        .limit(1);
    return result[0];
};
