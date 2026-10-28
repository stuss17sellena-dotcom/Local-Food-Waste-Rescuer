import React from 'react';
import { DonationListing } from '../data/rescueData';

interface BatchThumbnailProps {
  type: DonationListing['illustrationType'];
  className?: string;
}

export const BatchThumbnail: React.FC<BatchThumbnailProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'sourdough':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FEF3C7] via-[#FDE68A] to-[#F59E0B]/30 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Artisan sourdough loaves in crate">
            <rect width="120" height="120" fill="url(#warmBakery)" />
            {/* Linen Basket Base */}
            <rect x="16" y="66" width="88" height="36" rx="8" fill="#92400E" />
            <rect x="20" y="62" width="80" height="10" rx="4" fill="#FEF3C7" />
            {/* Sourdough Boule Left */}
            <ellipse cx="46" cy="54" rx="24" ry="18" fill="#D97706" />
            <ellipse cx="46" cy="52" rx="21" ry="14" fill="#B45309" />
            <path d="M35 48C40 43 52 43 57 48" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38 54C43 50 50 50 54 54" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
            {/* Baguette & Croissant Right */}
            <ellipse cx="76" cy="56" rx="20" ry="15" fill="#F59E0B" />
            <path d="M65 52C71 46 81 46 87 52" stroke="#FFFBEB" strokeWidth="2.5" strokeLinecap="round" />
            {/* Wheat Stalk Detail */}
            <path d="M24 84H96" stroke="#B45309" strokeWidth="2" strokeDasharray="6 4" />
            <defs>
              <linearGradient id="warmBakery" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFBEB" />
                <stop offset="1" stopColor="#FDE68A" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'heirloom_produce':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#DCFCE7] via-[#BBF7D0] to-[#86EFAC]/40 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fresh farm produce and heirloom tomatoes">
            <rect width="120" height="120" fill="url(#freshProduce)" />
            {/* Harvest Crate */}
            <rect x="18" y="68" width="84" height="34" rx="7" fill="#14532D" />
            <path d="M26 78H94M26 88H94" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
            {/* Leafy Greens */}
            <circle cx="42" cy="50" r="18" fill="#15803D" />
            <circle cx="56" cy="44" r="16" fill="#22C55E" />
            <path d="M42 62V42M42 50L48 45" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" />
            {/* Heirloom Tomatoes */}
            <circle cx="76" cy="56" r="15" fill="#DC2626" />
            <circle cx="64" cy="60" r="12" fill="#EA580C" />
            <path d="M73 41L76 45L79 41M76 39V45" stroke="#14532D" strokeWidth="2.2" strokeLinecap="round" />
            <defs>
              <linearGradient id="freshProduce" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F0FDF4" />
                <stop offset="1" stopColor="#BBF7D0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'prepared_trays':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#F1F5F9] via-[#E2E8F0] to-[#DCFCE7] flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Blast-chilled prepared catering trays">
            <rect width="120" height="120" fill="url(#cateringSurface)" />
            {/* Stainless Hotel Pan Bottom */}
            <rect x="18" y="56" width="84" height="40" rx="8" fill="#475569" />
            <rect x="14" y="50" width="92" height="9" rx="4.5" fill="#64748B" />
            {/* Upper Stacked Pan */}
            <rect x="24" y="30" width="72" height="22" rx="6" fill="#94A3B8" />
            <rect x="20" y="26" width="80" height="7" rx="3.5" fill="#CBD5E1" />
            {/* Herb Garnish & Temperature Seal */}
            <rect x="42" y="68" width="36" height="16" rx="4" fill="#DCFCE7" />
            <path d="M50 76H70" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="60" cy="41" r="5" fill="#15803D" />
            <defs>
              <linearGradient id="cateringSurface" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F8FAFC" />
                <stop offset="1" stopColor="#DCFCE7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'cultured_dairy':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#DCFCE7] flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chilled organic milk and cultured dairy">
            <rect width="120" height="120" fill="url(#coldDairy)" />
            {/* Milk Bottle 1 */}
            <path d="M36 42L40 30H52L56 42V92C56 95.3137 53.3137 98 50 98H42C38.6863 98 36 95.3137 36 92V42Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
            <rect x="38" y="26" width="16" height="6" rx="3" fill="#15803D" />
            <rect x="40" y="56" width="12" height="18" rx="2" fill="#DCFCE7" />
            {/* Yogurt Tub & Cultured Butter */}
            <rect x="62" y="54" width="34" height="44" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
            <rect x="60" y="50" width="38" height="7" rx="3.5" fill="#0F172A" />
            <rect x="68" y="66" width="22" height="14" rx="3" fill="#FEF3C7" />
            <defs>
              <linearGradient id="coldDairy" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F8FAFC" />
                <stop offset="1" stopColor="#E0F2FE" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'citrus_crates':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#DCFCE7] flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Orchard citrus and apple crates">
            <rect width="120" height="120" fill="url(#citrusGrad)" />
            <rect x="18" y="66" width="84" height="36" rx="6" fill="#78350F" />
            <circle cx="40" cy="54" r="15" fill="#F97316" />
            <circle cx="62" cy="50" r="16" fill="#FB923C" />
            <circle cx="82" cy="56" r="14" fill="#DC2626" />
            <path d="M58 34C62 30 68 32 66 37" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
            <path d="M26 78H94M26 89H94" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="citrusGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFBEB" />
                <stop offset="1" stopColor="#FDE68A" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'pastries':
    default:
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Artisan morning pastries and quiche">
            <rect width="120" height="120" fill="url(#pastryBox)" />
            <rect x="20" y="64" width="80" height="34" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
            <path d="M34 56C34 42 52 38 60 48C68 38 86 42 86 56" fill="#D97706" />
            <circle cx="60" cy="54" r="14" fill="#F59E0B" />
            <path d="M34 78H86" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
            <defs>
              <linearGradient id="pastryBox" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFBEB" />
                <stop offset="1" stopColor="#FEF3C7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
  }
};
