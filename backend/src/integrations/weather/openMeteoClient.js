import { weatherConfig } from "../../config/weatherConfig.js";

const CURRENT_FIELDS = [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "precipitation",
    "weather_code",
    "cloud_cover",
    "wind_speed_10m",
    "is_day",
];

const HOURLY_FIELDS = [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "precipitation_probability",
    "precipitation",
    "weather_code",
    "wind_speed_10m",
    "is_day",
];

const DAILY_FIELDS = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "apparent_temperature_min",
    "precipitation_probability_max",
    "precipitation_sum",
    "wind_speed_10m_max",
    "sunrise",
    "sunset",
];

function createForecastUrl() {
    const queryParameters = new URLSearchParams({
        latitude: String(weatherConfig.location.latitude),
        longitude: String(weatherConfig.location.longitude),

        current: CURRENT_FIELDS.join(","),
        hourly: HOURLY_FIELDS.join(","),
        daily: DAILY_FIELDS.join(","),

        temperature_unit: "fahrenheit",
        wind_speed_unit: "mph",
        precipitation_unit: "inch",

        timezone: weatherConfig.location.timezone,
        forecast_days: String(weatherConfig.forecastDays),
    });

    return (
        `${weatherConfig.providerBaseUrl}?` +
        queryParameters.toString()
    );
}

export async function fetchOpenMeteoForecast() {
    const requestController = new AbortController();

    const timeoutId = setTimeout(() => {
        requestController.abort();
    }, weatherConfig.requestTimeoutMilliseconds);

    try {
        const response = await fetch(createForecastUrl(), {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            signal: requestController.signal,
        });

        if (!response.ok) {
            const responseText = await response.text();

            throw new Error(
                `Open-Meteo returned status ${response.status}: ` +
                responseText.slice(0, 300),
            );
        }

        const responseBody = await response.json();

        if (
            !responseBody ||
            typeof responseBody !== "object"
        ) {
            throw new Error(
                "Open-Meteo returned an invalid response.",
            );
        }

        return responseBody;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(
                "The weather provider request timed out.",
                { cause: error },
            );
        }

        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}