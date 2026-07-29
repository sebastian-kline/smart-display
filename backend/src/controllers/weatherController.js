import { getWeatherForecast } from "../services/weatherService.js";

export async function getWeatherForecastController(
    _request,
    response,
) {
    const forecast = await getWeatherForecast();

    response.setHeader("Cache-Control", "no-store");

    response.status(200).json({
        data: forecast,
    });
}