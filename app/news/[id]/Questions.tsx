"use client";
import Loading from "@/app/components/ui/Loading";
import { Answer } from "@/server/api/answer";
import { api } from "@/trpc/react";
import { useState } from "react";
import { QuestionItem } from "./QuestionItem";
import SumupItem from "./SumupItem";

const Questions = ({ articleId }: { articleId: string }) => {
    const { data: questions, isLoading: questionsLoading } =
        api.question.list.useQuery({
            articleId: articleId,
        });
    const { data: answers, isLoading: answersLoading } =
        api.answer.list.useQuery({
            articleId: articleId,
        });
    const utils = api.useUtils();

    const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(
        null
    );

    const handleAnswerUpdate = (questionId: string, newAnswer: Answer) => {
        utils.answer.list.setData(
            { articleId: articleId },
            (oldData: Answer[] | undefined) => {
                if (!oldData) oldData = [];
                //delete the answer with the same questionId
                const newAnswers = oldData.filter(
                    (ans) => ans.questionId !== questionId
                );
                //add the new answer to the list
                newAnswers.push({ ...newAnswer });
                return newAnswers;
            }
        );
    };

    if (questionsLoading || answersLoading || !questions || !answers) {
        return <Loading />;
    }

    const summaryQuestions = questions.filter((q) => q.type === 1);
    const discussionQuestions = questions.filter((q) => q.type === 2);

    const answersMap = new Map(answers?.map((a) => [a.questionId, a]));
    return (
        <>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                <legend className="fieldset-legend">
                    Questions About This Article
                </legend>

                {summaryQuestions.map((q) => (
                    <QuestionItem
                        key={q.questionId}
                        question={q}
                        answer={answersMap.get(q.questionId) ?? null}
                        setAnswer={(answer) =>
                            handleAnswerUpdate(q.questionId, answer)
                        }
                        isFocused={q.questionId === focusedQuestionId}
                        setFocused={(questionId: string) =>
                            setFocusedQuestionId(questionId)
                        }
                    />
                ))}
            </fieldset>
            {discussionQuestions.length > 0 && (
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                    <legend className="fieldset-legend">
                        Further Discussions
                    </legend>
                    {discussionQuestions.map((q) => (
                        <QuestionItem
                            key={q.questionId}
                            question={q}
                            answer={answersMap.get(q.questionId) ?? null}
                            setAnswer={(answer) =>
                                handleAnswerUpdate(q.questionId, answer)
                            }
                            isFocused={q.questionId === focusedQuestionId}
                            setFocused={(questionId: string) =>
                                setFocusedQuestionId(questionId)
                            }
                        />
                    ))}
                </fieldset>
            )}
            {/* Sum Up! */}
            {answers.length == questions.length && (
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                    <legend className="fieldset-legend">Sum Up</legend>
                    <SumupItem articleId={articleId} />
                </fieldset>
            )}
        </>
    );
};

export default Questions;
