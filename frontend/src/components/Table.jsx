function Table({ columns, children, stickyHeader = false }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-darkCard shadow-panel transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/50">
          <thead className={`bg-slate-50 dark:bg-darkBg/80 ${stickyHeader ? "sticky top-0 z-10 backdrop-blur-md" : ""}`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-darkCard text-slate-700 dark:text-slate-200 [&>tr]:transition-colors [&>tr]:duration-200 hover:[&>tr]:bg-slate-50 dark:hover:[&>tr]:bg-white/[0.04] dark:[&>tr:nth-child(even)]:bg-white/[0.02]">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
