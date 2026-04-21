function ExportButton({ onClick, loading = false, label = "Export CSV" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 disabled"
    >
      {loading ? "Exporting..." : label}
    </button>
  );
}

export default ExportButton;

