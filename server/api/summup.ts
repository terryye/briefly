import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
//import { format } from "date-fns";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { sumUpAnswers } from "../ai/llm_sumup";
import { db, schema } from "../db";
import { getAnswersByArticleId } from "./answer";
import { getArticleById } from "./article";
import { getQuestionsByArticleId, QuestionType } from "./question";

const t_question = schema.question;
export type Question = typeof t_question.$inferSelect;

const t_sumup = schema.sumup;
export type Sumup = typeof t_sumup.$inferSelect;

export default createTRPCRouter({
    view: protectedProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ input, ctx }) => {
            const articleId = input.articleId;
            const userId = ctx.session?.user.id;
            if (!userId) {
                throw new Error("User not found");
            }
            const sumup = await db
                .select()
                .from(t_sumup)
                .where(
                    and(
                        eq(t_sumup.articleId, articleId),
                        eq(t_sumup.userId, userId)
                    )
                );
            if (sumup.length > 0) {
                return sumup[0].message;
            } else {
                //get all data
                const article = await getArticleById(articleId);
                const questionsData = await getQuestionsByArticleId(articleId);
                const answersData = await getAnswersByArticleId(
                    articleId,
                    userId
                );

                //construct data to be [{question, answer, feedback, type}] , using question_id as index
                const [questions, answers, feedbacks] = [[], [], []] as [
                    string[],
                    string[],
                    string[]
                ];
                for (let { question, questionId, type } of questionsData) {
                    const typeName =
                        type === QuestionType.Summary
                            ? "Summary"
                            : "Discussion";
                    questions.push(question + "(type " + typeName + ")");

                    const answer = answersData.find(
                        (answer) => answer.questionId === questionId
                    );
                    if (answer) {
                        answers.push(answer?.answer ?? "");
                        feedbacks.push(JSON.stringify(answer?.feedbacks) ?? "");
                    }
                }

                if (questions.length !== answers.length) {
                    throw new Error("Data mismatch");
                }

                const response = await sumUpAnswers(
                    article.title,
                    article.content,
                    questions,
                    answers,
                    feedbacks
                );
                await db.insert(t_sumup).values({
                    articleId: articleId,
                    userId: userId,
                    message: response.toString(),
                    type: 1,
                });

                return response.toString() as string;
            }
        }),
});
