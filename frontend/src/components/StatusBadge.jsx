const statusStyles = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  contacted: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  converted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  replied: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  closed: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
        statusStyles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
