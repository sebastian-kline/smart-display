const BACKGROUND_ENDPOINT = "/api/backgrounds";

export async function fetchBackgrounds({ signal } = {}) {
    const response = await fetch(BACKGROUND_ENDPOINT, {
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
            `Background request failed with status ${response.status}.`,
        );
    }

    const backgrounds =
        responseBody?.data?.backgrounds;

    if (!Array.isArray(backgrounds)) {
        throw new Error(
            "Background response contained invalid data.",
        );
    }

    return backgrounds;
}