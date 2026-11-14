'use client';

import React from 'react';
import { MissionPatchBadge } from './MissionPatchBadge';

interface FooterProps {
  onOpenScienceLab: () => void;
  onResetProgress: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenScienceLab, onResetProgress }) => {
  return (
    <footer className="w-full bg-space-950 border-t border-slate-800/80 py-8 px-4 sm:px-6 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Super Intelligence (SI) Disclosure & Compliance Badge */}
        <div className="p-4 rounded-xl bg-space-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl sm:text-2xl mt-0.5">🤖</span>
            <div>
              <div className="font-bold text-xs uppercase font-mono text-cyan-neon">
                Super Intelligence (SI) Transparency & Compliance Disclosure
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                SI Transparency: Application code and procedural visual/audio elements were accelerated with AI/SI tools; all simulation physics are grounded in curated NASA &amp; ISRO datasets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              NASA Space Apps 2026 Compliant
            </span>
          </div>
        </div>

        {/* Middle Credits & Attribution */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <MissionPatchBadge size={38} />
            <div>
              <div className="font-bold text-white font-mono">
                OUTPOST ZERO: Junior Astronaut Mission Trainer
              </div>
              <div className="text-[11px] text-slate-400">
                Created by <strong>Team Parakram</strong> for the 2026 NASA Space Apps Challenge
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <button
              onClick={onOpenScienceLab}
              className="text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Science Lab &amp; Lesson Plan
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={onResetProgress}
              className="text-slate-400 hover:text-coral-neon transition-colors"
            >
              Reset Saved Progress
            </button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/40">
          Educational simulation for the 2026 NASA Space Apps Challenge (&quot;Build a Junior Astronaut Mission Trainer&quot;).
          In compliance with challenge rules, no official NASA meatball/worm logos or ISRO seals are used.
          Ground-truth data derived from NASA-STD-3001, ISS ECLSS, ISRO Chandrayaan-3 ChaSTE, and NASA Perseverance MOXIE/MEDA public archives.
        </div>
      </div>
    </footer>
  );
};
