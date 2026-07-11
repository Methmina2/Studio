import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { buildImageUrl } from '../utils/buildImageUrl';

const HomePage = () => {
  const [hovered, setHovered] = useState(null);
  const [services, setServices] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);

  const serviceConfig = {
    production: { titleImg: "/images/1_-_Productions.png", link: "/production", alt: "Productions" },
    wedding: { titleImg: "/images/2_-_Weddings.png", link: "/wedding", alt: "Weddings" },
    studiolabs: { titleImg: "/images/3_-_Labs.png", link: "/studiolabs", alt: "Labs" },
    rentals: { titleImg: "/images/4_-_Camera_Rentals.png", link: "/rentals", alt: "Camera Rentals" }
  };

  useEffect(() => {
    const handleRes = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleRes);
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        const order = ['production', 'wedding', 'studiolabs', 'rentals'];
        const filtered = res.data.data
          .filter(s => order.includes(s.type))
          .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
        setServices(filtered);
      } catch (err) { console.error(err); }
    };
    fetchServices();
    return () => window.removeEventListener('resize', handleRes);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const dropdownLinks = [
    { name: 'PRODUCTIONS', path: '/production' },
    { name: 'WEDDINGS', path: '/wedding' },
    { name: 'LABS', path: '/studiolabs' },
    { name: 'CAMERA RENTALS', path: '/rentals' }
  ];

  return (
    <div className="relative pt-16 md:pt-0 h-screen w-full overflow-hidden bg-black flex flex-col md:flex-row">
      {/* Hamburger – moved to the LEFT side, above the navbar */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-[200] text-white text-2xl md:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* Slide panel – slides in from the LEFT now */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-absolute-black border-r border-white/10 z-[160] transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          <h2 className="text-white text-xl font-serif mb-8">Menu</h2>
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-white text-sm font-extended font-bold tracking-wider hover:text-[#de660e] transition"
              onClick={closeMenu}
            >
              HOME
            </Link>
            <div className="relative">
              <span className="text-white text-sm font-extended font-bold tracking-wider block mb-2">
                SERVICES
              </span>
              <div className="flex flex-col gap-2 ml-4 border-l border-white/10 pl-4">
                {dropdownLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-white/70 text-xs font-extended tracking-wider hover:text-[#de660e] transition"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/about"
              className="text-white text-sm font-extended font-bold tracking-wider hover:text-[#de660e] transition"
              onClick={closeMenu}
            >
              CREW
            </Link>
            <Link
              to="/contact"
              className="text-white text-sm font-extended font-bold tracking-wider hover:text-[#de660e] transition"
              onClick={closeMenu}
            >
              CONTACT
            </Link>
            <Link
              to="/booking"
              className="mt-4 bg-[#de660e] text-black text-sm font-extended font-bold tracking-wider px-4 py-2 rounded-full text-center hover:bg-[#ff7f2c] transition"
              onClick={closeMenu}
            >
              BOOK NOW
            </Link>
          </nav>
        </div>
      </div>

      {/* Service cards – unchanged */}
      {services.map((service, index) => {
        const isHovered = !isMobile && hovered === index;
        const config = serviceConfig[service.type];

        return (
          <Link
            key={service._id}
            to={config.link}
            onMouseEnter={() => !isMobile && setHovered(index)}
            onMouseLeave={() => !isMobile && setHovered(null)}
            className="relative h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/10 last:border-0 transition-all duration-700 ease-in-out flex flex-col justify-end pb-20"
            style={{
              flex: isMobile ? 1 : (hovered === null ? 1 : isHovered ? 2.2 : 0.6),
            }}
          >
            <img
              src={buildImageUrl(service.imageUrls?.[0])}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000 ${
                isHovered ? 'brightness-110 contrast-110' : 'brightness-75'
              }`}
            />
            
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

            <div className="relative z-10 w-full flex justify-start pl-0 md:pl-0 pointer-events-none">
              <img 
                src={config.titleImg} 
                alt={config.alt}
                className={`transition-all duration-500 object-left object-contain w-auto
                  ${isMobile 
                    ? 'h-16' 
                    : (isHovered 
                        ? 'h-24 lg:h-32 opacity-100' 
                        : 'h-10 lg:h-12 opacity-60'
                      )
                  }`}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default HomePage;