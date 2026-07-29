import { runCommand } from "../../utils/runCommand.js";

const DEFAULT_AUDIO_SINK = "@DEFAULT_AUDIO_SINK@";

function getAudioEnvironment() {
    const userId = process.getuid();

    return {
        ...process.env,

        // PipeWire stores its user-session socket under this directory.
        XDG_RUNTIME_DIR:
            process.env.XDG_RUNTIME_DIR ?? `/run/user/${userId}`,
    };
}

export async function getSystemVolume() {
    const { stdout } = await runCommand(
        "wpctl",
        ["get-volume", DEFAULT_AUDIO_SINK],
        {
            env: getAudioEnvironment(),
        },
    );

    const match = stdout.match(
        /Volume:\s+([0-9.]+)(?:\s+\[(MUTED)\])?/i,
    );

    if (!match) {
        throw new Error(
            `Unable to parse system volume output: ${stdout}`,
        );
    }

    const volumeLevel = Number.parseFloat(match[1]);

    if (!Number.isFinite(volumeLevel)) {
        throw new Error("Audio system returned an invalid volume.");
    }

    return {
        volumePercent: Math.round(volumeLevel * 100),
        isMuted: Boolean(match[2]),
    };
}

export async function setSystemVolume(volumePercent) {
    const audioEnvironment = getAudioEnvironment();

    await runCommand(
        "wpctl",
        [
            "set-volume",
            DEFAULT_AUDIO_SINK,
            `${volumePercent}%`,
            "--limit",
            "1.0",
        ],
        {
            env: audioEnvironment,
        },
    );

    // Adjusting the volume should restore sound if it was previously muted.
    await runCommand(
        "wpctl",
        ["set-mute", DEFAULT_AUDIO_SINK, "0"],
        {
            env: audioEnvironment,
        },
    );

    return getSystemVolume();
}