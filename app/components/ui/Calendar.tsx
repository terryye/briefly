"use client";
//https://daypicker.dev/

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";

const Calendar = () => {
    //const [dates] = useState<Date[] | undefined>();
    let dates: Date[] = [];
    return (
        <DayPicker
            className="react-day-picker"
            mode="multiple"
            selected={dates}
        />
    );
};

export default Calendar;
