function RangeSetting({
                          id,
                          label,
                          value,
                          minimum = 0,
                          maximum = 100,
                          disabled = false,
                          isSaving = false,
                          onChange,
                          onCommit,
                      }) {
    const hasValue = Number.isFinite(value);
    const displayedValue = hasValue ? value : minimum;

    function handleChange(event) {
        onChange(Number(event.currentTarget.value));
    }

    function handleCommit(event) {
        onCommit(Number(event.currentTarget.value));
    }

    return (
        <div className="range-setting">
            <div className="range-setting__header">
                <label
                    className="range-setting__label"
                    htmlFor={id}
                >
                    {label}
                </label>

                <span className="range-setting__value">
          {hasValue ? `${value}%` : "--"}
                    {isSaving ? " · Saving" : ""}
        </span>
            </div>

            <input
                id={id}
                className="range-setting__input"
                type="range"
                min={minimum}
                max={maximum}
                step="1"
                value={displayedValue}
                disabled={disabled || !hasValue}
                aria-valuetext={
                    hasValue ? `${value} percent` : "Unavailable"
                }
                onChange={handleChange}
                onPointerUp={handleCommit}
                onPointerCancel={handleCommit}
                onKeyUp={handleCommit}
            />
        </div>
    );
}

export default RangeSetting;