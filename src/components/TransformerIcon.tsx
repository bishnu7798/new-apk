import React from 'react';

interface TransformerIconProps {
  className?: string;
  size?: number | string;
  variant?: 'inline' | 'hero' | 'badge';
}

/**
 * High-Precision Electrical Distribution Transformer (DTR) Icon & Hero Logo
 * Designed specifically for electrical distribution network management (HT/LT Transformer).
 */
export const TransformerIcon: React.FC<TransformerIconProps> = ({
  className = 'w-6 h-6',
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Electrical Distribution Transformer"
    >
      {/* 3 High-Voltage (HT) Porcelain Insulator Bushings on Top */}
      {/* Bushing 1 (Phase R) */}
      <g>
        <rect x="13" y="4" width="2" height="7" rx="1" fill="#F59E0B" />
        <ellipse cx="14" cy="4" rx="2" ry="1.2" fill="#D97706" />
        <path d="M11.5 7.5H16.5M12 9.5H16" stroke="#FEF3C7" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      {/* Bushing 2 (Phase Y) */}
      <g>
        <rect x="23" y="2.5" width="2" height="8.5" rx="1" fill="#F59E0B" />
        <ellipse cx="24" cy="2.5" rx="2" ry="1.2" fill="#D97706" />
        <path d="M21.5 6H26.5M22 8H26" stroke="#FEF3C7" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      {/* Bushing 3 (Phase B) */}
      <g>
        <rect x="33" y="4" width="2" height="7" rx="1" fill="#F59E0B" />
        <ellipse cx="34" cy="4" rx="2" ry="1.2" fill="#D97706" />
        <path d="M31.5 7.5H36.5M32 9.5H36" stroke="#FEF3C7" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Top Cover / Flange */}
      <rect x="8" y="11" width="32" height="3" rx="1.5" fill="currentColor" />

      {/* Left Cooling Radiator Fins */}
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line x1="5" y1="16" x2="9" y2="16" />
        <line x1="5" y1="20" x2="9" y2="20" />
        <line x1="5" y1="24" x2="9" y2="24" />
        <line x1="5" y1="28" x2="9" y2="28" />
        <line x1="5" y1="32" x2="9" y2="32" />
        <path d="M5 16V32" />
      </g>

      {/* Right Cooling Radiator Fins */}
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line x1="39" y1="16" x2="43" y2="16" />
        <line x1="39" y1="20" x2="43" y2="20" />
        <line x1="39" y1="24" x2="43" y2="24" />
        <line x1="39" y1="28" x2="43" y2="28" />
        <line x1="39" y1="32" x2="43" y2="32" />
        <path d="M43 16V32" />
      </g>

      {/* Main Steel Tank Body */}
      <rect
        x="9"
        y="14"
        width="30"
        height="22"
        rx="3"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Internal High-Voltage Lightning Warning Emblem */}
      <path
        d="M24.5 17L20.5 24.5H24.5L23.5 31L28.5 23H24.5L26 17H24.5Z"
        fill="#F59E0B"
      />

      {/* Bottom Mounting Skid / Channel Base */}
      <rect x="7" y="37" width="34" height="3" rx="1.2" fill="currentColor" />
      <rect x="11" y="40" width="6" height="3" rx="0.8" fill="currentColor" fillOpacity="0.8" />
      <rect x="31" y="40" width="6" height="3" rx="0.8" fill="currentColor" fillOpacity="0.8" />
    </svg>
  );
};

/**
 * Premium Hero DTR Transformer Logo Badge for headers & title cards
 */
