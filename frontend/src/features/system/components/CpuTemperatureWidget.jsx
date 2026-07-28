import useCpuTemperature from "../hooks/useCpuTemperature.js";
import CpuTemperature from "./CpuTemperature.jsx";

function CpuTemperatureWidget() {
    const { temperatureCelsius, isStale } =
        useCpuTemperature();

    return (
        <CpuTemperature
            temperatureCelsius={temperatureCelsius}
            isStale={isStale}
        />
    );
}

export default CpuTemperatureWidget;