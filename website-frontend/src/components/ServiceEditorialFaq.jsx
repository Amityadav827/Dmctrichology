"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function ServiceEditorialFaq({ data, pageSlug = "", googleReviewCta }) {
  const [activeIndex, useStateActiveIndex] = useState(0);

  const faqs = data?.faqs || [];
  const activeFaqs = (faqs || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const showFaqs = data?.isVisible !== false && activeFaqs.length > 0;
  const showReview = googleReviewCta && googleReviewCta.isVisible !== false;

  if (!showFaqs && !showReview) return null;

  const toggleFaq = (idx) => {
    useStateActiveIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="service-edfaq-section">
      <div className="service-edfaq-container">
        {showFaqs && (
          <>
            <div className="service-edfaq-header">
              <span className="service-edfaq-label">Expert Answers</span>
              <h2 className="service-edfaq-heading">
                Editorial FAQ
              </h2>
              <div className="service-edfaq-divider"></div>
            </div>

            <div className="service-edfaq-list">
              {activeFaqs.map((faq, i) => {
                const isOpen = activeIndex === i;
                return (
                  <div key={i} className="service-edfaq-item">
                    <button
                      onClick={() => toggleFaq(i)}
                      className="service-edfaq-btn"
                    >
                      <span className="service-edfaq-title">
                        {faq.question}
                      </span>
                      <div className="service-edfaq-icon-wrap">
                        {isOpen ? (
                          <Minus className="service-edfaq-icon" />
                        ) : (
                          <Plus className="service-edfaq-icon" />
                        )}
                      </div>
                    </button>
                    
                    <div className={`service-edfaq-content ${isOpen ? "open" : ""}`}>
                      <div className="service-edfaq-content-inner">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {showReview && (
          <div className="service-edfaq-google-review" style={googleReviewCta.backgroundColor ? { backgroundColor: googleReviewCta.backgroundColor } : undefined}>
            <h3 className="service-edfaq-google-review-heading">
              {googleReviewCta.title || "Google Review"}
            </h3>
            <button 
              onClick={() => {
                if (googleReviewCta.buttonLink) {
                  window.location.href = googleReviewCta.buttonLink;
                }
              }} 
              className="service-edfaq-google-review-btn" 
              type="button"
            >
              <span>{googleReviewCta.buttonText || "VIEW MORE"}</span>
              <span className="service-edfaq-google-review-arrow" aria-hidden="true">
                <img
                  src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png"
                  alt=""
                  className="service-edfaq-google-review-arrow-icon"
                />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
