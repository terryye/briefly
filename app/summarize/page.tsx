import { HydrateClient } from "@/trpc/server";
import Icons from "@/app/components/ui/Icons";
import Image from "next/image";

export default async function Home() {
    return (
        <>
            <HydrateClient>
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
            </HydrateClient>
            <div className="prose prose-invert max-w-none p-6">
                <span className="text-xs opacity-60 tracking-wide">
                    Summarize the article here, AI will give you a review:
                </span>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Your info</legend>
                    <textarea
                        className="textarea h-48 w-auto"
                        placeholder="Bio"
                    ></textarea>
                    <span className="label">max 200 words</span>
                </fieldset>
                <div className="flex flex-row justify-between">
                    <button className="btn btn-sm"> &lt; Back</button>
                    <button className="btn btn-primary btn-sm">Sumbit</button>
                </div>
            </div>
        </>
    );
}
