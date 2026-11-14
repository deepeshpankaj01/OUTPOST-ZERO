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
      ? '#EF4444'
      : mood === 'proud'
      ? '#10B981'
      : mood === 'thinking'
      ? '#F59E0B'
      : '#00F0FF';

  const defaultSpeech = isCadet
    ? `Hey Cadet! Commander Aria here for Sol ${currentSol}. Remember: Outpost Zero is like a giant space submarine. If you run the big oxygen plant, heaters, and rovers at full blast, our battery will drain before midnight. Check the preview calculator before committing!`
    : `Flight Director: Sol ${currentSol} subsystem synchronization nominal. Enforce NASA-STD-3001 metabolic constraints (0.96 kg O2/day and 2.5 L potable water per crewmember) and maintain ALARA radiation protocols across all EVA and surface operations.`;

  const displayText = speechText || defaultSpeech;

  return (
    <div className="relative flex items-start gap-4 p-4 rounded-xl bg-space-850/90 border border-cyan-500/20 backdrop-blur-md shadow-cyan-glow/20 transition-all hover:border-cyan-400/40">
      {/* Illustrated SVG Astronaut Avatar */}
      <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Helmet Outer Shell */}
          <circle cx="50" cy="46" r="38" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2.5" />
          <path d="M 14,46 A 36,36 0 0,1 86,46" fill="#FFFFFF" opacity="0.4" />

          {/* Golden Communication Antenna */}
          <line x1="84" y1="35" x2="94" y2="20" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="94" cy="20" r="3" fill="#F59E0B" />

          {/* Helmet Visor */}
          <ellipse cx="50" cy="48" rx="27" ry="22" fill="#0A0F1E" stroke={visorColor} strokeWidth="2" />

          {/* Visor Reflection / HUD overlay */}
          <path
            d="M 28,42 Q 50,30 72,42 Q 50,36 28,42 Z"
            fill={visorColor}
            opacity="0.35"
          />
          <circle cx="36" cy="44" r="3" fill="#FFFFFF" opacity="0.7" />

          {/* Collar & Suit Details */}
          <path d="M 22,80 L 18,98 L 82,98 L 78,80 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          {/* Mission Patch on Chest */}
          <circle cx="50" cy="90" r="5" fill="#00F0FF" />
          <polygon points="50,87 52,91 48,91" fill="#FBBF24" />

          {/* Microphone boom */}
          <path d="M 32,56 Q 38,62 46,60" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="47" cy="60" r="2" fill="#EF4444" />
        </svg>

        {/* Live Status indicator dot */}
        <span
          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-space-900 animate-pulse"
          style={{ backgroundColor: visorColor }}
          title={mood}
        />
      </div>

      {/* Speech Bubble / Dialogue Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-cyan-neon">
              Commander Aria Patel
            </span>
            <span className="px-2 py-0.5 text-[10px] uppercase font-mono rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              {isCadet ? 'Junior Mentor' : 'CapCom / Systems Lead'}
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            SOL {currentSol} COMM-LINK
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {displayText}
        </p>

        {onQuickTipClick && (
          <button
            onClick={onQuickTipClick}
            aria-label="Ask Aria for trade-off engineering hints"
            className="mt-2 text-[11px] font-mono text-cyan-neon hover:text-cyan-300 hover:underline inline-flex items-center gap-1 focus:ring-1 focus:ring-cyan-400"
          >
            <span>💡 Ask Aria for trade-off hints</span>
          </button>
        )}
      </div>
    </div>
  );
};