export const DTRHeroLogo: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-14 h-14',
}) => {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-[#0B2D52] via-[#0D4468] to-[#00A896] p-2 flex items-center justify-center shadow-lg shadow-[#00A896]/25 border border-teal-400/30 relative overflow-hidden shrink-0 ${className}`}
    >
      {/* Background ambient lighting effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.35),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-amber-400/20 rounded-full blur-xs pointer-events-none" />

      {/* Rich Detailed Transformer Graphic */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        {/* Gradients */}
        <defs>
          <linearGradient id="tankGrad" x1="16" y1="20" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E3A5F" />
            <stop offset="0.5" stopColor="#0E2A47" />
            <stop offset="1" stopColor="#0A1F35" />
          </linearGradient>
          <linearGradient id="tankLidGrad" x1="12" y1="16" x2="52" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.5" stopColor="#00A896" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="finGrad" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#2DD4BF" />
            <stop offset="1" stopColor="#0D9488" />
          </linearGradient>
          <linearGradient id="bushingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#FEF08A" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* HT Ceramic Insulator Bushings (3-Phase: Red, Yellow, Blue) */}
        {/* Bushing 1 (Left) */}
        <g>
          <line x1="20" y1="5" x2="20" y2="16" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="17.5" y="7" width="5" height="9" rx="1.5" fill="url(#bushingGrad)" stroke="#78350F" strokeWidth="0.75" />
          <path d="M16.5 10H23.5M17 12.5H23" stroke="#FEF3C7" strokeWidth="1" strokeLinecap="round" />
          <circle cx="20" cy="5" r="2" fill="#EF4444" stroke="#FEF08A" strokeWidth="0.75" />
        </g>

        {/* Bushing 2 (Center - High) */}
        <g>
          <line x1="32" y1="3" x2="32" y2="16" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="29.5" y="5" width="5" height="11" rx="1.5" fill="url(#bushingGrad)" stroke="#78350F" strokeWidth="0.75" />
          <path d="M28.5 8H35.5M29 11H35" stroke="#FEF3C7" strokeWidth="1" strokeLinecap="round" />
          <circle cx="32" cy="3" r="2.2" fill="#EAB308" stroke="#FEF08A" strokeWidth="0.75" />
        </g>

        {/* Bushing 3 (Right) */}
        <g>
          <line x1="44" y1="5" x2="44" y2="16" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="41.5" y="7" width="5" height="9" rx="1.5" fill="url(#bushingGrad)" stroke="#78350F" strokeWidth="0.75" />
          <path d="M40.5 10H47.5M41 12.5H47" stroke="#FEF3C7" strokeWidth="1" strokeLinecap="round" />
          <circle cx="44" cy="5" r="2" fill="#3B82F6" stroke="#FEF08A" strokeWidth="0.75" />
        </g>

        {/* Conservator Oil Tank (Top Cylinder) */}
        <rect x="14" y="16" width="36" height="4" rx="2" fill="url(#tankLidGrad)" stroke="#67E8F9" strokeWidth="0.8" />

        {/* Cooling Radiator Fins (Left Side) */}
        <g stroke="url(#finGrad)" strokeWidth="1.8" strokeLinecap="round">
          <line x1="8" y1="23" x2="14" y2="23" />
          <line x1="8" y1="28" x2="14" y2="28" />
          <line x1="8" y1="33" x2="14" y2="33" />
          <line x1="8" y1="38" x2="14" y2="38" />
          <line x1="8" y1="43" x2="14" y2="43" />
          <path d="M8 23V43" strokeWidth="2" />
        </g>

        {/* Cooling Radiator Fins (Right Side) */}
        <g stroke="url(#finGrad)" strokeWidth="1.8" strokeLinecap="round">
          <line x1="50" y1="23" x2="56" y2="23" />
          <line x1="50" y1="28" x2="56" y2="28" />
          <line x1="50" y1="33" x2="56" y2="33" />
          <line x1="50" y1="38" x2="56" y2="38" />
          <line x1="50" y1="43" x2="56" y2="43" />
          <path d="M56 23V43" strokeWidth="2" />
        </g>

        {/* Main Transformer Oil Tank Body */}
        <rect
          x="14"
          y="20"
          width="36"
          height="28"
          rx="4"
          fill="url(#tankGrad)"
          stroke="#2DD4BF"
          strokeWidth="1.5"
        />

        {/* DTR Nameplate / Rating Plate */}
        <rect x="19" y="24" width="26" height="7" rx="1.5" fill="#0B2D52" stroke="#38BDF8" strokeWidth="0.8" />
        <text x="32" y="29.2" fill="#38BDF8" fontSize="4.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
          11 / 0.433 kV
        </text>

        {/* High Voltage Hazard Spark Emblem */}
        <path
          d="M33 33L27.5 40.5H32.5L31 46.5L37.5 38.5H32.5L34.5 33H33Z"
          fill="url(#sparkGrad)"
          stroke="#78350F"
          strokeWidth="0.5"
        />

        {/* Oil Level Gauge */}
        <rect x="44" y="34" width="3" height="10" rx="1.5" fill="#0369A1" stroke="#38BDF8" strokeWidth="0.6" />
        <line x1="45.5" y1="38" x2="45.5" y2="42" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Grounding Terminal / Skid Base Mounting Channels */}
        <rect x="11" y="49" width="42" height="4" rx="1.5" fill="#0F172A" stroke="#00A896" strokeWidth="1" />
        <rect x="16" y="53" width="8" height="4" rx="1" fill="#334155" />
        <rect x="40" y="53" width="8" height="4" rx="1" fill="#334155" />
      </svg>

      {/* Tiny High-Voltage badge in bottom corner */}
      <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center shadow-xs">
        <span className="text-[7px] font-black text-slate-900 leading-none">⚡</span>
      </div>
    </div>
  );
};
