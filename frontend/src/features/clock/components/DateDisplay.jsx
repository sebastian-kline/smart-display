import { useMemo } from "react";

function DateDisplay({ date }) {
    const dateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            }),
        [],
    );

    return (
        <time
            className="clock-display__date"
            dateTime={date.toISOString()}
        >
            {dateFormatter.format(date)}
        </time>
    );
}

export default DateDisplay;