import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapPin, FaClock, FaUsers } from 'react-icons/fa';

const ServiceCard = ({
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
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    console.log(`DesktopServiceCard ${title}: image="${image}"`);
  }, [image, title]);

  const handleImageLoad = () => {
    console.log(`Image loaded: ${image}`);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.error(`Failed to load image: ${image}`, e);
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <Link
      to={ctaLink}
      className="block group bg-studio-surface rounded-xl border border-zinc-900 hover:border-zinc-700 transition-all duration-500 flex flex-col h-full overflow-hidden"
    >
      {/* Image Header – smaller height on mobile */}
      <div className="relative h-36 sm:h-48 md:h-56 lg:h-64 xl:h-80 overflow-hidden bg-zinc-900">
        {image ? (
          <img
            src={image}
            alt={title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-500">
            <span className="text-sm">No image URL</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
        {/* Gradient Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5 opacity-50 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: gradientBar }}
        ></div>

        {/* Badge */}
        {badge && (
          <span
            className="absolute top-2 left-2 sm:top-3 sm:left-3 text-white font-sans text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 shadow-lg"
            style={{ backgroundColor: primaryColor, borderRadius: 0 }}
          >
            {badge}
          </span>
        )}

        {/* Price */}
        {price && (
          <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-white font-sans font-bold text-[10px] sm:text-xs md:text-sm drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
            {price}
          </span>
        )}
      </div>

      {/* Content Area – smaller padding/fonts on mobile */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-1 sm:gap-2">
          {titleImage ? (
            <img
              src={titleImage}
              alt={title}
              className="h-8 sm:h-12 md:h-16 lg:h-20 object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <h3 className="font-serif text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider leading-tight">
              {title}
            </h3>
          )}
          {rating && (
            <span className="font-sans text-[10px] sm:text-xs md:text-sm text-zinc-400 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
              <span className="text-[#de660e]">★</span> {rating}
            </span>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1 font-sans text-[10px] sm:text-xs md:text-sm text-zinc-500 mt-0.5 sm:mt-1">
            <FaMapPin style={{ color: primaryColor }} className="w-2 h-2 sm:w-3 sm:h-3" />
            {location}
          </div>
        )}

        {/* Description – hidden on very small screens, shown on larger */}
        <p className="hidden sm:block mt-2 text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed flex-1">
          {description}
        </p>

        {/* Bullets – hidden on very small, shown on larger */}
        {bullets && bullets.length > 0 && (
          <ul className="hidden sm:block mt-2 space-y-1 font-sans text-[10px] sm:text-xs md:text-sm text-zinc-500">
            {bullets.slice(0, 2).map((bullet, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="font-bold text-base" style={{ color: primaryColor }}>•</span>
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {/* Icons – hidden on very small, shown on larger */}
        {icons && icons.length > 0 && (
          <div className="hidden sm:flex gap-3 font-sans text-[10px] sm:text-xs md:text-sm text-zinc-500 mt-3 mb-1">
            {icons.map(({ icon, label }, idx) => {
              let IconComponent = null;
              if (icon === 'FaClock') IconComponent = FaClock;
              else if (icon === 'FaUsers') IconComponent = FaUsers;
              return IconComponent ? (
                <span key={idx} className="flex items-center gap-1">
                  <IconComponent style={{ color: primaryColor }} className="w-3 h-3 sm:w-4 sm:h-4" />
                  {label}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* "Explore" link – always visible */}
        <span className="mt-2 sm:mt-3 md:mt-4 inline-flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium text-zinc-400 group-hover:text-[#de660e] transition-colors duration-300">
          {ctaText || 'Explore'} →
        </span>
      </div>
    </Link>
  );
};

export default ServiceCard;
