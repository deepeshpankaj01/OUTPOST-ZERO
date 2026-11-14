'use client';

import React, { useState } from 'react';
import { DonkiApiResult } from '../data/historicalSpaceWeather';
import { audioEngine } from '../lib/audioEngine';

interface DonkiStatusPillProps {
  donkiState: DonkiApiResult | null;
  isLoading: boolean;
  onSyncClick: () => void;
}

export const DonkiStatusPill: React.FC<DonkiStatusPillProps> = ({
  donkiState,
  isLoading,
  onSyncClick,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  const isLive = donkiState?.isLive ?? false;

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-2">
        {/* Sync Button */}
        <button
          onClick={() => {
            audioEngine.playRadarPing();
            onSyncClick();
          }}
          disabled={isLoading}
          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-space-850 hover:bg-space-800 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all shadow-sm hover:border-cyan-400 disabled:opacity-50"
          title="Fetch real-time Solar Flare telemetry from NASA DONKI satellites"
        >
          <span className={`text-xs ${isLoading ? 'animate-spin' : ''}`}>📡</span>
          <span className="hidden sm:inline">Sync NASA DONKI</span>
        </button>

        {/* Status Pill */}
        {donkiState && (
          <button
            onClick={() => setShowDetail(!showDetail)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isLive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 hover:bg-emerald-900/80 shadow-emerald-glow/20'
                : 'bg-blue-950/80 text-cyan-300 border-blue-500/60 hover:bg-blue-900/80'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
              }`}
            />
            <span className="truncate max-w-[170px] sm:max-w-none">
              {isLive ? 'LIVE NASA DONKI TELEMETRY' : 'CURATED NASA DATASET (OFFLINE SAFE)'}
            </span>
          </button>
        )}
      </div>

      {/* Detail Popover */}
      {showDetail && donkiState && (
        <div className="absolute top-full right-0 mt-2 z-50 w-72 sm:w-80 p-4 rounded-xl bg-space-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-xs text-slate-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-700 mb-2">
            <span className="font-bold font-mono text-cyan-neon">
              {isLive ? '🟢 Orbital Satellite Stream' : '🔵 NASA Space Weather Telemetry'}
            </span>
            <button
              onClick={() => setShowDetail(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div>
              <span className="text-slate-400">Event Class:</span>{' '}
              <strong className="text-amber-400 font-bold">{donkiState.event.classType} Solar Flare</strong>
            </div>
            <div>
              <span className="text-slate-400">Flare ID:</span>{' '}
              <span className="text-slate-200">{donkiState.event.flareId}</span>
            </div>
            <div>
              <span className="text-slate-400">Source:</span>{' '}
              <span className="text-slate-200">{donkiState.event.sourceLocation}</span>
            </div>
            <div>
              <span className="text-slate-400">Radiation Multiplier:</span>{' '}
              <span className="text-coral-neon font-bold">{donkiState.event.radiationFactor}x</span>
            </div>
            <div>
              <span className="text-slate-400">Updated:</span>{' '}
              <span className="text-slate-300">{donkiState.timestamp}</span>
            </div>
          </div>

          <p className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-sans leading-tight">
            {donkiState.event.description}
          </p>
        </div>
      )}
    </div>
  );
};
