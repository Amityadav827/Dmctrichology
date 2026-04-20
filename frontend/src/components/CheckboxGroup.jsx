function CheckboxGroup({ options, values, onChange }) {
  const toggleValue = (value) => {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <input
            type="checkbox"
            checked={values.includes(option.value)}
            onChange={() => toggleValue(option.value)}
            className="h-4 w-4 rounded border-slate-300 text-ink"
          />
          <span className="text-sm font-medium text-slate-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export default CheckboxGroup;
