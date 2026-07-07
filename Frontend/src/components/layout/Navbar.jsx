import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { servicesData } from '../../data/serviceData';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const bgClass = isHome && !isScrolled ? 'bg-transparent' : 'bg-black/90 backdrop-blur-sm shadow-md';
  const servicesLabel = 'Services'; // change this string to rename the Services label

  const servicePathToQuery = {
    '/wedding': 'Wedding',
    '/production': 'Production',
    '/studiolabs': 'Studio Rentals',
  };
  const bookingLink = servicePathToQuery[location.pathname] ? `/booking?service=${encodeURIComponent(servicePathToQuery[location.pathname])}` : '/booking';

  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const servicesRef = useRef(null);
  useEffect(() => {
    const handleOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center min-h-[56px] sm:min-h-[64px] md:h-20">
          {/* Logo / Brand link on the far left */}
          <Link
            to="/"
            className={`fonarto text-2xl font-normal text-white tracking-wide hover:text-[#de660e] transition`}
            aria-label="Hotmello Home"
          >
            HOTMELLO
          </Link>

          {/* Desktop navigation links (hidden on small screens) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8">
            <Link to="/" className="text-white/80 hover:text-[#de660e] transition font-sans text-[11px] sm:text-xs md:text-sm uppercase tracking-wider whitespace-nowrap">
              Home
            </Link>
            {/* Services dropdown (hover on desktop) */}
            <div
              className="relative"
              ref={servicesRef}
              onMouseEnter={() => { if (window.innerWidth >= 768) setServicesOpen(true); }}
              onMouseLeave={() => { if (window.innerWidth >= 768) setServicesOpen(false); }}
            >
              <button
                onClick={() => setServicesOpen((s) => !s)}
                aria-expanded={servicesOpen}
                className="text-white/80 hover:text-[#de660e] transition font-sans text-[11px] sm:text-xs md:text-sm uppercase tracking-wider flex items-center gap-1 whitespace-nowrap"
              >
                {servicesLabel}
                <span className="ml-1 inline-block" aria-hidden>
                  <svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/80">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div
                className={`absolute left-0 mt-2 w-48 md:w-56 bg-black/95 border border-white/10 rounded-lg shadow-xl py-2 transition-all duration-200 z-20 ${servicesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
              >
                {servicesData.map((s) => (
                  <Link
                    key={s.id}
                    to={s.enquireLink}
                    onClick={() => setServicesOpen(false)}
                    className="block px-4 py-2 text-sm text-white/80 hover:text-[#de660e] hover:bg-white/5 transition"
                  >
                    {s.icon} {s.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/about" className="text-white/80 hover:text-[#de660e] transition font-sans text-[11px] sm:text-xs md:text-sm uppercase tracking-wider whitespace-nowrap">
              Crew
            </Link>
            <Link to="/contact" className="text-white/80 hover:text-[#de660e] transition font-sans text-[11px] sm:text-xs md:text-sm uppercase tracking-wider whitespace-nowrap">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-[#de660e] transition"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>


          {/* CTA Button – only on home page */}
          {isHome && (
            <div className="hidden md:flex items-center">
              <Link
                to="/booking"
                className="bg-[#de660e] text-black font-semibold text-[10px] sm:text-xs md:text-sm px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full hover:bg-[#ff7f2c] transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Book Now
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Mobile menu panel */}
      <div className={`md:hidden absolute left-0 right-0 top-full z-40 bg-black/95 border-t border-white/10 transition-transform duration-200 ${mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`}>
          <div className="px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block text-white/90 hover:text-[#de660e] uppercase tracking-wider font-sans">
              Home
            </Link>
            <Link to={bookingLink} onClick={() => setMobileOpen(false)} className="inline-block bg-[#de660e] text-black text-center font-semibold px-3 py-1 rounded-full text-sm">
              Book Now
            </Link>
          </div>

          <div className="border-t border-white/6 pt-2">
            {servicesData.map((s) => (
              <Link key={s.id} to={s.enquireLink} onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-white/80 hover:text-[#de660e]">
                {s.icon} {s.title}
              </Link>
            ))}
          </div>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block text-white/90 hover:text-[#de660e] uppercase tracking-wider font-sans">
            Crew
          </Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-white/90 hover:text-[#de660e] uppercase tracking-wider font-sans">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;