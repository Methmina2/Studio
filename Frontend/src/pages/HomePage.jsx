// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../services/api';
// import { buildImageUrl } from '../utils/buildImageUrl';

// const HomePage = () => {
//   const [hovered, setHovered] = useState(null);
//   const [services, setServices] = useState([]);
//   const [isMobile, setIsMobile] = useState(false);

//   const serviceConfig = {
//     production: { top: "HOTMELLO", main: "PRODUCTIONS", link: "/production" },
//     wedding: { top: "HOTMELLO", main: "WEDDINGS", link: "/wedding" },
//     studiolabs: { top: "HOTMELLO", main: "LABS", link: "/studiolabs" },
//     rentals: { top: "HOTMELLO", main: "CAMERA RENTALS", link: "/rentals" }
//   };

//   useEffect(() => {
//     // 1. Determine if device is mobile to disable hover logic
//     const checkRes = () => setIsMobile(window.innerWidth < 768);
//     checkRes();
//     window.addEventListener('resize', checkRes);

//     const fetchServices = async () => {
//       try {
//         const res = await api.get('/services');
//         const order = ['production', 'wedding', 'studiolabs', 'rentals'];
//         const filtered = res.data.data
//           .filter(s => order.includes(s.type))
//           .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
//         setServices(filtered);
//       } catch (err) { console.error(err); }
//     };
//     fetchServices();
//     return () => window.removeEventListener('resize', checkRes);
//   }, []);

//   return (
//     <div className="relative pt-16 md:pt-0 h-screen w-full overflow-hidden bg-black flex flex-col md:flex-row">
//       {services.map((service, index) => {
//         // Only consider something "hovered" if we are on Desktop
//         const isHovered = !isMobile && hovered === index;
//         const config = serviceConfig[service.type];

//         return (
//           <Link
//             key={service._id}
//             to={config.link}
//             onMouseEnter={() => !isMobile && setHovered(index)}
//             onMouseLeave={() => !isMobile && setHovered(null)}
//             className="relative h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5 last:border-0 transition-all duration-700 ease-in-out flex items-end justify-start"
//             style={{
//               // On mobile, all strips are equal (flex: 1). Expansion only on desktop.
//               flex: isMobile ? 1 : (hovered === null ? 1 : isHovered ? 2.2 : 0.6),
//             }}
//           >
//             <img
//               src={buildImageUrl(service.imageUrls?.[0])}
//               alt={service.title}
//               className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
//                 isHovered ? 'scale-110' : 'scale-100'
//               }`}
//             />

//             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
//             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

//             <div className="relative z-10 mb-10 md:mb-16 ml-6 md:ml-10 select-none pointer-events-none">
//               <p className="text-[#de660e] font-sans text-[10px] md:text-xs tracking-[0.4em] font-bold mb-2 uppercase text-left">
//                 {config.top}
//               </p>
              
//               <h2 
//                 className={`text-white font-fonarto leading-[0.85] uppercase transition-all duration-700 text-left
//                 ${isMobile 
//                   ? 'text-3xl' // Static font size for mobile
//                   : (isHovered ? 'text-4xl md:text-6xl lg:text-7xl tracking-tighter' : 'text-xl md:text-2xl lg:text-3xl tracking-normal')
//                 }`}
//               >
//                 {config.main}
//               </h2>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { buildImageUrl } from '../utils/buildImageUrl';

const HomePage = () => {
  const [hovered, setHovered] = useState(null);
  const [services, setServices] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const serviceConfig = {
    production: { top: "HOTMELLO", main: "PRODUCTIONS", link: "/production" },
    wedding: { top: "HOTMELLO", main: "WEDDINGS", link: "/wedding" },
    studiolabs: { top: "HOTMELLO", main: "LABS", link: "/studiolabs" },
    rentals: { top: "HOTMELLO", main: "CAMERA\nRENTALS", link: "/rentals" }
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
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
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
            className="relative h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/10 last:border-0 transition-all duration-700 ease-in-out flex items-end justify-start"
            style={{
              // Hovered expands to take most of the screen, others shrink but stay visible
              flex: isMobile ? 1 : (hovered === null ? 1 : isHovered ? 4.5 : 0.5),
            }}
          >
            {/* Image Layer */}
            <img
              src={buildImageUrl(service.imageUrls?.[0])}
              alt={service.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />

            {/* Readability Overlays */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Text Content */}
            <div className="relative z-10 mb-16 ml-6 md:ml-12 pointer-events-none w-full pr-10">
              {/* TOP LABEL - Margin bottom 0 or 1 to sit right on top of title */}
              <p className="text-[#de660e] font-service-label text-[10px] md:text-[12px] mb-0 font-bold uppercase text-left">
                {config.top}
              </p>
              
              {/* MAIN TITLE */}
              <h2 
                className={`text-white font-service-title transition-all duration-500 text-left
                ${isMobile 
                  ? 'text-4xl' 
                  : (isHovered 
                      ? 'text-4xl md:text-6xl lg:text-7xl tracking-tighter' 
                      : 'text-lg md:text-xl lg:text-2xl opacity-60 tracking-tight'
                    )
                }`}
              >
                {config.main}
              </h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default HomePage;