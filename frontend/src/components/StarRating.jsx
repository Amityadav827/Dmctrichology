function StarRating({ value = 0, onChange, interactive = false }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        if (!interactive) {
          return (
            <span key={star} className={`text-lg ${active ? "text-amber-400" : "text-slate-300"}`}>
              ★
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`text-2xl transition ${
              active ? "text-amber-400" : "text-slate-300 hover:text-amber-300"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
