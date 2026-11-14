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

  const isLive = donkiState?.statusType === 'live_telemetry';
  const isNoEvents = donkiState?.statusType === 'no_events_found';

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
          aria-label="Query real-time solar flare records from NASA DONKI API"
          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-space-850 hover:bg-space-800 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all shadow-sm hover:border-cyan-400 disabled:opacity-50 focus:ring-2 focus:ring-cyan-400"
          title="Query NASA Space Weather Database Of Notifications, Knowledge, Information"
        >
          <span className={`text-xs ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true">📡</span>
          <span className="hidden sm:inline">Sync NASA DONKI</span>
        </button>

        {/* Status Pill */}
        {donkiState && (
          <button
            onClick={() => setShowDetail(!showDetail)}
            aria-expanded={showDetail}
            aria-label="Toggle NASA Space Weather Telemetry Details"
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer focus:ring-2 focus:ring-cyan-400 ${
              isLive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 hover:bg-emerald-900/80 shadow-emerald-glow/20'
                : isNoEvents
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 hover:bg-amber-900/80'
                : 'bg-blue-950/80 text-cyan-300 border-blue-500/60 hover:bg-blue-900/80'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-400 animate-pulse' : isNoEvents ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              aria-hidden="true"
            />
            <span className="truncate max-w-[170px] sm:max-w-none">
              {isLive
                ? 'LIVE NASA DONKI (SOLAR FLARE FLR FEED)'
                : isNoEvents
                ? 'NASA DONKI (0 EVENTS IN 30-DAY WINDOW)'
                : 'CURATED NASA ARCHIVE RECORD (OFFLINE/FALLBACK)'}
            </span>
          </button>
        )}
      </div>

      {/* Detail Popover */}
      {showDetail && donkiState && (
        <div
          role="region"
          aria-label="Space weather detailed feed"
          className="absolute top-full right-0 mt-2 z-50 w-80 sm:w-96 p-4 rounded-xl bg-space-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-xs text-slate-200"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-700 mb-2">
            <span className="font-bold font-mono text-cyan-neon">
              {isLive ? '🟢 Live NASA Satellite Record' : '🔵 NASA Space Weather Telemetry'}
            </span>
            <button
              onClick={() => setShowDetail(false)}
              aria-label="Close Popover"
              className="text-slate-400 hover:text-white px-1 text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div>
              <span className="text-slate-400">Selected Event:</span>{' '}
              <strong className="text-amber-400 font-bold">{donkiState.event.classType} Flare ({donkiState.event.flareId})</strong>
            </div>
            <div>
              <span className="text-slate-400">Observed Date:</span>{' '}
              <span className="text-slate-200">{donkiState.event.observedDate || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400">Active Region:</span>{' '}
              <span className="text-slate-200">{donkiState.event.sourceLocation}</span>
            </div>
            {donkiState.queryWindow && (
              <div>
                <span className="text-slate-400">Query Window:</span>{' '}
                <span className="text-slate-300">{donkiState.queryWindow.startDate} to {donkiState.queryWindow.endDate}</span>
              </div>
            )}
            <div>
              <span className="text-slate-400">Events Returned:</span>{' '}
              <span className="text-slate-200">{donkiState.rawApiCount}</span>
            </div>
            <div>
              <span className="text-slate-400">Fetched At:</span>{' '}
              <span className="text-slate-300">{donkiState.timestamp}</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-300 space-y-1">
            <div className="font-bold text-cyan-300">Scientific Semantics Notice:</div>
            <p className="text-slate-400 leading-tight">
              {donkiState.provenanceNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
