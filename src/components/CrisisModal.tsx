'use client';

import React, { useEffect } from 'react';
import { CrisisEvent, CrisisChoice, AudienceMode } from '../types/mission';
import { audioEngine } from '../lib/audioEngine';

interface CrisisModalProps {
  crisis: CrisisEvent;
  mode: AudienceMode;
  onSelectChoice: (choice: CrisisChoice) => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ crisis, mode, onSelectChoice }) => {
  const isCadet = mode === 'cadet';

  useEffect(() => {
    audioEngine.playStormAlarm();
  }, [crisis]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl rounded-2xl bg-space-900 border-2 border-amber-500/80 shadow-amber-glow p-5 sm:p-8 overflow-hidden my-auto">
        {/* Pulsing warning light header */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-coral-neon animate-ping" aria-hidden="true" />
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                ⚠️ PRIORITY FLIGHT CONTROLLER ALERT • SOL {crisis.sol}
              </span>
              <h2 id="crisis-dialog-title" className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {isCadet ? crisis.cadetTitle : crisis.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-600/50">
              {crisis.warningLevel.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950/80 text-cyan-300 border border-blue-600/50">
              SIMULATION ASSUMPTION
            </span>
          </div>
        </div>

        {/* Source Dataset Citation Banner */}
        <div className="mb-3 px-3 py-2 rounded-lg bg-space-950 border border-slate-800 text-[11px] font-mono text-cyan-300/90 flex items-center gap-2">
          <span className="text-cyan-neon" aria-hidden="true">📡</span>
          <span>
            Context / Reference: <strong className="text-white">{crisis.sourceDataset}</strong>
          </span>
        </div>

        {/* Scientific Context Notice */}
        {crisis.scientificContext && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-space-950 border border-slate-700 text-[11px] font-sans text-slate-300 leading-tight">
            <span className="font-bold text-amber-300">Physical Semantics: </span>
            {crisis.scientificContext}
          </div>
        )}

        {/* Briefing Narrative */}
        <div className="mb-5 p-4 rounded-xl bg-space-850/90 border border-slate-800 text-slate-200 text-sm leading-relaxed">
          <p>{isCadet ? crisis.cadetBriefing : crisis.flightDirectorBriefing}</p>
        </div>

        {/* 3 Engineering Choices Grid */}
        <div className="space-y-3 sm:space-y-4 mb-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Select Engineering Directive (Evaluate Trade-Offs Carefully):
          </div>

          {crisis.choices.map((choice, index) => (
            <div
              key={choice.id}
              role="button"
              tabIndex={0}
              aria-label={`Select Directive ${index + 1}: ${choice.title}`}
              onClick={() => {
                audioEngine.playClick();
                onSelectChoice(choice);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  audioEngine.playClick();
                  onSelectChoice(choice);
                }
              }}
              className="p-4 rounded-xl bg-space-950/90 border border-slate-700 hover:border-cyan-400 hover:bg-space-800/90 transition-all cursor-pointer group hover:shadow-cyan-glow/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-cyan-500 text-slate-300 group-hover:text-space-950 font-bold text-xs flex items-center justify-center font-mono">
                    {index + 1}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300">
                    {choice.title}
                  </h4>
                </div>

                {/* Resource Impact Pills */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {choice.resourceImpacts.batteryKWhDelta !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded ${
                        choice.resourceImpacts.batteryKWhDelta < 0
                          ? 'bg-red-950/80 text-coral-neon border border-red-800'
                          : 'bg-emerald-950/80 text-emerald-neon border border-emerald-800'
                      }`}
                    >
                      Battery {choice.resourceImpacts.batteryKWhDelta > 0 ? '+' : ''}
                      {choice.resourceImpacts.batteryKWhDelta} kWh
                    </span>
                  )}

                  {choice.resourceImpacts.oxygenKgDelta !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded ${
                        choice.resourceImpacts.oxygenKgDelta < 0
                          ? 'bg-red-950/80 text-coral-neon border border-red-800'
                          : 'bg-emerald-950/80 text-emerald-neon border border-emerald-800'
                      }`}
                    >
                      O2 {choice.resourceImpacts.oxygenKgDelta > 0 ? '+' : ''}
                      {choice.resourceImpacts.oxygenKgDelta} kg
                    </span>
                  )}

                  {choice.resourceImpacts.waterLitersDelta !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded ${
                        choice.resourceImpacts.waterLitersDelta < 0
                          ? 'bg-red-950/80 text-coral-neon border border-red-800'
                          : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      H2O {choice.resourceImpacts.waterLitersDelta > 0 ? '+' : ''}
                      {choice.resourceImpacts.waterLitersDelta} L
                    </span>
                  )}

                  {choice.resourceImpacts.moraleDelta !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded ${
                        choice.resourceImpacts.moraleDelta < 0
                          ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                          : 'bg-purple-900/80 text-purple-200 border border-purple-700'
                      }`}
                    >
                      Morale {choice.resourceImpacts.moraleDelta > 0 ? '+' : ''}
                      {choice.resourceImpacts.moraleDelta}%
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">
                {isCadet ? choice.cadetDescription : choice.engineeringDescription}
              </p>

              <div className="text-[11px] font-mono text-amber-300/90 bg-amber-950/30 px-2.5 py-1.5 rounded border border-amber-900/40">
                ⚖️ <strong>Trade-Off:</strong> {choice.tradeOffSummary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
