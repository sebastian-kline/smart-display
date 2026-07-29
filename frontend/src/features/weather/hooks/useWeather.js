import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { fetchWeatherForecast } from "../services/weatherService.js";

const DEFAULT_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const INITIAL_RETRY_INTERVAL_MS = 5 * 1000;
const RECOVERY_RETRY_INTERVAL_MS = 60 * 1000;
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

                // After a successful request, refresh using the interval
                // supplied by the backend. This is currently 10 minutes.
                refreshTimeoutId = window.setTimeout(
                    loadWeather,
                    getRefreshInterval(forecast),
                );
            } catch (error) {
                if (
                    error.name !== "AbortError" &&
                    !requestController.signal.aborted
                ) {
                    const hasExistingWeather = Boolean(
                        weatherRef.current,
                    );

                    console.error("Unable to load weather:", error);

                    setErrorMessage(
                        hasExistingWeather
                            ? "Weather may be out of date."
                            : "Weather is temporarily unavailable.",
                    );

                    // The API may still be starting when Chromium first opens.
                    // Retry quickly until the first forecast successfully loads.
                    // After data has previously loaded, retry once per minute.
                    refreshTimeoutId = window.setTimeout(
                        loadWeather,
                        hasExistingWeather
                            ? RECOVERY_RETRY_INTERVAL_MS
                            : INITIAL_RETRY_INTERVAL_MS,
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
            setErrorMessage("");
        } catch (error) {
            console.error("Unable to refresh weather:", error);

            setErrorMessage(
                weatherRef.current
                    ? "Weather may be out of date."
                    : "Weather is temporarily unavailable.",
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