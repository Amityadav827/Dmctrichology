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
      { name: 'telegram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png' },
      { name: 'instagram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png' },
      { name: 'facebook', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png' },
      { name: 'youtube', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png' },
      { name: 'linkedin', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png' }
    ]
  };

  const phones = settings?.phone1 ? [settings.phone1, settings.phone2].filter(Boolean) : fallbackSettings.phones;
  const email = settings?.email || fallbackSettings.email;
  const socials = settings?.socialLinks 
    ? fallbackSettings.socials.map(s => ({ ...s, link: settings.socialLinks[s.name] || s.link }))
    : fallbackSettings.socials;

  const renderIcon = (social) => {
    return <img src={social.iconUrl} alt={social.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />;
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
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
