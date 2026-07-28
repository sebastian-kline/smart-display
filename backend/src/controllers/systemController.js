import { getCpuTemperature } from "../services/systemService.js";

export async function getCpuTemperatureController(_request, response) {
    const temperatureCelsius = await getCpuTemperature();

    response.status(200).json({
        data: {
            temperatureCelsius,
        },
    });
}