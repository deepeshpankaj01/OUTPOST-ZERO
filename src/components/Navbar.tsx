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
  onOpenBriefing?: () => void;
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
  onOpenBriefing,
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
    <header className="sticky top-0 z-40 w-full bg-space-950/95 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand Identity & Sol Progress */}
        <div className="flex items-center gap-3">
          <MissionPatchBadge size={40} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-wide text-white font-mono">
                OUTPOST ZERO
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 hidden sm:inline">
                Team Parakram
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Junior Astronaut Trainer</span>
              <span className="text-slate-600">•</span>
              <span className="px-1.5 py-0.2 rounded font-mono font-bold text-sky-400 bg-slate-900 border border-slate-800 text-[10px]">
                SOL {currentSol} / {maxSols}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Mission Destination Selector */}
        <div
          role="radiogroup"
          aria-label="Select Mission Destination"
          className="flex items-center p-1 rounded-xl bg-space-900 border border-slate-800 text-xs font-medium"
        >
          <button
            role="radio"
            aria-checked={currentMissionId === 'moon_shackleton'}
            onClick={() => {
              audioEngine.playClick();
              onSelectMission('moon_shackleton');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all focus:outline-none focus:ring-1 focus:ring-sky-400 ${
              currentMissionId === 'moon_shackleton'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span aria-hidden="true" className="text-sm">🌕</span>
            <span>Moon <span className="hidden md:inline font-normal text-slate-400">(Shackleton)</span></span>
          </button>

          <button
            role="radio"
            aria-checked={currentMissionId === 'mars_jezero'}
            onClick={() => {
              audioEngine.playClick();
              onSelectMission('mars_jezero');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all focus:outline-none focus:ring-1 focus:ring-orange-400 ${
              currentMissionId === 'mars_jezero'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span aria-hidden="true" className="text-sm">🔴</span>
            <span>Mars <span className="hidden md:inline font-normal text-slate-400">(Jezero)</span></span>
          </button>
        </div>

        {/* Right Controls: Mode Toggle, DONKI, Modals, Sound */}
        <div className="flex items-center gap-2">
          {/* DONKI Space Weather Pill */}
          <DonkiStatusPill
            donkiState={donkiState}
            isLoading={isLoadingDonki}
            onSyncClick={onSyncDonki}
          />

          {/* Mission Briefing Button */}
          {onOpenBriefing && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenBriefing();
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-space-900 hover:bg-space-850 text-slate-300 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 transition-all focus:ring-1 focus:ring-sky-400"
              title="Open Mission Briefing and Objectives"
              aria-label="Open Mission Briefing"
            >
              <span aria-hidden="true">📖</span>
              <span className="hidden md:inline">Briefing</span>
            </button>
          )}

          {/* Dual Audience Mode Toggle */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onToggleMode();
            }}
            aria-label={`Current Mode: ${isCadet ? 'Cadet Mode (Ages 7-12)' : 'Flight Director Mode (Ages 13+)'}. Click to switch.`}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 focus:ring-1 focus:ring-sky-400 ${
              isCadet
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:border-amber-400/50'
                : 'bg-sky-500/10 text-sky-300 border-sky-500/30 hover:border-sky-400/50'
            }`}
            title="Toggle between Cadet Mode (simplified) and Flight Director Mode (engineering metrics)"
          >
            <span aria-hidden="true">{isCadet ? '🧒' : '🚀'}</span>
            <span className="hidden sm:inline">
              {isCadet ? 'Cadet (7–12)' : 'Director (13+)'}
            </span>
          </button>

          {/* Science Lab Modal Opener */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenScienceLab();
            }}
            aria-label="Open NASA and ISRO Science Lab and Provenance Registry"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-space-900 hover:bg-space-850 text-slate-300 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 transition-all focus:ring-1 focus:ring-sky-400"
            title="Open NASA & ISRO Science Lab, Provenance Registry & Lesson Plan"
          >
            <span aria-hidden="true">🔬</span>
            <span className="hidden md:inline">Science Lab</span>
          </button>

          {/* Audio Synthesizer Mute Toggle */}
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Unmute Web Audio Synthesizer' : 'Mute Web Audio Synthesizer'}
            className="p-1.5 sm:px-2 rounded-lg bg-space-900 hover:bg-space-850 text-slate-400 hover:text-white border border-slate-800 transition-all text-xs focus:ring-1 focus:ring-slate-400"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
    </header>
  );
};
