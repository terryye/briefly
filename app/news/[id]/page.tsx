import Badge from "@/app/components/ui/badge";
import { HydrateClient, api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function NewsPage({ params }: { params: Params }) {
    const articleId = (await params).id;

    const article =
        articleId == "today"
            ? await api.article.latest()
            : await api.article.view({ articleId });

    return (
        <HydrateClient>
            <div className="fixed right-6 bottom-60">
                <button className="btn btn-primary btn-circle">
                    <Link href={"/summarize?article_id=" + article.articleId}>
                        Go
                    </Link>
                </button>
            </div>
            <div className="flex flex-row p-6 border-b-1 border-zinc-200">
                <div className="basis-2/3 text-2xl font-serif font-extrabold">
                    {articleId == "today" ? "Today" : "Article"}
                </div>
                <Badge />
            </div>
            <div className="prose prose-invert max-w-none p-6">
                <article>
                    <h1 className="text-2xl font-bold">{article.title}</h1>
                    <Image
                        width={500}
                        height={300}
                        alt="Trump and Waltz"
                        className="py-4 object-fill"
                        src={article.poster}
                    />
                    {article.content}
                </article>
            </div>
        </HydrateClient>
    );
}
