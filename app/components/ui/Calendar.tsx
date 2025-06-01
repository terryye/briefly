"use client";
//https://daypicker.dev/
import { api } from "@/trpc/react";

import { useEffect, useState } from "react";
import {
    DayPicker,
    defaultLocale,
    NextMonthButton,
    NextMonthButtonProps,
} from "react-day-picker";

const Calendar = () => {
    const [month, setMonth] = useState(new Date());
    const [booked, setBooked] = useState<Date[]>([]);

    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const { data } = api.summary.listByDateRange.useQuery({
        startDate: monthStart,
        endDate: monthEnd,
    });

    const dates = data?.map((d) => new Date(d.articleDate)) ?? [];
    const CustomNextMonthBtn = (props: NextMonthButtonProps) => {
        return <NextMonthButton {...props} disabled={new Date() < monthEnd} />;
    };

    useEffect(() => {
        setBooked(dates);
    }, [data?.[0]?.articleDate]);

    return (
        <>
            <DayPicker
                locale={defaultLocale}
                className="react-day-picker"
                components={{
                    NextMonthButton: CustomNextMonthBtn,
                }}
                modifiers={{
                    booked: booked,
                    today: new Date(),
                }}
                //hidden after the end of the month
                hidden={{
                    after: new Date(
                        month.getFullYear(),
                        month.getMonth() + 1,
                        0
                    ),
                }}
                disabled={{ after: new Date() }}
                modifiersClassNames={{
                    booked: "rdp-booked_day",
                    today: "bg-primary text-white rounded-md",
                }}
                onMonthChange={setMonth}
            />
        </>
    );
};

export default Calendar;
