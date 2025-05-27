import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
//import { format } from "date-fns";

import { desc, eq } from "drizzle-orm";
import { db, schema } from "../db";
import { z } from "zod";

const t_article = schema.article;
export type Article = typeof t_article.$inferSelect;

export default createTRPCRouter({
    latest: publicProcedure.query(async () => {
        const result = await db
            .select()
            .from(t_article)
            .orderBy(desc(t_article.date))
            .limit(1);
        return result[0];
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
