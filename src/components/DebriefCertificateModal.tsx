'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { MissionConfig, ResourceState, SolLogEntry, AudienceMode } from '../types/mission';
import { MissionPatchBadge } from './MissionPatchBadge';
import { audioEngine } from '../lib/audioEngine';
import { storage } from '../lib/storage';

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
    storage.unlockBadge(`${mission.id.toUpperCase()}_SURVIVOR`);

    // Load saved callsign if available
    const profile = storage.getPlayerProfile();
    if (profile.callsign) {
      setCallsign(profile.callsign);
    }
  }, [mission.id]);

  // Calculate efficiency score (0-100)
  const batteryScore = Math.min(25, (finalResources.batteryKWh / finalResources.batteryCapacityKWh) * 25);
  const o2Score = Math.min(25, (finalResources.oxygenKg / 90) * 25);
  const waterScore = Math.min(20, (finalResources.waterLiters / 350) * 20);
  const moraleScore = Math.min(20, (finalResources.crewMoralePct / 100) * 20);
  const radiationScore = Math.max(0, 10 - finalResources.radiationDoseAccumulatedMSv * 0.2);

  const totalScore = Math.round(batteryScore + o2Score + waterScore + moraleScore + radiationScore);

  const handleCopySummary = () => {
    const text = `🚀 OUTPOST ZERO: JUNIOR ASTRONAUT MISSION COMPLETE!
👨‍🚀 Flight Director: ${callsign}
🌍 Mission: ${mission.name} (${mission.missionDurationSols} Sols Survived)
🏆 Total Flight Efficiency Score: ${totalScore}/100
⚡ Final Battery: ${Math.round((finalResources.batteryKWh / finalResources.batteryCapacityKWh) * 100)}%
🌬️ Final Oxygen: ${finalResources.oxygenKg.toFixed(1)} kg
💧 Final Water: ${finalResources.waterLiters.toFixed(1)} L
🛡️ Accumulated Radiation: ${finalResources.radiationDoseAccumulatedMSv.toFixed(2)} mSv (Safe)
😊 Crew Morale: ${finalResources.crewMoralePct}%
Certified by Team Parakram for the 2026 NASA Space Apps Challenge!`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-space-900 border-2 border-cyan-400 shadow-cyan-glow p-5 sm:p-8 my-auto text-white">
        {/* Certificate Decorative Border Container */}
        <div className="p-4 sm:p-6 rounded-xl border border-cyan-500/40 bg-gradient-to-b from-space-950/90 to-space-900/90 relative overflow-hidden">
          {/* Watermark Patch */}
          <div className="absolute right-4 top-4 opacity-20 pointer-events-none">
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
            <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-yellow-200 to-emerald-300">
              CERTIFIED JUNIOR ASTRONAUT FLIGHT DIRECTOR
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Official Mission Certification for Outpost Zero Spaceflight Operations
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
                  className="px-3 py-1 bg-space-950 border border-cyan-400 rounded text-cyan-neon font-bold text-lg text-center font-mono"
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
              For exemplary systems engineering and leadership on the <strong>{mission.name}</strong>
            </div>
          </div>

          {/* Efficiency Score & Trade-Off Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-space-950/80 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">Overall Score</div>
              <div className="text-2xl font-black font-mono text-cyan-neon mt-0.5">
                {totalScore}/100
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">Mission Success</div>
            </div>

            <div className="p-3 rounded-lg bg-space-950/80 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">EPS Efficiency</div>
              <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
                {Math.round((finalResources.batteryKWh / finalResources.batteryCapacityKWh) * 100)}%
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Battery Buffer</div>
            </div>

            <div className="p-3 rounded-lg bg-space-950/80 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">ECLSS Balance</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                {finalResources.oxygenKg.toFixed(1)} kg
              </div>
              <div className="text-[10px] text-slate-400 font-mono">O2 Surplus Kept</div>
            </div>

            <div className="p-3 rounded-lg bg-space-950/80 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-mono text-slate-400">Dosimetry</div>
              <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                {finalResources.radiationDoseAccumulatedMSv.toFixed(2)} mSv
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">Safe Deep Space</div>
            </div>
          </div>

          {/* Trade-Offs Mastered Badges */}
          <div className="mb-6 p-4 rounded-xl bg-space-950/60 border border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-400 mb-2">
              Trade-Off Competencies Mastered:
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                ✅ Closed-Loop ECLSS Balance
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                ✅ Hydroponic Biomass Management
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800 text-amber-300">
                ✅ Regolith & Water-Wall Radiation Shielding
              </span>
              <span className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
                ✅ Autonomous ISRU Volatiles Extraction
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopySummary}
              className="flex-1 py-3 px-4 rounded-xl font-bold font-mono text-xs uppercase transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-space-950 hover:from-cyan-400 hover:to-teal-300 shadow-cyan-glow/20"
            >
              <span>📋</span>
              <span>{copied ? 'Copied to Clipboard! ✅' : 'Copy Shareable Summary'}</span>
            </button>

            <button
              onClick={handlePrintCertificate}
              className="py-3 px-4 rounded-xl font-mono text-xs uppercase bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700 flex items-center gap-2"
            >
              <span>🖨️</span>
              <span>Print Certificate</span>
            </button>

            <button
              onClick={onRestart}
              className="py-3 px-4 rounded-xl font-mono text-xs uppercase bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700"
            >
              🔄 Play Again
            </button>

            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl font-mono text-xs uppercase bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
