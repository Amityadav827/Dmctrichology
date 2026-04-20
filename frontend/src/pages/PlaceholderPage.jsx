function PlaceholderPage({ title }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-panel">
      <h3 className="text-2xl font-semibold text-ink">{title}</h3>
      <p className="mt-3 text-sm text-slate-500">This section is reserved in the admin layout.</p>
    </div>
  );
}

export default PlaceholderPage;
