/**
 
    if (questions.length == answers.length) {
        const { data: sumup, isLoading: isSumupLoading } =
            api.summup.view.useQuery({
                articleId: articleId,
            });
        console.log(sumup);
        if (isSumupLoading) {
            return <Loading />;
        }
        if (sumup) {
            console.log(sumup);
        }
    }
 */

import Loading from "@/app/components/ui/Loading";
import { api } from "@/trpc/react";

const SumupItem = ({ articleId }: { articleId: string }) => {
    const { data: sumup, isLoading: isSumupLoading } = api.summup.view.useQuery(
        {
            articleId: articleId,
        }
    );
    if (isSumupLoading) {
        return <Loading />;
    }
    return <div className="whitespace-pre-wrap">{"" + sumup}</div>;
};

export default SumupItem;
