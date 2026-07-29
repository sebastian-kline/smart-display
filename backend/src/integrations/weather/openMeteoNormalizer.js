import { weatherConfig } from "../../config/weatherConfig.js";

function getWeatherCondition(weatherCode) {
    if (weatherCode === 0) {
        return {
            key: "clear",
            label: "Clear",
        };
    }

    if (weatherCode === 1) {
        return {
            key: "mostly-clear",
            label: "Mostly Clear",
        };
    }

    if (weatherCode === 2) {
        return {
            key: "partly-cloudy",
            label: "Partly Cloudy",
        };
    }

    if (weatherCode === 3) {
        return {
            key: "cloudy",
            label: "Cloudy",
        };
    }

    if ([45, 48].includes(weatherCode)) {
        return {
            key: "fog",
            label: "Foggy",
        };
    }

    if ([51, 53, 55].includes(weatherCode)) {
        return {
            key: "drizzle",
            label: "Drizzle",
        };
    }

    if ([56, 57].includes(weatherCode)) {
        return {
            key: "freezing-drizzle",
            label: "Freezing Drizzle",
        };
    }

    if ([61, 63, 65].includes(weatherCode)) {
        return {
            key: "rain",
            label: "Rain",
        };
    }

    if ([66, 67].includes(weatherCode)) {
        return {
            key: "freezing-rain",
            label: "Freezing Rain",
        };
    }

    if ([71, 73, 75, 77].includes(weatherCode)) {
        return {
            key: "snow",
            label: "Snow",
        };
    }

    if ([80, 81, 82].includes(weatherCode)) {
        return {
            key: "showers",
            label: "Rain Showers",
        };
    }

    if ([85, 86].includes(weatherCode)) {
        return {
            key: "snow-showers",
            label: "Snow Showers",
        };
    }

    if (weatherCode === 95) {
        return {
            key: "thunderstorm",
            label: "Thunderstorms",
        };
    }

    if ([96, 99].includes(weatherCode)) {
        return {
            key: "severe-thunderstorm",
            label: "Severe Thunderstorms",
        };
    }

    return {
        key: "unknown",
        label: "Unknown",
    };
}

function readArray(container, fieldName) {
    const fieldValue = container?.[fieldName];

    if (!Array.isArray(fieldValue)) {
        throw new Error(
            `Weather response is missing ${fieldName}.`,
        );
    }

    return fieldValue;
}

function readNumber(value, fieldName) {
    if (!Number.isFinite(value)) {
        throw new Error(
            `Weather response contains invalid ${fieldName}.`,
        );
    }

    return value;
}

function normalizeCurrentConditions(responseBody) {
    const current = responseBody.current;

    if (!current || typeof current !== "object") {
        throw new Error(
            "Weather response is missing current conditions.",
        );
    }

    const weatherCode = readNumber(
        current.weather_code,
        "current weather code",
    );

    return {
        observedAt: current.time,

        temperatureFahrenheit: readNumber(
            current.temperature_2m,
            "current temperature",
        ),

        feelsLikeFahrenheit: readNumber(
            current.apparent_temperature,
            "current apparent temperature",
        ),

        humidityPercent: readNumber(
            current.relative_humidity_2m,
            "current humidity",
        ),

        precipitationInches: readNumber(
            current.precipitation,
            "current precipitation",
        ),

        windSpeedMph: readNumber(
            current.wind_speed_10m,
            "current wind speed",
        ),

        cloudCoverPercent: readNumber(
            current.cloud_cover,
            "current cloud cover",
        ),

        isDay: current.is_day === 1,
        weatherCode,
        condition: getWeatherCondition(weatherCode),
    };
}

