import Badge from "@/app/components/ui/badge";
import { HydrateClient, api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import reactStringReplace from "react-string-replace";

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
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                        <legend className="fieldset-legend">
                            Summarize It Step By Step
                        </legend>

                        <label className="label  whitespace-normal">
                            1. What happened on the Spanish Steps in Rome on
                            June 17, and who was involved?
                        </label>
                        <textarea
                            className="textarea w-full"
                            placeholder="This helps identify the main event and the key person involved."
                        />
                        <button className="btn btn-block">Submit</button>
                        <label className="label  whitespace-normal">
                            2. What actions did the police take, and what were
                            the results of their investigation?
                        </label>
                        <textarea
                            className="textarea w-full"
                            placeholder="This focuses on the consequences and official response"
                        />

                        <label className="label  whitespace-normal">
                            3. Why is this incident significant or unusual?
                        </label>
                        <textarea
                            className="textarea w-full"
                            placeholder="This encourages you to reflect on why the story matters — historical or cultural significance."
                        />

                        <label className="label whitespace-normal">
                            4. What background information does the article
                            provide about the Spanish Steps and similar past
                            events?
                        </label>
                        <textarea
                            className="textarea w-full"
                            placeholder="This helps you include relevant context that supports the main story"
                        />
                    </fieldset>

                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                        <legend className="fieldset-legend">Discussion</legend>

                        <label className="label whitespace-normal">
                            1. What are your thoughts on this incident?
                        </label>
                        <textarea className="textarea w-full" placeholder="" />

                        <label className="label whitespace-normal">
                            2. Have you been to Rome? If so, did you visit the
                            Spanish Steps? If not, would you like to go someday?
                        </label>
                        <textarea className="textarea w-full" placeholder="" />

                        <label className="label whitespace-normal">
                            3. What famous historic sites would you most like to
                            see?
                        </label>
                        <textarea className="textarea w-full" placeholder="" />

                        <label className="label whitespace-normal">
                            4. What are some of your country's most visited
                            historic sites?
                        </label>
                        <textarea className="textarea w-full" placeholder="" />
                    </fieldset>
                </div>
            </div>
        </HydrateClient>
    );
}
