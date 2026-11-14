'use client';

import React from 'react';

interface MissionPatchBadgeProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'compact' | 'shield';
  subtext?: string;
}

/**
 * ORIGINAL "OUTPOST ZERO / TEAM PARAKRAM" MISSION PATCH
 * Strictly obeys 2026 NASA Space Apps Challenge Rule:
 * NO NASA logos or official insignia used.
 * Features custom vector geometry: Lunar South Pole & Mars Jezero alignment,
 * Kilopower orbital trajectory, and 7 geometric constellation stars.
 */
export const MissionPatchBadge: React.FC<MissionPatchBadgeProps> = ({
  className = '',
  size = 64,
  variant = 'full',
  subtext,
}) => {
  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]"
      >
        <defs>
          <linearGradient id="patchBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="50%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#070B19" />
          </linearGradient>

          <linearGradient id="patchGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="marsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          <linearGradient id="cyanArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00F0FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
          </linearGradient>

          <path id="textCircleTop" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
          <path id="textCircleBottom" d="M 170,100 A 70,70 0 0,1 30,100" fill="none" />
        </defs>

        {/* Outer Circular Rim */}
        <circle cx="100" cy="100" r="96" fill="url(#patchBg)" stroke="url(#patchGold)" strokeWidth="4" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

        {/* Deep Space Background Grid */}
        <circle cx="100" cy="100" r="76" fill="#050814" stroke="#1E293B" strokeWidth="1" />

        {/* Geometric Constellation Stars */}
        <polygon points="100,32 103,40 111,40 105,45 107,53 100,48 93,53 95,45 89,40 97,40" fill="#FBBF24" />
        <circle cx="56" cy="68" r="2" fill="#FFFFFF" opacity="0.9" />
        <circle cx="144" cy="68" r="2" fill="#FFFFFF" opacity="0.9" />
        <circle cx="48" cy="115" r="1.5" fill="#38BDF8" opacity="0.8" />
        <circle cx="152" cy="115" r="1.5" fill="#38BDF8" opacity="0.8" />
        <circle cx="70" cy="145" r="1.5" fill="#FFFFFF" opacity="0.7" />
        <circle cx="130" cy="145" r="1.5" fill="#FFFFFF" opacity="0.7" />

        {/* Orbit Arc connecting Earth/Moon to Mars */}
        <ellipse cx="100" cy="105" rx="58" ry="34" fill="none" stroke="url(#cyanArc)" strokeWidth="2.5" strokeDasharray="6 4" transform="rotate(-15 100 105)" />

        {/* Moon Vector (Shackleton South Pole illuminated rim) */}
        <g transform="translate(62, 95)">
          <circle cx="16" cy="16" r="15" fill="url(#moonGrad)" />
          {/* Craters */}
          <circle cx="12" cy="14" r="3" fill="#475569" opacity="0.6" />
          <circle cx="21" cy="20" r="2.5" fill="#475569" opacity="0.6" />
          <circle cx="22" cy="10" r="2" fill="#475569" opacity="0.6" />
          {/* Illuminated rim highlight */}
          <path d="M 2,16 A 14,14 0 0,0 28,24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.8" />
        </g>

        {/* Mars Vector (Jezero Crater with Delta fan) */}
        <g transform="translate(112, 75)">
          <circle cx="18" cy="18" r="17" fill="url(#marsGrad)" />
          {/* Ancient Delta channel lines */}
          <path d="M 10,14 Q 18,17 24,12" stroke="#7F1D1D" strokeWidth="1.5" fill="none" />
          <path d="M 14,22 Q 20,23 26,20" stroke="#7F1D1D" strokeWidth="1.5" fill="none" />
          {/* Polar ice cap */}
          <ellipse cx="18" cy="4" rx="6" ry="2.5" fill="#FFFFFF" opacity="0.85" />
        </g>

        {/* Central Outpost Habitat Chevron / Geometric Ascent Vehicle */}
        <path d="M 100,64 L 118,110 L 100,102 L 82,110 Z" fill="url(#patchGold)" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="100" cy="85" r="3" fill="#00F0FF" />

        {/* Text Arc: OUTPOST ZERO */}
        <text fill="#00F0FF" fontSize="12.5" fontWeight="900" letterSpacing="2.8" fontFamily="sans-serif">
          <textPath href="#textCircleTop" startOffset="50%" textAnchor="middle">
            OUTPOST ZERO
          </textPath>
        </text>

        {/* Text Arc: TEAM PARAKRAM • 2026 */}
        <text fill="#FBBF24" fontSize="10" fontWeight="700" letterSpacing="2.2" fontFamily="sans-serif">
          <textPath href="#textCircleBottom" startOffset="50%" textAnchor="middle">
            TEAM PARAKRAM • 2026
          </textPath>
        </text>
      </svg>

      {subtext && (
        <span className="text-[10px] font-mono tracking-wider text-cyan-neon/80 uppercase mt-1">
          {subtext}
        </span>
      )}
    </div>
  );
};
