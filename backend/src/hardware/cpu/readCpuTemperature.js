import { readFile } from "node:fs/promises";

const DEFAULT_TEMPERATURE_PATH =
    "/sys/class/thermal/thermal_zone0/temp";

/**
 * Reads the Raspberry Pi CPU temperature from Linux thermal sysfs.
 *
 * The path can be overridden for testing or future hardware support.
 */
export async function readCpuTemperature() {
    const temperaturePath =
        process.env.CPU_TEMPERATURE_PATH ?? DEFAULT_TEMPERATURE_PATH;

    const rawTemperature = await readFile(temperaturePath, "utf8");
    const millidegreesCelsius = Number.parseInt(
        rawTemperature.trim(),
        10,
    );

    if (!Number.isFinite(millidegreesCelsius)) {
        throw new Error("CPU temperature contained an invalid value.");
    }

    const temperatureCelsius = millidegreesCelsius / 1000;

    // Reject obviously invalid readings instead of returning corrupt data.
    if (temperatureCelsius < -20 || temperatureCelsius > 150) {
        throw new Error("CPU temperature was outside the expected range.");
    }

    return Math.round(temperatureCelsius * 10) / 10;
}