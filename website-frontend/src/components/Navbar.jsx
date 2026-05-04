"use client";
import { useEffect, useState, useRef } from 'react';
import { fetchMenu } from '../services/api';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';

export default function Navbar() {
  const [menuItems, setMenuItems] = useState([
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about', dropdown: [{label: 'Our Story', link: '#'}] },
    { label: 'Pages', link: '#', dropdown: [{label: 'Page 1', link: '#'}, {label: 'Page 2', link: '#'}] },
    { label: 'Services', link: '/services' },
    { label: 'Blog', link: '/blog' },
    { label: 'Contact', link: '/contact' }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    fetchMenu().then(data => {
      if(data && data.length > 0) {
        setMenuItems(data);
      }
    });
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div ref={navRef} style={{ display: 'flex', alignItems: 'center' }}>
      {/* Hamburger Toggle Button */}
      <button
        className="mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Desktop + Mobile Nav */}
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        {menuItems.map((item, i) => (
          <div key={i} className="nav-item" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <a
              href={item.link}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
            {item.dropdown && <ChevronDown size={14} className="nav-chevron" />}
            {item.dropdown && (
              <div className="dropdown-menu">
                {item.dropdown.map((sub, j) => (
                  <a
                    key={j}
                    href={sub.link}
                    className="dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
