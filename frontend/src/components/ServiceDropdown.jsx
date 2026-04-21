function ServiceDropdown({ value, options, onChange, disabled = false }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 disabled"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default ServiceDropdown;

