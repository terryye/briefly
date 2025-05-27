import { Summary } from "@/server/api/summary";
import { auth } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Icons from "../components/ui/Icons";

const HistoryPage = async () => {
    //check is user logged in, if not, redirect to login page with callback url to current page
    const session = await auth();
    if (!session) {
        redirect(`/api/auth/signin`);
    }

    const articles = await api.article.list();

    const summaries = await api.summary.listByIds({
        articleIds: articles.map((item) => item.articleId),
    });

    const summariesMap = new Map<string, Summary>();
    summaries.forEach((item) => {
        summariesMap.set(item.articleId, item);
    });

    return (
        <HydrateClient>
            <div>
                <div className="flex flex-row p-6 border-b-1 border-zinc-300">
                    <div className="basis-2/3 text-2xl font-serif font-extrabold">
                        History
                    </div>
                    <div className="basis-1/3 flex flex-row justify-end"></div>
                </div>
                <ul className="list bg-base-100 rounded-box ">
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                        Recent News / Articles
                    </li>
                    {articles.map((item) => (
                        <li className="list-row" key={item.articleId}>
                            <div>
                                <Image
                                    width={40}
                                    height={40}
                                    alt={item.title}
                                    className="size-10 rounded-box"
                                    src={item.poster}
                                />
                            </div>
                            <div>
                                <div>
                                    <Link href={`/news/${item.articleId}`}>
                                        {item.title}
                                    </Link>
                                </div>
                                <div className="text-xs  font-semibold opacity-60">
                                    {summariesMap.get(item.articleId) ? (
                                        <>
                                            <div className="badge badge-success mr-2 text-white">
                                                {Icons.score}
                                                {
                                                    summariesMap.get(
                                                        item.articleId
                                                    )?.score
                                                }
                                            </div>

                                            <button className="btn btn-xs mr-2">
                                                <Link
                                                    href={`/summarize?summary_id=${
                                                        summariesMap.get(
                                                            item.articleId
                                                        )?.summaryId
                                                    }`}
                                                >
                                                    View Submission
                                                </Link>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-xs  font-semibold opacity-60">
                                            Not done yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                    <li className="list-row hidden">
                        <div>
                            <Image
                                width={40}
                                height={40}
                                alt="Ellie Beilish"
                                className="size-10 rounded-box"
                                src="https://img.daisyui.com/images/profile/demo/4@94.webp"
                            />
                        </div>
                        <div>
                            <div>Ellie Beilish</div>
                            <div className="text-xs uppercase font-semibold opacity-60">
                                Bears of a fever
                            </div>
                        </div>
                        <button className="btn btn-square btn-ghost">
                            <svg
                                className="size-[1.2em]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                                </g>
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
        </HydrateClient>
    );
};

export default HistoryPage;
