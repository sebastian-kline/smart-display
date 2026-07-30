import {
    useCallback,
    useEffect,
    useState,
} from "react";

export const DEFAULT_BACKGROUND_SOURCE =
    "/backgrounds/home.mp4";

const BACKGROUND_STORAGE_KEY =
    "smart-display:selected-background";

const BACKGROUND_CHANGE_EVENT =
    "smart-display:background-changed";

function isValidBackgroundSource(source) {
    return (
        typeof source === "string" &&
        source.startsWith("/backgrounds/") &&
        source.toLowerCase().endsWith(".mp4")
    );
}

function readSavedBackground() {
    if (typeof window === "undefined") {
        return DEFAULT_BACKGROUND_SOURCE;
    }

    const savedSource = window.localStorage.getItem(
        BACKGROUND_STORAGE_KEY,
    );

    return isValidBackgroundSource(savedSource)
        ? savedSource
        : DEFAULT_BACKGROUND_SOURCE;
}

function useBackgroundPreference() {
    const [backgroundSource, setBackgroundSourceState] =
        useState(readSavedBackground);

    useEffect(() => {
        function handleBackgroundChange(event) {
            const changedSource = event.detail?.source;

            if (isValidBackgroundSource(changedSource)) {
                setBackgroundSourceState(changedSource);
            }
        }

        function handleStorageChange(event) {
            if (
                event.key === BACKGROUND_STORAGE_KEY
            ) {
                setBackgroundSourceState(
                    readSavedBackground(),
                );
            }
        }

        window.addEventListener(
            BACKGROUND_CHANGE_EVENT,
            handleBackgroundChange,
        );

        window.addEventListener(
            "storage",
            handleStorageChange,
        );

        return () => {
            window.removeEventListener(
                BACKGROUND_CHANGE_EVENT,
                handleBackgroundChange,
            );

            window.removeEventListener(
                "storage",
                handleStorageChange,
            );
        };
    }, []);

    const setBackgroundSource = useCallback((source) => {
        const safeSource = isValidBackgroundSource(source)
            ? source
            : DEFAULT_BACKGROUND_SOURCE;

        window.localStorage.setItem(
            BACKGROUND_STORAGE_KEY,
            safeSource,
        );

        setBackgroundSourceState(safeSource);

        window.dispatchEvent(
            new CustomEvent(BACKGROUND_CHANGE_EVENT, {
                detail: {
                    source: safeSource,
                },
            }),
        );
    }, []);

    return {
        backgroundSource,
        setBackgroundSource,
    };
}

export default useBackgroundPreference;