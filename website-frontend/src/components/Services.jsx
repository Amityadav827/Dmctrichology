import React from 'react';

const serviceCards = [
  {
    title: 'Follicular Unit Extraction (FUE)',
    desc: 'FUE Is One Of The Most Popular And Limited Modern Procedure Techniques For Hair Repair.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/fue-illus.png' // Placeholder or actual if available
  },
  {
    title: 'Follicular Unit Transplantation (FUT)',
    desc: 'FUT is another effective technique for hair restoration with high graft yield.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/fut-illus.png'
  },
  {
    title: 'Hair Replacement In Delhi – Non-Surgical Solutions',
    desc: 'Advanced non-surgical hair replacement solutions for natural look.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/replacement-illus.png'
  },
  {
    title: 'Scalp Treatments For Healthy Hair',
    desc: 'Nourish your scalp and promote healthy hair growth with our treatments.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/scalp-illus.png'
  }
];

export default function Services() {
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  return (
    <section className="services-section" style={{ padding: '100px 5%', backgroundColor: '#FFFBF0', textAlign: 'center' }}>
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
          Services
        </span>
      </div>

      <h2 style={{ 
        fontFamily: "'Marcellus', serif", 
        fontSize: '44px', 
        lineHeight: '60px', 
        color: '#000000', 
        marginBottom: '60px',
        fontWeight: 400,
        textTransform: 'capitalize'
      }}>
        Our Hair Transplant Services
      </h2>

      <div className="services-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1.5fr 1fr', 
        gap: '30px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        alignItems: 'start'
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {serviceCards.slice(0, 2).map((card, index) => (
            <div key={index} style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <img src={card.image} alt={card.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }} />
              <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '22px', lineHeight: '32px', color: '#000', marginBottom: '12px', fontWeight: 400 }}>{card.title}</h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px', lineHeight: '26px', color: '#7B7B7B' }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Center Focus Box */}
        <div style={{ backgroundColor: '#FFEDC2', borderRadius: '24px', padding: '50px', textAlign: 'left', height: '100%' }}>
          <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '28px', lineHeight: '38px', color: '#000', marginBottom: '24px', fontWeight: 400 }}>Follicular Unit Extraction (FUE)</h3>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px', lineHeight: '26px', color: '#333', marginBottom: '24px' }}>
            Each Hair Follicle Is Removed Individually And Implanted Into The Thinning Or Bald Areas, Making Sure That It's Natural Volume And Growth.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
            {['Best For Both Men And Women', 'Low Scarring And Recovery Time', 'Permanent, Natural-Looking Results'].map((item, i) => (
              <li key={i} style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px', color: '#333', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#E4B753' }}>•</span> {item}
              </li>
            ))}
          </ul>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', lineHeight: '24px', color: '#666' }}>
            Our FUE Procedure Is Performed By Skilled Hair Transplant Surgeons With Years Of Experience, Making Us The Best Hair Transplant Centre In Delhi.
          </p>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {serviceCards.slice(2, 4).map((card, index) => (
            <div key={index} style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <img src={card.image} alt={card.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }} />
              <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '22px', lineHeight: '32px', color: '#000', marginBottom: '12px', fontWeight: 400 }}>{card.title}</h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px', lineHeight: '26px', color: '#7B7B7B' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
