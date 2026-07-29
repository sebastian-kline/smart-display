export function roundTemperature(value) {
    return Number.isFinite(value) ? Math.round(value) : null;
}

export function formatTemperature(value) {
    const roundedValue = roundTemperature(value);

    return roundedValue === null ? "--°" : `${roundedValue}°`;
}

export function formatHour(dateTime, isFirstItem = false) {
    if (isFirstItem) {
        return "Now";
    }

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
    }).format(new Date(dateTime));
}

export function formatDay(date, index) {
    if (index === 0) {
        return "Today";
    }

    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
    }).format(new Date(`${date}T12:00:00`));
}

export function formatClockTime(dateTime) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(dateTime));
}