import React from 'react';

const stats = [
  { number: '2k+', label: 'Patients Healed' },
  { number: '15+', label: 'Certified Doctors' },
  { number: '4.9', label: 'Average Patient Rating' },
  { number: '100+', label: 'New Equipments' }
];

export default function AboutUsCare() {
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";
  const description = "Experience compassionate care healthier care certified brighter smile.";

  return (
    <section className="about-us-care" style={{ padding: '100px 5%', textAlign: 'center', backgroundColor: '#fff' }}>
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
          About Us Care
        </span>
      </div>

      <h2 style={{ 
        fontFamily: "'Marcellus', serif", 
        fontSize: '49px', 
        lineHeight: '67px', 
        color: '#1C1C1C', 
        marginBottom: '16px',
        fontWeight: 400,
        textTransform: 'capitalize'
      }}>
        WELCOME TO DMC TRICHOLOGY®
      </h2>
      
      <p style={{ 
        fontFamily: "'Marcellus', serif", 
        fontSize: '49px', 
        lineHeight: '67px', 
        color: '#1C1C1C', 
        maxWidth: '1200px', 
        margin: '0 auto 80px',
        fontWeight: 400,
        textTransform: 'capitalize'
      }}>
        At DMC Trichology, advanced hair transplant techniques restore your hairline and boost confidence
      </p>

      <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {stats.map((stat, index) => (
          <div key={index} className="stat-item" style={{ textAlign: 'center' }}>
            <div style={{ 
              fontFamily: "'Marcellus', serif", 
              fontSize: '44px', 
              lineHeight: '60px', 
              color: '#000000',
              fontWeight: 400
            }}>
              {stat.number}
            </div>
            <div style={{ 
              fontFamily: "'Marcellus', serif", 
              fontSize: '30px', 
              lineHeight: '48px', 
              color: '#1C1C1C',
              marginBottom: '12px',
              fontWeight: 400,
              textTransform: 'capitalize'
            }}>
              {stat.label}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <img src={iconUrl} alt="icon" style={{ width: '30px', height: 'auto' }} />
            </div>
            <p style={{ 
              fontFamily: "'Lato', sans-serif", 
              fontSize: '16px', 
              lineHeight: '26px', 
              color: '#4D4D4D',
              textTransform: 'capitalize'
            }}>
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
