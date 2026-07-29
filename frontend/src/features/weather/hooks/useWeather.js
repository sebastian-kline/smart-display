import { useCallback, useEffect, useRef, useState } from "react";

import { fetchWeatherForecast } from "../services/weatherService.js";

const DEFAULT_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const MINIMUM_REFRESH_INTERVAL_MS = 60 * 1000;

function getRefreshInterval(weather) {
    const configuredInterval =
        weather?.metadata?.refreshIntervalMilliseconds;

    if (!Number.isFinite(configuredInterval)) {
        return DEFAULT_REFRESH_INTERVAL_MS;
    }

    return Math.max(
        MINIMUM_REFRESH_INTERVAL_MS,
        configuredInterval,
    );
}

function useWeather() {
    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const weatherRef = useRef(null);

    useEffect(() => {
        const requestController = new AbortController();
        let refreshTimeoutId;

        async function loadWeather() {
            try {
                const forecast = await fetchWeatherForecast({
                    signal: requestController.signal,
                });

                if (requestController.signal.aborted) {
                    return;
                }

                weatherRef.current = forecast;
                setWeather(forecast);
                setErrorMessage("");

                refreshTimeoutId = window.setTimeout(
                    loadWeather,
                    getRefreshInterval(forecast),
                );
            } catch (error) {
                if (
                    error.name !== "AbortError" &&
                    !requestController.signal.aborted
                ) {
                    console.error("Unable to load weather:", error);

                    setErrorMessage(
                        weatherRef.current
                            ? "Weather may be out of date."
                            : "Weather is unavailable.",
                    );

                    refreshTimeoutId = window.setTimeout(
                        loadWeather,
                        DEFAULT_REFRESH_INTERVAL_MS,
                    );
                }
            } finally {
                if (!requestController.signal.aborted) {
                    setIsLoading(false);
                    setIsRefreshing(false);
                }
            }
        }

        void loadWeather();

        return () => {
            requestController.abort();
            window.clearTimeout(refreshTimeoutId);
        };
    }, []);

    const refreshWeather = useCallback(async () => {
        setIsRefreshing(true);
        setErrorMessage("");

        try {
            const forecast = await fetchWeatherForecast();

            weatherRef.current = forecast;
            setWeather(forecast);
        } catch (error) {
            console.error("Unable to refresh weather:", error);

            setErrorMessage(
                weatherRef.current
                    ? "Weather may be out of date."
                    : "Weather is unavailable.",
            );
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    return {
        weather,
        isLoading,
        isRefreshing,
        errorMessage,
        refreshWeather,
    };
}

export default useWeather;