"use client";
import React, { useState, useEffect, useRef } from 'react';

const features = [
  {
    id: 'natural',
    title: 'Natural Results',
    desc: 'Every Hairline Is Designed To Match Your Facial Structure For A Natural Look.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/tcy9wy64djnagoimcfnx.png',
    pos: 'left-top'
  },
  {
    id: 'customized',
    title: 'Customized Care',
    desc: 'Every Hair Loss Condition Is Different And Also Unique.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/ecjlnpbmt8rk3ebxazva.png',
    pos: 'left-bottom'
  },
  {
    id: 'surgical',
    title: 'Reduce Surgical',
    desc: 'Techniques Like FUE Ensure Minimal Discomfort, No Linear Scars, And Quick Recovery.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/kganja8haq69bvurxro8.png',
    pos: 'right-top'
  },
  {
    id: 'aftercare',
    title: 'Complete Aftercare',
    desc: 'Our Team Supports You From Consultation To Full Hair Growth.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/j8gecypsa2honobtknua.png',
    pos: 'right-bottom'
  }
];

export default function WhyChooseUs() {
  const centralImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777550637/dmc-trichology/mprq5pm7g2utm2olrnj1.png";
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const renderCard = (feat, index) => {
    const isLeft = feat.pos.includes('left');
    return (
      <div 
        className={`feature-card ${isLeft ? 'slide-left' : 'slide-right'} ${isVisible ? 'animate' : ''}`}
        style={{
          backgroundColor: '#000',
          borderRadius: '24px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          width: '400px',
          color: '#fff',
          textAlign: 'left',
          zIndex: 10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translate(${mousePos.x * (isLeft ? -15 : 15)}px, ${mousePos.y * 15}px)`,
          animationDelay: `${index * 0.15}s`
        }}
      >
        <div className="icon-box" style={{
          backgroundColor: '#FEF0D7',
          borderRadius: '16px',
          padding: '12px',
          minWidth: '85px',
          height: '85px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease'
        }}>
          <img src={feat.icon} alt={feat.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
        </div>
        <div>
          <h4 style={{ fontFamily: "'Marcellus', serif", fontSize: '24px', marginBottom: '8px', fontWeight: 400, color: '#FEF0D7' }}>{feat.title}</h4>
          <p style={{ fontFamily: "'Marcellus', serif", fontSize: '13px', lineHeight: '20px', color: '#FFFFFF' }}>{feat.desc}</p>
        </div>
      </div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="why-choose-us" 
      style={{ padding: '80px 0', backgroundColor: '#fff', textAlign: 'center', overflow: 'hidden' }}
    >
      <div className="section-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        <img src={iconUrl} alt="icon" style={{ width: '50px', height: 'auto' }} />
        <span className="section-subtitle">Best Hair Graft Clinic</span>
      </div>

      <h2 className="section-title" style={{ maxWidth: '1000px', margin: '0 auto 80px', textAlign: 'center' }}>
        Why DMC Trichology Is The Best Hair Transplant Clinic In Delhi
      </h2>

      <div style={{
        position: 'relative',
        maxWidth: '1300px',
        height: '650px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Animated Connector Lines */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
          {/* Top Left */}
          <path d="M 650 325 L 400 180" className="connector-path" />
          {/* Bottom Left */}
          <path d="M 650 325 L 400 480" className="connector-path" />
          {/* Top Right */}
          <path d="M 650 325 L 900 70" className="connector-path" />
          {/* Bottom Right */}
          <path d="M 650 325 L 900 370" className="connector-path" />
        </svg>

        {/* Central Image Container */}
        <div className={`central-container ${isVisible ? 'reveal' : ''}`} style={{
          width: '500px',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          position: 'relative',
          transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`
        }}>
          {/* Glowing Ring */}
          <div className="glowing-ring"></div>
          <div className="rotating-ring"></div>
          
          <img 
            src={centralImage} 
            alt="Head Visualization" 
            className="floating-image"
            style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 6 }} 
          />
        </div>

        {/* Feature Cards */}
        <div style={{ position: 'absolute', top: '130px', left: '0' }}>{renderCard(features[0], 1)}</div>
        <div style={{ position: 'absolute', top: '430px', left: '0' }}>{renderCard(features[1], 2)}</div>
        <div style={{ position: 'absolute', top: '20px', right: '0' }}>{renderCard(features[2], 3)}</div>
        <div style={{ position: 'absolute', top: '320px', right: '0' }}>{renderCard(features[3], 4)}</div>
      </div>

      <style jsx>{`
        .feature-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 30px 60px rgba(0,0,0,0.3) !important;
          border: 1px solid rgba(254, 240, 215, 0.3);
        }
        .feature-card:hover .icon-box {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 20px rgba(254, 240, 215, 0.4);
        }
        
        .floating-image {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .glowing-ring {
          position: absolute;
          width: 80%;
          height: 80%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(254, 240, 215, 0.2) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
          z-index: 1;
        }
        
        .rotating-ring {
          position: absolute;
          width: 90%;
          height: 90%;
          border: 1px dashed rgba(254, 240, 215, 0.3);
          border-radius: 50%;
          animation: rotate 20s linear infinite;
          z-index: 2;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        
        .connector-path {
          fill: none;
          stroke: rgba(254, 240, 215, 0.2);
          stroke-width: 2;
          stroke-dasharray: 10, 10;
          animation: dashMove 30s linear infinite;
        }
        
        @keyframes dashMove {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }
        
        .connector-path::after {
          content: "";
          /* Simulated via another path for light pulse */
        }
        
        /* Viewport Entry Animations */
        .slide-left { opacity: 0; transform: translateX(-50px); transition: all 0.8s ease-out; }
        .slide-right { opacity: 0; transform: translateX(50px); transition: all 0.8s ease-out; }
        .central-container { opacity: 0; transform: scale(0.8); transition: all 1s ease-out; }
        
        .animate.slide-left, .animate.slide-right { opacity: 1; transform: translateX(0) !important; }
        .reveal.central-container { opacity: 1; transform: scale(1) !important; }

        @media (max-width: 1024px) {
          div[style*="height: 650px"] { height: auto !important; flex-direction: column !important; }
          div[style*="position: absolute"] { position: relative !important; top: auto !important; left: auto !important; right: auto !important; margin: 10px auto !important; }
          .feature-card { width: 90% !important; max-width: 400px; }
          svg { display: none; }
          .central-container { width: 300px !important; height: 300px !important; margin: 40px auto; }
        }
      `}</style>
    </section>
  );
}
