'use client';

import React from 'react';
import { AudienceMode } from '../types/mission';

interface CommanderAriaProps {
  mode: AudienceMode;
  currentSol: number;
  speechText?: string;
  mood?: 'nominal' | 'alert' | 'proud' | 'thinking';
  onQuickTipClick?: () => void;
}

export const CommanderAria: React.FC<CommanderAriaProps> = ({
  mode,
  currentSol,
  speechText,
  mood = 'nominal',
  onQuickTipClick,
}) => {
  const isCadet = mode === 'cadet';

  // Visor reflection color based on mood
  const visorColor =
    mood === 'alert'
      ? '#F87171'
      : mood === 'proud'
      ? '#34D399'
      : mood === 'thinking'
      ? '#FBBF24'
      : '#38BDF8';

  const defaultSpeech = isCadet
    ? `Commander Aria here for Sol ${currentSol}: Remember, our base is like a spaceship on land. Don't run all 4 systems at full blast or our battery will drain before nightfall! Keep life support at or above 3.5 kW.`
    : `Flight Director: Sol ${currentSol} status synchronized. Enforce NASA-STD-3001 metabolic standards (0.96 kg O₂/day and 2.5 L potable water per crewmember) and maintain ALARA radiation protocols across all surface operations.`;

  const displayText = speechText || defaultSpeech;

  return (
    <div className="clean-card p-3 sm:p-4 border-slate-700/70 flex items-center gap-3.5 shadow-sm">
      {/* Astronaut Avatar Icon */}
      <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Helmet Outer Shell */}
          <circle cx="50" cy="46" r="38" fill="#F1F5F9" stroke="#64748B" strokeWidth="2.5" />
          <path d="M 14,46 A 36,36 0 0,1 86,46" fill="#FFFFFF" opacity="0.3" />

          {/* Golden Communication Antenna */}
          <line x1="84" y1="35" x2="94" y2="20" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="94" cy="20" r="3" fill="#F59E0B" />

          {/* Helmet Visor */}
          <ellipse cx="50" cy="48" rx="27" ry="22" fill="#0A1024" stroke={visorColor} strokeWidth="2.5" />

          {/* Visor Reflection */}
          <path
            d="M 28,42 Q 50,30 72,42 Q 50,36 28,42 Z"
            fill={visorColor}
            opacity="0.35"
          />

          {/* Torso Suit Collar */}
          <path d="M 22,84 L 78,84 L 74,96 L 26,96 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          <rect x="42" y="85" width="16" height="5" rx="2" fill="#0284C7" />
        </svg>

        {/* Status dot */}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-space-950"
          style={{ backgroundColor: visorColor }}
        />
      </div>

      {/* Speech Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold font-mono text-white tracking-wide">
            Commander Aria Patel
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {isCadet ? 'Mission Mentor' : 'Flight Safety Lead'}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-none">
          {displayText}
        </p>
      </div>

      {/* Optional Quick Action button */}
      {onQuickTipClick && (
        <button
          onClick={onQuickTipClick}
          className="hidden sm:inline-flex px-2.5 py-1 text-xs font-medium rounded-lg bg-space-900 hover:bg-space-850 text-sky-400 border border-slate-700/80 hover:border-sky-500/40 transition-colors flex-shrink-0"
        >
          Inspect Subsystem
        </button>
      )}
    </div>
  );
};
