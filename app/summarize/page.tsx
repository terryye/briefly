import { Article } from "@/server/api/article";
import { Summary } from "@/server/api/summary";
import { auth } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";
import { redirect } from "next/navigation";
import SummaryForm from "./SummaryForm";

export default async function PageSummarize({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();
    if (!session) {
        redirect(`/api/auth/signin`);
    }
    const summaryId = (await searchParams).summary_id as string;
    let summary: Summary | null = null;
    let article: Article | null = null;
    let articleId: string | null = (await searchParams).article_id as string;

    if (summaryId) {
        summary = await api.summary.view({ summaryId: summaryId });
        articleId = summary.articleId;
    }

    article = await api.article.view({ articleId: articleId });

    return (
        <HydrateClient>
            <SummaryForm summary={summary} article={article} />
        </HydrateClient>
    );
}
