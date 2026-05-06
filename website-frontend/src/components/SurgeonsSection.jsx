"use client";
import React, { useState } from 'react';
import { CheckCircle2, MoveRight, ArrowUpRight } from 'lucide-react';

const surgeons = [
  {
    id: 1,
    name: 'Dr. Nandani Dadu',
    role: 'MBBS, A Board-Certified Trichologist, Has Been Studying Hair And Scalp Treatments For Over Ten Years.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777621065/dmc-trichology/bdobupruhaxajozumydn.png',
    features: [
      'Recover Stronger With Expert Orthopedic Rehabilitation',
      'Restoring Strength, Mobility, And Joint Health',
      'Comprehensive Care For Bones And Joints'
    ]
  },
  {
    id: 2,
    name: 'Dr. Nivedita Dadu',
    role: 'Expert Dermatologist and Hair Transplant Specialist with extensive experience in clinical dermatology.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777621065/dmc-trichology/bdobupruhaxajozumydn.png',
    features: [
      'Advanced Skin and Hair Solutions',
      'Personalized Patient Care',
      'Innovative Treatment Methods'
    ]
  }

];

const SurgeonsSection = () => {
  const [activeSurgeon, setActiveSurgeon] = useState(surgeons[0]);

  return (
    <section className="surgeons-section" style={{ padding: '100px 5%', backgroundColor: '#FFFAF1' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
              alt="icon" 
              style={{ width: '40px', height: 'auto' }} 
            />
            <span className="section-subtitle">TRUSTED CARE SERVICES</span>
          </div>
          <h2 className="section-title">Meet Our Hair Transplant Surgeons</h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start' }}>
          
          {/* Left Column: List */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {surgeons.map((surgeon) => (
              <div 
                key={surgeon.id}
                onClick={() => setActiveSurgeon(surgeon)}
                style={{ 
                  padding: '25px 30px', 
                  borderRadius: '25px', 
                  backgroundColor: activeSurgeon.id === surgeon.id ? '#000' : '#FEF0D7',
                  color: activeSurgeon.id === surgeon.id ? '#fff' : '#000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '18px', fontFamily: "'Marcellus', serif" }}>{surgeon.name}</span>
                <div style={{ 
                  transform: activeSurgeon.id === surgeon.id ? 'rotate(-45deg)' : 'none',
                  transition: 'transform 0.3s ease'
                }}>
                  <img 
                    src="https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/xc065ftxo6zamcldpd59.png" 
                    alt="arrow" 
                    style={{ width: '40px', height: 'auto' }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Detail Card */}
          <div style={{ 
            flex: '2 1 600px', 
            backgroundColor: '#FEF0D7', 
            borderRadius: '40px', 
            padding: '30px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
          }}>
            {/* Image */}
            <div style={{ flex: '1 1 300px' }}>
              <img 
                src={activeSurgeon.image} 
                alt={activeSurgeon.name} 
                style={{ width: '100%', borderRadius: '25px', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            {/* Info */}
            <div style={{ flex: '1 1 300px', padding: '10px 0' }}>
              <div style={{ marginBottom: '20px' }}>
                <img 
                  src="https://res.cloudinary.com/dseixl6px/image/upload/v1777621065/dmc-trichology/de4kyqzwsgkrkdfsihkv.png" 
                  alt="icon" 
                  style={{ width: '40px' }} 
                />
              </div>

              <h3 style={{ 
                fontSize: '28px', 
                color: '#000', 
                fontFamily: "'Marcellus', serif", 
                marginBottom: '15px',
                fontWeight: '400'
              }}>{activeSurgeon.name}</h3>

              <p style={{ 
                fontSize: '14px', 
                lineHeight: '22px', 
                color: '#333', 
                fontFamily: "'Marcellus', serif",
                marginBottom: '20px'
              }}>{activeSurgeon.role}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                {activeSurgeon.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src="https://res.cloudinary.com/dseixl6px/image/upload/v1777621065/dmc-trichology/egrvgm3b2utj3jai3g2k.png" 
                      alt="check" 
                      style={{ width: '16px', height: 'auto' }} 
                    />
                    <span style={{ fontSize: '13px', color: '#333', fontFamily: "'Marcellus', serif" }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button style={{ 
                padding: '12px 25px', 
                borderRadius: '30px', 
                border: '1px solid #000', 
                backgroundColor: 'transparent',
                fontFamily: "'Marcellus', serif",
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}>
                Get Details
                <img 
                  src="https://res.cloudinary.com/dseixl6px/image/upload/v1777622110/dmc-trichology/mzd4ynevgozuwiehhwah.png" 
                  alt="arrow" 
                  style={{ width: '24px', height: 'auto' }} 
                />
              </button>


            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .surgeons-section { padding: 60px 5% !important; }
        }
      `}</style>
    </section>
  );
};

export default SurgeonsSection;
