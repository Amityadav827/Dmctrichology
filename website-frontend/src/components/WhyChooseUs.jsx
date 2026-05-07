"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const WhyChooseUs = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sections/why-choose-us`);
        if (res.data.success && res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("WhyChooseUs Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const title = data?.title || 'Why DMC Trichology Is The Best Hair Transplant Clinic In Delhi';
  const subtitle = data?.subtitle || 'Best Hair Graft Clinic';
  const features = data?.features || [
    { title: 'Natural Results', desc: 'Every Hairline Is Designed To Match Your Facial Structure For A Natural Look.', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/tcy9wy64djnagoimcfnx.png' },
    { title: 'Customized Care', desc: 'Every Hair Loss Condition Is Different And Also Unique.', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/ecjlnpbmt8rk3ebxazva.png' },
    { title: 'Reduce Surgical', desc: 'Techniques Like FUE Ensure Minimal Discomfort, No Linear Scars, And Quick Recovery.', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/kganja8haq69bvurxro8.png' },
    { title: 'Complete Aftercare', desc: 'Our Team Supports You From Consultation To Full Hair Growth.', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/j8gecypsa2honobtknua.png' }
  ];

  const centralImage = data?.centralImage || "https://res.cloudinary.com/dseixl6px/image/upload/v1777550637/dmc-trichology/mprq5pm7g2utm2olrnj1.png";
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  const renderCard = (feat, index) => (
    <div className="card-item" style={{
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
        <h4 style={{ fontFamily: "'Marcellus', serif", fontSize: '24px', marginBottom: '8px', fontWeight: 400, color: '#FEF0D7' }}>
          <EditableText sectionId="why-choose-us" fieldPath={`features.${index}.title`} tag="span">
            {feat.title}
          </EditableText>
        </h4>
        <p style={{ fontFamily: "'Marcellus', serif", fontSize: '13px', lineHeight: '20px', color: '#FFFFFF' }}>
          <EditableText sectionId="why-choose-us" fieldPath={`features.${index}.desc`} tag="span">
            {feat.desc}
          </EditableText>
        </p>
      </div>
    </div>
  );

  return (
    <EditableSection sectionId="why-choose-us" label="Why Choose Us">
      <section className="why-choose-us" style={{ padding: '0', backgroundColor: '#fff', textAlign: 'center', overflow: 'hidden' }}>
        <div className="section-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <img src={iconUrl} alt="icon" style={{ width: '50px', height: 'auto' }} />
          <EditableText sectionId="why-choose-us" fieldPath="subtitle" tag="span" className="section-subtitle">
            {subtitle}
          </EditableText>
        </div>

        <h2 className="section-title" style={{ maxWidth: '1000px', margin: '0 auto 100px', textAlign: 'center' }}>
          <EditableText sectionId="why-choose-us" fieldPath="title" tag="span">
            {title}
          </EditableText>
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
            width: '500px',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            position: 'relative'
          }}>
            <img src={centralImage} alt="Head Visualization" style={{ width: '100%', height: 'auto' }} />
          </div>

          {/* Feature Cards Positioned Around */}
          <div className="pos-card-1" style={{ position: 'absolute', top: '150px', left: '0' }}>{renderCard(features[0], 0)}</div>
          <div className="pos-card-2" style={{ position: 'absolute', top: '450px', left: '0' }}>{renderCard(features[1], 1)}</div>
          <div className="pos-card-3" style={{ position: 'absolute', top: '40px', right: '0' }}>{renderCard(features[2], 2)}</div>
          <div className="pos-card-4" style={{ position: 'absolute', top: '340px', right: '0' }}>{renderCard(features[3], 3)}</div>
        </div>
      </section>
      
      <style jsx>{`
        @media (max-width: 1200px) {
          .why-choose-us div[style*="height: 650px"] { height: auto !important; flex-direction: column !important; padding-bottom: 40px; }
          .pos-card-1, .pos-card-2, .pos-card-3, .pos-card-4 { position: relative !important; top: auto !important; left: auto !important; right: auto !important; margin-bottom: 20px; }
          .card-item { width: 90% !important; max-width: 400px; margin: 0 auto; }
        }
      `}</style>
    </EditableSection>
  );
}

export default WhyChooseUs;
