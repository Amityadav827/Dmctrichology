function Table({ columns, children, stickyHeader = false }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkCard shadow-panel transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className={`bg-slate-50 dark:bg-[#0B0F19] ${stickyHeader ? "sticky top-0 z-10" : ""}`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-darkCard text-slate-700 dark:text-slate-300 [&>tr]:transition-colors [&>tr]:duration-200 hover:[&>tr]:bg-slate-50 dark:hover:[&>tr]:bg-slate-800/50">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
