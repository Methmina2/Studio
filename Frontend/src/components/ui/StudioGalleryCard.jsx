import React from 'react';

const StudioGalleryCard = ({ image, alt }) => {
  return (
    <div className="group bg-studio-surface rounded-xl border border-zinc-900 hover:border-zinc-700 transition-all duration-500 overflow-hidden aspect-[4/3] relative bg-zinc-900">
      <img
        src={image}
        alt={alt || 'Studio image'}
        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/images/placeholder-studio.jpg';
          e.target.onerror = null;
        }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
    </div>
  );
};

export default StudioGalleryCard;