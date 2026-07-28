function CpuTemperature({
                            temperatureCelsius,
                            isStale = false,
                        }) {
    const hasTemperature = Number.isFinite(
        temperatureCelsius,
    );

    const displayedTemperature = hasTemperature
        ? temperatureCelsius.toFixed(1)
        : "--";

    const className = [
        "cpu-temperature",
        isStale ? "cpu-temperature--stale" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <span
            className={className}
            title={
                isStale
                    ? "CPU temperature is temporarily unavailable."
                    : undefined
            }
        >
      CPU {displayedTemperature}°C
    </span>
    );
}

export default CpuTemperature;