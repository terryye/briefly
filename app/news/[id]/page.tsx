import Badge from "@/app/components/ui/badge";
import { HydrateClient, api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import reactStringReplace from "react-string-replace";
import Questions from "./Questions";

type Params = Promise<{ id: string }>;

export default async function NewsPage({ params }: { params: Params }) {
    const articleId = (await params).id;

    const article =
        articleId == "today"
            ? await api.article.latest()
            : await api.article.view({ articleId });
    const lines = article.content.split("\n");

    return (
        <HydrateClient>
            <div className="fixed right-6 bottom-60 hidden">
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
            <div className="grid grid-cols-1  sm:grid-cols-2">
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

                        <div>
                            {lines.map((line, index) => (
                                // Render each line within a <p> tag, using a unique key for each paragraph
                                <p key={index} className="mt-2">
                                    {reactStringReplace(
                                        line,
                                        /_([^_]*)_/g,
                                        (match, i) => (
                                            <i key={i}>{match}</i>
                                        )
                                    )}
                                </p>
                            ))}
                        </div>
                    </article>
                </div>
                <div className="prose prose-invert max-w-none p-6">
                    <Questions articleId={article.articleId} />
                </div>
            </div>
        </HydrateClient>
    );
}
