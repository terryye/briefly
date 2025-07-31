import AudioPlayer from "@/app/components/ui/AudioPlayer";
import Badge from "@/app/components/ui/Badge";
import { HydrateClient, api } from "@/trpc/server";
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
            <div className="flex flex-row p-6 border-b-1 border-zinc-200">
                <div className="basis-2/3 text-2xl font-serif font-extrabold">
                    {articleId == "today" ? "Today" : "Article"}
                </div>
                <Badge />
            </div>
            <div className="grid grid-cols-1  sm:grid-cols-2">
                <div className="prose prose-invert max-w-none p-6">
                    <article className="h-full">
                        <h1 className="text-2xl font-bold">{article.title}</h1>
                        <img
                            width="100%"
                            alt="Trump and Waltz"
                            className="py-4 object-fill"
                            src={article.poster}
                        />
                        {article.audio && (
                            <AudioPlayer audioUrl={article.audio} />
                        )}

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
