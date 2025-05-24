import { HydrateClient, api } from "@/trpc/server";
import Icons from "./components/ui/Icons";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const result = await api.article.latest();
    const article = result[0];

    return (
        <HydrateClient>
            <div className="fixed right-6 bottom-60">
                <button className="btn btn-primary btn-circle">
                    <Link href={"/summarize?id=" + article.id}>Go</Link>
                </button>
            </div>
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
