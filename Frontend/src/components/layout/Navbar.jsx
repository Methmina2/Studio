import React from 'react';
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

  const dropdownLinks = [
    { name: 'PRODUCTIONS', path: '/production' },
    { name: 'WEDDINGS', path: '/wedding' },
    { name: 'LABS', path: '/studiolabs' },
    { name: 'CAMERA RENTALS', path: '/rentals' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] h-20 flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo Area */}
        <Link to="/" className="flex flex-col items-start leading-none group">
          <h1 className="text-white font-logo text-3xl tracking-tighter">
            HOTMELLO
          </h1>
          <span className="text-[#de660e] font-extended text-[9px] tracking-label font-black mt-1 ml-0.5">
            PVT LTD
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-10">
          <Link to="/" className="text-white text-[12px] font-extended font-bold tracking-[0.2em] hover:text-[#de660e] transition-all">
            HOME
          </Link>

          {/* SERVICES DROPDOWN */}
          <div className="relative group h-full flex items-center">
            <button className="text-white text-[12px] font-extended font-bold tracking-[0.2em] group-hover:text-[#de660e] transition-all cursor-default">
              SERVICES
            </button>
            
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-black/95 border border-white/10 rounded-b-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl">
              {dropdownLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-6 py-2.5 text-white text-[11px] font-extended font-bold tracking-[0.2em] hover:bg-[#de660e] hover:text-black transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/about" className="text-white text-[12px] font-extended font-bold tracking-[0.2em] hover:text-[#de660e] transition-all">
            CREW
          </Link>
          <Link to="/contact" className="text-white text-[12px] font-extended font-bold tracking-[0.2em] hover:text-[#de660e] transition-all">
            CONTACT
          </Link>
        </div>

        {/* Action Button – further reduced width */}
        {!isServicePage ? (
          <Link
            to="/booking"
            className="bg-[#de660e] text-black font-extended font-extrabold text-[11px] tracking-wider px-3.5 py-2 rounded-2xl hover:bg-[#ff7f2c] transition-all"
          >
            BOOK NOW
          </Link>
        ) : (
          <div className="w-[85px]" />
        )}
      </div>
    </nav>
  );
};

export default Navbar;