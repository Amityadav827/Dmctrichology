import React from "react";

export default function ServiceTechniques({ data }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, techniques } = data;
  const activeTechniques = (techniques || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeTechniques.length === 0 && !sectionHeading) return null;

  return (
    <section className="service-techniques-section py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-[800px] mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-neutral-900 font-serif mb-4 uppercase tracking-wider leading-snug">
            {sectionHeading || "Procedural Techniques"}
          </h2>
          <div className="w-16 h-[1px] bg-[#c5a880] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTechniques.map((tech, i) => {
            const formattedNum = String(i + 1).padStart(2, "0");
            return (
              <div 
                key={i} 
                className="bg-neutral-50 hover:bg-[#FAF9F6] p-8 rounded-3xl border border-neutral-100/60 hover:border-[#FAF9F6] hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[44px] font-serif text-[#c5a880]/30 font-light mb-6 tracking-tight">
                    {formattedNum}
                  </div>
                  <h3 className="text-lg font-serif text-neutral-900 uppercase tracking-widest mb-4 font-bold">
                    {tech.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-light white-space-pre-line">
                    {tech.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
