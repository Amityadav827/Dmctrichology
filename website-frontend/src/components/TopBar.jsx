"use client";
import { useEffect, useState } from 'react';
import { fetchSiteSettings } from '../services/api';

export default function TopBar() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSiteSettings().then(data => {
      if(data) setSettings(data);
    });
  }, []);

  const fallbackSettings = {
    phones: ['+91-8527830194', '+91-9810939319'],
    email: 'info@dadumedicalcentre.com',
    socials: [
      { name: 'telegram', link: '#', iconUrl: 'http://dmctrichology-1.onrender.com/uploads/gallery/telegram-1777465282571.png' },
      { name: 'instagram', link: '#', iconUrl: 'http://dmctrichology-1.onrender.com/uploads/gallery/instagram-1777465282571.png' },
      { name: 'facebook', link: '#', iconUrl: 'http://dmctrichology-1.onrender.com/uploads/gallery/facebook-1777465282571.png' },
      { name: 'youtube', link: '#', iconUrl: 'http://dmctrichology-1.onrender.com/uploads/gallery/youtube-1777465282571.png' },
      { name: 'linkedin', link: '#', iconUrl: 'http://dmctrichology-1.onrender.com/uploads/gallery/linkdin-1777465282571.png' }
    ]
  };

  const phones = settings?.phones || fallbackSettings.phones;
  const email = settings?.email || fallbackSettings.email;
  const socials = settings?.socials || fallbackSettings.socials;

  const renderIcon = (social) => {
    return <img src={social.iconUrl} alt={social.name} style={{ width: '12px', height: '12px', objectFit: 'contain' }} />;
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {phones.map((phone, i) => (
          <span key={i}>{phone} {i < phones.length - 1 ? <span style={{margin: '0 8px'}}>|</span> : ''}</span>
        ))}
        <span style={{margin: '0 8px'}}>|</span>
        <span>{email}</span>
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
