"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function BlogFaqAccordion({ faqs }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="blog-faq-container mt-16 mb-16">
      <div className="faq-header mb-10 text-center">
        <span className="faq-subtitle text-[#2563EB] font-bold tracking-[0.2em] text-[12px] uppercase block mb-3">
          QUICK ANSWERS
        </span>
        <h3 className="faq-main-title text-4xl md:text-5xl font-marcellus text-[#0F172A] leading-tight">
          Common Questions
        </h3>
      </div>

      <div className="faq-list space-y-5 max-w-[900px] mx-auto">
        {faqs.map((faq, index) => {
          const isActive = activeIndex === index;
          return (
            <div 
              key={index} 
              className={`faq-item-wrapper transition-all duration-500 rounded-[24px] border ${
                isActive ? 'border-transparent bg-[#F8FAFF]' : 'border-[#E2E8F0] bg-white'
              }`}
              style={{
                boxShadow: isActive ? '0 20px 40px rgba(37, 99, 235, 0.06)' : 'none'
              }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-7 md:p-9 text-left focus:outline-none group"
              >
                <span className={`text-xl md:text-2xl font-marcellus transition-colors duration-300 ${
                  isActive ? 'text-[#2563EB]' : 'text-[#1E293B]'
                }`}>
                  {faq.question}
                </span>
                
                <div className={`faq-icon-box flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive ? 'bg-[#2563EB] text-white rotate-45' : 'bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#E2E8F0]'
                }`}>
                  <Plus size={20} strokeWidth={2.5} />
                </div>
              </button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-7 pb-9 md:px-9 md:pb-11">
                      <div className="faq-answer-content text-[#475569] text-lg leading-relaxed max-w-[800px] pt-4 border-t border-[#2563EB15]">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .font-marcellus {
          font-family: 'Marcellus', serif;
        }
        .faq-item-wrapper:hover {
          ${!activeIndex ? 'transform: translateY(-4px); border-color: #2563EB40;' : ''}
        }
        .faq-item-wrapper {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
