import ForecastDay from "./ForecastDay.jsx";

function DailyForecast({ dailyForecast }) {
    return (
        <section className="daily-forecast">
            <h2 className="weather-section-title">
                Seven-day forecast
            </h2>

            <div className="daily-forecast__list">
                {dailyForecast.map((forecast, index) => (
                    <ForecastDay
                        forecast={forecast}
                        index={index}
                        key={forecast.date}
                    />
                ))}
            </div>
        </section>
    );
}

export default DailyForecast;