import { Session } from "next-auth";
import Image from "next/image";

export default function ProfileCard({ session }: { session: Session | null }) {
    if (!session) {
        return null;
    }
    return (
        <>
            <div className="flex flex-row p-6 border-b-1 border-zinc-300">
                <div className="basis-2/3 text-2xl font-serif font-extrabold">
                    Profile
                </div>
                <div className="basis-1/3 flex flex-row justify-end">
                    <button className="btn btn-primary btn-xs hidden">
                        Edit
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 pt-8">
                <div className="avatar">
                    <div className="w-24 mask mask-squircle ">
                        <Image
                            alt={session?.user.name || ""}
                            width={96}
                            height={96}
                            src={session?.user.image || ""}
                        />
                    </div>
                </div>
                <span className="p-2 font-bold">{session?.user.name}</span>
            </div>
        </>
    );
}
