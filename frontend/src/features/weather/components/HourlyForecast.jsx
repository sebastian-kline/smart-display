import {
    formatHour,
    formatTemperature,
} from "../utils/weatherFormatting.js";
import WeatherIcon from "./WeatherIcon.jsx";

const DISPLAYED_HOURS = 8;

function HourlyForecast({ hourlyForecast }) {
    const displayedForecast = hourlyForecast.slice(
        0,
        DISPLAYED_HOURS,
    );

    return (
        <section className="hourly-forecast">
            <h2 className="weather-section-title">
                Next several hours
            </h2>

            <div className="hourly-forecast__list">
                {displayedForecast.map((hour, index) => (
                    <article
                        className="hourly-forecast__item"
                        key={hour.time}
                    >
            <span className="hourly-forecast__time">
              {formatHour(hour.time, index === 0)}
            </span>

                        <WeatherIcon
                            conditionKey={hour.condition.key}
                            isDay={hour.isDay}
                            className="hourly-forecast__icon"
                        />

                        <strong className="hourly-forecast__temperature">
                            {formatTemperature(
                                hour.temperatureFahrenheit,
                            )}
                        </strong>

                        <span className="hourly-forecast__rain">
              {hour.precipitationProbabilityPercent}%
            </span>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default HourlyForecast;