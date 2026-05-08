"use client";
import React, { useState, useEffect } from 'react';
import { fetchHomeFAQ } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function FaqSection() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [activeFaqId, setActiveFaqId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchHomeFAQ();
      if (res?.success) {
        setData(res.data);
        if (res.data.categories?.length > 0) {
          setActiveTab(res.data.categories[0].title);
        }
      }
    };
    loadData();

    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'faq-section') {
        const { fieldPath, value } = e.detail;
        setData(prev => {
          if (!prev) return prev;
          const newData = { ...prev };
          if (fieldPath.includes('.')) {
            const parts = fieldPath.split('.');
            let curr = newData;
            for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]];
            curr[parts[parts.length - 1]] = value;
          } else {
            newData[fieldPath] = value;
          }
          return newData;
        });
      }
    };

    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  if (!data?.enabled && data !== null) return null;

  const badgeText = data?.badgeText || "TRUSTED CARE SERVICES";
  const heading = data?.heading || "Frequently Asked Question?";
  const categories = data?.categories || [];
  const activeCategory = categories.find(c => c.title === activeTab) || categories[0];
  const buttonText = data?.buttonText || "View All Questions";

  return (
    <EditableSection sectionId="faq-section" label="Frequently Asked Question?">
      <section style={{ padding: '100px 5% 80px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          {/* Header Area */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '50px', 
            flexWrap: 'wrap', 
            gap: '30px' 
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#E4B753', borderRadius: '50%' }}></div>
                <EditableText sectionId="faq-section" fieldPath="badgeText" tag="span" style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  fontFamily: "'Marcellus', serif", 
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  {badgeText}
                </EditableText>
              </div>
              <h2 style={{ 
                fontSize: 'clamp(32px, 5vw, 48px)', 
                color: '#1A1A1A', 
                fontFamily: "'Marcellus', serif", 
                fontWeight: '400',
                margin: 0
              }}>
                <EditableText sectionId="faq-section" fieldPath="heading" tag="span">
                  {heading}
                </EditableText>
              </h2>
            </div>

            {/* Tabs */}
            <div style={{ 
              display: 'flex', 
              backgroundColor: '#fff', 
              border: '1px solid #E5E5E5', 
              borderRadius: '100px', 
              padding: '6px', 
              gap: '4px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(cat.title)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '100px',
                    border: 'none',
                    backgroundColor: activeTab === cat.title ? '#000' : 'transparent',
                    color: activeTab === cat.title ? '#fff' : '#1A1A1A',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: "'Marcellus', serif"
                  }}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Area */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', 
            gap: '24px' 
          }}>
            {(activeCategory?.faqs || []).map((faq, index) => {
              const catIndex = categories.indexOf(activeCategory);
              const isActive = activeFaqId === `${catIndex}-${index}`;
              return (
                <div
                  key={index}
                  onClick={() => setActiveFaqId(isActive ? null : `${catIndex}-${index}`)}
                  className={`faq-card ${isActive ? 'active' : ''}`}
                  style={{
                    backgroundColor: isActive ? '#000' : '#F9F8F3',
                    borderRadius: '40px',
                    padding: '35px 40px',
                    display: 'flex',
                    gap: '25px',
                    alignItems: 'center',
                    border: '1px solid transparent',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    minHeight: '140px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Icon Circle */}
                  <div style={{ 
                    flexShrink: 0,
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#fff' : '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.5s ease'
                  }}>
                    <img 
                      src={faq.icon} 
                      alt="icon" 
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        filter: isActive ? 'none' : 'invert(1)'
                      }} 
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '24px', 
                      color: isActive ? '#fff' : '#1A1A1A', 
                      fontFamily: "'Marcellus', serif", 
                      fontWeight: '400', 
                      marginBottom: isActive ? '15px' : '0', 
                      lineHeight: '1.2',
                      transition: 'all 0.3s ease'
                    }}>
                      <EditableText sectionId="faq-section" fieldPath={`categories.${catIndex}.faqs.${index}.question`} tag="span">
                        {faq.question}
                      </EditableText>
                    </h3>
                    <div style={{ 
                      maxHeight: isActive ? '200px' : '0', 
                      overflow: 'hidden', 
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: isActive ? 1 : 0
                    }}>
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'rgba(255,255,255,0.8)', 
                        fontFamily: "'Marcellus', serif", 
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        <EditableText sectionId="faq-section" fieldPath={`categories.${catIndex}.faqs.${index}.answer`} tag="span">
                          {faq.answer}
                        </EditableText>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <button className="faq-view-all-btn" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '15px', 
              padding: '12px 35px', 
              borderRadius: '100px', 
              border: '1px solid #E5E5E5', 
              backgroundColor: '#fff', 
              color: '#1A1A1A', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '600', 
              fontFamily: "'Marcellus', serif",
              transition: 'all 0.4s ease'
            }}>
              <EditableText sectionId="faq-section" fieldPath="buttonText" tag="span">
                {buttonText}
              </EditableText>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                backgroundColor: '#000', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.4s ease'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <style jsx>{`
          .faq-card:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 20px 40px rgba(0,0,0,0.05); 
          }
          .faq-card.active {
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          }
          .faq-view-all-btn:hover { 
            background-color: #000 !important; 
            color: #fff !important; 
            transform: translateY(-3px); 
          }
          .faq-view-all-btn:hover div {
            background-color: #fff !important;
          }
          .faq-view-all-btn:hover svg {
            stroke: #000 !important;
          }
          @media (max-width: 992px) {
            div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
