import React from "react";

export default function ServiceInfoBlocks({ data }) {
  if (!data || data.isVisible === false) return null;

  const { blocks } = data;
  const activeBlocks = (blocks || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeBlocks.length === 0) return null;

  return (
    <div className="service-info-blocks-wrapper">
      {activeBlocks.map((block, i) => {
        const isCream = block.backgroundVariant === "cream";
        return (
          <section 
            key={i} 
            className={`py-24 ${isCream ? "bg-[#FAF9F6]" : "bg-white"} border-b border-neutral-100`}
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="max-w-[900px] mx-auto">
                <h2 className="text-3xl md:text-4xl text-neutral-900 font-serif mb-8 uppercase tracking-widest leading-snug">
                  {block.heading}
                </h2>
                <div className="w-12 h-[1px] bg-[#c5a880] mb-8"></div>
                <p className="text-base text-neutral-600 leading-relaxed font-light whitespace-pre-line">
                  {block.description}
                </p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
