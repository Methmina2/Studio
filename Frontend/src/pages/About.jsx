import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { portraitItems as fallbackCrew } from '../data/portraitData';
import { FaTimes } from 'react-icons/fa';

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

const buildImageUrl = (image) => {
  if (!image) return '';
  if (/^https?:\/\//i.test(image)) return image;
  const normalizedImage = image.startsWith('/') ? image : `/${image}`;
  const isBackendUpload = normalizedImage.startsWith('/uploads/');
  if (!isBackendUpload) {
    return normalizedImage;
  }
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');
  return `${baseUrl}${normalizedImage}`;
};

const About = () => {
  const [portraitItems, setPortraitItems] = useState(fallbackCrew);
  const [loading, setLoading] = useState(true);
  const owner = portraitItems.find(item => item.featured || item.id === 4);
  const others = portraitItems.filter(item => !(item.featured || item.id === 4));
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        const res = await api.get('/crew');
        setPortraitItems(res.data.data?.length ? res.data.data : fallbackCrew);
      } catch (err) {
        console.error('Failed to fetch crew members', err);
        setPortraitItems(fallbackCrew);
      } finally {
        setLoading(false);
      }
    };

    fetchCrew();
  }, []);

  const handleCardClick = (member) => {
    if (isMobile) {
      setSelectedMember(member);
    }
  };

  const closeModal = () => setSelectedMember(null);

  return (
    <>
      <div className="bg-absolute-black py-20 px-4 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">About Us</h1>
          <div className="w-20 h-1 bg-[#de660e] mx-auto mt-4 mb-8"></div>
          <p className="font-sans text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
            We are a boutique photography studio dedicated to capturing life's most precious moments with artistry and passion.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-studio-surface p-6 rounded-lg border border-zinc-800 hover:border-[#de660e]/30 transition-all hover:shadow-lg hover:shadow-[#de660e]/5">
              <h3 className="font-serif text-2xl text-[#de660e]">10+</h3>
              <p className="text-zinc-400 text-sm mt-2">Years of Excellence</p>
            </div>
            <div className="bg-studio-surface p-6 rounded-lg border border-zinc-800 hover:border-[#de660e]/30 transition-all hover:shadow-lg hover:shadow-[#de660e]/5">
              <h3 className="font-serif text-2xl text-[#de660e]">500+</h3>
              <p className="text-zinc-400 text-sm mt-2">Happy Clients</p>
            </div>
            <div className="bg-studio-surface p-6 rounded-lg border border-zinc-800 hover:border-[#de660e]/30 transition-all hover:shadow-lg hover:shadow-[#de660e]/5">
              <h3 className="font-serif text-2xl text-[#de660e]">100+</h3>
              <p className="text-zinc-400 text-sm mt-2">Awards Won</p>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="max-w-6xl mx-auto mt-20 w-full">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Meet the Team
          </h2>

          {loading ? (
            <div className="text-center text-zinc-400">Loading crew...</div>
          ) : portraitItems.length === 0 ? (
            <div className="text-center text-zinc-400">No crew members available yet.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {/* Featured member (Takes 2 columns by 2 rows) */}
            {owner && (
              <div
                key={owner._id || owner.id}
                className="col-span-2 row-span-2 relative group overflow-hidden rounded-xl shadow-xl border-2 border-[#de660e]/40 hover:border-[#de660e] transition-all duration-500 hover:scale-[1.01] z-10 cursor-pointer"
                onClick={() => handleCardClick(owner)}
              >
                <img
                  src={buildImageUrl(owner.image)}
                  alt={owner.name}
                  className="w-full h-full object-cover aspect-[4/3] sm:aspect-[3/4]"
                  loading="lazy"
                />
                {/* Overlay – visible on hover (desktop) only */}
                <div className="hidden md:flex absolute inset-0 flex-col justify-end p-4 md:p-6 lg:p-8 text-left
                                bg-gradient-to-t from-black/95 via-black/80 to-transparent
                                opacity-0 group-hover:opacity-100
                                transition-all duration-300
                                translate-y-4 group-hover:translate-y-0">
                  <span className="inline-block bg-[#de660e] text-black text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-2">
                    Founder & CEO
                  </span>
                  <h3 className="text-white font-serif text-xl sm:text-2xl md:text-3xl">{owner.name}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">{owner.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                    {owner.specialties.map((spec, idx) => (
                      <span key={idx} className="text-[8px] sm:text-[10px] text-[#de660e] border border-[#de660e]/30 bg-black/50 px-2 sm:px-3 py-1 rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. The rest of the team (1 slot each) */}
            {others.map((item) => (
              <div
                key={item._id || item.id}
                className="relative group overflow-hidden rounded-lg shadow-lg border border-zinc-800 hover:border-[#de660e]/30 transition-all duration-500 hover:scale-[1.03] hover:shadow-xl cursor-pointer"
                data-aos="fade-up"
                data-aos-duration="300"
                data-aos-delay={((item._id || item.id).toString().length % 10) * 30}
                onClick={() => handleCardClick(item)}
              >
                <img
                  src={buildImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover aspect-square"
                  loading="lazy"
                />

                {/* Overlay – visible on hover (desktop) only */}
                <div className="hidden md:flex absolute inset-0 flex-col justify-end p-3 sm:p-4 text-center
                                bg-gradient-to-t from-black/95 via-black/80 to-transparent
                                opacity-0 group-hover:opacity-100
                                transition-all duration-300
                                translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-white font-serif text-sm sm:text-md font-bold leading-tight">{item.name}</h3>
                  <p className="text-[#de660e] text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5">{item.role}</p>
                  <p className="text-gray-300 text-[10px] sm:text-xs mt-1 leading-tight line-clamp-2">{item.bio}</p>
                  {item.specialties && (
                    <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                      {item.specialties.slice(0, 2).map((spec, idx) => (
                        <span key={idx} className="text-[6px] sm:text-[8px] text-gray-400 border border-zinc-700/50 bg-black/50 px-1.5 sm:px-2 py-0.5 rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Mobile Modal – appears when a member is tapped on mobile */}
      {isMobile && selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-studio-surface rounded-xl border border-zinc-800 max-w-sm w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-xl font-bold text-white">{selectedMember.name}</h3>
              <button
                onClick={closeModal}
                className="text-zinc-400 hover:text-white transition"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="aspect-square w-full rounded-lg overflow-hidden mb-4 border border-zinc-800">
              <img
                src={buildImageUrl(selectedMember.image)}
                alt={selectedMember.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[#de660e] text-xs uppercase tracking-widest font-medium mb-1">{selectedMember.role}</p>
            <p className="text-zinc-300 text-sm leading-relaxed mb-3">{selectedMember.bio}</p>
            {selectedMember.specialties && (
              <div className="flex flex-wrap gap-2">
                {selectedMember.specialties.map((spec, idx) => (
                  <span key={idx} className="text-[10px] text-[#de660e] border border-[#de660e]/30 bg-black/50 px-2 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default About;
