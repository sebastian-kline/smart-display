const SYSTEM_CONTROL_ENDPOINT = "/api/system/control";

async function requestData(endpoint, options = {}) {
    const { headers, ...fetchOptions } = options;

    const response = await fetch(endpoint, {
        cache: "no-store",
        ...fetchOptions,
        headers: {
            Accept: "application/json",
            ...headers,
        },
    });

    let responseBody = null;

    try {
        responseBody = await response.json();
    } catch {
        // Some successful requests may not contain JSON.
    }

    if (!response.ok) {
        const message =
            responseBody?.error?.message ??
            `Request failed with status ${response.status}.`;

        throw new Error(message);
    }

    return responseBody?.data ?? null;
}

export async function fetchDisplayBrightness({ signal } = {}) {
    const data = await requestData(
        `${SYSTEM_CONTROL_ENDPOINT}/brightness`,
        { signal },
    );

    return data.brightnessPercent;
}

export async function updateDisplayBrightness(brightnessPercent) {
    const data = await requestData(
        `${SYSTEM_CONTROL_ENDPOINT}/brightness`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                brightnessPercent,
            }),
        },
    );

    return data.brightnessPercent;
}

export async function fetchSystemVolume({ signal } = {}) {
    const data = await requestData(
        `${SYSTEM_CONTROL_ENDPOINT}/volume`,
        { signal },
    );

    return data.volumePercent;
}

export async function updateSystemVolume(volumePercent) {
    const data = await requestData(
        `${SYSTEM_CONTROL_ENDPOINT}/volume`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                volumePercent,
            }),
        },
    );

    return data.volumePercent;
}

export async function exitKiosk() {
    return requestData(
        `${SYSTEM_CONTROL_ENDPOINT}/kiosk/exit`,
        {
            method: "POST",
        },
    );
}