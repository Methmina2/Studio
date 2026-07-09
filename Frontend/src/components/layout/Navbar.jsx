import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const servicePaths = ['/production', '/wedding', '/studiolabs', '/rentals'];
  const isServicePage = servicePaths.includes(location.pathname);

  const dropdownLinks = [
    { name: 'PRODUCTIONS', path: '/production' },
    { name: 'WEDDINGS', path: '/wedding' },
    { name: 'LABS', path: '/studiolabs' },
    { name: 'CAMERA RENTALS', path: '/rentals' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] h-16 flex items-center justify-between pl-2 md:pl-4 pr-4 md:pr-8 bg-black/85 backdrop-blur-md border-b border-white/5 overflow-visible">
      
      {/* LOGO: massive — overflows navbar */}
      <Link to="/" className="flex items-center group">
        <img 
          src="/images/hotmello.png" 
          alt="Hotmello Logo" 
          className="h-28 md:h-36 w-auto object-contain transition-transform group-hover:scale-105"
        />
      </Link>

      {/* CENTER: Navigation Links */}
      <div className="hidden lg:flex items-center gap-8 h-full">
        <Link to="/" className="text-white text-[11px] font-extended font-bold tracking-[0.2em] hover:text-[#de660e] transition-all">HOME</Link>
        <div className="relative group h-full flex items-center">
          <button className="text-white text-[11px] font-extended font-bold tracking-[0.2em] group-hover:text-[#de660e] transition-all cursor-default">SERVICES</button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-black/95 border border-white/10 rounded-b-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            {dropdownLinks.map((item) => (
              <Link key={item.name} to={item.path} className="block px-6 py-2.5 text-white text-[10px] font-extended font-bold tracking-wider hover:bg-[#de660e] hover:text-black transition-colors">{item.name}</Link>
            ))}
          </div>
        </div>
        <Link to="/about" className="text-white text-[11px] font-extended font-bold tracking-[0.2em] hover:text-[#de660e] transition-all">CREW</Link>
        <Link to="/contact" className="text-white text-[11px] font-extended font-bold tracking-[0.2em] hover:text-[#de660e] transition-all">CONTACT</Link>
      </div>

      {/* RIGHT: Action Button */}
      {!isServicePage ? (
        <Link to="/booking" className="bg-[#de660e] text-black font-extended font-black text-[12px] tracking-wider px-6 py-2 rounded-xl hover:bg-[#ff7f2c] transition-all">BOOK NOW</Link>
      ) : <div className="w-[115px]" />}
    </nav>
  );
};

export default Navbar;