import { useEffect, useState } from "react";

import { fetchCpuTemperature } from "../services/systemService.js";

const REFRESH_INTERVAL_MS = 10_000;

function useCpuTemperature() {
    const [temperatureCelsius, setTemperatureCelsius] =
        useState(null);
    const [isStale, setIsStale] = useState(false);

    useEffect(() => {
        let isActive = true;
        let refreshTimeoutId;
        let requestController;

        async function refreshTemperature() {
            requestController = new AbortController();

            try {
                const latestTemperature = await fetchCpuTemperature({
                    signal: requestController.signal,
                });

                if (isActive) {
                    setTemperatureCelsius(latestTemperature);
                    setIsStale(false);
                }
            } catch (error) {
                if (error.name !== "AbortError" && isActive) {
                    console.error(
                        "Unable to refresh CPU temperature:",
                        error,
                    );

                    // Keep the last successful reading instead of flashing "--".
                    setIsStale(true);
                }
            } finally {
                if (isActive) {
                    // Recursive timeout prevents requests from overlapping.
                    refreshTimeoutId = window.setTimeout(
                        refreshTemperature,
                        REFRESH_INTERVAL_MS,
                    );
                }
            }
        }

        refreshTemperature();

        return () => {
            isActive = false;
            requestController?.abort();
            window.clearTimeout(refreshTimeoutId);
        };
    }, []);

    return {
        temperatureCelsius,
        isStale,
    };
}

export default useCpuTemperature;