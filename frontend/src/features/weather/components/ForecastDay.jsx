import {
    formatDay,
    formatTemperature,
} from "../utils/weatherFormatting.js";
import WeatherIcon from "./WeatherIcon.jsx";

function ForecastDay({ forecast, index }) {
    return (
        <article className="forecast-day">
      <span className="forecast-day__name">
        {formatDay(forecast.date, index)}
      </span>

            <WeatherIcon
                conditionKey={forecast.condition.key}
                isDay
                className="forecast-day__icon"
            />

            <span className="forecast-day__condition">
        {forecast.condition.label}
      </span>

            <div className="forecast-day__temperatures">
                <strong>
                    {formatTemperature(
                        forecast.highTemperatureFahrenheit,
                    )}
                </strong>

                <span>
          {formatTemperature(
              forecast.lowTemperatureFahrenheit,
          )}
        </span>
            </div>

            <span className="forecast-day__rain">
        {forecast.precipitationProbabilityPercent}% rain
      </span>
        </article>
    );
}

export default ForecastDay;