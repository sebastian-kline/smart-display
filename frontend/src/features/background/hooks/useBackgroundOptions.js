import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { fetchBackgrounds } from "../services/backgroundService.js";

function useBackgroundOptions() {
    const [backgrounds, setBackgrounds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const requestController = new AbortController();

        async function loadInitialBackgrounds() {
            try {
                const availableBackgrounds =
                    await fetchBackgrounds({
                        signal: requestController.signal,
                    });

                if (requestController.signal.aborted) {
                    return;
                }

                setBackgrounds(availableBackgrounds);
                setErrorMessage("");
            } catch (error) {
                if (
                    error.name !== "AbortError" &&
                    !requestController.signal.aborted
                ) {
                    console.error(
                        "Unable to load backgrounds:",
                        error,
                    );

                    setErrorMessage(
                        "Unable to load backgrounds.",
                    );
                }
            } finally {
                if (!requestController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadInitialBackgrounds();

        return () => {
            requestController.abort();
        };
    }, []);

    const reloadBackgrounds = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const availableBackgrounds =
                await fetchBackgrounds();

            setBackgrounds(availableBackgrounds);
            setErrorMessage("");
        } catch (error) {
            console.error(
                "Unable to reload backgrounds:",
                error,
            );

            setErrorMessage(
                "Unable to load backgrounds.",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        backgrounds,
        isLoading,
        errorMessage,
        reloadBackgrounds,
    };
}

export default useBackgroundOptions;