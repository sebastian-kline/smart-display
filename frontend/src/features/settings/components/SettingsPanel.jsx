import {
    useRef,
    useState,
} from "react";

import { BackgroundPicker } from "../../background/index.js";
import useSettingsControls from "../hooks/useSettingsControls.js";
import { exitKiosk } from "../services/settingsService.js";
import RangeSetting from "./RangeSetting.jsx";

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function BackIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="m15 18-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function BackgroundIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <rect
                x="3"
                y="4"
                width="18"
                height="16"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
            />

            <circle
                cx="8"
                cy="9"
                r="1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
            />

            <path
                d="m4 17 4.5-4.5 3.2 3.2 2.5-2.5L20 19"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
            />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="m9 6 6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function SettingsPanel({ onClose }) {
    const [activeView, setActiveView] =
        useState("settings");

    const [isSystemUnlocked, setIsSystemUnlocked] =
        useState(false);

    const secretTapCountRef = useRef(0);
    const secretTapTimeoutRef = useRef(null);

    const {
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
    } = useSettingsControls();

    const [isConfirmingExit, setIsConfirmingExit] =
        useState(false);

    const [isExiting, setIsExiting] =
        useState(false);

    const [exitError, setExitError] =
        useState("");

    const isBackgroundView =
        activeView === "background";

    function handleSecretTap() {
        secretTapCountRef.current += 1;

        window.clearTimeout(
            secretTapTimeoutRef.current,
        );

        if (secretTapCountRef.current >= 5) {
            setIsSystemUnlocked(true);
            secretTapCountRef.current = 0;
            return;
        }

        secretTapTimeoutRef.current =
            window.setTimeout(() => {
                secretTapCountRef.current = 0;
            }, 2_000);
    }

    async function handleExitKiosk() {
        setIsExiting(true);
        setExitError("");

        try {
            await exitKiosk();
        } catch (error) {
            console.error(
                "Unable to exit kiosk mode:",
                error,
            );

            setExitError(
                "Unable to exit kiosk mode.",
            );

            setIsExiting(false);
        }
    }

    return (
        <div
            className="settings-overlay"
            onPointerDown={onClose}
        >
            <aside
                className="settings-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
                onPointerDown={(event) =>
                    event.stopPropagation()
                }
            >
                <header className="settings-panel__header">
                    <div className="settings-panel__heading">
                        {isBackgroundView ? (
                            <button
                                className="settings-panel__back"
                                type="button"
                                aria-label="Back to settings"
                                onClick={() =>
                                    setActiveView(
                                        "settings",
                                    )
                                }
                            >
                                <BackIcon />
                            </button>
                        ) : null}

                        <h2
                            id="settings-title"
                            className="settings-panel__title"
                            onPointerUp={
                                isBackgroundView
                                    ? undefined
                                    : handleSecretTap
                            }
                        >
                            {isBackgroundView
                                ? "Background"
                                : "Settings"}
                        </h2>
                    </div>

                    <button
                        className="settings-panel__close"
                        type="button"
                        aria-label="Close settings"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </button>
                </header>

                <div className="settings-panel__content">
                    {isBackgroundView ? (
                        <BackgroundPicker />
                    ) : isLoading ? (
                        <p className="settings-panel__message">
                            Loading settings…
                        </p>
                    ) : (
                        <>
                            <section className="settings-section">
                                <h3 className="settings-section__title">
                                    Display
                                </h3>

                                <RangeSetting
                                    id="brightness-setting"
                                    label="Brightness"
                                    minimum={15}
                                    value={brightnessPercent}
                                    disabled={
                                        isSavingBrightness
                                    }
                                    isSaving={
                                        isSavingBrightness
                                    }
                                    onChange={
                                        setBrightnessPercent
                                    }
                                    onCommit={
                                        commitBrightness
                                    }
                                />
                            </section>

                            <section className="settings-section">
                                <h3 className="settings-section__title">
                                    Audio
                                </h3>

                                <RangeSetting
                                    id="volume-setting"
                                    label="Volume"
                                    value={volumePercent}
                                    disabled={
                                        isSavingVolume
                                    }
                                    isSaving={
                                        isSavingVolume
                                    }
                                    onChange={
                                        setVolumePercent
                                    }
                                    onCommit={
                                        commitVolume
                                    }
                                />
                            </section>

                            <section className="settings-section">
                                <h3 className="settings-section__title">
                                    Appearance
                                </h3>

                                <button
                                    className="settings-navigation"
                                    type="button"
                                    onClick={() =>
                                        setActiveView(
                                            "background",
                                        )
                                    }
                                >
                                    <BackgroundIcon />

                                    <span className="settings-navigation__text">
                                        <strong>
                                            Background
                                        </strong>

                                        <span>
                                            Choose animated background
                                        </span>
                                    </span>

                                    <ChevronIcon />
                                </button>
                            </section>

                            {isSystemUnlocked ? (
                                <section className="settings-section">
                                    <h3 className="settings-section__title">
                                        System
                                    </h3>

                                    {!isConfirmingExit ? (
                                        <button
                                            className="settings-action settings-action--danger"
                                            type="button"
                                            onClick={() =>
                                                setIsConfirmingExit(
                                                    true,
                                                )
                                            }
                                        >
                                            Exit kiosk mode
                                        </button>
                                    ) : (
                                        <div className="exit-confirmation">
                                            <p className="exit-confirmation__message">
                                                Exit to the Raspberry Pi desktop?
                                            </p>

                                            <div className="exit-confirmation__actions">
                                                <button
                                                    className="settings-action"
                                                    type="button"
                                                    disabled={
                                                        isExiting
                                                    }
                                                    onClick={() =>
                                                        setIsConfirmingExit(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    className="settings-action settings-action--danger"
                                                    type="button"
                                                    disabled={
                                                        isExiting
                                                    }
                                                    onClick={
                                                        handleExitKiosk
                                                    }
                                                >
                                                    {isExiting
                                                        ? "Exiting…"
                                                        : "Exit"}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {exitError ? (
                                        <p className="settings-panel__error">
                                            {exitError}
                                        </p>
                                    ) : null}
                                </section>
                            ) : null}
                        </>
                    )}

                    {!isBackgroundView &&
                    errorMessage ? (
                        <div className="settings-error">
                            <p>{errorMessage}</p>

                            <button
                                type="button"
                                onClick={reloadSettings}
                            >
                                Try again
                            </button>
                        </div>
                    ) : null}
                </div>
            </aside>
        </div>
    );
}

export default SettingsPanel;