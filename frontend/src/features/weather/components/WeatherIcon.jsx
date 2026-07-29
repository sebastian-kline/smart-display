function SunIcon() {
    return (
        <>
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
    );
}

function MoonIcon() {
    return (
        <path d="M20 15.6A8.5 8.5 0 0 1 8.4 4a8.5 8.5 0 1 0 11.6 11.6Z" />
    );
}

function CloudIcon() {
    return (
        <path d="M6.5 18h10.7a4.3 4.3 0 0 0 .5-8.6A6.1 6.1 0 0 0 6.2 8.1 5 5 0 0 0 6.5 18Z" />
    );
}

function RainIcon() {
    return (
        <>
            <CloudIcon />
            <path d="m8 20-1 2M13 20l-1 2M18 20l-1 2" />
        </>
    );
}

function SnowIcon() {
    return (
        <>
            <CloudIcon />
            <path d="M8 20v2M7 21h2M13 20v2M12 21h2M18 20v2M17 21h2" />
        </>
    );
}

function ThunderIcon() {
    return (
        <>
            <CloudIcon />
            <path d="m13 17-3 5h3l-1 4 5-7h-3l1-2Z" />
        </>
    );
}

function FogIcon() {
    return (
        <>
            <CloudIcon />
            <path d="M4 20h16M6 23h12" />
        </>
    );
}

function PartlyCloudyIcon({ isDay }) {
    return (
        <>
            <g transform="translate(-3 -3) scale(.72)">
                {isDay ? <SunIcon /> : <MoonIcon />}
            </g>
            <CloudIcon />
        </>
    );
}

function WeatherIcon({
                         conditionKey = "unknown",
                         isDay = true,
                         className = "",
                     }) {
    let icon;

    switch (conditionKey) {
        case "clear":
            icon = isDay ? <SunIcon /> : <MoonIcon />;
            break;

        case "mostly-clear":
        case "partly-cloudy":
            icon = <PartlyCloudyIcon isDay={isDay} />;
            break;

        case "cloudy":
            icon = <CloudIcon />;
            break;

        case "fog":
            icon = <FogIcon />;
            break;

        case "drizzle":
        case "freezing-drizzle":
        case "rain":
        case "freezing-rain":
        case "showers":
            icon = <RainIcon />;
            break;

        case "snow":
        case "snow-showers":
            icon = <SnowIcon />;
            break;

        case "thunderstorm":
        case "severe-thunderstorm":
            icon = <ThunderIcon />;
            break;

        default:
            icon = <CloudIcon />;
    }

    return (
        <svg
            className={`weather-icon ${className}`.trim()}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            {icon}
        </svg>
    );
}

export default WeatherIcon;