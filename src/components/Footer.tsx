'use client';

import React from 'react';
import { MissionPatchBadge } from './MissionPatchBadge';

interface FooterProps {
  onOpenScienceLab: () => void;
  onOpenBriefing?: () => void;
  onResetProgress: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenScienceLab, onOpenBriefing, onResetProgress }) => {
  return (
    <footer className="w-full bg-space-950 border-t border-slate-800/80 py-8 px-4 sm:px-6 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Persistent Educational Notice */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 flex items-start gap-2.5">
          <span className="text-amber-400 text-base" aria-hidden="true">⚠️</span>
          <div>
            <strong>Persistent Notice:</strong> OUTPOST ZERO is an educational simulation, not an engineering design tool, flight procedure, radiation safety assessment, or NASA/ISRO-endorsed product.
          </div>
        </div>

        {/* Super Intelligence (SI) Disclosure & Compliance Badge */}
        <div className="p-4 rounded-xl bg-space-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl sm:text-2xl mt-0.5" aria-hidden="true">🤖</span>
            <div>
              <div className="font-bold text-xs uppercase font-mono text-cyan-neon">
                Super Intelligence (SI) Transparency &amp; Compliance Disclosure
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                SI Transparency: Application code, UI layout scaffolding, and procedural Web Audio/SVG synthesis were accelerated using Super Intelligence (SI) AI coding tools by Team Parakram; all simulation mechanics and cited data are cross-referenced with public NASA and ISRO technical documentation.
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
            {onOpenBriefing && (
              <>
                <button
                  onClick={onOpenBriefing}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline focus:ring-1 focus:ring-cyan-400"
                >
                  📖 Mission Briefing
                </button>
                <span className="text-slate-700" aria-hidden="true">•</span>
              </>
            )}
            <button
              onClick={onOpenScienceLab}
              className="text-cyan-400 hover:text-cyan-300 hover:underline focus:ring-1 focus:ring-cyan-400"
            >
              🔬 Science Lab &amp; Provenance
            </button>
            <span className="text-slate-700" aria-hidden="true">•</span>
            <button
              onClick={onResetProgress}
              className="text-slate-400 hover:text-coral-neon transition-colors focus:ring-1 focus:ring-coral-400"
            >
              🔄 Reset Progress &amp; State
            </button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/40 leading-relaxed">
          Educational simulation for the 2026 NASA Space Apps Challenge (&quot;Build a Junior Astronaut Mission Trainer&quot;).
          In strict compliance with challenge rules, no official NASA meatball/worm logos or ISRO seals are used.
          Ground-truth data derived from NASA-STD-3001, ISS ECLSS, ISRO Chandrayaan-3 ChaSTE (69.37°S), and NASA Perseverance MOXIE/MEDA public archives.
        </div>
      </div>
    </footer>
  );
};
