function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-coral border-t-transparent" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default Spinner;
