import { runCommand } from "../../utils/runCommand.js";

const BRIGHTNESS_VCP_CODE = "10";

export async function getDisplayBrightness() {
    const { stdout } = await runCommand("ddcutil", [
        "getvcp",
        BRIGHTNESS_VCP_CODE,
        "--brief",
    ]);

    const match = stdout.match(
        /VCP\s+10\s+C\s+(\d+)\s+(\d+)/i,
    );

    if (!match) {
        throw new Error(
            `Unable to parse display brightness output: ${stdout}`,
        );
    }

    const currentValue = Number.parseInt(match[1], 10);
    const maximumValue = Number.parseInt(match[2], 10);

    if (
        !Number.isFinite(currentValue) ||
        !Number.isFinite(maximumValue) ||
        maximumValue <= 0
    ) {
        throw new Error("Display returned an invalid brightness value.");
    }

    return {
        brightnessPercent: Math.round(
            (currentValue / maximumValue) * 100,
        ),
        currentValue,
        maximumValue,
    };
}

export async function setDisplayBrightness(brightnessPercent) {
    const { maximumValue } = await getDisplayBrightness();

    const displayValue = Math.round(
        (brightnessPercent / 100) * maximumValue,
    );

    await runCommand("ddcutil", [
        "setvcp",
        BRIGHTNESS_VCP_CODE,
        String(displayValue),
    ]);

    return getDisplayBrightness();
}