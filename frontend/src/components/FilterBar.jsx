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
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search leads"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-coral focus:bg-white"
      />
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
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
        onChange={(event) => onStartDateChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
      />
      <input
        type="date"
        value={endDate}
        onChange={(event) => onEndDateChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
      />
    </div>
  );
}

export default FilterBar;
