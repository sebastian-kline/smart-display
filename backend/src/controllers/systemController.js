import {
    closeKiosk,
    getBrightness,
    getCpuTemperature,
    getVolume,
    updateBrightness,
    updateVolume,
} from "../services/systemService.js";

function readPercentage(request, fieldName) {
    const value = request.body?.[fieldName];

    if (
        !Number.isInteger(value) ||
        value < 0 ||
        value > 100
    ) {
        return null;
    }

    return value;
}

function sendPercentageValidationError(response, fieldName) {
    return response.status(400).json({
        error: {
            code: "INVALID_PERCENTAGE",
            message: `${fieldName} must be an integer from 0 through 100.`,
        },
    });
}

export async function getCpuTemperatureController(
    _request,
    response,
) {
    const temperatureCelsius = await getCpuTemperature();

    response.status(200).json({
        data: {
            temperatureCelsius,
        },
    });
}

export async function getBrightnessController(
    _request,
    response,
) {
    const brightness = await getBrightness();

    response.status(200).json({
        data: brightness,
    });
}

export async function updateBrightnessController(
    request,
    response,
) {
    const brightnessPercent = readPercentage(
        request,
        "brightnessPercent",
    );

    if (brightnessPercent === null) {
        return sendPercentageValidationError(
            response,
            "brightnessPercent",
        );
    }

    const brightness = await updateBrightness(
        brightnessPercent,
    );

    return response.status(200).json({
        data: brightness,
    });
}

export async function getVolumeController(
    _request,
    response,
) {
    const volume = await getVolume();

    response.status(200).json({
        data: volume,
    });
}

export async function updateVolumeController(
    request,
    response,
) {
    const volumePercent = readPercentage(
        request,
        "volumePercent",
    );

    if (volumePercent === null) {
        return sendPercentageValidationError(
            response,
            "volumePercent",
        );
    }

    const volume = await updateVolume(volumePercent);

    return response.status(200).json({
        data: volume,
    });
}

export function exitKioskController(_request, response) {
    response.status(202).json({
        data: {
            accepted: true,
        },
    });

    // Give the HTTP response enough time to reach Chromium before closing it.
    setTimeout(() => {
        closeKiosk().catch((error) => {
            console.error("Unable to exit kiosk mode:", error);
        });
    }, 250).unref();
}