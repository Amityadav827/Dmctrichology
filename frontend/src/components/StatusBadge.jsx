const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-orange-100 text-orange-700",
  converted: "bg-emerald-100 text-emerald-700",
  replied: "bg-amber-100 text-amber-700",
  closed: "bg-slate-200 text-slate-700",
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

