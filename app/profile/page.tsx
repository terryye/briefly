import { auth } from "@/server/auth";
import Calendar from "../components/ui/Calendar";
import Icons from "../components/ui/Icons";
import ProfileCard from "./ProfileCard";
import Signinout from "../components/ui/Signinout";

export default async function ProfilePage() {
    const session = await auth();

    return (
        <div>
            <ProfileCard session={session} />
            <div className={`${session ? "" : "hidden"}`}>
                <div className="flex flex-row m-4 pb-4 border-b-1 border-zinc-300">
                    <div className="basis-2/3  font-serif font-extrabold">
                        Progress
                    </div>
                    <div className="basis-1/3 flex justify-end">
                        <div className="badge badge-success mr-2 text-white">
                            {Icons.hot} 20
                        </div>
                        <div className="badge badge-info  text-white">
                            {Icons.star} 365
                        </div>
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
