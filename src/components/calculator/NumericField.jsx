export default function NumericField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  min = "0",
  step = "any",
  suffix,
  required = false,
}) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className={suffix ? "calculator-input-wrap" : ""}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          className={`field-input ${error ? "is-invalid" : ""}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
        {suffix && <span className="calculator-input-suffix">{suffix}</span>}
      </div>
      {error && <div className="invalid-feedback d-block" id={`${id}-error`}>{error}</div>}
    </div>
  );
}
