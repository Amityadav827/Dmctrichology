import { Star } from "lucide-react";

function StarRating({ value = 0, onChange, interactive = false }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        if (!interactive) {
          return (
            <Star
              key={star}
              size={16}
              className={`${active ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className="transition hover:scale-110 active:scale-95"
          >
            <Star
              size={24}
              className={`${
                active ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;

