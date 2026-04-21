function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  statusOptions,
}) {
  const fieldStyle = {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    padding: "0.5rem 0.875rem",
    fontSize: "0.875rem",
    color: "#0F172A",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "0.75rem",
      }}
    >
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search leads..."
        style={fieldStyle}
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        style={fieldStyle}
      >
        <option value="">All Statuses</option>
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        style={fieldStyle}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        style={fieldStyle}
      />
    </div>
  );
}

export default FilterBar;
