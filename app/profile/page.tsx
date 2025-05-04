import Image from "next/image";
import React from "react";
import Calendar from "../components/ui/Calendar";
import Icons from "../components/ui/Icons";

const HistoryPage = () => {
    return (
        <div>
            <div className="flex flex-row p-6 border-b-1 border-zinc-300">
                <div className="basis-2/3 text-2xl font-serif font-extrabold">
                    Profile
                </div>
                <div className="basis-1/3 flex flex-row justify-end">
                    <button className="btn btn-primary btn-xs">Edit</button>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 pt-8">
                <div className="avatar">
                    <div className="w-24 mask mask-squircle ">
                        <Image
                            alt="Terry Ye"
                            width={96}
                            height={96}
                            src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
                        />
                    </div>
                </div>
                <span className="p-2 font-bold">Terry Ye</span>
            </div>
            <div className="flex flex-row m-4 pb-4 border-b-1 border-zinc-300 ">
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
    );
};

export default HistoryPage;
