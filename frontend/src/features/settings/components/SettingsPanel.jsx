import { useState } from "react";

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

function SettingsPanel({ onClose }) {
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
    const [isExiting, setIsExiting] = useState(false);
    const [exitError, setExitError] = useState("");

    async function handleExitKiosk() {
        setIsExiting(true);
        setExitError("");

        try {
            await exitKiosk();
        } catch (error) {
            console.error("Unable to exit kiosk mode:", error);
            setExitError("Unable to exit kiosk mode.");
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
                onPointerDown={(event) => event.stopPropagation()}
            >
                <header className="settings-panel__header">
                    <h2
                        id="settings-title"
                        className="settings-panel__title"
                    >
                        Settings
                    </h2>

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
                    {isLoading ? (
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
                                    disabled={isSavingBrightness}
                                    isSaving={isSavingBrightness}
                                    onChange={setBrightnessPercent}
                                    onCommit={commitBrightness}
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
                                    disabled={isSavingVolume}
                                    isSaving={isSavingVolume}
                                    onChange={setVolumePercent}
                                    onCommit={commitVolume}
                                />
                            </section>

                            <section className="settings-section">
                                <h3 className="settings-section__title">
                                    System
                                </h3>

                                {!isConfirmingExit ? (
                                    <button
                                        className="settings-action settings-action--danger"
                                        type="button"
                                        onClick={() => setIsConfirmingExit(true)}
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
                                                disabled={isExiting}
                                                onClick={() =>
                                                    setIsConfirmingExit(false)
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                className="settings-action settings-action--danger"
                                                type="button"
                                                disabled={isExiting}
                                                onClick={handleExitKiosk}
                                            >
                                                {isExiting ? "Exiting…" : "Exit"}
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
                        </>
                    )}

                    {errorMessage ? (
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