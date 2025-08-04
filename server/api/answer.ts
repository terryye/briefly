import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { and, avg, count, eq } from "drizzle-orm";
import z from "zod";
import { evaluateAnswer } from "../ai/llm_evaluate";
import { db, schema } from "../db";
import { getArticleById } from "./article";
import { updateHistoryByArticleId } from "./history";
import { getQuestionsByArticleId, getQuestionsById } from "./question";

const t_answer = schema.answer;
export type Answer = typeof t_answer.$inferSelect;
export type Feedback = Answer["feedbacks"];

export default createTRPCRouter({
    list: publicProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ input, ctx }) => {
            const articleId = input.articleId;
            const userId = ctx.session?.user.id;
            return await getAnswersByArticleId(articleId, userId);
        }),
    submit: protectedProcedure
        .input(z.object({ questionId: z.string(), answer: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const questionId = input.questionId;
            const answer = input.answer;

            //get current question info
            const questionInfo = await getQuestionsById(questionId);
            if (!questionInfo) {
                throw new Error("Question not found");
            }
            const { articleId, question, type } = questionInfo;

            //get all questions of the article with the same type as the current question
            const questionsInfo = await getQuestionsByArticleId(
                articleId,
                type
            );
            const questions = questionsInfo.map((q) => q.question);

            const article = await getArticleById(articleId);
            if (!article) {
                throw new Error("Article not found");
            }

            const aiFeedback = await evaluateAnswer(
                article.title,
                article.content,
                questions,
                question,
                type,
                questionInfo.tip,
                questionInfo.answer ?? "",
                answer
            );
            //compose feedbacks
            const feedbacks = [
                { title: "Feedback", content: aiFeedback.feedback },
                { title: "Improved", content: aiFeedback.improved },
            ];

            // save answers and feedbacks to database
            const answerSaved = await db
                .insert(t_answer)
                .values({
                    questionId,
                    userId: ctx.session?.user.id,
                    articleId,
                    answer,
                    score: aiFeedback.score,
                    feedbacks,
                })
                .onConflictDoUpdate({
                    target: [t_answer.questionId, t_answer.userId],
                    set: {
                        answer,
                        score: aiFeedback.score,
                        feedbacks,
                        updateAt: new Date(),
                    },
                })
                .returning();

            //update history
            await updateHistoryByArticleId(articleId, ctx.session?.user.id);
            return answerSaved[0];
        }),
});

export async function getAnswerStatistics(articleId: string, userId: string) {
    const result = await db
        .select({
            count: count(),
            scoreAvg: avg(t_answer.score).mapWith(Number),
        })
        .from(t_answer)
        .where(
            and(eq(t_answer.articleId, articleId), eq(t_answer.userId, userId))
        );

    return result[0] ?? { count: 0, scoreAvg: 0 };
}

export async function getAnswersByArticleId(
    articleId: string,
    userId: string | undefined
) {
    const result = await db
        .select()
        .from(t_answer)
        .where(
            and(
                eq(t_answer.articleId, articleId),
                eq(
                    t_answer.userId,
                    userId ?? "00000000-0000-0000-0000-000000000000"
                )
            )
        )
        .limit(100);
    return result;
}
