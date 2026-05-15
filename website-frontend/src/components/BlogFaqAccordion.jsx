"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function BlogFaqAccordion({ faqs }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="blog-faq-section py-20 px-4 md:px-0 border-t border-[#0000000a]">
      <div className="faq-container max-w-[1000px] mx-auto">
        
        {/* Header Section */}
        <div className="faq-header text-center mb-16">
          <h2 className="faq-title font-marcellus text-[42px] md:text-[54px] text-black leading-[1.1] mb-6">
            Frequently Asked <br className="hidden md:block" /> Questions
          </h2>
          <p className="faq-subtitle text-[17px] md:text-[19px] text-black opacity-60 max-w-[700px] mx-auto leading-relaxed">
            Everything you need to know about our treatments, procedures, and post-care support to ensure a seamless recovery.
          </p>
        </div>

        {/* FAQ List */}
        <div className="faq-list flex flex-col gap-6">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={index}
                className={`faq-card group transition-all duration-500 rounded-[40px] bg-white border border-[#0000000d] ${
                  isActive ? 'is-active' : 'hover:border-[#0000001a]'
                }`}
                style={{
                  boxShadow: isActive 
                    ? '0 20px 60px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.02)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.02)'
                }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between py-8 px-8 md:py-10 md:px-12 text-left focus:outline-none"
                >
                  <span className={`question-text text-xl md:text-[23px] font-semibold transition-all duration-300 ${
                    isActive ? 'text-black' : 'text-black opacity-90 group-hover:opacity-100'
                  }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                    {faq.question}
                  </span>
                  
                  <div className={`faq-icon-wrapper flex-shrink-0 w-12 h-12 rounded-full border border-[#0000000d] flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-black text-white border-black rotate-180' : 'bg-transparent text-black group-hover:bg-[#00000005]'
                  }`}>
                    {isActive ? <Minus size={20} strokeWidth={1.5} /> : <Plus size={20} strokeWidth={1.5} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-10 md:px-12 md:pb-14">
                        <div className="faq-divider w-full h-[1px] bg-[#0000000a] mb-8"></div>
                        <p className="answer-text text-[17px] md:text-[18px] text-black opacity-[0.65] leading-[1.8] max-w-[850px]">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .font-marcellus {
          font-family: 'Marcellus', serif;
        }
        .faq-card {
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s, border-color 0.4s;
          position: relative;
        }
        .faq-card:hover {
          transform: translateY(-6px);
        }
        .faq-card.is-active {
          transform: translateY(-2px);
        }
        .question-text {
          letter-spacing: -0.02em;
        }
        .answer-text {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
