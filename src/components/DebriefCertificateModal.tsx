'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { MissionConfig, ResourceState, SolLogEntry, AudienceMode } from '../types/mission';
import { MissionPatchBadge } from './MissionPatchBadge';
import { audioEngine } from '../lib/audioEngine';
import { storage } from '../lib/storage';
import { calculateMissionScore } from '../lib/simulationEngine';

interface DebriefCertificateModalProps {
  mission: MissionConfig;
  finalResources: ResourceState;
  history: SolLogEntry[];
  mode: AudienceMode;
  onClose: () => void;
  onRestart: () => void;
}

export const DebriefCertificateModal: React.FC<DebriefCertificateModalProps> = ({
  mission,
  finalResources,
  history,
  mode,
  onClose,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);
  const [callsign, setCallsign] = useState('Cadet Explorer');
  const [isEditingCallsign, setIsEditingCallsign] = useState(false);

  // Derive score directly from recorded gameplay
  const totalScore = calculateMissionScore(finalResources, history);

  useEffect(() => {
    // Play procedural victory fanfare
    audioEngine.playVictoryFanfare();

    // Trigger colorful confetti shower
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#10B981', '#F59E0B', '#FBBF24', '#38BDF8'],
      });
    } catch (e) {}

    // Unlock badge in local storage
    storage.unlockBadge(`${mission.id.toUpperCase()}_COMPLETED`);

    // Load saved callsign if available
    const profile = storage.getPlayerProfile();
    if (profile.callsign) {
      setCallsign(profile.callsign);
    }
  }, [mission.id]);

  const handleCopySummary = () => {
    const text = `🚀 OUTPOST ZERO: EDUCATIONAL MISSION SCENARIO COMPLETED
👨‍🚀 Flight Director Callsign: ${callsign}
🌍 Mission Scenario: ${mission.name} (${mission.missionDurationSols} Sols Completed)
🏆 Recorded Simulation Score: ${totalScore}/100
⚡ Final Stored Battery: ${Math.round((finalResources.batteryKWh / finalResources.batteryCapacityKWh) * 100)}% (${finalResources.batteryKWh.toFixed(0)} kWh)
🌬️ Final Oxygen Storage: ${finalResources.oxygenKg.toFixed(1)} kg
💧 Final Potable Water: ${finalResources.waterLiters.toFixed(1)} L
🛡️ Scenario Exposure Index: ${finalResources.radiationDoseAccumulatedMSv.toFixed(2)} mSv (Simulation Estimate)
😊 Crew Morale: ${finalResources.crewMoralePct}%
* Note: OUTPOST ZERO is an educational simulation. Not an official NASA or ISRO certificate.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveCallsign = (newName: string) => {
    setCallsign(newName);
    const profile = storage.getPlayerProfile();
    profile.callsign = newName;
    storage.savePlayerProfile(profile);
    setIsEditingCallsign(false);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl rounded-2xl bg-space-900 border border-sky-400/40 shadow-2xl p-5 sm:p-7 my-auto text-white">
        {/* Certificate Decorative Border Container */}
        <div className="p-4 sm:p-6 rounded-xl border border-cyan-500/40 bg-gradient-to-b from-space-950/90 to-space-900/90 relative overflow-hidden">
          {/* Watermark Patch */}
          <div className="absolute right-4 top-4 opacity-20 pointer-events-none" aria-hidden="true">
            <MissionPatchBadge size={140} />
          </div>

          {/* Certificate Header */}
          <div className="text-center mb-6">
            <div className="inline-block mb-2">
              <MissionPatchBadge size={72} />
            </div>

            <div className="text-xs font-mono tracking-widest uppercase text-cyan-neon font-bold">
              2026 NASA SPACE APPS CHALLENGE • TEAM PARAKRAM
            </div>
            <h1
              id="certificate-title"
              className="text-xl sm:text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-yellow-200 to-emerald-300"
            >
              OUTPOST ZERO Educational Mission Completion
            </h1>
            <p className="text-[11px] text-amber-300/90 mt-1 font-mono">
              * Educational Simulation Recognition • Not an official NASA or ISRO certificate
            </p>
          </div>

          {/* Callsign / Recipient */}
          <div className="text-center mb-6">
            <div className="text-xs uppercase font-mono text-slate-400">Awarded To:</div>
            {isEditingCallsign ? (
              <div className="inline-flex items-center gap-2 mt-1">
                <input
                  type="text"
                  defaultValue={callsign}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveCallsign((e.target as HTMLInputElement).value);
                  }}
                  onBlur={(e) => handleSaveCallsign(e.target.value)}
                  autoFocus
                  className="px-3 py-1 bg-space-950 border border-cyan-400 rounded text-cyan-neon font-bold text-lg text-center font-mono focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            ) : (
              <div
                onClick={() => setIsEditingCallsign(true)}
                className="inline-flex items-center gap-2 mt-1 cursor-pointer group"
                title="Click to customize your astronaut callsign"
              >
                <span className="text-xl sm:text-2xl font-black text-cyan-300 border-b border-dashed border-cyan-500/60 pb-0.5 group-hover:text-cyan-neon">
                  {callsign}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-cyan-300">✏️</span>
              </div>
            )}
            <div className="text-xs text-slate-400 mt-1">
              For mastering aerospace resource trade-offs in the <strong>{mission.name}</strong> scenario
            </div>
          </div>

          {/* Efficiency Score & Trade-Off Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-space-950/80 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">Derived Score</div>
              <div className="text-2xl font-black font-mono text-cyan-neon mt-0.5">
                {totalScore}/100
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">Scenario Completed</div>
            </div>

            <div className="p-3 rounded-lg bg-space-950/80 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">Battery Buffer</div>
              <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
                {Math.round((finalResources.batteryKWh / finalResources.batteryCapacityKWh) * 100)}%
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{finalResources.batteryKWh.toFixed(0)} kWh stored</div>
            </div>

            <div className="p-3 rounded-lg bg-space-950/80 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">O2 Balance</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                {finalResources.oxygenKg.toFixed(1)} kg
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Reserves Preserved</div>
            </div>

            <div className="p-3 rounded-lg bg-space-950/80 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">Exposure Index</div>
              <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                {finalResources.radiationDoseAccumulatedMSv.toFixed(2)} mSv
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">Scenario Estimate</div>
            </div>
          </div>

          {/* Competencies Mastered */}
          <div className="mb-6 p-4 rounded-xl bg-space-950/60 border border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-400 mb-2">
              Aerospace Engineering Competencies Mastered:
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                ✅ Continuous Power vs. Daily Energy (kW vs. kWh)
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                ✅ Closed-Loop Life Support &amp; Metabolic Replacement
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800 text-amber-300">
                ✅ Regolith Thermal Insulation &amp; Radiation Deflection
              </span>
              <span className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
                ✅ Non-Punitive Systems Engineering Iteration
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopySummary}
              className="flex-1 py-3 px-4 rounded-xl font-bold font-mono text-xs uppercase transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-space-950 hover:from-cyan-400 hover:to-teal-300 shadow-cyan-glow/20 focus:ring-2 focus:ring-cyan-400"
            >
              <span aria-hidden="true">📋</span>
              <span>{copied ? 'Copied to Clipboard! ✅' : 'Copy Shareable Summary'}</span>
            </button>

            <button
              onClick={handlePrintCertificate}
              className="py-3 px-4 rounded-xl font-mono text-xs uppercase bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700 flex items-center gap-2 focus:ring-2 focus:ring-slate-400"
            >
              <span aria-hidden="true">🖨️</span>
              <span>Print Certificate</span>
            </button>

            <button
              onClick={onRestart}
              className="py-3 px-4 rounded-xl font-mono text-xs uppercase bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700 focus:ring-2 focus:ring-slate-400"
            >
              🔄 Play Again
            </button>

            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl font-mono text-xs uppercase bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white focus:ring-2 focus:ring-slate-400"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
