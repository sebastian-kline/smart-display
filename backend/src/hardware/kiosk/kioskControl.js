import { runCommand } from "../../utils/runCommand.js";

export async function exitKiosk() {
    try {
        await runCommand("pkill", [
            "-f",
            "chromium.*--kiosk",
        ]);

        return true;
    } catch (error) {
        // pkill returns exit code 1 when no matching process exists.
        if (error.code === 1) {
            return false;
        }

        throw error;
    }
}