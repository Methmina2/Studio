import React, { useState, useEffect } from 'react';
import { servicesData, categoryColors } from '../../data/serviceData.js';
import { rentalItems } from '../../data/rentalData.js';
import DesktopServiceCard from '../ui/DesktopServiceCard';
import MobileServiceCard from '../ui/MobileServiceCard';
import api from '../../services/api';
import { buildImageUrl } from '../../utils/buildImageUrl';

const defaultServiceMetadata = {
  wedding: {
    colorKey: 'weddings',
    image: '/images/wedding.png',
    badge: 'Most Requested',
    title: 'Hotmello Weddings',
    locationText: 'On-site & Studio',
    rating: '5.0 (124)',
    enquireLink: '/wedding',
    description: 'Capture every laugh, tear, and dance floor moment with our signature storytelling approach.',
    bullets: ['Unlimited coverage', 'Print rights included', 'Personalized album design'],
    price: 'From $1,200',
  },
  production: {
    colorKey: 'events',
    image: '/images/event.png',
    badge: 'Corporate & Social',
    title: 'Hotmello Productions',
    locationText: 'On-site',
    rating: '4.9 (87)',
    enquireLink: '/production',
    description: 'Professional coverage for conferences, galas, and private celebrations with a candid eye.',
    bullets: ['4-hour coverage', 'Digital gallery', 'Same-day previews'],
    price: 'From $800',
  },
  rentals: {
    colorKey: 'rentals',
    image: '/images/rental-camara.png',
    badge: 'Pro-Grade Gear',
    title: 'Hotmello Rental',
    locationText: 'Studio Pickup',
    rating: '4.8 (43)',
    enquireLink: '/rentals',
    description: 'Access top-tier Sony, Canon, and Leica bodies and lenses for your personal projects.',
    bullets: ['Latest models', 'Cleaning & inspection', 'Free support'],
    price: 'From $150/day',
  },
  studiolabs: {
    colorKey: 'studio',
    image: '/images/studio.png',
    badge: 'Fully Equipped',
    title: 'Hotmello Lab',
    locationText: 'In-studio',
    rating: '4.9 (62)',
    enquireLink: '/studiolabs',
    description: 'Our spacious studio features professional lighting, backdrops, and a creative atmosphere.',
    bullets: ['Cyclorama wall', 'Lighting kit included', 'Props available'],
    price: 'From $200/hr',
  },
};

const ServicesGrid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Add timestamp to bust cache and ensure fresh data
      const res = await api.get('/services', { params: { t: Date.now() } });
      const serviceData = Array.isArray(res.data?.data) ? res.data.data : [];
      if (serviceData.length > 0) {
        const mappedServices = serviceData.map((service) => {
          const defaults = defaultServiceMetadata[service.type] || {};
          const imageUrl = service.imageUrls?.[0] ? buildImageUrl(service.imageUrls[0]) : defaults.image || service.image || '';
          console.log(`Service ${service.type}: image = ${imageUrl}`);
          return {
            id: service._id || service.type || service.title,
            title: service.title || defaults.title || 'Service',
            image: imageUrl,
            badge: defaults.badge || service.badge || '',
            price: service.price || defaults.price || '',
            locationText: defaults.locationText || service.locationText || '',
            rating: defaults.rating || service.rating || '',
            description: service.description || defaults.description || '',
            bullets: service.details?.bullets || service.bullets || defaults.bullets || [],
            icons: service.icons || [],
            enquireLink: defaults.enquireLink || service.enquireLink || '/',
            colorKey: defaults.colorKey || service.colorKey || '',
          };
        });
        setServices(mappedServices);
      }
    } catch (error) {
      console.error('Failed to fetch services for ServicesGrid', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();

    // Refetch services when the page becomes visible (user returns from another tab/page)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchServices();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const minRentalPrice = Math.min(...rentalItems.map(item => item.pricePerDay));
  const minPriceFormatted = minRentalPrice.toLocaleString('en-US');

  // Sort services in the desired order: production (events), wedding (weddings), rentals, studiolabs (studio)
  const serviceOrder = ['events', 'weddings', 'rentals', 'studio'];
  const sortedCards = services.length > 0 
    ? [...services].sort((a, b) => {
        const aIndex = serviceOrder.indexOf(a.colorKey || '');
        const bIndex = serviceOrder.indexOf(b.colorKey || '');
        return aIndex - bIndex;
      })
    : servicesData;

  return (
    <section className="pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-16 md:pb-24 px-3 sm:px-4 bg-absolute-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ===== DESKTOP (md and up) – 2×2 grid ===== */}
        <div className="hidden md:grid grid-cols-2 gap-4 md:gap-6">
          {sortedCards.map((service) => {
            const colors = categoryColors[service.colorKey];
            if (!colors) return null;
            let price = service.price;
            if (service.colorKey === 'rentals') {
              price = `LKR ${minPriceFormatted} onwards`;
            }
            return (
              <DesktopServiceCard
                key={service.id}
                title={service.title}
                image={service.image}
                badge={service.badge}
                price={price}
                location={service.locationText}
                rating={service.rating}
                description={service.description}
                bullets={service.bullets}
                icons={service.icons}
                ctaText="Explore"
                ctaLink={service.enquireLink}
                primaryColor={colors.primary}
                secondaryColor={colors.secondary}
                gradientBar={`linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`}
              />
            );
          })}
        </div>

        {/* ===== MOBILE (below md) – also 2×2 grid ===== */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {sortedCards.map((service) => {
            const colors = categoryColors[service.colorKey];
            if (!colors) return null;
            let price = service.price;
            if (service.colorKey === 'rentals') {
              price = `LKR ${minPriceFormatted} onwards`;
            }
            return (
              <MobileServiceCard
                key={service.id}
                title={service.title}
                image={service.image}
                badge={service.badge}
                price={price}
                location={service.locationText}
                rating={service.rating}
                description={service.description}
                bullets={service.bullets}
                icons={service.icons}
                ctaText="Explore"
                ctaLink={service.enquireLink}
                primaryColor={colors.primary}
                secondaryColor={colors.secondary}
                gradientBar={`linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;