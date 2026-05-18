import React from "react";
import { Award } from "lucide-react";

export default function ServiceWhyChooseUs({ data }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, introText, features } = data;
  const activeFeatures = (features || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeFeatures.length === 0 && !sectionHeading) return null;

  return (
    <section className="service-why-choose-us py-24 bg-[#FAF9F6] border-t border-b border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-16">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-bold">The Gold Standard</span>
            <h2 className="text-3xl md:text-4xl text-neutral-900 font-serif uppercase tracking-wider leading-snug">
              {sectionHeading || "Why Choose DMC Trichology?"}
            </h2>
            <div className="w-16 h-[1px] bg-[#c5a880]"></div>
          </div>
          {introText && (
            <div className="lg:col-span-7">
              <p className="text-base text-neutral-600 leading-relaxed font-light whitespace-pre-line lg:mt-6">
                {introText}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeFeatures.map((ft, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-3xl border border-neutral-100/50 hover:shadow-xl hover:shadow-neutral-200/40 transition-all duration-300 flex flex-col gap-6"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#c5a880]/10 flex items-center justify-center text-[#c5a880]">
                <Award size={20} />
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                {ft.featureText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
