import { useEffect, useMemo, useState } from "react";

import DateDisplay from "./DateDisplay.jsx";
import "../styles/clock.css";

function getMillisecondsUntilNextMinute() {
    const currentTime = Date.now();
    return 60_000 - (currentTime % 60_000);
}

function Clock() {
    const [currentDateTime, setCurrentDateTime] = useState(() => new Date());

    const timeFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
            }),
        [],
    );

    useEffect(() => {
        let minuteIntervalId;

        // Synchronize the first update with the beginning of the next minute.
        // After that, updating once per minute avoids unnecessary re-renders.
        const minuteTimeoutId = window.setTimeout(() => {
            setCurrentDateTime(new Date());

            minuteIntervalId = window.setInterval(() => {
                setCurrentDateTime(new Date());
            }, 60_000);
        }, getMillisecondsUntilNextMinute());

        return () => {
            window.clearTimeout(minuteTimeoutId);
            window.clearInterval(minuteIntervalId);
        };
    }, []);

    return (
        <section className="clock-display" aria-label="Current date and time">
            <time
                className="clock-display__time"
                dateTime={currentDateTime.toISOString()}
            >
                {timeFormatter.format(currentDateTime)}
            </time>

            <DateDisplay date={currentDateTime} />
        </section>
    );
}

export default Clock;