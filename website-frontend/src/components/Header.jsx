"use client";
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Navbar from './Navbar';
import { fetchSiteSettings } from '../services/api';

export default function Header() {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetchSiteSettings().then(data => {
      if(data && data.logo) setLogoUrl(data.logo);
    });
  }, []);

  return (
    <header className="header">
      <div className="logo">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" />
        ) : (
          <div style={{width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #E4B753', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#E4B753'}}>LOGO</div>
        )}
      </div>
      
      <Navbar />

      <div className="header-right" style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
        <a href="#book" className="btn-primary">
          Book Appointment 
          <div className="icon-circle">
            <ArrowUpRight />
          </div>
        </a>
      </div>
    </header>
  );
}