function normalizeHourlyForecast(
    responseBody,
    currentConditions,
) {
    const hourly = responseBody.hourly;

    if (!hourly || typeof hourly !== "object") {
        throw new Error(
            "Weather response is missing hourly data.",
        );
    }

    const times = readArray(hourly, "time");

    const currentHour =
        `${currentConditions.observedAt.slice(0, 13)}:00`;

    const matchingIndex = times.findIndex(
        (time) => time >= currentHour,
    );

    const startIndex =
        matchingIndex >= 0 ? matchingIndex : 0;

    const endIndex = Math.min(
        startIndex + weatherConfig.hourlyForecastHours,
        times.length,
    );

    const temperatures = readArray(
        hourly,
        "temperature_2m",
    );

    const feelsLikeTemperatures = readArray(
        hourly,
        "apparent_temperature",
    );

    const humidities = readArray(
        hourly,
        "relative_humidity_2m",
    );

    const precipitationProbabilities = readArray(
        hourly,
        "precipitation_probability",
    );

    const precipitationAmounts = readArray(
        hourly,
        "precipitation",
    );

    const weatherCodes = readArray(
        hourly,
        "weather_code",
    );

    const windSpeeds = readArray(
        hourly,
        "wind_speed_10m",
    );

    const dayIndicators = readArray(
        hourly,
        "is_day",
    );

    const forecast = [];

    for (
        let index = startIndex;
        index < endIndex;
        index += 1
    ) {
        const weatherCode = weatherCodes[index];

        forecast.push({
            time: times[index],

            temperatureFahrenheit:
                temperatures[index],

            feelsLikeFahrenheit:
                feelsLikeTemperatures[index],

            humidityPercent:
                humidities[index],

            precipitationProbabilityPercent:
                precipitationProbabilities[index],

            precipitationInches:
                precipitationAmounts[index],

            windSpeedMph:
                windSpeeds[index],

            isDay: dayIndicators[index] === 1,
            weatherCode,
            condition: getWeatherCondition(weatherCode),
        });
    }

    return forecast;
}

function normalizeDailyForecast(responseBody) {
    const daily = responseBody.daily;

    if (!daily || typeof daily !== "object") {
        throw new Error(
            "Weather response is missing daily data.",
        );
    }

    const dates = readArray(daily, "time");
    const weatherCodes = readArray(
        daily,
        "weather_code",
    );

    const highTemperatures = readArray(
        daily,
        "temperature_2m_max",
    );

    const lowTemperatures = readArray(
        daily,
        "temperature_2m_min",
    );

    const apparentHighTemperatures = readArray(
        daily,
        "apparent_temperature_max",
    );

    const apparentLowTemperatures = readArray(
        daily,
        "apparent_temperature_min",
    );

    const precipitationProbabilities = readArray(
        daily,
        "precipitation_probability_max",
    );

    const precipitationAmounts = readArray(
        daily,
        "precipitation_sum",
    );

    const maximumWindSpeeds = readArray(
        daily,
        "wind_speed_10m_max",
    );

    const sunrises = readArray(daily, "sunrise");
    const sunsets = readArray(daily, "sunset");

    return dates.map((date, index) => {
        const weatherCode = weatherCodes[index];

        return {
            date,

            highTemperatureFahrenheit:
                highTemperatures[index],

            lowTemperatureFahrenheit:
                lowTemperatures[index],

            apparentHighFahrenheit:
                apparentHighTemperatures[index],

            apparentLowFahrenheit:
                apparentLowTemperatures[index],

            precipitationProbabilityPercent:
                precipitationProbabilities[index],

            precipitationInches:
                precipitationAmounts[index],

            maximumWindSpeedMph:
                maximumWindSpeeds[index],

            sunrise: sunrises[index],
            sunset: sunsets[index],

            weatherCode,
            condition: getWeatherCondition(weatherCode),
        };
    });
}

export function normalizeOpenMeteoForecast(
    responseBody,
) {
    const current = normalizeCurrentConditions(
        responseBody,
    );

    return {
        location: {
            name: weatherConfig.location.name,
            region: weatherConfig.location.region,

            displayName:
                `${weatherConfig.location.name}, ` +
                weatherConfig.location.region,

            latitude: weatherConfig.location.latitude,
            longitude: weatherConfig.location.longitude,

            timezone:
                responseBody.timezone ??
                weatherConfig.location.timezone,
        },

        current,

        hourly: normalizeHourlyForecast(
            responseBody,
            current,
        ),

        daily: normalizeDailyForecast(responseBody),

        attribution: {
            provider: "Open-Meteo",
            text: "Weather data by Open-Meteo",
        },
    };
}