import { getSystemVolume, setSystemVolume } from "../hardware/audio/systemVolume.js";
import {
    getDisplayBrightness,
    setDisplayBrightness,
} from "../hardware/display/displayBrightness.js";
import { exitKiosk } from "../hardware/kiosk/kioskControl.js";
import { readCpuTemperature } from "../hardware/cpu/readCpuTemperature.js";

export async function getCpuTemperature() {
    return readCpuTemperature();
}

export async function getBrightness() {
    return getDisplayBrightness();
}

export async function updateBrightness(brightnessPercent) {
    return setDisplayBrightness(brightnessPercent);
}

export async function getVolume() {
    return getSystemVolume();
}

export async function updateVolume(volumePercent) {
    return setSystemVolume(volumePercent);
}

export async function closeKiosk() {
    return exitKiosk();
}