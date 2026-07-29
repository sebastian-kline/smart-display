import { Route, Routes } from "react-router";

import HomePage from "../pages/HomePage.jsx";
import WeatherPage from "../pages/WeatherPage.jsx";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/weather" element={<WeatherPage />} />
        </Routes>
    );
}

export default AppRouter;