import Badge from "@/app/components/ui/badge";
import Icons from "@/app/components/ui/Icons";
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
                            Questions About This Article
                        </legend>
                        <label className="label  whitespace-normal">
                            1. What happened on the Spanish Steps in Rome on
                            June 17, and who was involved?
                        </label>
                        <textarea
                            className="textarea w-full"
                            placeholder="This helps identify the main event and the key person involved."
                        />
                        <button className="btn btn-block btn-neutral">
                            Done, Submit
                        </button>
                        <label className="label  whitespace-normal">
                            2. What actions did the police take, and what were
                            the results of their investigation?
                        </label>
                        <div className="chat chat-start">
                            <div className="chat-bubble max-w-full">
                                the police test the man for alcohol. the result
                                is negative. the man is not drunk.
                            </div>
                            <div className="row-start-2 col-start-3 self-center">
                                {Icons.edit}
                            </div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-bubble">
                                <p>
                                    <span className="underline">Feedback:</span>
                                    <br />
                                    1. Verb tense: Use past tense consistently
                                    when talking about past events.
                                    <br />
                                    2. Capitalization: Start each sentence with
                                    a capital letter. <br />
                                    3. More complete answer: Include the police
                                    charging the man and removing the car.
                                </p>
                            </div>
                        </div>

                        <div className="chat chat-end">
                            <div className="chat-bubble">
                                <p>
                                    <span className="underline">
                                        Improved answer:
                                    </span>
                                    <br />
                                    The police tested the man for alcohol, and
                                    the result was negative, so he was not
                                    drunk. They also charged him for driving on
                                    the Spanish Steps. Later, firefighters used
                                    a crane to remove the car.
                                </p>
                            </div>
                        </div>
                        <blockquote className="hidden">
                            <p>
                                <span className="text-info">Your input:</span>{" "}
                                the police test the man for alcohol. the result
                                is negative. the man is not drunk.
                            </p>
                            <p>
                                <span className="text-info">Improvements:</span>
                                <br />
                                1. Verb tense: Use past tense consistently when
                                talking about past events.
                                <br />
                                2. Capitalization: Start each sentence with a
                                capital letter. <br />
                                3. More complete answer: Include the police
                                charging the man and removing the car.
                            </p>
                            <p>
                                <span className="text-info">
                                    Improved answer:
                                </span>
                                The police tested the man for alcohol, and the
                                result was negative, so he was not drunk. They
                                also charged him for driving on the Spanish
                                Steps. Later, firefighters used a crane to
                                remove the car.
                            </p>
                        </blockquote>
                        <label className="label  whitespace-normal">
                            3. Why is this incident significant or unusual?
                        </label>
                        <textarea
                            className="textarea w-full"
                            placeholder="This encourages you to reflect on why the story matters — historical or cultural significance."
                        />
                        <div className="flex flex-row gap-2 justify-center">
                            <button className="btn flex-1 btn-neutral">
                                Done, Submit
                            </button>
                            <button className="btn">Cancel</button>
                        </div>
                        <label className="label whitespace-normal">
                            4. What background information does the article
                            provide about the Spanish Steps and similar past
                            events?
                        </label>
                        <span className="loading loading-dots loading-md"></span>
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
