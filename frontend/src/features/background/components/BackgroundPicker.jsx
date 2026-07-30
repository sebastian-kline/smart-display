import { useEffect, useRef } from "react";

import useBackgroundOptions from "../hooks/useBackgroundOptions.js";
import useBackgroundPreference from "../hooks/useBackgroundPreference.js";

import "../styles/backgroundPicker.css";

function BackgroundPreviewCard({
                                   background,
                                   isCurrent,
                                   onSelect,
                               }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return undefined;
        }

        /*
         * Only play previews that are visible.
         * This prevents every MP4 in the directory
         * from playing at the same time.
         */
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const playRequest = video.play();

                    if (playRequest) {
                        void playRequest.catch(() => {
                            // Ignore temporary autoplay failures.
                        });
                    }
                } else {
                    video.pause();
                }
            },
            {
                threshold: 0.35,
            },
        );

        observer.observe(video);

        return () => {
            observer.disconnect();
            video.pause();
        };
    }, []);

    return (
        <button
            className={[
                "background-picker__option",
                isCurrent
                    ? "background-picker__option--current"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
            type="button"
            aria-pressed={isCurrent}
            aria-label={
                isCurrent
                    ? `${background.name}, current background`
                    : `Use ${background.name} background`
            }
            onClick={onSelect}
        >
            <video
                ref={videoRef}
                className="background-picker__option-video"
                src={background.source}
                loop
                muted
                playsInline
                preload="metadata"
            />

            <span className="background-picker__option-shade" />

            <span className="background-picker__option-name">
                {background.name}
            </span>

            {isCurrent ? (
                <span
                    className="background-picker__current-indicator"
                    aria-hidden="true"
                >
                    ✓
                </span>
            ) : null}
        </button>
    );
}

function BackgroundPicker() {
    const {
        backgrounds,
        isLoading,
        errorMessage,
        reloadBackgrounds,
    } = useBackgroundOptions();

    const {
        backgroundSource,
        setBackgroundSource,
    } = useBackgroundPreference();

    if (isLoading) {
        return (
            <p className="background-picker__message">
                Loading backgrounds…
            </p>
        );
    }

    if (errorMessage) {
        return (
            <div className="background-picker__error">
                <p>{errorMessage}</p>

                <button
                    className="settings-action"
                    type="button"
                    onClick={reloadBackgrounds}
                >
                    Try again
                </button>
            </div>
        );
    }

    if (backgrounds.length === 0) {
        return (
            <p className="background-picker__message">
                No MP4 backgrounds were found.
            </p>
        );
    }

    return (
        <section className="background-picker">
            <div className="background-picker__list">
                {backgrounds.map((background) => {
                    const isCurrent =
                        background.source ===
                        backgroundSource;

                    return (
                        <BackgroundPreviewCard
                            key={background.source}
                            background={background}
                            isCurrent={isCurrent}
                            onSelect={() =>
                                setBackgroundSource(
                                    background.source,
                                )
                            }
                        />
                    );
                })}
            </div>
        </section>
    );
}

export default BackgroundPicker;