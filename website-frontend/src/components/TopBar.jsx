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
    email: 'Info@Dadumedicalcentre.Com',
    socials: [
      { name: 'telegram', link: '#' },
      { name: 'instagram', link: '#' },
      { name: 'facebook', link: '#' },
      { name: 'youtube', link: '#' },
      { name: 'linkedin', link: '#' }
    ]
  };

  const phones = settings?.phones || fallbackSettings.phones;
  const email = settings?.email || fallbackSettings.email;
  const socials = settings?.socials || fallbackSettings.socials;

  const renderIcon = (name) => {
    switch(name.toLowerCase()) {
      case 'telegram': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
      case 'instagram': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
      case 'facebook': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
      case 'youtube': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
      case 'linkedin': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
      default: return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>;
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {phones.map((phone, i) => (
          <span key={i}>{phone} {i < phones.length - 1 ? <span style={{margin: '0 8px', color: '#666'}}>|</span> : ''}</span>
        ))}
        <span style={{margin: '0 8px', color: '#666'}}>|</span>
        <span>{email}</span>
      </div>
      <div className="topbar-right">
        {socials.map((social, i) => (
          <a key={i} href={social.link} target="_blank" rel="noreferrer" className="social-icon">
            {social.icon ? <social.icon /> : renderIcon(social.name)}
          </a>
        ))}
      </div>
    </div>
  );
}
