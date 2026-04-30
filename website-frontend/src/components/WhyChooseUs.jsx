import React from 'react';

const features = [
  {
    side: 'left',
    title: 'Natural Results',
    desc: 'Every Hairline Is Designed To Match Your Facial Structure For A Natural Look.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/kganja8haq69bvurxro8.png'
  },
  {
    side: 'left',
    title: 'Customized Care',
    desc: 'Every Hair Loss Condition Is Different And Also Unique.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/ecjlnpbmt8rk3ebxazva.png'
  },
  {
    side: 'right',
    title: 'Reduce Surgical',
    desc: 'Techniques Like FUE Ensure Minimal Discomfort, No Linear Scars, And Quick Recovery.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/j8gecypsa2honobtknua.png'
  },
  {
    side: 'right',
    title: 'Complete Aftercare',
    desc: 'Our Team Supports You From Consultation To Full Hair Growth.',
    icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/ecjlnpbmt8rk3ebxazva.png' // Reusing icon if missing one, but user gave 4. I'll use them.
  }
];

export default function WhyChooseUs() {
  const centralImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/tcy9wy64djnagoimcfnx.png";
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  const renderCard = (feat) => (
    <div style={{ 
      backgroundColor: '#000', 
      borderRadius: '20px', 
      padding: '24px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      maxWidth: '380px',
      color: '#fff',
      textAlign: 'left',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        backgroundColor: '#FEF0D7', 
        borderRadius: '12px', 
        padding: '12px', 
        minWidth: '70px', 
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img src={feat.icon} alt={feat.title} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
      </div>
      <div>
        <h4 style={{ fontFamily: "'Marcellus', serif", fontSize: '22px', marginBottom: '8px', fontWeight: 400 }}>{feat.title}</h4>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '13px', lineHeight: '20px', color: '#ccc' }}>{feat.desc}</p>
      </div>
    </div>
  );

  return (
    <section className="why-choose-us" style={{ padding: '100px 5%', backgroundColor: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="section-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        <img src={iconUrl} alt="icon" style={{ width: '40px', height: 'auto' }} />
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
        marginBottom: '80px',
        fontWeight: 400,
        maxWidth: '900px',
        margin: '0 auto 80px'
      }}>
        Why DMC Trichology Is The Best Hair Transplant Clinic In Delhi
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1.2fr 1fr', 
        gap: '40px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Left Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', alignItems: 'flex-end' }}>
          {renderCard(features[0])}
          {renderCard(features[1])}
        </div>

        {/* Central Circle */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '450px', 
            height: '450px', 
            borderRadius: '50%', 
            border: '1px solid #eee', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: '#fff'
          }}>
            <img src={centralImage} alt="Best Hair Transplant" style={{ width: '100%', height: 'auto', borderRadius: '50%' }} />
          </div>
          
          {/* Decorative SVG Lines (simplified) */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
             {/* Lines could be added here for extra polish */}
          </svg>
        </div>

        {/* Right Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', alignItems: 'flex-start' }}>
          {renderCard(features[2])}
          {renderCard(features[3])}
        </div>
      </div>
    </section>
  );
}
