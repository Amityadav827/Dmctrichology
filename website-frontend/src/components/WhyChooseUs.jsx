import React from 'react';

const features = [
  {
    id: 'natural',
    title: 'Natural Results',
    desc: 'Every Hairline Is Designed To Match Your Facial Structure For A Natural Look.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/tcy9wy64djnagoimcfnx.png'
  },
  {
    id: 'customized',
    title: 'Customized Care',
    desc: 'Every Hair Loss Condition Is Different And Also Unique.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/ecjlnpbmt8rk3ebxazva.png'
  },
  {
    id: 'surgical',
    title: 'Reduce Surgical',
    desc: 'Techniques Like FUE Ensure Minimal Discomfort, No Linear Scars, And Quick Recovery.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/kganja8haq69bvurxro8.png'
  },
  {
    id: 'aftercare',
    title: 'Complete Aftercare',
    desc: 'Our Team Supports You From Consultation To Full Hair Growth.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/j8gecypsa2honobtknua.png'
  }
];

export default function WhyChooseUs() {
  const centralImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/lk8xz9tuxb0pz6v4xprd.png";
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  const renderCard = (feat) => (
    <div style={{ 
      backgroundColor: '#000', 
      borderRadius: '24px', 
      padding: '20px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      width: '400px',
      color: '#fff',
      textAlign: 'left',
      zIndex: 2,
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
    }}>
      <div style={{ 
        backgroundColor: '#FEF0D7', 
        borderRadius: '16px', 
        padding: '12px', 
        minWidth: '85px', 
        height: '85px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img src={feat.icon} alt={feat.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
      </div>
      <div>
        <h4 style={{ fontFamily: "'Marcellus', serif", fontSize: '24px', marginBottom: '8px', fontWeight: 400, color: '#FEF0D7' }}>{feat.title}</h4>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '13px', lineHeight: '20px', color: '#FFFFFF' }}>{feat.desc}</p>
      </div>
    </div>
  );

  return (
    <section className="why-choose-us" style={{ padding: '100px 5%', backgroundColor: '#fff', textAlign: 'center', overflow: 'hidden' }}>
      <div className="section-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        <img src={iconUrl} alt="icon" style={{ width: '50px', height: 'auto' }} />
        <span style={{ 
          fontFamily: "'Marcellus', serif", 
          fontSize: '12px', 
          lineHeight: '28px', 
          textTransform: 'uppercase', 
          color: '#1C1C1C',
          fontWeight: 400
        }}>
          Best Hair Graft Clinic
        </span>
      </div>

      <h2 style={{ 
        fontFamily: "'Marcellus', serif", 
        fontSize: '44px', 
        lineHeight: '60px', 
        color: '#000', 
        marginBottom: '100px',
        fontWeight: 400,
        maxWidth: '1000px',
        margin: '0 auto 100px'
      }}>
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
        {/* Central Circular Head Image */}
        <div style={{ 
          width: '450px', 
          height: '450px', 
          borderRadius: '50%', 
          border: '1px solid #E4B753', 
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          zIndex: 1,
          position: 'relative'
        }}>
          <img src={centralImage} alt="Head Visualization" style={{ width: '100%', height: 'auto', borderRadius: '50%' }} />
          
          {/* Connector Dots on the circle */}
          <div style={{ position: 'absolute', top: '25%', left: '10%', width: '12px', height: '12px', backgroundColor: '#E4B753', borderRadius: '50%', border: '2px solid #fff' }}></div>
          <div style={{ position: 'absolute', top: '75%', left: '15%', width: '12px', height: '12px', backgroundColor: '#E4B753', borderRadius: '50%', border: '2px solid #fff' }}></div>
          <div style={{ position: 'absolute', top: '25%', right: '10%', width: '12px', height: '12px', backgroundColor: '#E4B753', borderRadius: '50%', border: '2px solid #fff' }}></div>
          <div style={{ position: 'absolute', top: '75%', right: '15%', width: '12px', height: '12px', backgroundColor: '#E4B753', borderRadius: '50%', border: '2px solid #fff' }}></div>
        </div>

        {/* Feature Cards Positioned Around */}
        <div style={{ position: 'absolute', top: '20px', left: '0' }}>{renderCard(features[0])}</div>
        <div style={{ position: 'absolute', bottom: '20px', left: '0' }}>{renderCard(features[1])}</div>
        <div style={{ position: 'absolute', top: '20px', right: '0' }}>{renderCard(features[2])}</div>
        <div style={{ position: 'absolute', bottom: '20px', right: '0' }}>{renderCard(features[3])}</div>

        {/* Connecting Lines (SVG) */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
           <line x1="400" y1="120" x2="500" y2="250" stroke="#E4B753" strokeWidth="1" opacity="0.3" />
           <line x1="400" y1="530" x2="500" y2="400" stroke="#E4B753" strokeWidth="1" opacity="0.3" />
           <line x1="900" y1="120" x2="800" y2="250" stroke="#E4B753" strokeWidth="1" opacity="0.3" />
           <line x1="900" y1="530" x2="800" y2="400" stroke="#E4B753" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>
    </section>
  );
}
