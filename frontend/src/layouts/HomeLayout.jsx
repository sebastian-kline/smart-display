import { Background } from "../features/background/index.js";
import { Clock } from "../features/clock/index.js";
import { StatusBar } from "../features/system/index.js";

import "./HomeLayout.css";

function HomeLayout() {
    return (
        <main className="home-layout">
            <Background source="/backgrounds/home.mp4" />

            <div className="home-layout__center">
                <Clock />
            </div>

            <StatusBar />
        </main>
    );
}

export default HomeLayout;