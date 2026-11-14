'use client';

import React from 'react';
import { MissionConfig, AudienceMode } from '../types/mission';
import { MissionPatchBadge } from './MissionPatchBadge';
import { audioEngine } from '../lib/audioEngine';

interface BriefingModalProps {
  mission: MissionConfig;
  mode: AudienceMode;
  onClose: () => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({ mission, mode, onClose }) => {
  const isCadet = mode === 'cadet';
  const isMoon = mission.id === 'moon_shackleton';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl rounded-2xl bg-space-900 border border-cyan-500/50 shadow-2xl p-5 sm:p-8 my-auto text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <MissionPatchBadge size={48} />
            <div>
              <div className="text-[10px] uppercase font-mono text-cyan-neon font-bold tracking-wider">
                FLIGHT OPERATIONS BRIEFING
              </div>
              <h2 id="briefing-modal-title" className="text-lg sm:text-xl font-black text-white">
                {isCadet ? mission.cadetName : mission.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            aria-label="Close Mission Briefing Modal"
            className="w-8 h-8 rounded-lg bg-space-850 hover:bg-space-800 text-slate-400 hover:text-white flex items-center justify-center font-mono border border-slate-700 transition-colors focus:ring-2 focus:ring-cyan-400"
          >
            ✕
          </button>
        </div>

        {/* Persistent Notice */}
        <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 leading-relaxed font-sans">
          <strong>Persistent Notice:</strong> OUTPOST ZERO is an educational simulation, not an engineering design tool, flight procedure, radiation safety assessment, or NASA/ISRO-endorsed product.
        </div>

        {/* Destination Overview */}
        <div className="mb-4 p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center gap-2">
            <span>{isMoon ? '🌕' : '🔴'}</span>
            <span>Mission Objective &amp; Site Environment:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {isCadet ? mission.cadetDescription : mission.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
            <div>
              <span className="text-slate-400">Duration:</span>{' '}
              <strong className="text-white">{mission.missionDurationSols} Sols</strong>
            </div>
            <div>
              <span className="text-slate-400">Solar Flux:</span>{' '}
              <strong className="text-cyan-300">{mission.solarIrradianceWPerM2} W/m²</strong>
            </div>
            <div>
              <span className="text-slate-400">Base Temp:</span>{' '}
              <strong className="text-amber-300">{mission.baselineSurfaceTempC}°C</strong>
            </div>
            <div>
              <span className="text-slate-400">Target Envelope:</span>{' '}
              <strong className="text-emerald-300">18.3°C – 26.7°C</strong>
            </div>
          </div>
        </div>

        {/* 4 Core Trade-Offs Guide */}
        <div className="mb-5 space-y-2">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold">
            The 4 Engineering Allocation Subsystems:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
            <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
              <div className="font-bold text-cyan-300 font-mono mb-1">🌬️ Scaled O2 &amp; ECLSS</div>
              <p className="text-slate-300 text-[11px]">
                {isMoon
                  ? 'ECLSS OGA water electrolysis to replace 3.84 kg O2/day and catalytic water distillation.'
                  : 'Hypothetical scaled oxygen plant (16x MOXIE scale) synthesizing 3.84 kg O2/day from atmospheric CO2.'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
              <div className="font-bold text-emerald-300 font-mono mb-1">🌱 Hydroponic Astro-Garden</div>
              <p className="text-slate-300 text-[11px]">
                Biomass lighting and nutrient cycling. Yields fresh food days, supplemental oxygen, and lifts crew morale.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
              <div className="font-bold text-amber-300 font-mono mb-1">🛡️ Thermal &amp; Regolith Shielding</div>
              <p className="text-slate-300 text-[11px]">
                Cabin ceramic heaters to maintain nominal 22°C against exterior cold, plus sintering rovers to deposit protective regolith.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
              <div className="font-bold text-purple-300 font-mono mb-1">🔬 Science &amp; ISRU Drills</div>
              <p className="text-slate-300 text-[11px]">
                Autonomous prospecting rovers drilling for volatile ice in crater cold traps, replenishing potable reserves.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            audioEngine.playSolAdvance();
            onClose();
          }}
          className="w-full py-3 px-5 rounded-xl font-bold font-mono text-sm tracking-wider uppercase transition-all bg-gradient-to-r from-cyan-500 to-teal-400 text-space-950 hover:from-cyan-400 hover:to-teal-300 shadow-cyan-glow/20 focus:ring-2 focus:ring-cyan-400"
        >
          🚀 Enter Mission Control &amp; Begin Scenario
        </button>
      </div>
    </div>
  );
};
