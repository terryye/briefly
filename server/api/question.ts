import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
//import { format } from "date-fns";
import { and, asc, count, eq } from "drizzle-orm";
import z from "zod";
import {
    generateQuestions,
    QuestionsGroup,
    QuestionTip,
} from "../ai/llm_questions";
import { db, schema } from "../db";
import { getArticleById } from "./article";

const t_question = schema.question;
export type Question = typeof t_question.$inferSelect;

export enum QuestionType {
    Summary = 1,
    Discussion = 2,
}

export default createTRPCRouter({
    list: publicProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ input }) => {
            const articleId = input.articleId;
            let result = await db
                .select()
                .from(t_question)
                .where(eq(t_question.articleId, articleId))
                .orderBy(asc(t_question.type), asc(t_question.seq))
                .limit(100);

            if (result.length > 0) {
                return result;
            } else {
                const article = await getArticleById(articleId);
                const questions = await generateQuestions(
                    article.title,
                    article.content
                );

                const q = flattenQuestions(questions, articleId);

                result = await db.insert(t_question).values(q).returning();
                return result;
            }
        }),
});

export const getById = async (questionId: string) => {
    const question = await db
        .select()
        .from(t_question)
        .where(eq(t_question.questionId, questionId))
        .limit(1);
    return question[0];
};

function flattenQuestions(questionGroup: QuestionsGroup, articleId: string) {
    const _flatten = (questions: QuestionTip[], type: number) =>
        questions.map((question, seq) => ({
            ...question,
            articleId,
            seq,
            type,
        }));
    const q1 = _flatten(questionGroup.comprehensionQuestions, 1);
    const q2 = _flatten(questionGroup.discussionQuestions, 2);
    return [...q1, ...q2];
}

export async function getQuestionsByArticleId(
    articleId: string,
    type?: number
) {
    const query = db
        .select()
        .from(t_question)
        .where(
            and(
                eq(t_question.articleId, articleId),
                type ? eq(t_question.type, type) : undefined
            )
        );
    if (type) {
        query.orderBy(asc(t_question.seq));
    } else {
        query.orderBy(asc(t_question.type), asc(t_question.seq));
    }
    const result = await query;
    return result;
}

export async function getQuestionsById(questionId: string) {
    const result = await db
        .select()
        .from(t_question)
        .where(eq(t_question.questionId, questionId))
        .limit(1);
    return result[0];
}

export async function getQuestionStatistics(articleId: string) {
    const result = await db
        .select({
            count: count(),
        })
        .from(t_question)
        .where(eq(t_question.articleId, articleId));
    return result[0] ?? { count: 0 };
}
