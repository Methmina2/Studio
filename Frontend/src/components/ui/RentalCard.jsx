import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

const buildImageUrl = (image) => {
  if (!image) return '';
  if (/^https?:\/\//i.test(image)) return image;
  const normalizedImage = image.startsWith('/') ? image : `/${image}`;
  const isBackendUpload = normalizedImage.startsWith('/uploads/');
  if (!isBackendUpload) return encodeURI(normalizedImage);
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');
  return `${baseUrl}${encodeURI(normalizedImage)}`;
};

const RentalCard = ({ 
  id, name, category, image, pricePerDay, 
  description, specs, available, 
  isSelected, onToggleSelect 
}) => {
  const primaryColor = '#de660e';
  const formattedPrice = pricePerDay.toLocaleString('en-US');

  return (
    <div className="group bg-studio-surface rounded-xl border border-zinc-900 hover:border-zinc-700 transition-all duration-500 flex flex-col h-full overflow-hidden mx-auto max-w-md sm:max-w-none">
      <div className="relative h-40 sm:h-52 md:h-56 overflow-hidden flex-shrink-0 bg-zinc-800">
        <img
          src={buildImageUrl(image)}
          alt={name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
        <span
          className="absolute top-4 left-4 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 shadow-lg"
          style={{ backgroundColor: primaryColor, borderRadius: 0 }}
        >
          {category}
        </span>
        <span className="absolute bottom-4 right-4 text-white font-bold text-sm drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          LKR {formattedPrice}/day
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider mb-1 line-clamp-2">
          {name}
        </h3>
        <p className="font-sans text-sm text-zinc-400 leading-relaxed flex-1 line-clamp-3">
          {description}
        </p>
        <ul className="mt-3 space-y-1 font-sans text-xs text-zinc-500">
          {specs.slice(0, 3).map((spec, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-[#de660e] font-bold">•</span>
              {spec}
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
          <span className={`text-xs font-medium ${available ? 'text-emerald-400' : 'text-red-400'}`}>
            {available ? (
              <span className="flex items-center gap-1"><FaCheckCircle className="w-3 h-3" /> Available</span>
            ) : (
              <span className="flex items-center gap-1"><FaClock className="w-3 h-3" /> On request</span>
            )}
          </span>
          <button
            onClick={() => onToggleSelect(id)}
            className={`flex items-center gap-1.5 text-sm font-bold transition-colors px-3 py-1.5 rounded-full ${
              isSelected
                ? 'bg-[#de660e] text-black hover:bg-[#ff7f2c]'
                : 'border border-[#de660e] text-[#de660e] hover:bg-[#de660e] hover:text-black'
            }`}
          >
            {isSelected ? (
              <>
                <FaTimes className="w-3 h-3" /> Deselect
              </>
            ) : (
              <>
                <FaPlus className="w-3 h-3" /> Select
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
