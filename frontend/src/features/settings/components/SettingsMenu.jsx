import { useEffect, useRef, useState } from "react";

import SettingsPanel from "./SettingsPanel.jsx";
import "../styles/settings.css";

function MenuIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="M5 7h14M5 12h14M5 17h14"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function GearIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Zm7-3.25.02-1.4-1.9-.7a7 7 0 0 0-.55-1.32l.85-1.84-1.98-1.98-1.84.85a7 7 0 0 0-1.32-.55L11.6 3H8.8l-.68 2.06a7 7 0 0 0-1.32.55l-1.84-.85-1.98 1.98.85 1.84a7 7 0 0 0-.55 1.32l-1.9.7L1.4 12l.02 1.4 1.86.7c.14.46.33.9.55 1.32l-.85 1.84 1.98 1.98 1.84-.85c.42.22.86.41 1.32.55L8.8 21h2.8l.68-2.06c.46-.14.9-.33 1.32-.55l1.84.85 1.98-1.98-.85-1.84c.22-.42.41-.86.55-1.32l1.9-.7L19 12Z"
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}

function SettingsMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const menuContainerRef = useRef(null);

    useEffect(() => {
        if (!isMenuOpen) {
            return undefined;
        }

        function handleOutsidePointer(event) {
            if (
                !menuContainerRef.current?.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        }

        function handleEscapeKey(event) {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener(
            "pointerdown",
            handleOutsidePointer,
        );
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener(
                "pointerdown",
                handleOutsidePointer,
            );
            document.removeEventListener(
                "keydown",
                handleEscapeKey,
            );
        };
    }, [isMenuOpen]);

    function openSettingsPanel() {
        setIsMenuOpen(false);
        setIsPanelOpen(true);
    }

    return (
        <>
            <div
                className="settings-menu"
                ref={menuContainerRef}
            >
                <button
                    className="settings-menu__trigger"
                    type="button"
                    aria-label="Open menu"
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((current) => !current)}
                >
                    <MenuIcon />
                </button>

                {isMenuOpen ? (
                    <div
                        className="settings-menu__dropdown"
                        role="menu"
                    >
                        <button
                            className="settings-menu__item"
                            type="button"
                            role="menuitem"
                            onClick={openSettingsPanel}
                        >
                            <GearIcon />
                            <span>Settings</span>
                        </button>
                    </div>
                ) : null}
            </div>

            {isPanelOpen ? (
                <SettingsPanel
                    onClose={() => setIsPanelOpen(false)}
                />
            ) : null}
        </>
    );
}

export default SettingsMenu;