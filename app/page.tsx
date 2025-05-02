import { HydrateClient } from "@/trpc/server";
import Icons from "./components/ui/Icons";
import Image from "next/image";

export default async function Home() {
    return (
        <HydrateClient>
            <div className="fixed right-6 bottom-60">
                <button className="btn btn-primary btn-circle">Go</button>
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
                <h1 className="text-2xl font-bold">
                    Waltz ousted as security adviser, Rubio to...
                </h1>
                <Image
                    alt="Trump and Waltz"
                    className="py-4"
                    src="https://media.cnn.com/api/v1/images/stellar/prod/c-gettyimages-2203986531.jpg?c=original"
                />
                <p className="text-base">
                    President Donald Trump announced Thursday that he would
                    nominate national security adviser Mike Waltz to serve as UN
                    ambassador, after widespread reports that Trump planned to
                    oust him, in the first major staff shakeup since the
                    president took office in January.
                </p>
                <p className="text-base">
                    The president said Secretary of State Marco Rubio would
                    replace Waltz in the prior role on an interim basis.
                </p>
                <p className="text-base">
                    “Mike Waltz has worked hard to put our Nation’s Interests
                    first. I know he will do the same in his new role,” Trump
                    wrote on Truth Social. “In the interim, Secretary of State
                    Marco Rubio will serve as National Security Advisor, while
                    continuing his strong leadership at the State Department.”
                </p>
                <p className="text-base">
                    Trump informed Waltz that he was removing him from his role
                    as national security adviser and nominating him as UN
                    ambassador Thursday morning, a White House official told
                    CNN.
                </p>
                <p className="text-base">
                    “I’m deeply honored to continue my service to President
                    Trump and our great nation,” Waltz wrote on X after Trump’s
                    announcement.
                </p>
                <p className="text-base">
                    Waltz’s job has been in limbo after it was made clear to him
                    earlier this week that his time leading the National
                    Security Council had come to an end, according to a source
                    familiar with the matter. Alex Wong, the deputy national
                    security adviser, and other national security advisers are
                    expected to depart their roles as well, per multiple sources
                    familiar with conversations, though timing is unclear.
                </p>
            </div>
        </HydrateClient>
    );
}
