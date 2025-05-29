import { api } from "@/trpc/server";
import Icons from "./Icons";

const Badge = async () => {
    const badge = await api.summary.badge();
    console.log(badge);
    return (
        <>
            <div className="basis-1/3 flex flex-row justify-end">
                <div className="tooltip tooltip-bottom" data-tip="Last 31 days">
                    <div
                        className="badge badge-success mr-2 text-white"
                        title="Last 31 days"
                    >
                        {Icons.hot} {badge?.last31days}
                    </div>
                </div>

                <div className="tooltip tooltip-bottom" data-tip="All time">
                    <div
                        className="badge badge-info  text-white"
                        title="All time"
                    >
                        {Icons.star} {badge?.allTime}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Badge;
