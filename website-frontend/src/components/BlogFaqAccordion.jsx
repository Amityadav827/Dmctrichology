"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BlogFaqAccordion({ faqs }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="blog-faq-section mt-12 mb-12">
      <h3 className="text-2xl font-bold mb-8 text-[#0F172A] font-marcellus">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white transition-all duration-300"
            style={{ boxShadow: activeIndex === index ? '0 10px 25px rgba(0,0,0,0.04)' : 'none' }}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 transition-colors duration-200 focus:outline-none"
            >
              <span className="text-lg font-bold text-[#1E293B] pr-8">{faq.question}</span>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-colors duration-300 ${activeIndex === index ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} 
                />
              </div>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="p-6 pt-0 text-[#475569] leading-relaxed text-[15px]">
                <div className="pt-4 border-t border-[#F1F5F9]">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .font-marcellus {
          font-family: 'Marcellus', serif;
        }
        .blog-faq-section {
            animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
