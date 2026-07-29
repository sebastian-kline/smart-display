import { useNavigate } from "react-router";

import useWeather from "../hooks/useWeather.js";
import { formatTemperature } from "../utils/weatherFormatting.js";
import WeatherIcon from "./WeatherIcon.jsx";
import "../styles/weather.css";

function HomeWeatherWidget() {
    const navigate = useNavigate();
    const { weather, isLoading, errorMessage } = useWeather();

    const currentWeather = weather?.current;

    return (
        <button
            className="home-weather-widget"
            type="button"
            aria-label="Open weather"
            onClick={() => navigate("/weather")}
        >
            <WeatherIcon
                conditionKey={currentWeather?.condition?.key}
                isDay={currentWeather?.isDay ?? true}
                className="home-weather-widget__icon"
            />

            <span className="home-weather-widget__temperature">
        {isLoading
            ? "--°"
            : formatTemperature(
                currentWeather?.temperatureFahrenheit,
            )}
      </span>

            {weather &&
            (weather.metadata?.isStale || errorMessage) ? (
                <span
                    className="home-weather-widget__stale"
                    aria-label="Weather data may be out of date"
                />
            ) : null}
        </button>
    );
}

export default HomeWeatherWidget;