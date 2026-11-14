'use client';

import React, { useState, useEffect } from 'react';
import { MissionId, AudienceMode } from '../types/mission';
import { MissionPatchBadge } from './MissionPatchBadge';
import { DonkiStatusPill } from './DonkiStatusPill';
import { DonkiApiResult } from '../data/historicalSpaceWeather';
import { audioEngine } from '../lib/audioEngine';

interface NavbarProps {
  currentMissionId: MissionId;
  mode: AudienceMode;
  currentSol: number;
  maxSols: number;
  donkiState: DonkiApiResult | null;
  isLoadingDonki: boolean;
  onSelectMission: (id: MissionId) => void;
  onToggleMode: () => void;
  onSyncDonki: () => void;
  onOpenScienceLab: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMissionId,
  mode,
  currentSol,
  maxSols,
  donkiState,
  isLoadingDonki,
  onSelectMission,
  onToggleMode,
  onSyncDonki,
  onOpenScienceLab,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(audioEngine.getMuted());
  }, []);

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioEngine.playClick();
    }
  };

  const isCadet = mode === 'cadet';

  return (
    <header className="sticky top-0 z-40 w-full bg-space-950/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mission Patch Logo & Title */}
        <div className="flex items-center gap-3">
          <MissionPatchBadge size={44} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-wider text-white font-mono flex items-center gap-1.5">
                <span>OUTPOST ZERO</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 hidden sm:inline">
                Team Parakram
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <span>Junior Astronaut Mission Trainer</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-bold">SOL {currentSol}/{maxSols}</span>
            </div>
          </div>
        </div>

        {/* Center: Mission Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-space-900 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              audioEngine.playClick();
              onSelectMission('moon_shackleton');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              currentMissionId === 'moon_shackleton'
                ? 'bg-cyan-500/20 text-cyan-neon border border-cyan-500/50 shadow-cyan-glow/20 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌕</span>
            <span className="hidden xs:inline sm:inline">Moon: Shackleton</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onSelectMission('mars_jezero');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              currentMissionId === 'mars_jezero'
                ? 'bg-coral-500/20 text-coral-neon border border-coral-500/50 shadow-coral-glow/20 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔴</span>
            <span className="hidden xs:inline sm:inline">Mars: Jezero</span>
          </button>
        </div>

        {/* Right Controls: Audience Mode, DONKI, Audio Mute, Science Lab */}
        <div className="flex items-center gap-2">
          {/* DONKI Space Weather Pill */}
          <DonkiStatusPill
            donkiState={donkiState}
            isLoading={isLoadingDonki}
            onSyncClick={onSyncDonki}
          />

          {/* Dual Audience Mode Toggle */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onToggleMode();
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
              isCadet
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40 hover:border-amber-400'
                : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-neon border-cyan-500/40 hover:border-cyan-400'
            }`}
            title="Toggle between Cadet Mode (Ages 7-12) and Flight Director Mode (Ages 13+ / Judges)"
          >
            <span>{isCadet ? '🧒' : '🚀'}</span>
            <span className="hidden sm:inline">
              {isCadet ? 'Cadet Mode (7-12)' : 'Flight Director (13+)'}
            </span>
          </button>

          {/* Science Lab Modal Opener */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenScienceLab();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono bg-space-850 hover:bg-space-800 text-purple-300 border border-purple-500/30 flex items-center gap-1 transition-all"
            title="Open NASA & ISRO Science Lab & Teacher Guide"
          >
            <span>🔬</span>
            <span className="hidden md:inline">Science Lab</span>
          </button>

          {/* Audio Synthesizer Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg bg-space-850 hover:bg-space-800 text-slate-300 border border-slate-700 hover:text-white transition-all text-xs"
            title={isMuted ? 'Unmute Web Audio Synthesizer' : 'Mute Web Audio Synthesizer'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
    </header>
  );
};
