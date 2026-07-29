const WEATHER_FORECAST_ENDPOINT = "/api/weather/forecast";

export async function fetchWeatherForecast({ signal } = {}) {
    const response = await fetch(WEATHER_FORECAST_ENDPOINT, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
        signal,
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(
            responseBody?.error?.message ??
            `Weather request failed with status ${response.status}.`,
        );
    }

    if (!responseBody?.data?.current) {
        throw new Error("Weather response contained invalid data.");
    }

    return responseBody.data;
}