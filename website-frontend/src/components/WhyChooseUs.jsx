"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

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

  const springConfig = { damping: 30, stiffness: 120 };
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
        initial={{ opacity: 0, x: isLeft ? -100 : 100, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ 
          y: -12, 
          scale: 1.03,
          rotateX: isLeft ? 6 : -6,
          rotateY: index < 2 ? 6 : -6,
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          border: '1px solid rgba(254, 240, 215, 0.5)'
        }}
        style={{
          backgroundColor: '#000',
          borderRadius: '24px',
          padding: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          width: '420px',
          color: '#fff',
          textAlign: 'left',
          zIndex: 10,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          x: useTransform(smoothX, (v) => v * (isLeft ? -25 : 25)),
          y: useTransform(smoothY, (v) => v * 25),
          perspective: '1000px'
        }}
      >
        {/* Layered Interactive Glow */}
        <motion.div 
          className="card-glow"
          animate={{ 
            opacity: [0.05, 0.2, 0.05],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
            background: 'radial-gradient(circle at center, rgba(254, 240, 215, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <motion.div 
          whileHover={{ scale: 1.18, rotate: 12, boxShadow: '0 15px 30px rgba(254, 240, 215, 0.25)' }}
          className="icon-box" 
          style={{
            backgroundColor: '#FEF0D7',
            borderRadius: '20px',
            padding: '16px',
            minWidth: '95px',
            height: '95px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 24px rgba(254, 240, 215, 0.15)',
            zIndex: 2,
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <img src={feat.icon} alt={feat.title} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
        </motion.div>
        
        <motion.div 
          style={{ position: 'relative', zIndex: 2 }}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h4 style={{ fontFamily: "'Marcellus', serif", fontSize: '28px', marginBottom: '10px', fontWeight: 400, color: '#FEF0D7', letterSpacing: '0.5px' }}>{feat.title}</h4>
          <p style={{ fontFamily: "'Marcellus', serif", fontSize: '15px', lineHeight: '24px', color: 'rgba(255,255,255,0.85)' }}>{feat.desc}</p>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="why-choose-us" 
      style={{ padding: '120px 0', backgroundColor: '#fff', textAlign: 'center', overflow: 'hidden', perspective: '1500px' }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="section-tag" 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '35px' }}
      >
        <img src={iconUrl} alt="icon" style={{ width: '60px', height: 'auto' }} />
        <span className="section-subtitle" style={{ letterSpacing: '3px', fontWeight: '500' }}>Best Hair Graft Clinic</span>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="section-title" 
        style={{ maxWidth: '1000px', margin: '0 auto 120px !important', textAlign: 'center' }}
      >
        Why DMC Trichology Is The Best Hair Transplant Clinic In Delhi
      </motion.h2>

      <div style={{
        position: 'relative',
        maxWidth: '1440px',
        height: '750px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* High-End Energy Connector SVG */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
          <defs>
            <filter id="energyGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(254, 240, 215, 0)" />
              <stop offset="50%" stopColor="rgba(254, 240, 215, 0.8)" />
              <stop offset="100%" stopColor="rgba(254, 240, 215, 0)" />
            </linearGradient>
          </defs>

          {[
            { d: "M 720 375 L 420 180", delay: 0.6 },
            { d: "M 720 375 L 420 550", delay: 0.8 },
            { d: "M 720 375 L 1020 80", delay: 1.0 },
            { d: "M 720 375 L 1020 450", delay: 1.2 }
          ].map((path, i) => (
            <React.Fragment key={i}>
              <motion.path 
                d={path.d} 
                stroke="rgba(254, 240, 215, 0.12)"
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.5, delay: path.delay, ease: "easeInOut" }}
              />
              {/* Energy Pulse with Glow Trail */}
              <motion.circle 
                r="3.5"
                fill="#FEF0D7"
                filter="url(#energyGlow)"
                animate={{
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  delay: path.delay,
                  ease: "linear"
                }}
                style={{ offsetPath: `path("${path.d}")` }}
              />
            </React.Fragment>
          ))}
        </svg>

        {/* Central Futuristic Medical Ecosystem */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(20px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="central-ecosystem" 
          style={{
            width: '600px',
            height: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            position: 'relative',
            x: useTransform(smoothX, (v) => v * 50),
            y: useTransform(smoothY, (v) => v * 50),
          }}
        >
          {/* Layered Advanced Rings */}
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
            style={{
              position: 'absolute',
              width: '100%', height: '100%',
              border: '1.5px solid rgba(254, 240, 215, 0.08)',
              borderRadius: '50%',
              padding: '25px'
            }}
          >
            <div style={{ width: '100%', height: '100%', border: '1px dashed rgba(254, 240, 215, 0.15)', borderRadius: '50%' }} />
          </motion.div>

          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              width: '88%', height: '88%',
              background: 'conic-gradient(from 0deg, transparent, rgba(254, 240, 215, 0.05), transparent 60%)',
              borderRadius: '50%',
              filter: 'blur(15px)'
            }}
          />

          {/* Luxury Ambient Pulse Aura */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              width: '75%', height: '75%',
              background: 'radial-gradient(circle, rgba(254, 240, 215, 0.3) 0%, transparent 75%)',
              filter: 'blur(40px)',
              zIndex: 1
            }}
          />

          {/* Cinematic Floating Particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -40, 0],
                x: [0, 20, 0],
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                width: i % 2 === 0 ? '3px' : '5px', 
                height: i % 2 === 0 ? '3px' : '5px',
                backgroundColor: '#FEF0D7',
                borderRadius: '50%',
                top: `${15 + Math.random() * 70}%`,
                left: `${15 + Math.random() * 70}%`,
                filter: 'blur(1.5px)',
                zIndex: 2
              }}
            />
          ))}
          
          <motion.img 
            src={centralImage} 
            alt="Medical Visualization" 
            style={{ 
              width: '92%', 
              height: 'auto', 
              position: 'relative', 
              zIndex: 6,
              filter: 'drop-shadow(0 40px 100px rgba(0,0,0,0.5))'
            }}
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 2, -2, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>

        {/* Coordinated Premium Feature Cards */}
        <div style={{ position: 'absolute', top: '100px', left: '0' }}>{renderCard(features[0], 0)}</div>
        <div style={{ position: 'absolute', top: '480px', left: '0' }}>{renderCard(features[1], 1)}</div>
        <div style={{ position: 'absolute', top: '0px', right: '0' }}>{renderCard(features[2], 2)}</div>
        <div style={{ position: 'absolute', top: '380px', right: '0' }}>{renderCard(features[3], 3)}</div>
      </div>

      <style jsx>{`
        .why-choose-us {
          background: radial-gradient(circle at 15% 15%, rgba(254, 240, 215, 0.04) 0%, transparent 35%),
                      radial-gradient(circle at 85% 85%, rgba(254, 240, 215, 0.04) 0%, transparent 35%);
        }
        @media (max-width: 1200px) {
          div[style*="height: 750px"] { height: auto !important; flex-direction: column !important; padding: 40px 0; }
          div[style*="position: absolute"] { position: relative !important; top: auto !important; left: auto !important; right: auto !important; margin: 20px auto !important; transform: none !important; }
          .central-ecosystem { width: 400px !important; height: 400px !important; margin: 60px auto !important; transform: none !important; }
          svg { display: none; }
          .feature-card { width: 92% !important; max-width: 440px; }
        }
      `}</style>
    </section>
  );
}
