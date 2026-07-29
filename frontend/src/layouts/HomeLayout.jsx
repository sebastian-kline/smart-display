import { Background } from "../features/background/index.js";
import { Clock } from "../features/clock/index.js";
import { SettingsMenu } from "../features/settings/index.js";
import { StatusBar } from "../features/system/index.js";
import { HomeWeatherWidget } from "../features/weather/index.js";

import "./HomeLayout.css";

function HomeLayout() {
    return (
        <main className="home-layout">
            <Background source="/backgrounds/home.mp4" />

            <HomeWeatherWidget />

            <div className="home-layout__center">
                <Clock />
            </div>

            <StatusBar />
            <SettingsMenu />
        </main>
    );
}

export default HomeLayout;