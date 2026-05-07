"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function FaqSection() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('General');
  const [activeFaqId, setActiveFaqId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sections/faq`);
        if (res.data.success && res.data.data) {
          setData(res.data.data);
          // Set initial active FAQ
          const initialTab = 'General';
          if (res.data.data.faqData && res.data.data.faqData[initialTab] && res.data.data.faqData[initialTab].length > 0) {
            setActiveFaqId(res.data.data.faqData[initialTab][0].id);
          }
        }
      } catch (err) {
        console.error("FAQ Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const title = data?.title || 'Frequently Asked Question?';
  const subtitle = data?.subtitle || 'TRUSTED CARE SERVICES';
  const faqData = data?.faqData || {
    'General': [
      { id: 'q1', question: "What Is The DMC-Golden Touch Technique?", answer: "The DMC-Golden Touch Technique is our signature method that combines precision hair transplantation with advanced healing protocols for natural results.", icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/nfk4apuep0hexzvztq70.png" },
      { id: 'q4', question: "What Should I Wear To My Appointment?", answer: "Wear loose, comfortable clothes. Gym wear or stretchable outfits are ideal. Avoid tight or formal clothing.", icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/cds9oqjny3l4ctfzdnxp.png" }
    ],
    'Pricing & Billing': [
      { id: 'p1', question: "What Is The Average Cost Of A Hair Transplant?", answer: "Cost varies based on the number of grafts and technique used. We provide a detailed estimate during your initial consultation.", icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/nfk4apuep0hexzvztq70.png" }
    ]
  };

  const tabs = Object.keys(faqData);

  return (
    <EditableSection sectionId="faq" label="FAQ Accordions">
      <section style={{ padding: '80px 5%', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          {/* Header Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '30px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto' }} />
                <EditableText sectionId="faq" fieldPath="subtitle" tag="span" className="section-subtitle">
                  {subtitle}
                </EditableText>
              </div>
              <h2 className="section-title">
                <EditableText sectionId="faq" fieldPath="title" tag="span">
                  {title}
                </EditableText>
              </h2>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', backgroundColor: '#fff', border: '1px solid #E5E5E5', borderRadius: '50px', padding: '5px', gap: '5px' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (faqData[tab] && faqData[tab].length > 0) setActiveFaqId(faqData[tab][0].id);
                  }}
                  style={{
                    padding: '12px 25px',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: activeTab === tab ? '#000' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#000',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Marcellus', serif"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px' }}>
            {faqData[activeTab]?.map((faq, index) => {
              const isActive = activeFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  onClick={() => setActiveFaqId(faq.id)}
                  className={`faq-card ${isActive ? 'active' : ''}`}
                  style={{
                    backgroundColor: isActive ? '#000' : '#F9F7F2',
                    borderRadius: '40px',
                    padding: '16px',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    border: '1px solid #4D4D4D',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <img src={faq.icon} alt="FAQ Icon" style={{ width: '50px', height: '50px', transition: 'transform 0.3s ease' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '22px', color: isActive ? '#fff' : '#333', fontFamily: "'Marcellus', serif", fontWeight: '400', marginBottom: '10px', lineHeight: '1.3' }}>
                      <EditableText sectionId="faq" fieldPath={`faqData.${activeTab}.${index}.question`} tag="span">
                        {faq.question}
                      </EditableText>
                    </h3>
                    <p style={{ fontSize: '14px', color: isActive ? 'rgba(255,255,255,0.8)' : '#666', fontFamily: "'Marcellus', serif", lineHeight: '1.6' }}>
                      <EditableText sectionId="faq" fieldPath={`faqData.${activeTab}.${index}.answer`} tag="span">
                        {faq.answer}
                      </EditableText>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <button className="view-all-faq-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '12px 30px', borderRadius: '50px', border: '1px solid #E5E5E5', backgroundColor: '#fff', color: '#000', cursor: 'pointer', fontSize: '14px', fontWeight: '600', fontFamily: "'Marcellus', serif" }}>
              View All Questions
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777698274/dmc-trichology/dh9kblxoinqmi5kvoona.png" className="btn-arrow" alt="arrow" style={{ width: '32px', height: '32px' }} />
            </button>
          </div>
        </div>

        <style jsx>{`
          .faq-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #000 !important; }
          .view-all-faq-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
          .view-all-faq-btn:hover .btn-arrow { transform: translateX(8px); }
          @media (max-width: 768px) {
            div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
