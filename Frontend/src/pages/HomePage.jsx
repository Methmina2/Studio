import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { buildImageUrl } from '../utils/buildImageUrl';

// Define the desired order for service types
const SERVICE_ORDER = ['production', 'wedding', 'rentals', 'studiolabs'];

const defaultServiceData = {
  production: {
    image: '/images/event.png',
    enquireLink: '/production',
    colorKey: 'events',
  },
  wedding: {
    image: '/images/wedding.png',
    enquireLink: '/wedding',
    colorKey: 'weddings',
  },
  rentals: {
    image: '/images/rental-camara.png',
    enquireLink: '/rentals',
    colorKey: 'rentals',
  },
  studiolabs: {
    image: '/images/studio.png',
    enquireLink: '/studiolabs',
    colorKey: 'studio',
  },
};

const HomePage = () => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const hasStartedRef = useRef(false);
  const word = 'HOTMELLO';

  // Typing effect
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const typeLetter = () => {
      if (indexRef.current < word.length) {
        setDisplayText((prev) => prev + word.charAt(indexRef.current));
        indexRef.current++;
        setTimeout(typeLetter, 180);
      } else {
        setIsComplete(true);
      }
    };
    typeLetter();
  }, []);

  // Fetch services from backend
  const [services, setServices] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        const mappedServices = res.data.data.map((service) => {
          const defaults = defaultServiceData[service.type] || {};
          const imageUrl = service.imageUrls?.[0]
            ? buildImageUrl(service.imageUrls[0])
            : defaults.image;
          return {
            ...service,
            image: imageUrl,
            enquireLink: service.enquireLink || defaults.enquireLink,
            colorKey: service.colorKey || defaults.colorKey,
          };
        });

        const sorted = mappedServices.sort(
          (a, b) => SERVICE_ORDER.indexOf(a.type) - SERVICE_ORDER.indexOf(b.type)
        );
        setServices(sorted);
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setIsLoaded(true);
      }
    };
    fetchServices();
  }, []);

  const cards = services.length ? services.slice(0, 4) : [];

  const cardTagline = {
    Production: 'LIVE CINEMA',
    Wedding: 'ROMANCE STAGE',
    'Camera Rentals': 'TECH GEAR',
    'Studio Rentals': 'CREATIVE LAB',
  };
  const hoverAccentMap = {
    Production: 'rgba(222,102,14,0.22)',
    Wedding: 'rgba(130,230,73,0.22)',
    'Camera Rentals': 'rgba(0,255,255,0.22)',
    'Studio Rentals': 'rgba(128,0,128,0.22)',
  };
  const cardAccentMap = {
    Production: 'rgba(222,102,14,0.55)',
    Wedding: 'rgba(130,230,73,0.55)',
    'Camera Rentals': 'rgba(0,255,255,0.55)',
    'Studio Rentals': 'rgba(128,0,128,0.55)',
  };
  const currentHoverAccent = hovered === null ? 'rgba(255,255,255,0.04)' : hoverAccentMap[cards[hovered]?.title] || 'rgba(255,255,255,0.04)';

  return (
    <div
      className="relative flex flex-col md:flex-row h-screen w-screen min-h-screen max-h-screen overflow-hidden bg-absolute-black homepage-shine-root"
      style={{ '--hover-accent': currentHoverAccent }}
    >
      <style>{`
        .card-entrance-down {
          animation: cardEntranceDown 0.7s ease-out forwards;
        }
        .card-entrance-up {
          animation: cardEntranceUp 0.7s ease-out forwards;
        }
        @keyframes cardEntranceDown {
          0% { opacity: 0; transform: translateY(-60px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardEntranceUp {
          0% { opacity: 0; transform: translateY(60px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[100vw] h-[80vh] bg-[#de660e]/50 blur-[140px] rounded-full" />
        <div className="absolute -bottom-40 -right-20 w-[60vw] h-[60vh] bg-[#de660e]/30 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(222,102,14,0.15),transparent_55%)]" />
        <div className="absolute left-1/2 top-[18%] h-[24vh] w-[84vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_48%)] blur-[96px] opacity-70 animate-shimmer" />
        <div className="absolute left-1/2 bottom-[10%] h-[28vh] w-[68vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_42%)] blur-[120px] opacity-50" />
        <div className="homepage-beam" />
        <div className="homepage-spot homepage-spot-a" />
        <div className="homepage-spot homepage-spot-b" />
        <div className="homepage-spot homepage-spot-c" />
      </div>

      {isLoaded && cards.length > 0 ? cards.map((service, index) => {
        const direction = index % 2 === 0 ? 'fade-down' : 'fade-up';
        const entranceClass = index % 2 === 0 ? 'card-entrance-down' : 'card-entrance-up';
        const glowClass = service.colorKey === 'weddings' ? 'glow-wedding' : service.colorKey === 'rentals' ? 'glow-rentals' : service.colorKey === 'studio' ? 'glow-studio' : 'glow-production';
        const isHovered = hovered === index;

        return (
          <Link
            key={service.id}
            to={service.enquireLink}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onTouchStart={() => setHovered(index)}
            className={`relative overflow-hidden group border-b md:border-b-0 md:border-r border-zinc-800 last:border-r-0 last:border-b-0 basis-[22.5%] md:basis-1/5 shrink-0 grow-0 card-entertainment card-entertainment-fx ${glowClass} ${entranceClass}`}
            data-aos={direction}
            data-aos-duration="420"
            data-aos-delay={35 + index * 35}
            data-accent={isHovered ? 'true' : undefined}
            style={{
              flex: hovered === null ? 1 : hovered === index ? 1.5 : 0.83,
              transition: 'flex 0.5s cubic-bezier(.2,.9,.2,1)',
              '--accent-color': cardAccentMap[service.title] || 'rgba(255,255,255,0.55)',
              '--card-delay': `${index * 0.08}s`,
            }}
          >
            <span className="card-spark" />
            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/55 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute inset-x-6 bottom-4 sm:bottom-6 z-10 text-center">
              <h2 className="card-title text-white text-base sm:text-lg md:text-xl lg:text-2xl uppercase tracking-[0.24em] drop-shadow-[0_12px_48px_rgba(0,0,0,0.35)]" style={{ color: '#ffffff', transform: isHovered ? 'translateY(-12px) skewX(-0.01turn)' : 'translateY(0)', transition: 'transform 0.35s ease, color 0.35s ease' }}>
                {service.title.toUpperCase()}
              </h2>
            </div>
          </Link>
        );
      }) : (
        [...Array(4)].map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden border-b md:border-b-0 md:border-r border-zinc-800 last:border-r-0 last:border-b-0 basis-[22.5%] md:basis-1/5 shrink-0 grow-0 skeleton-card"
            style={{ flex: 1, transition: 'flex 0.6s cubic-bezier(.2,.9,.2,1)', '--delay': `${index * 0.14}s` }}
          >
            <div className="absolute inset-0 bg-zinc-950" />
            <div className="absolute inset-0 skeleton-shimmer" />
            <div className="absolute inset-0 skeleton-grid" />
            <div className="absolute inset-0 skeleton-scan" />
            <div className="absolute inset-0 skeleton-glow" />
            <div className="absolute inset-0 skeleton-mask" />
            <div className="absolute inset-x-8 top-16 h-0.5 rounded-full skeleton-bar skeleton-bar-one" />
            <div className="absolute inset-x-16 top-28 h-0.5 rounded-full skeleton-bar skeleton-bar-two" />
            <div className="absolute inset-x-20 top-42 h-0.5 rounded-full skeleton-bar skeleton-bar-three" />
            <div className="absolute bottom-8 left-6 right-6 z-10">
              <div className="h-4 w-24 rounded-full bg-zinc-700 skeleton-pulse mb-3" />
              <div className="h-8 w-32 rounded-full bg-zinc-700 skeleton-pulse" />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;