function ExportButton({ onClick, loading = false, label = "Export CSV" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="btn-secondary"
    >
      {loading ? "Exporting..." : label}
    </button>
  );
}

export default ExportButton;
