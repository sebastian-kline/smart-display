import { execFile } from "node:child_process";
import { promisify } from "node:util";

const executeFile = promisify(execFile);

/**
 * Runs a system command without opening a shell.
 *
 * Arguments are passed separately to avoid shell interpretation and make
 * hardware-control commands safer.
 */
export async function runCommand(command, argumentsList = [], options = {}) {
    const { stdout = "", stderr = "" } = await executeFile(
        command,
        argumentsList,
        {
            encoding: "utf8",
            timeout: 10_000,
            maxBuffer: 64 * 1024,
            ...options,
        },
    );

    return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
    };
}