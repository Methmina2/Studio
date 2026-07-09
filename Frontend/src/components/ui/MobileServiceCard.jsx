import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapPin, FaClock, FaUsers } from 'react-icons/fa';

const MobileServiceCard = ({
  title,
  image,
  titleImage,
  badge,
  price,
  location,
  rating,
  description,
  bullets,
  icons,
  ctaText,
  ctaLink,
  primaryColor,
  gradientBar,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(!!image);
  const [imageError, setImageError] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    console.warn(`Failed to load image: ${image}`);
  };

  return (
    <Link
      to={ctaLink}
      className="block group bg-studio-surface rounded-xl border border-zinc-900 hover:border-zinc-700 transition-all duration-500 flex flex-col h-full overflow-hidden"
    >
      {/* Image Header – compact height */}
      <div className="relative h-40 overflow-hidden bg-zinc-900">
        {image && !imageError ? (
          <img
            src={image}
            alt={title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-500">
            <span className="text-xs">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-50 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: gradientBar }}
        ></div>

        {badge && (
          <span
            className="absolute top-2 left-2 text-white font-sans text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5 shadow-lg"
            style={{ backgroundColor: primaryColor, borderRadius: 0 }}
          >
            {badge}
          </span>
        )}

        {price && (
          <span className="absolute bottom-2 right-2 text-white font-sans font-bold text-[10px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
            {price}
          </span>
        )}
      </div>

      {/* Content – compact text */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-1">
          {titleImage ? (
            <img
              src={titleImage}
              alt={title}
              className="h-6 sm:h-8 object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider leading-tight">
              {title}
            </h3>
          )}
          {rating && (
            <span className="font-sans text-[10px] text-zinc-400 flex items-center gap-0.5 whitespace-nowrap">
              <span className="text-[#de660e]">★</span> {rating}
            </span>
          )}
        </div>

        {location && (
          <div className="flex items-center gap-1 font-sans text-[10px] text-zinc-500 mt-0.5">
            <FaMapPin style={{ color: primaryColor }} className="w-2 h-2" />
            {location}
          </div>
        )}

        <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Bullets – hidden on mobile for space */}
        {bullets && bullets.length > 0 && (
          <ul className="hidden mt-2 space-y-1 font-sans text-[10px] text-zinc-500">
            {bullets.slice(0, 2).map((bullet, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="font-bold text-base" style={{ color: primaryColor }}>•</span>
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {/* Icons – hidden on mobile */}
        {icons && icons.length > 0 && (
          <div className="hidden gap-3 font-sans text-[10px] text-zinc-500 mt-3 mb-1">
            {icons.map(({ icon, label }, idx) => {
              let IconComponent = null;
              if (icon === 'FaClock') IconComponent = FaClock;
              else if (icon === 'FaUsers') IconComponent = FaUsers;
              return IconComponent ? (
                <span key={idx} className="flex items-center gap-1">
                  <IconComponent style={{ color: primaryColor }} className="w-3 h-3" />
                  {label}
                </span>
              ) : null;
            })}
          </div>
        )}

        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 group-hover:text-[#de660e] transition-colors duration-300">
          {ctaText || 'Explore'} →
        </span>
      </div>
    </Link>
  );
};

export default MobileServiceCard;
