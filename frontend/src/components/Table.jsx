function Table({ columns, children, stickyHeader = false }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className={`bg-slate-50 ${stickyHeader ? "sticky top-0 z-10 backdrop-blur-md" : ""}`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-700 [&>tr] [&>tr] hover&>tr]&>tr]&>tr(even)]">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;


