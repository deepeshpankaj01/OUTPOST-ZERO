'use client';

import React from 'react';
import { PreFlightDelta, AudienceMode, ResourceState } from '../types/mission';
import { audioEngine } from '../lib/audioEngine';

interface PreFlightCalculatorProps {
  deltas: PreFlightDelta;
  currentResources: ResourceState;
  currentSol: number;
  maxSols: number;
  mode: AudienceMode;
  onAdvanceSol: () => void;
  onResetToBaseline: () => void;
  isSimulating?: boolean;
}

export const PreFlightCalculator: React.FC<PreFlightCalculatorProps> = ({
  deltas,
  currentResources,
  currentSol,
  maxSols,
  mode,
  onAdvanceSol,
  onResetToBaseline,
  isSimulating = false,
}) => {
  const isCadet = mode === 'cadet';

  const handleAdvance = () => {
    audioEngine.playSolAdvance();
    onAdvanceSol();
  };

  return (
    <div className="rounded-2xl bg-space-950/90 border border-cyan-500/30 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-neon animate-pulse" aria-hidden="true" />
          <h3 className="text-base font-bold text-cyan-300 font-mono tracking-wide uppercase">
            {isCadet ? '🔮 Pre-Flight Consequence Preview' : 'Trajectory & Subsystems Predictive Telemetry'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioEngine.playClick();
              onResetToBaseline();
            }}
            aria-label="Reset subsystem allocations to baseline target parameters"
            className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono transition-colors focus:ring-2 focus:ring-cyan-400"
          >
            ↺ {isCadet ? 'Reset to Baseline' : 'Reset NASA-STD Nominal'}
          </button>
        </div>
      </div>

      {/* Real-time Projected Deltas Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {/* Battery Prediction */}
        <div className="p-3 rounded-xl bg-space-900 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-slate-400">
            {isCadet ? 'Battery Next Sol' : 'EPS Storage Buffer'}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-lg font-bold font-mono ${
                deltas.projectedBatteryPct < 25 ? 'text-coral-neon' : 'text-cyan-neon'
              }`}
            >
              {deltas.projectedBatteryPct.toFixed(0)}%
            </span>
            <span
              className={`text-xs font-mono ${
                deltas.batteryNetKWh < 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              ({deltas.batteryNetKWh > 0 ? '+' : ''}
              {deltas.batteryNetKWh} kWh)
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {deltas.projectedBatteryPct < 25 ? '⚠️ Storage Low' : '✅ Nominal Buffer'}
          </div>
        </div>

        {/* Oxygen Prediction */}
        <div className="p-3 rounded-xl bg-space-900 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-slate-400">
            {isCadet ? 'Oxygen Reserve' : 'ECLSS O2 Partial Press.'}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-bold font-mono text-emerald-400">
              {deltas.projectedOxygenKg.toFixed(1)} kg
            </span>
            <span
              className={`text-xs font-mono ${
                deltas.oxygenNetKg < 0 ? 'text-coral-neon' : 'text-emerald-400'
              }`}
            >
              ({deltas.oxygenNetKg > 0 ? '+' : ''}
              {deltas.oxygenNetKg} kg)
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {deltas.oxygenNetKg < 0 ? '⚠️ Drawdown Net Loss' : '✅ Steady Synthesis'}
          </div>
        </div>

        {/* Cabin Temperature Prediction */}
        <div className="p-3 rounded-xl bg-space-900 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-slate-400">
            {isCadet ? 'Cabin Warmth' : 'TCS Cabin Temperature'}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-lg font-bold font-mono ${
                deltas.projectedTempC < 18.3 ? 'text-cyan-300' : 'text-amber-400'
              }`}
            >
              {deltas.projectedTempC.toFixed(1)}°C
            </span>
            <span className="text-[11px] text-slate-400 font-mono">(Target 22°C)</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {deltas.projectedTempC < 18.3 ? '❄️ Below NASA Envelope' : '✅ Thermal Nominal'}
          </div>
        </div>

        {/* Radiation Dose Prediction */}
        <div className="p-3 rounded-xl bg-space-900 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-slate-400">
            {isCadet ? 'Radiation Scenario Index' : 'Scenario Exposure Index'}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-lg font-bold font-mono ${
                deltas.projectedRadiationDoseMSv > 1.5 ? 'text-coral-neon' : 'text-emerald-400'
              }`}
            >
              {deltas.projectedRadiationDoseMSv.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">mSv/day</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {deltas.projectedRadiationDoseMSv > 1.5 ? '⚠️ Elevated Flux Scenario' : '✅ Baseline Scenario Estimate'}
          </div>
        </div>
      </div>

      {/* Warnings & Alerts Ribbon */}
      {(deltas.warningAlerts.length > 0 || deltas.nominalAlerts.length > 0) && (
        <div className="mb-5 flex flex-wrap gap-2">
          {deltas.warningAlerts.map((w, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-500/50 text-amber-200 inline-flex items-center gap-1.5"
            >
              <span aria-hidden="true">⚠️</span>
              <span>{w}</span>
            </span>
          ))}

          {deltas.nominalAlerts.map((n, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 inline-flex items-center gap-1.5"
            >
              <span aria-hidden="true">✅</span>
              <span>{n}</span>
            </span>
          ))}
        </div>
      )}

      {/* Primary Action Button */}
      <button
        onClick={handleAdvance}
        disabled={isSimulating}
        aria-label={
          currentSol >= maxSols
            ? 'Complete Scenario & Generate Educational Certification'
            : `Commit Subsystem Allocations & Advance to Sol ${currentSol + 1}`
        }
        className="w-full py-4 px-6 rounded-xl font-bold font-mono text-base tracking-wider uppercase transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-space-950 hover:from-cyan-400 hover:to-emerald-300 hover:shadow-cyan-glow disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 focus:ring-4 focus:ring-cyan-400/50"
      >
        <span aria-hidden="true">🚀</span>
        <span>
          {currentSol >= maxSols
            ? 'Complete Scenario & Generate Educational Certificate'
            : isCadet
            ? `Commit Trade-Offs & Advance to Sol ${currentSol + 1}`
            : `Execute Flight Telemetry Cycle → Sol ${currentSol + 1}`}
        </span>
        <span className="font-sans text-xs bg-space-950/20 px-2 py-0.5 rounded font-normal">
          Sol {currentSol} of {maxSols}
        </span>
      </button>
    </div>
  );
};
