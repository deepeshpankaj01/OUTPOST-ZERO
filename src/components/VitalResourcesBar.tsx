'use client';

import React from 'react';
import { ResourceState, AudienceMode } from '../types/mission';

interface VitalResourcesBarProps {
  resources: ResourceState;
  mode: AudienceMode;
  onOpenScienceLab?: () => void;
}

export const VitalResourcesBar: React.FC<VitalResourcesBarProps> = ({
  resources,
  mode,
  onOpenScienceLab,
}) => {
  const isCadet = mode === 'cadet';

  // Calculate percentages and statuses
  const batteryPct = Math.round(
    (resources.batteryKWh / Math.max(1, resources.batteryCapacityKWh)) * 100
  );
  const batteryStatus =
    batteryPct > 40 ? 'Nominal' : batteryPct > 20 ? 'Caution' : 'Critical';

  // Benchmark maximums for intuitive percentage visualization
  const oxygenPct = Math.min(100, Math.round((resources.oxygenKg / 90) * 100));
  const oxygenStatus =
    resources.oxygenKg > 40 ? 'Nominal' : resources.oxygenKg > 20 ? 'Caution' : 'Critical';

  const waterPct = Math.min(100, Math.round((resources.waterLiters / 350) * 100));
  const waterStatus =
    resources.waterLiters > 150 ? 'Nominal' : resources.waterLiters > 50 ? 'Caution' : 'Critical';

  const isTempNominal = resources.cabinTempC >= 18.0 && resources.cabinTempC <= 26.5;
  const tempStatus = isTempNominal
    ? 'Nominal'
    : resources.cabinTempC < 18.0
    ? 'Cold'
    : 'Elevated';

  const moraleStatus =
    resources.crewMoralePct >= 70
      ? 'High'
      : resources.crewMoralePct >= 40
      ? 'Moderate'
      : 'Stressed';

  const getStatusBadge = (status: string, goodWord: string = 'Nominal') => {
    switch (status) {
      case 'Nominal':
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {goodWord}
          </span>
        );
      case 'Caution':
      case 'Moderate':
      case 'Cold':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <section
      aria-label="Vital Habitat Life Support Resources"
      className="w-full"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. POWER & BATTERY */}
        <div className="clean-card p-3.5 sm:p-4 hover:border-sky-500/30 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <span className="text-base" aria-hidden="true">⚡</span>
                <span className="font-semibold text-white">
                  {isCadet ? 'Battery Power' : 'EPS Battery Bank'}
                </span>
              </div>
              {getStatusBadge(batteryStatus, isCadet ? 'Good' : 'Nominal')}
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
                {batteryPct}%
              </span>
              <span className="text-xs font-mono text-slate-400">
                {resources.batteryKWh.toFixed(1)} / {resources.batteryCapacityKWh} kWh
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  batteryPct > 40
                    ? 'bg-sky-400'
                    : batteryPct > 20
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, batteryPct))}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-1 group-hover:text-slate-300 transition-colors">
            {isCadet
              ? 'Stores electricity for heaters & life support'
              : 'Emergency buffer during low solar & shadow periods'}
          </p>
        </div>

        {/* 2. OXYGEN SUPPLY */}
        <div className="clean-card p-3.5 sm:p-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <span className="text-base" aria-hidden="true">🌬️</span>
                <span className="font-semibold text-white">
                  {isCadet ? 'Breathable Air' : 'ECLSS Oxygen'}
                </span>
              </div>
              {getStatusBadge(oxygenStatus, isCadet ? 'Safe' : 'Nominal')}
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-emerald-400">
                {resources.oxygenKg.toFixed(1)} <span className="text-sm font-sans font-normal text-slate-400">kg</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                {isCadet ? `${oxygenPct}% capacity` : '3.84 kg/Sol crew demand'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  resources.oxygenKg > 35
                    ? 'bg-emerald-400'
                    : resources.oxygenKg > 18
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, oxygenPct))}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-1 group-hover:text-slate-300 transition-colors">
            {isCadet
              ? 'Produced by the air maker & plants'
              : 'NASA-STD-3001 baseline: 0.96 kg/crew/Sol'}
          </p>
        </div>

        {/* 3. WATER SUPPLY */}
        <div className="clean-card p-3.5 sm:p-4 hover:border-blue-500/30 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <span className="text-base" aria-hidden="true">💧</span>
                <span className="font-semibold text-white">
                  {isCadet ? 'Clean Water' : 'Potable Water'}
                </span>
              </div>
              {getStatusBadge(waterStatus, isCadet ? 'Pure' : 'Recycled')}
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-sky-400">
                {resources.waterLiters.toFixed(0)} <span className="text-sm font-sans font-normal text-slate-400">L</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                {isCadet ? `${waterPct}% full` : '15.5 L/Sol turnover'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  resources.waterLiters > 120
                    ? 'bg-sky-400'
                    : resources.waterLiters > 60
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, waterPct))}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-1 group-hover:text-slate-300 transition-colors">
            {isCadet
              ? 'Filtered by water recycler + rover ice drilling'
              : 'WRS recycling loop supplemented by ISRU drills'}
          </p>
        </div>

        {/* 4. CABIN TEMPERATURE */}
        <div className="clean-card p-3.5 sm:p-4 hover:border-amber-500/30 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <span className="text-base" aria-hidden="true">🌡️</span>
                <span className="font-semibold text-white">
                  {isCadet ? 'Cabin Warmth' : 'TCS Thermal Cabin'}
                </span>
              </div>
              {getStatusBadge(tempStatus, isCadet ? 'Warm' : 'Optimal')}
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span
                className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${
                  isTempNominal ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {resources.cabinTempC.toFixed(1)}°C
              </span>
              <span className="text-xs font-mono text-slate-400">
                Target: 18°–24°C
              </span>
            </div>

            {/* Progress Bar with comfort zone indicator */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 relative">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isTempNominal ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.max(10, ((resources.cabinTempC - 5) / 25) * 100))}%`,
                }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-1 group-hover:text-slate-300 transition-colors">
            {isCadet
              ? 'Keep heaters running so the crew stays comfortable'
              : 'Conductive losses offset by Active Thermal Loop'}
          </p>
        </div>
      </div>
    </section>
  );
};
