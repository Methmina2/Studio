import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

// Dynamically import all images from public/StudioLabs/
const imageModules = import.meta.glob('/public/StudioLabs/**/*.{jpg,jpeg,png,webp}', { eager: true });
const allImages = Object.values(imageModules).map(mod => mod.default || mod);
const slides = allImages.map(src => ({ src }));

const StudioLabs = () => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsOpen(true);
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse break-inside-avoid">
      <div className="bg-zinc-800 rounded-xl aspect-[4/3] w-full"></div>
    </div>
  );

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 bg-absolute-black min-h-screen">
        <div className="watermark display-font">STUDIO</div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h1
                className="font-serif text-4xl md:text-5xl font-bold text-white mb-4"
                data-aos="fade-up"
                data-aos-duration="300"
              >
                Studio Labs
              </h1>
              <div className="w-20 h-1" style={{ background: 'linear-gradient(90deg, var(--accent-studio), rgba(179,102,179,0.6))' }}></div>
            </div>
            <Link
              to="/booking?service=Hotmello Lab"
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
            Explore our fully equipped studio – a versatile space for productions, portraits, and creative projects.
          </p>

          {loading ? (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {allImages.map((img, index) => (
                  <div
                    key={index}
                    className="break-inside-avoid overflow-hidden rounded-xl shadow-lg reveal-card gallery-card-hover cursor-pointer group"
                    data-aos="fade-up"
                    data-aos-duration="400"
                    data-aos-delay={50 + (index % 12) * 30}
                    data-aos-offset="0"
                    onClick={() => openLightbox(index)}
                    style={{ animationDelay: `${(index % 12) * 0.1}s`, ['--glow']: 'rgba(128,0,128,0.12)' }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={img}
                        alt={`Studio shot ${index + 1}`}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-white text-xs uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
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

export default StudioLabs;
