"use client";
import { useEffect, useState } from 'react';
import { fetchTopBar } from '../services/api';

export default function TopBar() {
  const [topBarData, setTopBarData] = useState(null);

  useEffect(() => {
    console.log('TopBar: Fetching data...');
    fetchTopBar().then(data => {
      console.log('TopBar: API Raw Response:', data);
      if(data && data.data) {
        console.log('TopBar: Setting state with:', data.data);
        setTopBarData(data.data);
      } else {
        console.warn('TopBar: API response invalid or empty');
      }
    });
  }, []);

  const fallbackSettings = {
    phones: ['+91-8527830194', '+91-9810939319'],
    email: 'info@dadumedicalcentre.com',
    socials: [
      { name: 'telegram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png' },
      { name: 'instagram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png' },
      { name: 'facebook', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png' },
      { name: 'youtube', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png' },
      { name: 'linkedin', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png' }
    ]
  };

  const isVisible = topBarData ? topBarData.isVisible : true;
  const phones = topBarData ? [topBarData.phone1, topBarData.phone2].filter(Boolean) : fallbackSettings.phones;
  const email = topBarData ? topBarData.email : fallbackSettings.email;
  const announcementText = topBarData ? topBarData.announcementText : "";
  
  const socials = topBarData ? topBarData.socialLinks : fallbackSettings.socials;

  const renderIcon = (social) => {
    return <img src={social.iconUrl} alt={social.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />;
  };

  if (topBarData === null) return null; // Wait for initial fetch
  if (!isVisible) return null;

  console.log('TopBar Rendering Data:', topBarData); // Debugging on live site

  return (
    <div className="topbar">
      <div className="topbar-left">
        {announcementText && (
          <>
            <span className="topbar-contact-item" style={{ color: '#E4B753', fontWeight: '500' }}>{announcementText}</span>
            <span className="topbar-sep">|</span>
          </>
        )}
        {phones.map((phone, i) => (
          <span key={i} className="topbar-contact-item">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="topbar-link">{phone}</a>
            {i < phones.length - 1 && <span className="topbar-sep">|</span>}
          </span>
        ))}
        <span className="topbar-sep">|</span>
        <a href={`mailto:${email}`} className="topbar-link">{email}</a>
      </div>
      <div className="topbar-right">
        {socials.map((social, i) => (
          <a key={i} href={social.link} target="_blank" rel="noreferrer" className="social-icon">
            {renderIcon(social)}
          </a>
        ))}
      </div>
    </div>
  );
}
