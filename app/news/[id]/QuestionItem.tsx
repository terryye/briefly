"use client";
import Icons from "@/app/components/ui/Icons";
import Loading from "@/app/components/ui/Loading";
import { useLogin } from "@/app/providers/LoginProvider";
import type { Answer } from "@/server/api/answer";
import type { Question } from "@/server/api/question";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const QuestionItem = ({
    question,
    answer,
    setAnswer,
    isFocused,
    setFocused,
}: {
    question: Question;
    answer: Answer | null;
    setAnswer(answer: Answer): void;
    isFocused: boolean;
    setFocused(questionId: string): void;
}) => {
    const { status: sessionStatus } = useSession();
    const { showLogin } = useLogin();

    const [status, setStatus] = useState<"editing" | "viewing" | "submitting">(
        answer?.answer ? "viewing" : "editing"
    );

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
        if (answer?.answer === answerContent) {
            setStatus("viewing");
            return;
        }
        setStatus("submitting");

        submitMutation.mutate({
            questionId: question.questionId,
            answer: answerContent,
        });
    };

    const handleCancel = () => {
        setStatus("viewing");
        setAnswerContent(answer?.answer ?? null);
    };
    return (
        <div>
            <label className="label  whitespace-normal">
                {question.seq + 1}. {question.question}
            </label>

            {["viewing", "submitting"].includes(status) && ( //answer
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
            )}
            {["submitting"].includes(status) && ( // loading
                <div className="chat chat-end">
                    <div className="chat-bubble">
                        <Loading />
                    </div>
                </div>
            )}

            {["viewing"].includes(status) && //feedback
                answer?.feedbacks?.map((feedback, index) => (
                    <div className="chat chat-end" key={index}>
                        <div className="chat-bubble">
                            <span className="underline">{feedback.title}</span>
                            <p>{feedback.content}</p>
                        </div>
                    </div>
                ))}

            {["editing"].includes(status) && (
                <>
                    <textarea
                        className="textarea w-full my-2"
                        placeholder=""
                        onFocus={() => {
                            setFocused(question.questionId);
                        }}
                        onChange={(e) => {
                            if (sessionStatus !== "authenticated") {
                                showLogin();
                                return;
                            }
                            setAnswerContent(e.target.value);
                        }}
                        value={answerContent ?? ""}
                    />
                    {answer?.answer && isFocused && (
                        <div className="flex flex-row gap-2 justify-center">
                            <button
                                className="btn flex-1 btn-neutral"
                                onClick={handleSubmit}
                            >
                                Done, Update
                            </button>
                            <button className="btn" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    )}

                    {!answer?.answer && isFocused && (
                        <button
                            className={`btn btn-block btn-neutral`}
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
