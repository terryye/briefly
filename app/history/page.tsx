import Image from "next/image";
import React from "react";
import { HydrateClient, api } from "@/trpc/server";

const HistoryPage = async () => {
    const items = await api.article.list();

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
                    {items.map((item) => (
                        <li className="list-row" key={item.id}>
                            <div>
                                <Image
                                    width={40}
                                    height={40}
                                    alt="Dio Lupa"
                                    className="size-10 rounded-box"
                                    src={item.poster}
                                />
                            </div>
                            <div>
                                <div>{item.title}</div>
                                <div className="text-xs uppercase font-semibold opacity-60"></div>
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
                    ))}
                    ;
                    <li className="list-row">
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
                    <li className="list-row">
                        <div>
                            <Image
                                width={40}
                                height={40}
                                alt="Sabrino Gardener"
                                className="size-10 rounded-box"
                                src="https://img.daisyui.com/images/profile/demo/3@94.webp"
                            />
                        </div>
                        <div>
                            <div>Sabrino Gardener</div>
                            <div className="text-xs uppercase font-semibold opacity-60">
                                Cappuccino
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
