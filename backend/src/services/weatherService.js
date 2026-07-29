import { weatherConfig } from "../config/weatherConfig.js";
import { fetchOpenMeteoForecast } from "../integrations/weather/openMeteoClient.js";
import { normalizeOpenMeteoForecast } from "../integrations/weather/openMeteoNormalizer.js";

let cachedForecast = null;
let cacheExpirationTime = 0;
let activeRefreshRequest = null;

function createForecastMetadata({
                                    fetchedAt,
                                    isStale,
                                }) {
    return {
        fetchedAt: new Date(fetchedAt).toISOString(),
        isStale,
        refreshIntervalMilliseconds:
        weatherConfig.cacheDurationMilliseconds,
    };
}

async function refreshForecast() {
    const providerResponse =
        await fetchOpenMeteoForecast();

    const normalizedForecast =
        normalizeOpenMeteoForecast(providerResponse);

    const fetchedAt = Date.now();

    cachedForecast = {
        ...normalizedForecast,

        metadata: createForecastMetadata({
            fetchedAt,
            isStale: false,
        }),
    };

    cacheExpirationTime =
        fetchedAt +
        weatherConfig.cacheDurationMilliseconds;

    return cachedForecast;
}

function getStaleForecast() {
    if (!cachedForecast) {
        return null;
    }

    const fetchedAt = Date.parse(
        cachedForecast.metadata.fetchedAt,
    );

    const cacheAge = Date.now() - fetchedAt;

    if (
        cacheAge >
        weatherConfig.maximumStaleAgeMilliseconds
    ) {
        return null;
    }

    return {
        ...cachedForecast,

        metadata: {
            ...cachedForecast.metadata,
            isStale: true,
        },
    };
}

export async function getWeatherForecast() {
    if (
        cachedForecast &&
        Date.now() < cacheExpirationTime
    ) {
        return cachedForecast;
    }

    if (activeRefreshRequest) {
        return activeRefreshRequest;
    }

    activeRefreshRequest = refreshForecast();

    try {
        return await activeRefreshRequest;
    } catch (error) {
        const staleForecast = getStaleForecast();

        if (staleForecast) {
            console.warn(
                "Weather provider unavailable. " +
                "Returning cached forecast.",
                error,
            );

            return staleForecast;
        }

        throw error;
    } finally {
        activeRefreshRequest = null;
    }
}