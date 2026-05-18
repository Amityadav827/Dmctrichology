import React from "react";
import { Check } from "lucide-react";

export default function ServiceAftercare({ data }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, introText, conclusionText, bullets } = data;
  const activeBullets = (bullets || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeBullets.length === 0 && !sectionHeading) return null;

  return (
    <section className="service-aftercare-section py-24 bg-white border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Heading + Intro */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-bold">Recovery Phase</span>
            <h2 className="text-3xl md:text-4xl text-neutral-900 font-serif uppercase tracking-wider leading-snug">
              {sectionHeading || "Aftercare Guidelines"}
            </h2>
            <div className="w-16 h-[1px] bg-[#c5a880]"></div>
            {introText && (
              <p className="text-sm text-neutral-600 leading-relaxed font-light whitespace-pre-line">
                {introText}
              </p>
            )}
            {conclusionText && (
              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100/50 mt-8">
                <p className="text-xs text-[#c5a880] font-bold uppercase tracking-wider mb-2">Important Note</p>
                <p className="text-xs text-neutral-500 leading-relaxed italic">
                  {conclusionText}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Bullets list */}
          <div className="lg:col-span-7 space-y-4">
            {activeBullets.map((pt, i) => (
              <div 
                key={i} 
                className="flex gap-4 items-start bg-neutral-50 p-6 rounded-2xl border border-neutral-100/60 hover:bg-[#FAF9F6] transition-all duration-300"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#c5a880]/10 flex items-center justify-center text-[#c5a880] mt-0.5">
                  <Check size={14} />
                </div>
                <div>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
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
