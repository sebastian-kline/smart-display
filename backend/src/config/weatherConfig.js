function readNumberFromEnvironment(
    variableName,
    fallbackValue,
    minimumValue,
    maximumValue,
) {
    const configuredValue = process.env[variableName];

    if (configuredValue === undefined) {
        return fallbackValue;
    }

    const parsedValue = Number.parseFloat(configuredValue);

    if (
        !Number.isFinite(parsedValue) ||
        parsedValue < minimumValue ||
        parsedValue > maximumValue
    ) {
        throw new Error(
            `${variableName} must be a number from ` +
            `${minimumValue} through ${maximumValue}.`,
        );
    }

    return parsedValue;
}

export const weatherConfig = Object.freeze({
    providerBaseUrl:
        "https://api.open-meteo.com/v1/forecast",

    location: Object.freeze({
        name:
            process.env.WEATHER_LOCATION_NAME ??
            "Herminie",

        region:
            process.env.WEATHER_LOCATION_REGION ??
            "PA",

        latitude: readNumberFromEnvironment(
            "WEATHER_LATITUDE",
            40.2634,
            -90,
            90,
        ),

        longitude: readNumberFromEnvironment(
            "WEATHER_LONGITUDE",
            -79.7175,
            -180,
            180,
        ),

        timezone:
            process.env.WEATHER_TIMEZONE ??
            "America/New_York",
    }),

    forecastDays: 7,
    hourlyForecastHours: 24,

    requestTimeoutMilliseconds: 8_000,
    cacheDurationMilliseconds: 10 * 60 * 1000,

    // A recent cached forecast remains useful during a brief outage.
    maximumStaleAgeMilliseconds: 6 * 60 * 60 * 1000,
});