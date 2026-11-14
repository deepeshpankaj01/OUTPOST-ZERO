'use client';

import React, { useEffect } from 'react';
import { FailureReason, AudienceMode } from '../types/mission';
import { audioEngine } from '../lib/audioEngine';

interface TimeMachineModalProps {
  failureReason: FailureReason;
  currentSol: number;
  mode: AudienceMode;
  canRewind: boolean;
  onRewindOneSol: () => void;
  onRestartMission: () => void;
}

export const TimeMachineModal: React.FC<TimeMachineModalProps> = ({
  failureReason,
  currentSol,
  mode,
  canRewind,
  onRewindOneSol,
  onRestartMission,
}) => {
  const isCadet = mode === 'cadet';

  useEffect(() => {
    audioEngine.playFailureTone();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-space-900 border-2 border-cyan-400/80 shadow-cyan-glow p-6 sm:p-8 my-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-xl">
            ⏪
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-neon font-bold">
              Engineering Failure Analysis & Time Machine • Sol {currentSol}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {failureReason.title}
            </h2>
          </div>
        </div>

        {/* NASA Scientific Explanation Box */}
        <div className="mb-5 p-4 rounded-xl bg-space-950 border border-slate-800 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <span>🔬</span>
            <span>Aerospace Physics Debrief:</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {failureReason.scientificExplanation}
          </p>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-300/80">
            NASA/ISRO Reference: <span className="text-white">{failureReason.nasaReference}</span>
          </div>
        </div>

        {/* Commander Aria Coaching Box */}
        <div className="mb-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">👩‍🚀</span>
            <span className="text-xs font-bold text-cyan-300 font-mono">
              Commander Aria&apos;s Engineering Recommendation:
            </span>
          </div>
          <p className="text-sm text-slate-200">
            {failureReason.recommendation}
          </p>
        </div>

        {/* Non-punitive Time Machine Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              audioEngine.playSolAdvance();
              onRewindOneSol();
            }}
            disabled={!canRewind}
            className="flex-1 py-3 px-5 rounded-xl font-bold font-mono text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-space-950 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-cyan-glow/30"
          >
            <span>⏪</span>
            <span>Rewind 1 Sol & Adjust Trade-Offs</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onRestartMission();
            }}
            className="py-3 px-5 rounded-xl font-mono text-sm tracking-wider uppercase transition-all bg-space-800 hover:bg-space-700 text-slate-300 border border-slate-700 hover:text-white"
          >
            🔄 Restart Mission
          </button>
        </div>

        <div className="text-center mt-3 text-[11px] font-mono text-slate-400">
          ✨ Real aerospace engineers test scenarios in flight simulators hundreds of times. Rewind as often as you need!
        </div>
      </div>
    </div>
  );
};
