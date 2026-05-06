"use client";
import React, { useState } from 'react';

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState('General');

  const faqs = [
    {
      question: "What Is The DMC-Golden Touch Technique?",
      answer: "No, You Can Book Directly Without A Doctor's Referral. We Welcome Walk-Ins And Online Bookings. Get Started With Your Recovery Today.",
      icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/nfk4apuep0hexzvztq70.png"
    },
    {
      question: "What Types Of Hair Treatments Are Available At DMC Trichology?",
      answer: "Yes, We Provide Home Visits When Needed. Ideal For Post-Surgery Or Limited Mobility Patients. Call Us To Check Availability In Your Area.",
      icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/azwnlible0jjieljwpin.png"
    },
    {
      question: "Who Performs The Hair Transplants At DMC Trichology?",
      answer: "We Help With Joint Pain, Sports Injuries, Back Issues, And More. Each Treatment Is Personalized To Your Needs. Our Goal Is To Restore Comfort And Movement.",
      icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/faxp8cvrttxpt3w38asw.png"
    },
    {
      question: "What Should I Wear To My Appointment?",
      answer: "Wear Loose, Comfortable Clothes. Gym Wear Or Stretchable Outfits Are Ideal. Avoid Tight Or Formal Clothing.",
      icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/cds9oqjny3l4ctfzdnxp.png",
      isActive: true
    },
    {
      question: "Can Both Men And Women Undergo Hair Transplant Procedures At DMC Trichology?",
      answer: "Sessions Typically Run Between 30 To 60 Minutes. Your Duration Depends On Your Treatment Plan. We Focus On Quality Care, Not The Clock.",
      icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/uwcoyjbmka6mtnpxif4t.png"
    },
    {
      question: "How Can I Book A Consultation At DMC Trichology?",
      answer: "Most Insurance Plans Include Coverage. Bring Your Insurance Details During Your First Visit. We'll Help You With The Paperwork.",
      icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/ju0yj4temj3aalwa1xna.png"
    }
  ];

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
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-card ${faq.isActive ? 'active' : ''}`}
              style={{
                backgroundColor: faq.isActive ? '#000' : '#F9F7F2',
                borderRadius: '40px',
                padding: '16px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                border: '1px solid #4D4D4D',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <img
                  src={faq.icon}
                  alt="FAQ Icon"
                  style={{
                    width: '50px',
                    height: '50px'
                  }}
                />
              </div>
              <div>
                <h3 style={{
                  fontSize: '22px',
                  color: faq.isActive ? '#fff' : '#000',
                  fontFamily: "'Marcellus', serif",
                  fontWeight: '400',
                  marginBottom: '10px',
                  lineHeight: '1.3'
                }}>
                  {faq.question}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: faq.isActive ? 'rgba(255,255,255,0.8)' : '#666',
                  fontFamily: "'Marcellus', serif",
                  lineHeight: '1.6'
                }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            borderRadius: '50px',
            border: '1px solid #E5E5E5',
            backgroundColor: '#fff',
            color: '#000',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: "'Marcellus', serif"
          }}>
            View All Questions
            <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777698274/dmc-trichology/dh9kblxoinqmi5kvoona.png" alt="arrow" style={{ width: '32px', height: '32px' }} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .faq-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
        }
      `}</style>
    </section>
  );
}
