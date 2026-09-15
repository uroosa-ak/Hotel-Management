import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BrandLogo - LuxuryStay Hospitality Logo Component
 * 
 * @param {Object} props
 * @param {'light' | 'dark' | 'gold'} [props.variant='light'] - Theme variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Component size
 * @param {boolean} [props.clickable=true] - Wrap in link to home
 * @param {string} [props.className=''] - Additional CSS classes
 */
const BrandLogo = ({ variant = 'light', size = 'md', clickable = true, className = '' }) => {
  // Dimensions based on size
  const iconSizes = { sm: 24, md: 32, lg: 44 };
  const textTitleSizes = { sm: 'text-base', md: 'text-lg sm:text-xl', lg: 'text-2xl sm:text-3xl' };
  const textSub = { sm: 'text-[9px]', md: 'text-[10px]', lg: 'text-[12px]' };

  const isDarkBg = variant === 'dark'; // Dark header/sidebar
  const isGold = variant === 'gold';

  const textColor = isDarkBg ? 'text-white' : isGold ? 'text-amber-800' : 'text-slate-900';
  const tagColor = isDarkBg ? 'text-amber-400' : 'text-amber-600';
  const badgeBg = isDarkBg
    ? 'bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-700/30 border-amber-500/40'
    : 'bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-300';

  const content = (
    <div className={`flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* Luxury Crown & Crest Emblem */}
      <div
        className={`p-2 rounded-xl border shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400/60 flex items-center justify-center ${badgeBg}`}
        style={{ width: iconSizes[size] + 12, height: iconSizes[size] + 12 }}
      >
        <svg
          width={iconSizes[size]}
          height={iconSizes[size]}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 4L28.5 14.5L39 12L34 21.5L43 27L32 30.5L34 42L24 35.5L14 42L16 30.5L5 27L14 21.5L9 12L19.5 14.5L24 4Z"
            fill="url(#goldGradient)"
            stroke="#b48238"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M24 13L26.2 18.5L32 17.2L29.2 22.2L34 25L28.5 27L29.5 33L24 29.5L18.5 33L19.5 27L14 25L18.8 22.2L16 17.2L21.8 18.5L24 13Z"
            fill="#FFF8E7"
            opacity="0.85"
          />
          <defs>
            <linearGradient id="goldGradient" x1="5" y1="4" x2="43" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5D77F" />
              <stop offset="0.4" stopColor="#D4AF37" />
              <stop offset="0.75" stopColor="#AA771C" />
              <stop offset="1" stopColor="#8A5A00" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-extrabold tracking-wider uppercase leading-none ${textTitleSizes[size]} ${textColor}`}
          style={{ letterSpacing: '0.08em' }}
        >
          LuxuryStay
        </span>
        <span
          className={`font-sans font-semibold tracking-widest uppercase mt-1 leading-none ${textSub[size]} ${tagColor}`}
          style={{ letterSpacing: '0.22em' }}
        >
          Hospitality
        </span>
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-block text-decoration-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
