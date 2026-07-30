import { useState } from "react";

import { DEFAULT_BACKGROUND_SOURCE } from "../hooks/useBackgroundPreference.js";
import "../styles/background.css";

function Background({
                        source = DEFAULT_BACKGROUND_SOURCE,
                    }) {
    const [failedSource, setFailedSource] =
        useState(null);

    const activeSource =
        failedSource === source
            ? DEFAULT_BACKGROUND_SOURCE
            : source;

    function handleVideoError() {
        if (source !== DEFAULT_BACKGROUND_SOURCE) {
            setFailedSource(source);
        }
    }

    return (
        <div
            className="background"
            aria-hidden="true"
        >
            <video
                key={activeSource}
                className="background__video"
                src={activeSource}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onError={handleVideoError}
            />

            <div className="background__overlay" />
        </div>
    );
}

export default Background;