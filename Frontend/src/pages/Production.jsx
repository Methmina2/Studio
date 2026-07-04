import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { FaFacebook } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

// Dynamically import all images from public/production/ and subfolders
const imageModules = import.meta.glob('/public/production/**/*.{jpg,jpeg,png,webp}', { eager: true });

// Facebook album links mapped to category names (folder names)
const categoryLinks = {
  'back to school': 'https://web.facebook.com/media/set/?set=a.948524617682278&type=3',
  'dark elegance': 'https://web.facebook.com/media/set/?set=a.925906986610708&type=3',
  'dhurlabha': 'https://web.facebook.com/media/set/?set=a.920080443860029&type=3',
  'Hello Kandy': 'https://web.facebook.com/media/set/?set=a.1665452345141427&type=3',
  'Kopi pata fantazy': 'https://web.facebook.com/media/set/?set=a.919750147226392&type=3',
  'love ceylone': 'https://web.facebook.com/media/set/?set=a.916624734205600&type=3',
  'Relax 26': 'https://web.facebook.com/media/set/?set=a.943051944896212&type=3',
  'SLAF': 'https://web.facebook.com/media/set/?set=a.950564650811608&type=3',
  'subhavi': 'https://web.facebook.com/media/set/?set=a.942759114925495&type=3',
  'Thanthra 2.0': 'https://web.facebook.com/media/set/?set=a.933301882537885&type=3',
  'isibusara': 'https://web.facebook.com/media/set/?set=a.954695067065233&type=3',
  'Annual Prize giving convent': 'https://web.facebook.com/media/set/?set=a.854727830395291&type=3',
};

// Group images by their folder name, excluding background.jpg
const getImagesByCategory = () => {
  const grouped = {};
  Object.keys(imageModules).forEach((path) => {
    const fileName = path.split('/').pop();
    if (fileName.toLowerCase() === 'background.jpg') return;
    const parts = path.split('/');
    const folderIndex = parts.indexOf('production') + 1;
    const folderName = parts[folderIndex] || 'Uncategorized';
    if (!grouped[folderName]) grouped[folderName] = [];
    grouped[folderName].push(imageModules[path].default || imageModules[path]);
  });
  return grouped;
};

// Custom hook for media query
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);
  return matches;
};

