import React from 'react';

const GalleryCard = ({ image, alt, category, albumLink }) => {
  // category is used as the title on the overlay
  const displayTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="gallery-card">
      <div className="card-image">
        <img
          src={image}
          alt={alt || displayTitle}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder-production.jpg';
            e.target.onerror = null;
          }}
        />
        {/* Overlay on hover */}
        <div className="card-overlay">
          <span className="eyebrow">Event Gallery</span>
          <h3 className="title">{displayTitle}</h3>
          <span className="pill">View Album →</span>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;