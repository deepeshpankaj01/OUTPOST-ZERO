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
  const hasWarnings = deltas.warningAlerts.length > 0;

  const handleAdvance = () => {
    audioEngine.playSolAdvance();
    onAdvanceSol();
  };

  return (
    <div className="clean-card p-4 sm:p-5 shadow-card border-slate-700/80">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base" aria-hidden="true">🔮</span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {isCadet ? 'Consequence Preview: What Happens Next?' : 'Subsystems Predictive Telemetry'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isCadet
              ? 'Review how your slider choices will change base reserves over the next Sol.'
              : 'Deterministic 1-Sol balance model based on current continuous power allocations.'}
          </p>
        </div>

        <button
          onClick={() => {
            audioEngine.playClick();
            onResetToBaseline();
          }}
          className="px-2.5 py-1 text-xs rounded-lg bg-space-900 hover:bg-space-850 text-slate-300 border border-slate-700 font-mono transition-colors focus:ring-1 focus:ring-sky-400"
          title="Reset subsystem allocations to baseline target parameters"
        >
          ↺ {isCadet ? 'Reset Baseline' : 'Reset NASA Nominal'}
        </button>
      </div>

      {/* Projected Impacts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {/* Battery Net Delta */}
        <div className="clean-card-subtle p-3">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">
            {isCadet ? 'Battery Next Sol' : 'EPS Storage Buffer'}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-lg font-bold font-mono ${
                deltas.projectedBatteryPct < 25 ? 'text-rose-400' : 'text-sky-300'
              }`}
            >
              {deltas.projectedBatteryPct.toFixed(0)}%
            </span>
            <span
              className={`text-xs font-mono font-medium ${
                deltas.batteryNetKWh < 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              ({deltas.batteryNetKWh > 0 ? '+' : ''}
              {deltas.batteryNetKWh} kWh)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            {deltas.projectedBatteryPct < 25 ? '⚠️ Battery Draining' : '✅ Stable Buffer'}
          </span>
        </div>

        {/* Oxygen Balance */}
        <div className="clean-card-subtle p-3">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">
            {isCadet ? 'Oxygen Reserve' : 'ECLSS O₂ Reserves'}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-bold font-mono text-emerald-400">
              {deltas.projectedOxygenKg.toFixed(1)} <span className="text-xs font-sans text-slate-400">kg</span>
            </span>
            <span
              className={`text-xs font-mono font-medium ${
                deltas.oxygenNetKg < 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              ({deltas.oxygenNetKg > 0 ? '+' : ''}
              {deltas.oxygenNetKg} kg)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            {deltas.oxygenNetKg < 0 ? '⚠️ Reserve Drawdown' : '✅ Synthesis Surplus'}
          </span>
        </div>

        {/* Water Balance */}
        <div className="clean-card-subtle p-3">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">
            {isCadet ? 'Water Reserve' : 'Potable Water Balance'}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-bold font-mono text-sky-400">
              {deltas.projectedWaterLiters.toFixed(0)} <span className="text-xs font-sans text-slate-400">L</span>
            </span>
            <span
              className={`text-xs font-mono font-medium ${
                deltas.waterNetLiters < 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              ({deltas.waterNetLiters > 0 ? '+' : ''}
              {deltas.waterNetLiters} L)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            {deltas.waterNetLiters < 0 ? '⚠️ Drawdown' : '✅ Recycled & Harvested'}
          </span>
        </div>

        {/* Cabin Temp & Exposure */}
        <div className="clean-card-subtle p-3">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">
            {isCadet ? 'Cabin Warmth' : 'TCS Cabin Temp'}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-lg font-bold font-mono ${
                deltas.projectedTempC < 18 ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              {deltas.projectedTempC.toFixed(1)}°C
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ({deltas.projectedRadiationDoseMSv.toFixed(2)} mSv/d)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            {deltas.projectedTempC < 18 ? '⚠️ Too Chilly' : '✅ Comfortable Warmth'}
          </span>
        </div>
      </div>

      {/* Warning or Nominal Alerts */}
      {hasWarnings && (
        <div className="mb-4 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs flex items-center gap-2">
          <span aria-hidden="true" className="text-sm">⚠️</span>
          <div className="flex-1">
            <strong>Warning:</strong> {deltas.warningAlerts[0]}
          </div>
        </div>
      )}

      {/* Prominent Advance Sol Action Button */}
      <button
        onClick={handleAdvance}
        disabled={isSimulating}
        className="w-full py-3 px-6 rounded-xl font-bold font-mono tracking-wide text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
      >
        <span>Confirm Allocations &amp; Advance to Sol {Math.min(maxSols, currentSol + 1)}</span>
        <span aria-hidden="true">➔</span>
      </button>
    </div>
  );
};