const Production = () => {
  const groupedImages = getImagesByCategory();
  const allImages = Object.values(groupedImages).flat();
  const slides = allImages.map(src => ({ src }));

  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const openLightbox = (index) => {
    const flatIndex = allImages.indexOf(index);
    setLightboxIndex(flatIndex);
    setIsOpen(true);
  };

  const categoryOrder = [
    'Hello Kandy',
    'dark elegance',
    'dhurlabha',
    'back to school',
    'Kopi pata fantazy',
    'love ceylone',
    'Relax 26',
    'SLAF',
    'subhavi',
    'Thanthra 2.0',
    'isibusara',
    'Annual Prize giving convent',
  ];

  const sortedCategories = Object.keys(groupedImages).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="bg-zinc-800 rounded-xl aspect-[4/3] w-full"></div>
    </div>
  );

  return (
    <Layout>
      <div className="relative pt-24 pb-16 px-4 bg-absolute-black min-h-screen">
        <div className="watermark display-font">PRODUCTION</div>
        
        {/* UPDATED: Increased opacity to 50% and 30% for a proper visible glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100vw] h-[80vh] bg-[#de660e]/50 blur-[140px] rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-[60vw] h-[60vh] bg-[#de660e]/30 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(222,102,14,0.15),transparent_55%)]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h1
                className="font-serif text-4xl md:text-5xl font-bold text-white mb-4"
                data-aos="fade-up"
                data-aos-duration="300"
              >
                Production Gallery
              </h1>
              <div className="w-24 h-1" style={{ background: 'linear-gradient(90deg, var(--accent-production), #ff7f2c)' }}></div>
            </div>
            <Link
              to="/booking?service=Production"
              className="px-6 py-3 bg-[#de660e] text-black font-semibold rounded-full hover:bg-[#ff7f2c] transition whitespace-nowrap btn-pulse"
            >
              Book Now
            </Link>
          </div>
          <p
            className="font-sans text-zinc-400 text-center max-w-2xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="50"
          >
            A curated collection of our creative productions, each event captured with artistry and precision.
          </p>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : isMobile ? (
            // MOBILE: Category-based collage
            sortedCategories.map((category, idx) => {
              const images = groupedImages[category];
              const albumLink = categoryLinks[category];
              return (
                <div key={category} className="mb-16">
                  <div
                    className="flex items-center gap-4 mb-6 flex-wrap"
                    data-aos="fade-right"
                    data-aos-duration="250"
                    data-aos-delay={idx * 20}
                  >
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                      {category}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#de660e]/50 to-transparent"></div>
                    <span className="text-sm text-zinc-500 font-sans">
                      {images.length} photos
                    </span>
                    {albumLink && (
                      <a
                        href={albumLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-[#de660e] hover:text-white transition-colors duration-300 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-[#de660e]/20 hover:border-[#de660e]/50"
                      >
                        <FaFacebook className="w-3.5 h-3.5" />
                        View Album
                      </a>
                    )}
                  </div>
                  <div className="columns-2 sm:columns-3 gap-4 space-y-4">
                    {images.map((img, imgIndex) => {
                      const globalIndex = allImages.indexOf(img);
                      return (
                        <div
                                  key={imgIndex}
                                  className="break-inside-avoid overflow-hidden rounded-xl shadow-lg reveal-card gallery-card-hover cursor-pointer"
                                  data-aos="fade-up"
                                  data-aos-duration="300"
                                  data-aos-delay={(imgIndex % 12) * 30}
                                  data-aos-offset="0"
                                  onClick={() => openLightbox(globalIndex)}
                                  style={{ animationDelay: `${(imgIndex % 12) * 0.1}s`, ['--glow']: 'rgba(222,102,14,0.12)' }}
                        >
                          <img
                            src={img}
                            alt={`${category} ${imgIndex + 1}`}
                            className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            // DESKTOP: Original featured + 2 stacked + grid
            sortedCategories.map((category, idx) => {
              const images = groupedImages[category];
              const featured = images[0];
              const stacked = images.slice(1, 3);
              const gridImages = images.slice(3);
              const albumLink = categoryLinks[category];

              return (
                <div key={category} className="mb-16">
                  <div
                    className="flex items-center gap-4 mb-6 flex-wrap"
                    data-aos="fade-right"
                    data-aos-duration="250"
                    data-aos-delay={idx * 20}
                  >
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                      {category}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#de660e]/50 to-transparent"></div>
                    <span className="text-sm text-zinc-500 font-sans">
                      {images.length} photos
                    </span>
                    {albumLink && (
                      <a
                        href={albumLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-[#de660e] hover:text-white transition-colors duration-300 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-[#de660e]/20 hover:border-[#de660e]/50"
                      >
                        <FaFacebook className="w-3.5 h-3.5" />
                        View Album
                      </a>
                    )}
                  </div>

                  {/* Featured + 2 stacked */}
                  {featured && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                      <div
                        className="lg:col-span-2 cursor-pointer"
                        data-aos="fade-right"
                        data-aos-duration="300"
                        onClick={() => openLightbox(allImages.indexOf(featured))}
                      >
                          <div className="relative overflow-hidden rounded-xl shadow-lg reveal-card gallery-card-hover hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]" style={{ animationDelay: `${(idx % 6) * 0.1}s`, ['--glow']: 'rgba(222,102,14,0.12)' }} onClick={() => openLightbox(allImages.indexOf(featured))}>
                            <img
                              src={featured}
                              alt={`Featured ${category}`}
                              className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                          </div>
                      </div>
                      <div className="grid grid-rows-2 gap-4" data-aos="fade-left" data-aos-duration="300">
                        {stacked.map((img, idx) => (
                          <div
                            key={idx}
                            className="cursor-pointer break-inside-avoid"
                            onClick={() => openLightbox(allImages.indexOf(img))}
                          >
                            <div className="relative overflow-hidden rounded-xl shadow-lg reveal-card gallery-card-hover transition-all duration-500 hover:scale-[1.02]" style={{ animationDelay: `${(idx % 6) * 0.1}s`, ['--glow']: 'rgba(222,102,14,0.12)' }}>
                              <img
                                src={img}
                                alt={`Stacked ${idx + 1}`}
                                className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        ))}
                        {stacked.length === 1 && (
                          <div className="bg-studio-surface rounded-xl border border-zinc-900 flex items-center justify-center text-zinc-500 text-sm aspect-[4/3]">
                            + more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Grid of remaining images */}
                  {gridImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {gridImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="cursor-pointer"
                          data-aos="fade-up"
                          data-aos-duration="250"
                          data-aos-delay={(idx % 8) * 50}
                          onClick={() => openLightbox(allImages.indexOf(img))}
                        >
                          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                            <img
                              src={img}
                              alt={`Grid ${idx + 1}`}
                              className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={lightboxIndex}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
        }}
        carousel={{ finite: false }}
        controller={{ closeOnBackdropClick: true }}
      />
    </Layout>
  );
};

export default Production;