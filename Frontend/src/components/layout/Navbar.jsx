import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const servicePages = [
    '/production',
    '/wedding',
    '/studiolabs',
    '/rentals',
    '/rental-application'
  ];

  const isServicePage = servicePages.includes(location.pathname);

  // Dropdown links configuration
  const dropdownLinks = [
    { name: 'PRODUCTIONS', path: '/production' },
    { name: 'WEDDINGS', path: '/wedding' },
    { name: 'LABS', path: '/studiolabs' },
    { name: 'CAMERA RENTALS', path: '/rentals' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] h-16 flex items-center justify-between px-6 md:px-10 bg-black/85 backdrop-blur-sm border-b border-white/5">
      {/* Logo Area */}
      <Link to="/" className="flex flex-col items-start leading-none group">
        <h1 className="text-white font-fonarto text-2xl tracking-tight transition-all">
          HOTMELLO
        </h1>
        <span className="text-[#de660e] font-sans text-[8px] tracking-[0.5em] font-black uppercase ml-0.5 mt-0.5">
          PVT LTD
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden lg:flex items-center gap-8 h-full">
        <Link to="/" className="text-white text-[11px] tracking-[0.2em] font-bold hover:text-[#de660e] transition-all">
          HOME
        </Link>

        {/* SERVICES DROPDOWN */}
        <div className="relative group h-full flex items-center">
          <button className="text-white text-[11px] tracking-[0.2em] font-bold group-hover:text-[#de660e] transition-all cursor-default">
            SERVICES
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-black/95 border border-white/10 rounded-b-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl">
            {dropdownLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-6 py-2.5 text-white text-[10px] tracking-[0.2em] font-bold hover:bg-[#de660e] hover:text-black transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <Link to="/about" className="text-white text-[11px] tracking-[0.2em] font-bold hover:text-[#de660e] transition-all">
          CREW
        </Link>
        <Link to="/contact" className="text-white text-[11px] tracking-[0.2em] font-bold hover:text-[#de660e] transition-all">
          CONTACT
        </Link>
      </div>

      {/* Action Button */}
      {!isServicePage ? (
        <Link
          to="/booking"
          className="bg-[#de660e] text-black font-black text-[12px] tracking-wider px-6 py-2 rounded-xl hover:bg-[#ff7f2c] hover:scale-105 transition-all duration-300"
        >
          BOOK NOW
        </Link>
      ) : (
        <div className="w-[115px]" />
      )}
    </nav>
  );
};

export default Navbar;