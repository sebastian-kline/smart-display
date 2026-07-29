import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    fetchDisplayBrightness,
    fetchSystemVolume,
    updateDisplayBrightness,
    updateSystemVolume,
} from "../services/settingsService.js";

function clampPercentage(value, minimum = 0) {
    return Math.min(
        100,
        Math.max(minimum, Math.round(value)),
    );
}

async function fetchSettings(signal) {
    const [brightnessPercent, volumePercent] =
        await Promise.all([
            fetchDisplayBrightness({ signal }),
            fetchSystemVolume({ signal }),
        ]);

    return {
        brightnessPercent,
        volumePercent,
    };
}

function useSettingsControls() {
    const [brightnessPercent, setBrightnessPercent] =
        useState(null);
    const [volumePercent, setVolumePercent] =
        useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSavingBrightness, setIsSavingBrightness] =
        useState(false);
    const [isSavingVolume, setIsSavingVolume] =
        useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const savedBrightnessRef = useRef(null);
    const savedVolumeRef = useRef(null);

    useEffect(() => {
        const requestController = new AbortController();

        async function loadInitialSettings() {
            try {
                const settings = await fetchSettings(
                    requestController.signal,
                );

                if (requestController.signal.aborted) {
                    return;
                }

                savedBrightnessRef.current =
                    settings.brightnessPercent;
                savedVolumeRef.current = settings.volumePercent;

                setBrightnessPercent(settings.brightnessPercent);
                setVolumePercent(settings.volumePercent);
            } catch (error) {
                if (
                    error.name !== "AbortError" &&
                    !requestController.signal.aborted
                ) {
                    console.error(
                        "Unable to load display settings:",
                        error,
                    );

                    setErrorMessage(
                        "Unable to load system settings.",
                    );
                }
            } finally {
                if (!requestController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadInitialSettings();

        return () => {
            requestController.abort();
        };
    }, []);

    const reloadSettings = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const settings = await fetchSettings();

            savedBrightnessRef.current =
                settings.brightnessPercent;
            savedVolumeRef.current = settings.volumePercent;

            setBrightnessPercent(settings.brightnessPercent);
            setVolumePercent(settings.volumePercent);
        } catch (error) {
            console.error(
                "Unable to reload display settings:",
                error,
            );

            setErrorMessage("Unable to load system settings.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    async function commitBrightness(value) {
        const nextValue = clampPercentage(value, 10);

        if (
            nextValue === savedBrightnessRef.current ||
            isSavingBrightness
        ) {
            return;
        }

        setIsSavingBrightness(true);
        setErrorMessage("");

        try {
            const savedValue =
                await updateDisplayBrightness(nextValue);

            savedBrightnessRef.current = savedValue;
            setBrightnessPercent(savedValue);
        } catch (error) {
            console.error(
                "Unable to update brightness:",
                error,
            );

            setBrightnessPercent(savedBrightnessRef.current);
            setErrorMessage("Unable to update brightness.");
        } finally {
            setIsSavingBrightness(false);
        }
    }

    async function commitVolume(value) {
        const nextValue = clampPercentage(value);

        if (
            nextValue === savedVolumeRef.current ||
            isSavingVolume
        ) {
            return;
        }

        setIsSavingVolume(true);
        setErrorMessage("");

        try {
            const savedValue =
                await updateSystemVolume(nextValue);

            savedVolumeRef.current = savedValue;
            setVolumePercent(savedValue);
        } catch (error) {
            console.error("Unable to update volume:", error);

            setVolumePercent(savedVolumeRef.current);
            setErrorMessage("Unable to update volume.");
        } finally {
            setIsSavingVolume(false);
        }
    }

    return {
        brightnessPercent,
        volumePercent,
        isLoading,
        isSavingBrightness,
        isSavingVolume,
        errorMessage,

        setBrightnessPercent,
        setVolumePercent,
        commitBrightness,
        commitVolume,
        reloadSettings,
    };
}

export default useSettingsControls;