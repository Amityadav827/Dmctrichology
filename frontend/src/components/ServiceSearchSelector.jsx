import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, Clock, X, AlertCircle, Command, Sparkles } from "lucide-react";

export default function ServiceSearchSelector({ services = [], selectedSlug, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [recentlyEdited, setRecentlyEdited] = useState([]);
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const activeService = services.find(s => s.slug === selectedSlug) || null;

  // Track recently edited items in localStorage
  useEffect(() => {
    if (!selectedSlug) return;
    try {
      const stored = localStorage.getItem("dmc_cms_recently_edited");
      let list = stored ? JSON.parse(stored) : [];
      // Remove if already exists to push it to the top
      list = list.filter(slug => slug !== selectedSlug);
      list.unshift(selectedSlug);
      list = list.slice(0, 5); // Keep top 5
      localStorage.setItem("dmc_cms_recently_edited", JSON.stringify(list));
      setRecentlyEdited(list);
    } catch (e) {
      console.error("Error updating recently edited:", e);
    }
  }, [selectedSlug]);

  // Load recently edited on mount and when open state changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dmc_cms_recently_edited");
      if (stored) {
        setRecentlyEdited(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading recently edited:", e);
    }
  }, [isOpen]);

  // Filter services based on search query
  const getFilteredServices = () => {
    if (!searchQuery.trim()) {
      return services;
    }
    const query = searchQuery.toLowerCase().trim();
    return services.filter(s => 
      (s.title || "").toLowerCase().includes(query) ||
      (s.slug || "").toLowerCase().includes(query) ||
      (s.category || "").toLowerCase().includes(query)
    );
  };

  const filteredServices = getFilteredServices();

  // Reset highlight index when filter changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug) => {
    onChange(slug);
    setIsOpen(false);
    setSearchQuery("");
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          filteredServices.length > 0 ? (prev + 1) % filteredServices.length : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          filteredServices.length > 0 ? (prev - 1 + filteredServices.length) % filteredServices.length : 0
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredServices.length > 0 && filteredServices[highlightedIndex]) {
          handleSelect(filteredServices[highlightedIndex].slug);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Category Badge color mapping
  const getCategoryColor = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("transplant")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100/80";
    }
    if (cat.includes("treatment")) {
      return "bg-violet-50 text-violet-700 border-violet-100/80";
    }
    if (cat.includes("laser")) {
      return "bg-blue-50 text-blue-700 border-blue-100/80";
    }
    return "bg-slate-50 text-slate-700 border-slate-100/80";
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const activeEl = dropdownRef.current.querySelector("[data-highlighted='true']");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Find recently edited service objects
  const recentServiceItems = services.filter(s => recentlyEdited.includes(s.slug));

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Search Input Box */}
      <div className="relative flex items-center w-full group">
        <div className="absolute left-5 text-slate-400 transition-colors group-focus-within:text-blue-500">
          <Search size={18} className="animate-pulse" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            activeService 
              ? `Currently Editing: ${activeService.title}... 🔍` 
              : "Search service by title, slug, or category... 🔍"
          }
          className="w-full pl-12 pr-44 py-4 bg-slate-50 border-2 border-slate-100 focus:border-blue-500/80 rounded-2xl text-sm font-bold text-slate-800 outline-none transition-all duration-300 shadow-inner group-hover:border-slate-200"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />

        {/* Current Active Indicator Badge on the right */}
        <div className="absolute right-3 flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
            >
              <X size={14} />
            </button>
          )}

          {activeService && !searchQuery && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-xl border border-blue-100 shadow-sm">
              <Sparkles size={11} className="text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
              Active Item
            </div>
          )}

          <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) inputRef.current?.focus();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 transition-all"
          >
            <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Floating Results Panel (Desktop: Floating, Mobile: Full-width clean searchable drawer) */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute left-0 right-0 mt-3 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.15)] z-[999] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-4"
        >
          {/* Top Info Bar */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] font-black tracking-widest text-slate-400 uppercase">
            <span className="flex items-center gap-1"><Command size={10} /> Keyboard Navigation Enabled</span>
            <span>{filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found</span>
          </div>

          <div className="max-h-[350px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
            {/* Show Recently Edited only if search query is empty */}
            {!searchQuery && recentServiceItems.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <Clock size={10} /> Recently Edited
                </div>
                <div className="space-y-0.5">
                  {recentServiceItems.map((s, idx) => {
                    const isCurrentlyActive = s.slug === selectedSlug;
                    return (
                      <button
                        key={`recent-${s.slug}`}
                        type="button"
                        onClick={() => handleSelect(s.slug)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 ${
                          isCurrentlyActive 
                            ? 'bg-blue-50/80 text-blue-900 border border-blue-100/50 shadow-sm shadow-blue-100/20' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black truncate ${isCurrentlyActive ? 'text-blue-700' : 'text-slate-800'}`}>
                              {s.title}
                            </span>
                            {isCurrentlyActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold block truncate mt-0.5">{s.slug}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border tracking-wider ml-3 ${getCategoryColor(s.category)}`}>
                          {s.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="h-px bg-slate-100 my-2 mx-3" />
              </div>
            )}

            {/* List Header if recently edited is shown */}
            {!searchQuery && recentServiceItems.length > 0 && (
              <div className="px-3 py-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
                All Services
              </div>
            )}

            {/* Empty State */}
            {filteredServices.length === 0 && (
              <div className="py-12 px-4 text-center">
                <AlertCircle size={32} className="text-slate-300 mx-auto mb-2.5 animate-bounce" />
                <p className="text-sm font-black text-slate-700">No matching services found</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">Try searching for a different service title, category or slug.</p>
              </div>
            )}

            {/* Services List */}
            {filteredServices.map((s, index) => {
              const isCurrentlyActive = s.slug === selectedSlug;
              const isHighlighted = index === highlightedIndex;
              
              return (
                <button
                  key={s.slug}
                  type="button"
                  data-highlighted={isHighlighted}
                  onClick={() => handleSelect(s.slug)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all duration-200 border-2 ${
                    isCurrentlyActive 
                      ? 'bg-blue-50/80 border-blue-100 text-blue-900 shadow-sm shadow-blue-100/10' 
                      : isHighlighted 
                        ? 'bg-slate-50 border-slate-200/80 text-slate-900' 
                        : 'bg-transparent border-transparent text-slate-700 hover:bg-slate-50/40'
                  }`}
                  role="option"
                  aria-selected={isCurrentlyActive}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black truncate ${isCurrentlyActive ? 'text-blue-700' : 'text-slate-800'}`}>
                        {s.title}
                      </span>
                      {isCurrentlyActive && (
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block truncate mt-0.5">{s.slug}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase border tracking-wider ml-3 ${getCategoryColor(s.category)}`}>
                    {s.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
