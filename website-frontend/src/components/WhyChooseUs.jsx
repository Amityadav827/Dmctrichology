"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

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

  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const renderCard = (feat, index) => {
    const isLeft = feat.pos.includes('left');
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? -80 : 80, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ 
          y: -10, 
          scale: 1.02,
          rotateX: isLeft ? 5 : -5,
          rotateY: index < 2 ? 5 : -5,
          boxShadow: '0 35px 70px rgba(0,0,0,0.4)',
          border: '1px solid rgba(254, 240, 215, 0.4)'
        }}
        style={{
          backgroundColor: '#000',
          borderRadius: '24px',
          padding: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          width: '410px',
          color: '#fff',
          textAlign: 'left',
          zIndex: 10,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          x: useTransform(smoothX, (v) => v * (isLeft ? -20 : 20)),
          y: useTransform(smoothY, (v) => v * 20),
        }}
      >
        {/* Card Ambient Glow */}
        <motion.div 
          className="card-glow"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(254, 240, 215, 0.05) 0%, transparent 80%)',
            pointerEvents: 'none'
          }}
        />

        <motion.div 
          whileHover={{ scale: 1.15, rotate: 8 }}
          className="icon-box" 
          style={{
            backgroundColor: '#FEF0D7',
            borderRadius: '18px',
            padding: '14px',
            minWidth: '90px',
            height: '90px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 20px rgba(254, 240, 215, 0.15)'
          }}
        >
          <img src={feat.icon} alt={feat.title} style={{ width: '55px', height: '55px', objectFit: 'contain' }} />
        </motion.div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h4 style={{ fontFamily: "'Marcellus', serif", fontSize: '26px', marginBottom: '8px', fontWeight: 400, color: '#FEF0D7' }}>{feat.title}</h4>
          <p style={{ fontFamily: "'Marcellus', serif", fontSize: '14px', lineHeight: '22px', color: 'rgba(255,255,255,0.8)' }}>{feat.desc}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="why-choose-us" 
      style={{ padding: '100px 0', backgroundColor: '#fff', textAlign: 'center', overflow: 'hidden', perspective: '1200px' }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-tag" 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}
      >
        <img src={iconUrl} alt="icon" style={{ width: '55px', height: 'auto' }} />
        <span className="section-subtitle" style={{ letterSpacing: '2px' }}>Best Hair Graft Clinic</span>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="section-title" 
        style={{ maxWidth: '1000px', margin: '0 auto 100px !important', textAlign: 'center' }}
      >
        Why DMC Trichology Is The Best Hair Transplant Clinic In Delhi
      </motion.h2>

      <div style={{
        position: 'relative',
        maxWidth: '1400px',
        height: '700px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Energy Connector Lines SVG */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(254, 240, 215, 0.1)" />
              <stop offset="50%" stopColor="rgba(254, 240, 215, 0.5)" />
              <stop offset="100%" stopColor="rgba(254, 240, 215, 0.1)" />
            </linearGradient>
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Staggered Path Drawing */}
          {[
            { d: "M 700 350 L 410 180", delay: 0.5 },
            { d: "M 700 350 L 410 500", delay: 0.7 },
            { d: "M 700 350 L 990 80", delay: 0.9 },
            { d: "M 700 350 L 990 400", delay: 1.1 }
          ].map((path, i) => (
            <React.Fragment key={i}>
              <motion.path 
                d={path.d} 
                stroke="rgba(254, 240, 215, 0.15)"
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: path.delay, ease: "easeInOut" }}
              />
              {/* Energy Pulse Circle */}
              <motion.circle 
                r="3"
                fill="#FEF0D7"
                filter="url(#lineGlow)"
                animate={{
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: path.delay,
                  ease: "linear"
                }}
                style={{ offsetPath: `path("${path.d}")` }}
              />
            </React.Fragment>
          ))}
        </svg>

        {/* Central Luxury Ecosystem */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.7, filter: 'blur(15px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="central-ecosystem" 
          style={{
            width: '550px',
            height: '550px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            position: 'relative',
            x: useTransform(smoothX, (v) => v * 40),
            y: useTransform(smoothY, (v) => v * 40),
          }}
        >
          {/* Layered Floating Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              border: '1px solid rgba(254, 240, 215, 0.1)',
              borderRadius: '50%',
              padding: '20px'
            }}
          >
            <div style={{ width: '100%', height: '100%', border: '1px dashed rgba(254, 240, 215, 0.2)', borderRadius: '50%' }} />
          </motion.div>

          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              width: '85%',
              height: '85%',
              background: 'conic-gradient(from 0deg, transparent, rgba(254, 240, 215, 0.1), transparent)',
              borderRadius: '50%',
              filter: 'blur(10px)'
            }}
          />

          {/* Deep Ambient Aura */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              width: '70%',
              height: '70%',
              background: 'radial-gradient(circle, rgba(254, 240, 215, 0.25) 0%, transparent 70%)',
              filter: 'blur(30px)',
              zIndex: 1
            }}
          />

          {/* Particles Ecosystem */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -30, 0],
                x: [0, 15, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                position: 'absolute',
                width: '4px', height: '4px',
                backgroundColor: '#FEF0D7',
                borderRadius: '50%',
                top: `${20 + i * 15}%`,
                left: `${30 + (i % 3) * 20}%`,
                filter: 'blur(1px)'
              }}
            />
          ))}
          
          <motion.img 
            src={centralImage} 
            alt="Head Visualization" 
            style={{ 
              width: '90%', 
              height: 'auto', 
              position: 'relative', 
              zIndex: 6,
              filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))'
            }}
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 1.5, -1.5, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>

        {/* Feature Cards with Coordinated Breathing */}
        <div style={{ position: 'absolute', top: '120px', left: '0' }}>{renderCard(features[0], 0)}</div>
        <div style={{ position: 'absolute', top: '440px', left: '0' }}>{renderCard(features[1], 1)}</div>
        <div style={{ position: 'absolute', top: '30px', right: '0' }}>{renderCard(features[2], 2)}</div>
        <div style={{ position: 'absolute', top: '350px', right: '0' }}>{renderCard(features[3], 3)}</div>
      </div>

      <style jsx>{`
        .why-choose-us {
          background-image: radial-gradient(circle at 10% 20%, rgba(254, 240, 215, 0.03) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(254, 240, 215, 0.03) 0%, transparent 40%);
        }
        @media (max-width: 1100px) {
          div[style*="height: 700px"] { height: auto !important; flex-direction: column !important; }
          div[style*="position: absolute"] { position: relative !important; top: auto !important; left: auto !important; right: auto !important; margin: 15px auto !important; transform: none !important; }
          .central-ecosystem { width: 350px !important; height: 350px !important; margin: 50px auto !important; transform: none !important; }
          svg { display: none; }
          .feature-card { width: 90% !important; max-width: 420px; }
        }
      `}</style>
    </section>
  );
}
