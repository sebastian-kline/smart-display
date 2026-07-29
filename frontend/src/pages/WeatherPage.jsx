import { useNavigate } from "react-router";

import {
    CurrentConditions,
    DailyForecast,
    HourlyForecast,
    useWeather,
} from "../features/weather/index.js";

function BackIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="m15 18-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function WeatherPage() {
    const navigate = useNavigate();

    const {
        weather,
        isLoading,
        isRefreshing,
        errorMessage,
        refreshWeather,
    } = useWeather();

    return (
        <main className="weather-page">
            <header className="weather-page__header">
                <button
                    className="weather-page__back"
                    type="button"
                    aria-label="Return home"
                    onClick={() => navigate("/")}
                >
                    <BackIcon />
                </button>

                <div>
                    <h1 className="weather-page__title">
                        Weather
                    </h1>

                    <p className="weather-page__location">
                        {weather?.location?.displayName ??
                            "Herminie, PA"}
                    </p>
                </div>

                <button
                    className="weather-page__refresh"
                    type="button"
                    disabled={isRefreshing}
                    onClick={refreshWeather}
                >
                    {isRefreshing ? "Refreshing…" : "Refresh"}
                </button>
            </header>

            {isLoading ? (
                <div className="weather-page__state">
                    Loading weather…
                </div>
            ) : null}

            {!isLoading && !weather ? (
                <div className="weather-page__state">
                    <p>{errorMessage || "Weather unavailable."}</p>

                    <button type="button" onClick={refreshWeather}>
                        Try again
                    </button>
                </div>
            ) : null}

            {weather ? (
                <div className="weather-page__content">
                    <div className="weather-page__top">
                        <CurrentConditions weather={weather} />

                        <HourlyForecast
                            hourlyForecast={weather.hourly}
                        />
                    </div>

                    <DailyForecast
                        dailyForecast={weather.daily}
                    />

                    <footer className="weather-page__footer">
                        <span>{weather.attribution.text}</span>

                        {weather.metadata.isStale ||
                        errorMessage ? (
                            <span className="weather-page__stale">
                Forecast may be out of date
              </span>
                        ) : null}
                    </footer>
                </div>
            ) : null}
        </main>
    );
}

export default WeatherPage;