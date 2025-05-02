import Image from "next/image";
import React from "react";

const HistoryPage = () => {
    return (
        <div>
            <ul className="list bg-base-100 rounded-box ">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                    Most played songs this week
                </li>

                <li className="list-row">
                    <div>
                        <Image
                            className="size-10 rounded-box"
                            src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                            alt={""}
                        />
                    </div>
                    <div>
                        <div>Dio Lupa</div>
                        <div className="text-xs uppercase font-semibold opacity-60">
                            Remaining Reason
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
                                <path d="M6 3L20 12 6 21 6 3z"></path>
                            </g>
                        </svg>
                    </button>
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
                            className="size-10 rounded-box"
                            src="https://img.daisyui.com/images/profile/demo/4@94.webp"
                            alt=""
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
                                <path d="M6 3L20 12 6 21 6 3z"></path>
                            </g>
                        </svg>
                    </button>
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
                            className="size-10 rounded-box"
                            src="https://img.daisyui.com/images/profile/demo/3@94.webp"
                            alt=""
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
                                <path d="M6 3L20 12 6 21 6 3z"></path>
                            </g>
                        </svg>
                    </button>
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
    );
};

export default HistoryPage;
