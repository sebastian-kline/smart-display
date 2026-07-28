const CPU_TEMPERATURE_ENDPOINT =
    "/api/system/cpu-temperature";

export async function fetchCpuTemperature({ signal } = {}) {
    const response = await fetch(CPU_TEMPERATURE_ENDPOINT, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
        signal,
    });

    if (!response.ok) {
        throw new Error(
            `CPU temperature request failed with status ${response.status}.`,
        );
    }

    const responseBody = await response.json();
    const temperatureCelsius =
        responseBody?.data?.temperatureCelsius;

    if (!Number.isFinite(temperatureCelsius)) {
        throw new Error(
            "CPU temperature response contained invalid data.",
        );
    }

    return temperatureCelsius;
}