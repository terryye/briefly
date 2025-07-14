"use client";
import Icons from "@/app/components/ui/Icons";
import Loading from "@/app/components/ui/Loading";
import { useLogin } from "@/app/providers/LoginProvider";
import type { Answer } from "@/server/api/answer";
import type { Question } from "@/server/api/question";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const QuestionItem = ({
    question,
    answer: answerOld,
}: {
    question: Question;
    answer: Answer | null;
}) => {
    const { status: sessionStatus } = useSession();
    const { showLogin } = useLogin();

    const [status, setStatus] = useState<"editing" | "viewing" | "submitting">(
        "viewing"
    );
    const [answer, setAnswer] = useState<Answer>(answerOld ?? ({} as Answer));

    const [isFocused, setIsFocused] = useState<boolean>(false);

    const [answerContent, setAnswerContent] = useState<string | null>(
        answer?.answer ?? null
    );

    const submitMutation = api.answer.submit.useMutation({
        onSuccess: (data) => {
            setStatus("viewing");
            setAnswer(data);
        },
        onError: (info) => {
            setStatus("editing");
            console.log("error", info);
        },
    });
    const handleSubmit = async () => {
        if (sessionStatus !== "authenticated") {
            showLogin();
            return;
        }
        if (!answerContent) {
            return;
        }
        if (answer.answer === answerContent) {
            setStatus("viewing");
            return;
        }
        setAnswer({
            ...answer,
            answer: answerContent,
        });
        setStatus("submitting");

        submitMutation.mutate({
            questionId: question.questionId,
            answer: answerContent,
        });
    };
    return (
        <div>
            <label className="label  whitespace-normal">
                {question.seq + 1}. {question.question}
            </label>
            {answer.answer && status !== "editing" && (
                <>
                    <div className="chat chat-start">
                        <div className="chat-bubble max-w-full">
                            {answerContent}
                        </div>
                        <div className="row-start-2 col-start-3 self-center">
                            <span
                                className="cursor-pointer"
                                onClick={() => {
                                    setStatus("editing");
                                }}
                            >
                                {Icons.edit}
                            </span>
                        </div>
                    </div>
                    {status === "submitting" && (
                        <div className="chat chat-end">
                            <div className="chat-bubble">
                                <Loading />
                            </div>
                        </div>
                    )}
                    {status !== "submitting" &&
                        answer?.feedbacks?.map((feedback, index) => (
                            <div className="chat chat-end" key={index}>
                                <div className="chat-bubble">
                                    <span className="underline">
                                        {feedback.title}
                                    </span>
                                    <p>{feedback.content}</p>
                                </div>
                            </div>
                        ))}
                </>
            )}
            {(!answer.answer || status === "editing") && (
                <>
                    <textarea
                        className="textarea w-full my-2"
                        placeholder=""
                        onFocus={() => {
                            setIsFocused(true);
                        }}
                        onChange={(e) => {
                            if (sessionStatus !== "authenticated") {
                                showLogin();
                                return;
                            }
                            setAnswerContent(e.target.value);
                        }}
                        onBlur={() => {
                            setIsFocused(false);
                        }}
                        value={answerContent ?? ""}
                    />
                    {status === "editing" ? (
                        <div className="flex flex-row gap-2 justify-center">
                            <button
                                className={`btn flex-1 ${
                                    isFocused ? "btn-neutral" : ""
                                }`}
                                onClick={handleSubmit}
                            >
                                Done, Update
                            </button>
                            <button
                                className="btn"
                                onClick={() => setStatus("viewing")}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className={`btn btn-block ${
                                isFocused ? "btn-neutral" : "btn-default"
                            }`}
                            onClick={handleSubmit}
                        >
                            Done, Submit
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

const Questions = ({ articleId }: { articleId: string }) => {
    const { data: questions, isLoading: questionsLoading } =
        api.question.list.useQuery({
            articleId: articleId,
        });
    const { data: answers, isLoading: answersLoading } =
        api.answer.list.useQuery({
            articleId: articleId,
        });

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

                {summaryQuestions.map((q, idx) => (
                    <QuestionItem
                        key={q.questionId}
                        question={q}
                        answer={answersMap.get(q.questionId) ?? null}
                    />
                ))}
            </fieldset>
            {discussionQuestions.length > 0 && (
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                    <legend className="fieldset-legend">
                        Further Discussions
                    </legend>
                    {discussionQuestions.map((q, idx) => (
                        <QuestionItem
                            key={q.questionId}
                            question={q}
                            answer={answersMap.get(q.questionId) ?? null}
                        />
                    ))}
                </fieldset>
            )}
        </>
    );
};

export default Questions;
