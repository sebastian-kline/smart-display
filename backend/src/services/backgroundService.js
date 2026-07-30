import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const DEFAULT_BACKGROUND_DIRECTORY = fileURLToPath(
    new URL(
        "../../../frontend/public/backgrounds/",
        import.meta.url,
    ),
);

function createDisplayName(filename) {
    return filename
        .replace(/\.mp4$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
}

export async function getAvailableBackgrounds() {
    const backgroundDirectory =
        process.env.BACKGROUND_DIRECTORY ??
        DEFAULT_BACKGROUND_DIRECTORY;

    const directoryEntries = await readdir(
        backgroundDirectory,
        {
            withFileTypes: true,
        },
    );

    return directoryEntries
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.toLowerCase().endsWith(".mp4"),
        )
        .sort((firstEntry, secondEntry) =>
            firstEntry.name.localeCompare(
                secondEntry.name,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base",
                },
            ),
        )
        .map((entry) => ({
            filename: entry.name,
            name: createDisplayName(entry.name),
            source: `/backgrounds/${encodeURIComponent(
                entry.name,
            )}`,
            isDefault:
                entry.name.toLowerCase() === "pitt-skyline.mp4",
        }));
}