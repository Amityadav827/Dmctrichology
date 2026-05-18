"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function ServiceEditorialFaq({ data }) {
  if (!data || data.isVisible === false) return null;

  const { faqs } = data;
  const activeFaqs = (faqs || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeFaqs.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (idx) => {
    setActiveIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="service-editorial-faq py-24 bg-white border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-[800px] mx-auto text-center mb-16">
          <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-bold block mb-2">Expert Answers</span>
          <h2 className="text-3xl md:text-4xl text-neutral-900 font-serif uppercase tracking-wider leading-snug">
            Editorial FAQ
          </h2>
          <div className="w-16 h-[1px] bg-[#c5a880] mx-auto mt-4"></div>
        </div>

        <div className="max-w-[900px] mx-auto space-y-4">
          {activeFaqs.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <div 
                key={i} 
                className="bg-neutral-50 rounded-2xl border border-neutral-100/60 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-6 md:px-8 flex items-center justify-between text-left gap-4 hover:bg-[#FAF9F6] transition-colors"
                >
                  <span className="text-base font-serif text-neutral-900 uppercase tracking-wider font-bold">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-neutral-200/50 flex items-center justify-center text-neutral-600 shadow-sm">
                    {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[800px] opacity-100 border-t border-neutral-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-6 md:px-8 text-sm text-neutral-600 leading-relaxed font-light whitespace-pre-line bg-white">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
