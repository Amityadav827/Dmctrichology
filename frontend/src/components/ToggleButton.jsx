function ToggleButton({ status, onClick, loading }) {
  const active = status === "active";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "..." : active ? "Active" : "Inactive"}
    </button>
  );
}

export default ToggleButton;
