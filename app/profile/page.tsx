import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import Badge from "../components/ui/badge";
import Calendar from "../components/ui/Calendar";
import Signinout from "../components/ui/Signinout";
import ProfileCard from "./ProfileCard";

export default async function ProfilePage() {
    const session = await auth();
    if (!session) {
        redirect(`/api/auth/signin`);
    }
    return (
        <div>
            <ProfileCard session={session} />
            <div className={`${session ? "" : "hidden"}`}>
                <div className="flex flex-row m-4 pb-4 border-b-1 border-zinc-300">
                    <div className="basis-2/3  font-serif font-extrabold">
                        Progress
                    </div>
                    <div className="basis-1/3 flex justify-end">
                        <Badge />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Calendar />
                </div>
            </div>
            <div className="flex flex-row m-4 pb-4 items-center justify-center">
                <Signinout session={session} />
            </div>
        </div>
    );
}
