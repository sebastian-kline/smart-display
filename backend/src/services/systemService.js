import { readCpuTemperature } from "../hardware/cpu/readCpuTemperature.js";

export async function getCpuTemperature() {
    return readCpuTemperature();
}