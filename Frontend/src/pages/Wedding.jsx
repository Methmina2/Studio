import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { weddingItems } from '../data/weddingData';

const Wedding = () => {
  const allImages = weddingItems.map(item => item.image);

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 bg-absolute-black min-h-screen">
        <div className="watermark display-font">WEDDING</div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h1
                className="font-serif text-4xl md:text-5xl font-bold text-white mb-4"
                data-aos="fade-up"
                data-aos-duration="300"
              >
                Wedding Gallery
              </h1>
              <div className="w-24 h-1" style={{ background: 'linear-gradient(90deg, var(--accent-wedding), rgba(130,230,73,0.6))' }}></div>
            </div>
            <Link
              to="/booking?service=Hotmello Weddings"
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
            A curated collection of timeless moments, captured with artistry and emotion.
          </p>

          {/* Masonry collage using CSS columns */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {allImages.map((img, index) => (
              <div
                key={index}
                className="break-inside-avoid overflow-hidden rounded-xl shadow-lg reveal-card gallery-card-hover"
                data-aos="fade-up"
                data-aos-duration="300"
                data-aos-delay={(index % 12) * 30}
                data-aos-offset="0"
                style={{ animationDelay: `${(index % 12) * 0.1}s`, ['--glow']: 'rgba(130,230,73,0.10)' }}
              >
                <img
                  src={img}
                  alt={`Wedding ${index + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wedding;
