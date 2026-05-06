"use client";
import React, { useState } from 'react';

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState('General');
  const [activeFaqId, setActiveFaqId] = useState('q4');

  const faqData = {
    'General': [
      {
        id: 'q1',
        question: "What Is The DMC-Golden Touch Technique?",
        answer: "The DMC-Golden Touch Technique is our signature method that combines precision hair transplantation with advanced healing protocols for natural results.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/nfk4apuep0hexzvztq70.png"
      },
      {
        id: 'q2',
        question: "What Types Of Hair Treatments Are Available At DMC Trichology?",
        answer: "We offer FUE, DMC-Golden Touch, PRP Therapy, Mesotherapy, and advanced scalp micropigmentation tailored to individual needs.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/azwnlible0jjieljwpin.png"
      },
      {
        id: 'q3',
        question: "Who Performs The Hair Transplants At DMC Trichology?",
        answer: "All procedures are performed by our board-certified surgeons and experienced medical team specializing in trichology.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/faxp8cvrttxpt3w38asw.png"
      },
      {
        id: 'q4',
        question: "What Should I Wear To My Appointment?",
        answer: "Wear loose, comfortable clothes. Gym wear or stretchable outfits are ideal. Avoid tight or formal clothing.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/cds9oqjny3l4ctfzdnxp.png"
      },
      {
        id: 'q5',
        question: "Can Both Men And Women Undergo Hair Transplant?",
        answer: "Yes, we provide specialized hair restoration solutions for both men and women, addressing pattern baldness and thinning.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/uwcoyjbmka6mtnpxif4t.png"
      },
      {
        id: 'q6',
        question: "How Can I Book A Consultation At DMC Trichology?",
        answer: "You can book directly via our website, call our helpdesk, or visit our clinic. We offer both physical and virtual consultations.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/ju0yj4temj3aalwa1xna.png"
      }
    ],
    'Pricing & Billing': [
      {
        id: 'p1',
        question: "What Is The Average Cost Of A Hair Transplant?",
        answer: "Cost varies based on the number of grafts and technique used. We provide a detailed estimate during your initial consultation.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/nfk4apuep0hexzvztq70.png"
      },
      {
        id: 'p2',
        question: "Do You Offer EMI Or Financing Options?",
        answer: "Yes, we offer 0% EMI options and flexible financing through partner providers to make treatments accessible.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/azwnlible0jjieljwpin.png"
      }
    ],
    'Our Treatments': [
      {
        id: 't1',
        question: "Is The Procedure Painful?",
        answer: "We use local anesthesia to ensure minimal discomfort. Most patients feel very relaxed throughout the session.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/faxp8cvrttxpt3w38asw.png"
      },
      {
        id: 't2',
        question: "How Long Does It Take To See Final Results?",
        answer: "Initial growth starts in 3-4 months, with full density and final results typically visible after 9-12 months.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/cds9oqjny3l4ctfzdnxp.png"
      }
    ]
  };

  return (
    <section style={{ padding: '80px 5%', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto' }} />
              <span className="section-subtitle">TRUSTED CARE SERVICES</span>
            </div>
            <h2 className="section-title">Frequently Asked Question?</h2>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: '#fff',
            border: '1px solid #E5E5E5',
            borderRadius: '50px',
            padding: '5px',
            gap: '5px'
          }}>
            {['General', 'Pricing & Billing', 'Our Treatments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
          {faqData[activeTab].map((faq) => {
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
                  <img
                    src={faq.icon}
                    alt="FAQ Icon"
                    style={{
                      width: '50px',
                      height: '50px',
                      filter: isActive ? 'brightness(0) invert(1)' : 'none',
                      transition: 'filter 0.3s ease'
                    }}
                  />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '22px',
                    color: isActive ? '#fff' : '#333',
                    fontFamily: "'Marcellus', serif",
                    fontWeight: '400',
                    marginBottom: '10px',
                    lineHeight: '1.3',
                    transition: 'color 0.3s ease'
                  }}>
                    {faq.question}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: isActive ? 'rgba(255,255,255,0.8)' : '#666',
                    fontFamily: "'Marcellus', serif",
                    lineHeight: '1.6',
                    transition: 'color 0.3s ease'
                  }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <button className="view-all-faq-btn" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 30px',
            borderRadius: '50px',
            border: '1px solid #E5E5E5',
            backgroundColor: '#fff',
            color: '#000',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: "'Marcellus', serif",
            transition: 'all 0.3s ease'
          }}>
            View All Questions
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777698274/dmc-trichology/dh9kblxoinqmi5kvoona.png" 
              className="btn-arrow"
              alt="arrow" 
              style={{ width: '32px', height: '32px', transition: 'transform 0.3s ease' }} 
            />
          </button>
        </div>
      </div>

      <style jsx>{`
        .faq-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08);
          border-color: #000 !important;
        }
        .view-all-faq-btn:hover {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .view-all-faq-btn:hover .btn-arrow {
          transform: translateX(5px);
          filter: brightness(0) invert(1);
        }
        @media (max-width: 768px) {
          section { padding: 60px 5% !important; }
          .section-title { font-size: 32px !important; }
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
          div[style*="justifyContent: space-between"] { justify-content: center !important; text-align: center; }
          div[style*="alignItems: center"] { justify-content: center !important; }
        }
      `}</style>
    </section>
  );
}
