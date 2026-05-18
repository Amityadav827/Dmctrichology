import React from "react";
import { XCircle } from "lucide-react";

export default function ServiceNotCandidates({ data }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, bullets } = data;
  const activeBullets = (bullets || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeBullets.length === 0 && !sectionHeading) return null;

  return (
    <section className="service-not-candidates-section py-20 bg-slate-50 border-t border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-[800px] mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-neutral-900 font-serif mb-4 uppercase tracking-wider leading-snug">
            {sectionHeading || "Contraindications & Exclusions"}
          </h2>
          <div className="w-16 h-[1px] bg-red-400 mx-auto"></div>
        </div>

        <div className="max-w-[900px] mx-auto bg-white p-8 md:p-12 rounded-3xl border border-red-50/50 shadow-xl shadow-red-950/[0.02]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBullets.map((pt, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 mt-0.5">
                  <XCircle size={15} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-600 leading-relaxed group-hover:text-neutral-900 transition-colors">
                    {pt.bulletText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
