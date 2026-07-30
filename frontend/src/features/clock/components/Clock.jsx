import {
    useEffect,
    useMemo,
    useState,
} from "react";

import DateDisplay from "./DateDisplay.jsx";
import "../styles/clock.css";

function getMillisecondsUntilNextMinute() {
    const currentTime = Date.now();

    return 60_000 - (currentTime % 60_000);
}

function Clock() {
    const [currentDateTime, setCurrentDateTime] =
        useState(() => new Date());

    const timeFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }),
        [],
    );

    const formattedTime = useMemo(() => {
        const timeParts =
            timeFormatter.formatToParts(currentDateTime);

        const hour =
            timeParts.find(
                (part) => part.type === "hour",
            )?.value ?? "";

        const minute =
            timeParts.find(
                (part) => part.type === "minute",
            )?.value ?? "";

        const dayPeriod =
            timeParts.find(
                (part) => part.type === "dayPeriod",
            )?.value ?? "";

        return {
            time: `${hour}:${minute}`,
            isAm: dayPeriod.toUpperCase() === "AM",
            accessibleTime:
                `${hour}:${minute} ${dayPeriod}`.trim(),
        };
    }, [currentDateTime, timeFormatter]);

    useEffect(() => {
        let minuteIntervalId;

        // Synchronize the first update with the beginning
        // of the next minute. After that, updating once per
        // minute avoids unnecessary re-renders.
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
        <section
            className="clock-display"
            aria-label="Current date and time"
        >
            <time
                className="clock-display__time"
                dateTime={currentDateTime.toISOString()}
                aria-label={formattedTime.accessibleTime}
            >
                <span className="clock-display__time-value">
                    {formattedTime.time}
                </span>

                {formattedTime.isAm ? (
                    <span
                        className="clock-display__period-dot"
                        aria-hidden="true"
                    />
                ) : null}
            </time>

            <DateDisplay date={currentDateTime} />
        </section>
    );
}

export default Clock;