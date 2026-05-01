import React from 'react';

const serviceCards = [
  {
    id: 'fue',
    title: 'Follicular Unit Extraction (FUE)',
    desc: 'FUE Is One Of The Most Popular And Limited Modern Procedure Techniques For Hair Repair.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777545320/dmc-trichology/scr1ziqgtxcsmwf2oq6p.png'
  },
  {
    id: 'fut',
    title: 'Follicular Unit Transplantation (FUT)',
    desc: 'FUT is another effective technique for hair restoration with high graft yield.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777545320/dmc-trichology/ugxr4ynn8vchlvqj6wkl.png'
  },
  {
    id: 'replacement',
    title: 'Hair Replacement In Delhi – Non-Surgical Solutions',
    desc: 'Advanced non-surgical hair replacement solutions for natural look.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777545320/dmc-trichology/jzdzyygl81bzzklwosgr.png'
  },
  {
    id: 'scalp',
    title: 'Scalp Treatments For Healthy Hair',
    desc: 'Nourish your scalp and promote healthy hair growth with our treatments.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777545319/dmc-trichology/kitvciqmkcr2xm1zr77f.png'
  }
];

export default function Services() {
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  const renderSmallCard = (card) => (
    <div style={{ 
      backgroundColor: '#FEF0D7', 
      borderRadius: '40px', 
      padding: '30px', 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 4px 30px rgba(0,0,0,0.03)',
      width: '100%'
    }}>
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <img src={card.image} alt={card.title} style={{ width: '100%', height: 'auto', borderRadius: '20px', objectFit: 'contain' }} />
      </div>
      <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '20px', lineHeight: '28px', color: '#000', marginBottom: '12px', fontWeight: 400 }}>{card.title}</h3>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', lineHeight: '22px', color: '#7B7B7B', margin: 0 }}>{card.desc}</p>
    </div>
  );

  return (
    <section className="services-section" style={{ padding: '100px 5%', backgroundColor: '#FFFAF1', textAlign: 'center' }}>
      <div className="section-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        <img src={iconUrl} alt="icon" style={{ width: '50px', height: 'auto' }} />
        <span style={{ 
          fontFamily: "'Marcellus', serif", 
          fontSize: '11px', 
          lineHeight: '28px', 
          textTransform: 'uppercase', 
          color: '#1C1C1C',
          fontWeight: 'bold',
          letterSpacing: '1px'
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
        gridTemplateColumns: '1fr 1.2fr 1fr', 
        gap: '40px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        alignItems: 'center'
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {renderSmallCard(serviceCards[0])} {/* FUE */}
          {renderSmallCard(serviceCards[1])} {/* FUT */}
        </div>

        {/* Center Focus Box */}
        <div style={{ 
          backgroundColor: '#FEF0D7', 
          borderRadius: '40px', 
          padding: '60px 40px', 
          textAlign: 'left',
          boxShadow: '0 4px 30px rgba(0,0,0,0.03)',
          height: 'fit-content'
        }}>
          <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '28px', lineHeight: '38px', color: '#000', marginBottom: '20px', fontWeight: 400 }}>Follicular Unit Extraction (FUE)</h3>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '15px', lineHeight: '26px', color: '#333', marginBottom: '24px' }}>
            Each Hair Follicle Is Removed Individually And Implanted Into The Thinning Or Bald Areas, Making Sure That It&apos;s Natural Volume And Growth.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px', textAlign: 'left' }}>
            {['Best For Both Men And Women', 'Low Scarring And Recovery Time', 'Permanent, Natural-Looking Results'].map((item, i) => (
              <li key={i} style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#333', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#E4B753', fontSize: '18px' }}>•</span> {item}
              </li>
            ))}
          </ul>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', lineHeight: '24px', color: '#7B7B7B', marginTop: '20px' }}>
            Our FUE Procedure Is Performed By Skilled Hair Transplant Surgeons With Years Of Experience, Making Us The Best Hair Transplant Centre In Delhi.
          </p>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {renderSmallCard(serviceCards[2])} {/* Non-Surgical */}
          {renderSmallCard(serviceCards[3])} {/* Scalp */}
        </div>
      </div>
    </section>
  );
}
