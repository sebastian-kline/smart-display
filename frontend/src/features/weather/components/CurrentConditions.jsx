import {
    formatClockTime,
    formatTemperature,
} from "../utils/weatherFormatting.js";
import WeatherIcon from "./WeatherIcon.jsx";

function CurrentConditions({ weather }) {
    const { current, daily } = weather;
    const today = daily[0];

    return (
        <section className="current-conditions">
            <div className="current-conditions__primary">
                <WeatherIcon
                    conditionKey={current.condition.key}
                    isDay={current.isDay}
                    className="current-conditions__icon"
                />

                <div>
                    <div className="current-conditions__temperature">
                        {formatTemperature(
                            current.temperatureFahrenheit,
                        )}
                    </div>

                    <div className="current-conditions__description">
                        {current.condition.label}
                    </div>
                </div>
            </div>

            <div className="current-conditions__details">
                <div>
                    <span>Feels like</span>
                    <strong>
                        {formatTemperature(
                            current.feelsLikeFahrenheit,
                        )}
                    </strong>
                </div>

                <div>
                    <span>High / Low</span>
                    <strong>
                        {formatTemperature(
                            today.highTemperatureFahrenheit,
                        )}{" "}
                        /{" "}
                        {formatTemperature(
                            today.lowTemperatureFahrenheit,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Humidity</span>
                    <strong>{current.humidityPercent}%</strong>
                </div>

                <div>
                    <span>Wind</span>
                    <strong>{Math.round(current.windSpeedMph)} mph</strong>
                </div>

                <div>
                    <span>Sunrise</span>
                    <strong>{formatClockTime(today.sunrise)}</strong>
                </div>

                <div>
                    <span>Sunset</span>
                    <strong>{formatClockTime(today.sunset)}</strong>
                </div>
            </div>
        </section>
    );
}

export default CurrentConditions;