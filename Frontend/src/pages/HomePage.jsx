import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { buildImageUrl } from '../utils/buildImageUrl';

const HomePage = () => {
  const [hovered, setHovered] = useState(null);
  const [services, setServices] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  return (
    <div className="relative pt-16 md:pt-0 h-screen w-full overflow-hidden bg-black flex flex-col md:flex-row">
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

            {/* Title Container – now truly flush left */}
            <div className="relative z-10 w-full flex justify-start items-start pointer-events-none pl-0 md:pl-0">
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