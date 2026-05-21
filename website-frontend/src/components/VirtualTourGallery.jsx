"use client";
import React, { useState, useEffect } from 'react';
import EditableSection from './Editable/EditableSection';

const VirtualTourGallery = ({ cards: initialCards = [] }) => {
  const [cards, setCards] = useState(initialCards);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'virtual-tour-cards') {
        const { fieldPath, value } = e.detail;
        if (fieldPath === 'tourCards') {
          setCards(value);
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  const visibleCards = cards
    .filter(c => c.isVisible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <EditableSection sectionId="virtual-tour-cards" label="Virtual Tour Gallery Cards">
        <section className="vt-gallery-section" id="tour-gallery">
          <div className="vt-gallery-inner">

            {visibleCards.length === 0 ? (
              <div className="vt-gallery-empty">
                <p>No tour cards available yet.</p>
              </div>
            ) : (
              <div className="vt-cards-grid">
                {visibleCards.map((card, idx) => (
                  <TourCard key={card.id || idx} card={card} idx={idx} />
                ))}
              </div>
            )}
          </div>
        </section>
      </EditableSection>

      <GalleryStyles />
    </>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const TourCard = ({ card, idx }) => (
  <div
    className="vt-card"
    style={{ animationDelay: `${idx * 0.15}s` }}
  >
    <div className="vt-card-img-wrap">
      {card.image ? (
        <img
          src={card.image}
          alt={card.title || 'Clinic View'}
          className="vt-card-img"
          loading="lazy"
        />
      ) : (
        <div className="vt-card-img-placeholder">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect width="48" height="48" rx="8" fill="rgba(59,89,152,0.1)"/>
            <path d="M16 20h16M16 24h10M16 28h12" stroke="rgba(59,89,152,0.4)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      {/* Glass overlay */}
      <div className="vt-card-glass-overlay">
         <div className="vt-card-glass-content">
             <h3 className="vt-card-title">{card.title}</h3>
             <p className="vt-card-desc">{card.description}</p>
             {card.buttonLink && (
                 <a href={card.buttonLink} className="vt-card-btn">
                     {card.buttonText || 'View Space'}
                 </a>
             )}
         </div>
      </div>
    </div>
  </div>
);

// ─── Styles ────────────────────────────────────────────────────────────────────

const GalleryStyles = () => (
  <style>{`
    .vt-gallery-section {
      background: linear-gradient(180deg, #f5f7fb 0%, #ffffff 100%);
      padding: 90px 5% 100px;
      position: relative;
      overflow: hidden;
    }

    .vt-gallery-inner {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .vt-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }

    .vt-card {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      animation: vtCardFadeIn 0.8s cubic-bezier(0.22,1,0.36,1) both;
    }

    @keyframes vtCardFadeIn {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .vt-card-img-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
      background: #ffffff;
      cursor: pointer;
    }

    .vt-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.8s cubic-bezier(0.25,1,0.5,1);
    }

    .vt-card:hover .vt-card-img {
      transform: scale(1.1);
    }

    .vt-card-img-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f2f5;
    }

    .vt-card-glass-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(17,17,17,0.9) 0%, rgba(17,17,17,0.4) 50%, transparent 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 30px;
      opacity: 0.85;
      transition: opacity 0.4s ease, background 0.4s ease;
    }

    .vt-card:hover .vt-card-glass-overlay {
      opacity: 1;
    }

    .vt-card-glass-content {
      transform: translateY(20px);
      transition: transform 0.4s cubic-bezier(0.25,1,0.5,1);
    }

    .vt-card:hover .vt-card-glass-content {
      transform: translateY(0);
    }

    .vt-card-title {
      font-family: 'Marcellus', serif !important;
      font-size: 24px !important;
      color: #ffffff !important;
      margin: 0 0 12px !important;
      line-height: 1.3 !important;
    }

    .vt-card-desc {
      font-family: 'Lato', sans-serif;
      font-size: 15px;
      color: rgba(255,255,255,0.8);
      margin: 0 0 24px;
      line-height: 1.6;
      opacity: 0;
      transition: opacity 0.4s ease 0.1s;
    }

    .vt-card:hover .vt-card-desc {
      opacity: 1;
    }

    .vt-card-btn {
      display: inline-block;
      padding: 10px 24px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.3);
      color: #ffffff;
      font-family: 'Lato', sans-serif;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-radius: 100px;
      text-decoration: none;
      transition: background 0.3s ease, color 0.3s ease;
      opacity: 0;
    }

    .vt-card:hover .vt-card-btn {
      opacity: 1;
    }

    .vt-card-btn:hover {
      background: #ffffff;
      color: #3b5998;
    }

    .vt-gallery-empty {
      text-align: center;
      padding: 80px 40px;
      background: #ffffff;
      border-radius: 20px;
      border: 2px dashed rgba(59,89,152,0.15);
      color: #aaaaaa;
      font-family: 'Lato', sans-serif;
    }

    @media (max-width: 1024px) {
      .vt-cards-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
    }

    @media (max-width: 640px) {
      .vt-gallery-section { padding: 60px 5% 70px; }
      .vt-cards-grid { grid-template-columns: 1fr; gap: 24px; }
      .vt-card-glass-content { transform: translateY(0); }
      .vt-card-desc, .vt-card-btn { opacity: 1; }
    }
  `}</style>
);

export default VirtualTourGallery;
