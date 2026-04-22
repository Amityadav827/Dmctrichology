import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const statusColors = {
  new: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    dot: "bg-blue-500",
  },
  contacted: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-500",
  },
  converted: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
  },
  default: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-100",
    dot: "bg-slate-400",
  }
};

const CustomDropdown = ({ value, onChange, options, placeholder = "Select status" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const color = statusColors[value] || statusColors.default;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full min-w-[140px]" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-bold transition-all duration-200 border rounded-2xl shadow-sm outline-none ${
          isOpen ? "ring-2 ring-primary/20 border-primary" : `hover:border-slate-300 ${color.bg} ${color.text} ${color.border}`
        }`}
      >
        <div className="flex items-center gap-2">
          {value && <span className={`w-2 h-2 rounded-full ${color.dot} animate-pulse`} />}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 overflow-hidden bg-white border border-slate-100 shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-200">
          <div className="py-1">
            {options.map((option) => {
              const optColor = statusColors[option.value] || statusColors.default;
              const isActive = value === option.value;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors group ${
                    isActive 
                      ? `${optColor.bg} ${optColor.text} font-bold` 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${optColor.dot} ${isActive ? "scale-110" : "opacity-40 group-hover:opacity-100"}`} />
                    <span>{option.label}</span>
                  </div>
                  {isActive && (
                    <div className={`w-1.5 h-1.5 rounded-full ${optColor.dot}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
