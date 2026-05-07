"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import CountUpStat from './CountUpStat';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const AboutUs = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/about-us?t=${Date.now()}`);
        console.log("AboutUs Data Fetched:", res.data.data);
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error("AboutUs Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const stats = data?.stats || [
    { value: '2k+', label: 'Patients Healed', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true },
    { value: '15+', label: 'Certified Doctors', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true },
    { value: '4.9', label: 'Average Patient Rating', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true },
    { value: '100+', label: 'New Equipments', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true }
  ];

  const title = data?.title || 'WELCOME TO DMC TRICHOLOGY®';
  const subtitle = data?.subtitle || 'ABOUT US CARE';
  const description = data?.description || 'At DMC Trichology, Advanced Hair Transplant Techniques Restore Your Hairline And Boost Confidence';
  const sectionIcon = data?.icon || "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  return (
    <EditableSection sectionId="about-us" label="About Us">
      <section className="welcome-section" style={{ padding: '100px 5%', backgroundColor: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <img 
              src={sectionIcon} 
              alt="icon" 
              style={{ width: '40px', height: 'auto' }} 
            />
            <EditableText sectionId="about-us" fieldPath="subtitle" tag="span" className="section-subtitle">
              {subtitle}
            </EditableText>
          </div>

          <h2 className="section-title">
            <EditableText sectionId="about-us" fieldPath="title" tag="span">
              {title}
            </EditableText>
          </h2>

          <p style={{ 
            fontSize: '44px', 
            lineHeight: '60px',
            color: '#333', 
            fontFamily: "'Marcellus', serif", 
            marginBottom: '60px',
            maxWidth: '1200px',
            margin: '0 auto 60px'
          }}>
            <EditableText sectionId="about-us" fieldPath="description" tag="span">
              {description}
            </EditableText>
          </p>

          <div className="stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '40px',
            marginTop: '40px'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '42px', color: '#333333', fontFamily: "'Marcellus', serif", marginBottom: '10px', fontWeight: '400' }}>
                  <EditableText sectionId="about-us" fieldPath={`stats.${index}.value`} tag="span">
                    <CountUpStat value={stat.value} />
                  </EditableText>
                </h3>
                <p style={{ fontSize: '18px', color: '#333333', fontFamily: "'Marcellus', serif", marginBottom: '20px' }}>
                  <EditableText sectionId="about-us" fieldPath={`stats.${index}.label`} tag="span">
                    {stat.label}
                  </EditableText>
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  {stat.showDivider !== false && (
                    <img 
                      src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
                      alt="divider" 
                      style={{ width: '60px', height: 'auto', marginBottom: '10px' }} 
                    />
                  )}
                  <p style={{ fontSize: '12px', color: '#777', fontFamily: "'Marcellus', serif", maxWidth: '180px', lineHeight: '1.6' }}>
                    <EditableText sectionId="about-us" fieldPath={`stats.${index}.description`} tag="span">
                      {stat.description}
                    </EditableText>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            p { font-size: 18px !important; }
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .stats-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default AboutUs;
