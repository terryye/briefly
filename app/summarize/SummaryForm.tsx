"use client";

import Icons from "@/app/components/ui/Icons";
import { Article } from "@/server/api/article";
import { Summary } from "@/server/api/summary";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import FeedbackCard from "./FeedbackCard";

export default function SummaryForm({
    summary: summaryInit,
    article,
}: {
    summary: Summary | null;
    article: Article;
}) {
    const articleId = article.articleId;
    const [summary, setSummary] = useState(summaryInit);
    const [post, setPost] = useState(summary?.post || "");
    const [error, setError] = useState("");
    const [formStatus, setFormStatus] = useState(summary ? 2 : 0); // 0: initial, 1: loading, 2: finished
    const submitRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const submitMutation = api.summary.submit.useMutation({
        onSuccess: (data) => {
            setSummary(data);
            setFormStatus(2);
            setTimeout(() => {
                if (submitRef.current) {
                    submitRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }, 300);
        },
        onError: (info) => {
            setError(JSON.parse(info.message)[0].message);
            setFormStatus(0);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        setFormStatus(1);
        e.preventDefault();
        if (!articleId) return;

        submitMutation.mutate({
            summaryId: summary?.summaryId,
            articleId: articleId,
            post: post,
        });
    };

    return (
        <>
            <div className="flex flex-row p-6 border-b-1 border-zinc-200">
                <div className="basis-2/3 text-2xl font-serif font-extrabold">
                    Today
                </div>
                <div className="basis-1/3 flex flex-row justify-end">
                    <div className="badge badge-success mr-2 text-white">
                        {Icons.hot} 20
                    </div>
                    <div className="badge badge-info  text-white">
                        {Icons.star} 365
                    </div>
                </div>
            </div>
            <div className="prose prose-invert max-w-none p-6">
                <span className="text-xs opacity-60 tracking-wide">
                    Summarize the article here, AI will give you a review:
                </span>
                <form onSubmit={handleSubmit}>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            {article?.title}
                        </legend>
                        <textarea
                            disabled={formStatus == 1 || formStatus === 2}
                            className="textarea h-48 w-auto"
                            placeholder="write your summary here"
                            name="post"
                            value={post}
                            onChange={(e) => {
                                setPost(e.target.value);
                                setError("");
                            }}
                        ></textarea>
                        <span className="label">max 200 words</span>
                    </fieldset>
                    <div
                        className="flex flex-row justify-between"
                        ref={submitRef}
                    >
                        <button
                            className="btn btn-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                router.back();
                            }}
                        >
                            &lt; Back
                        </button>

                        {formStatus === 2 ? (
                            <button
                                className="btn btn-primary btn-sm"
                                type="button"
                                onClick={(e) => {
                                    setFormStatus(0);
                                    e.preventDefault();
                                    return false;
                                }}
                            >
                                Try again
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary btn-sm"
                                type="submit"
                                disabled={submitMutation.isPending}
                            >
                                {submitMutation.isPending ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Rating...
                                    </>
                                ) : (
                                    <>Sumbit</>
                                )}
                            </button>
                        )}
                    </div>
                    {error && (
                        <div
                            role="alert"
                            className="alert alert-error alert-soft my-6"
                        >
                            <span>{error}</span>
                        </div>
                    )}
                </form>
            </div>
            {summary && <FeedbackCard summary={summary} />}
        </>
    );
}
