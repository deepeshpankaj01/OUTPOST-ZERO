'use client';

import React from 'react';
import { PowerAllocation, AudienceMode, MissionConfig } from '../types/mission';
import { audioEngine } from '../lib/audioEngine';

interface AllocationSlidersProps {
  mission: MissionConfig;
  allocations: PowerAllocation;
  availablePowerKw: number;
  mode: AudienceMode;
  onChange: (newAllocations: PowerAllocation) => void;
  focusedSlider?: string | null;
}

export const AllocationSliders: React.FC<AllocationSlidersProps> = ({
  mission,
  allocations,
  availablePowerKw,
  mode,
  onChange,
  focusedSlider,
}) => {
  const isCadet = mode === 'cadet';
  const isMars = mission.id === 'mars_jezero';
  const solHours = isMars ? 24.6 : 24.0;

  const totalAllocatedKw = parseFloat(
    (
      allocations.lifeSupportKw +
      allocations.hydroponicsKw +
      allocations.shieldThermalKw +
      allocations.scienceIsruKw
    ).toFixed(2)
  );

  const netPowerDeltaKw = parseFloat((availablePowerKw - totalAllocatedKw).toFixed(2));
  const isDeficit = netPowerDeltaKw < 0;
  const netDailyEnergyKWh = parseFloat((netPowerDeltaKw * solHours).toFixed(1));

  const handleSliderChange = (field: keyof PowerAllocation, val: number) => {
    audioEngine.playSliderTick(val / 8.0);
    const updated = {
      ...allocations,
      [field]: parseFloat(val.toFixed(1)),
    };
    onChange(updated);
  };

  // Subsystem configs with educational guidance
  const subsystems = [
    {
      id: 'lifesupport',
      field: 'lifeSupportKw' as keyof PowerAllocation,
      icon: '🌬️',
      name: isCadet ? 'Air & Water Maker' : isMars ? 'Scaled O₂ Plant & WRS Recycling' : 'ECLSS (O₂ & Water Recycling)',
      subtitle: isCadet
        ? 'Keeps 4 astronauts breathing & hydrated'
        : isMars
        ? 'Hypothetical 16× SOXE plant + closed-loop distillation'
        : 'Water Recovery System & Oxygen Generation Assembly',
      currentKw: allocations.lifeSupportKw,
      minKw: 0.5,
      maxKw: 6.0,
      step: 0.5,
      nominalKw: isMars ? 3.0 : 3.5,
      warningThreshold: isMars ? 2.8 : 3.0,
      warningText: isCadet ? 'Low Air Production! Oxygen will deplete.' : 'Sub-nominal O₂ generation (<3.84 kg/Sol demand).',
      accentColor: 'text-sky-400',
      trackColor: 'bg-sky-500',
    },
    {
      id: 'hydroponics',
      field: 'hydroponicsKw' as keyof PowerAllocation,
      icon: '🌱',
      name: isCadet ? 'Food Greenhouse' : 'Astro-Hydroponics & Food',
      subtitle: isCadet
        ? 'Grows fresh vegetables to boost morale'
        : 'Artificial LED grow arrays supplementing calorie rations',
      currentKw: allocations.hydroponicsKw,
      minKw: 0.0,
      maxKw: 5.0,
      step: 0.5,
      nominalKw: 2.5,
      warningThreshold: 1.0,
      warningText: isCadet ? 'Crops wilting from dim lights.' : 'Hydroponic crop stress (diminished calorie harvest).',
      accentColor: 'text-emerald-400',
      trackColor: 'bg-emerald-500',
    },
    {
      id: 'shielding',
      field: 'shieldThermalKw' as keyof PowerAllocation,
      icon: '🛡️',
      name: isCadet ? 'Cabin Heaters & Shield Berm' : 'Thermal Loops & Hull Shielding',
      subtitle: isCadet
        ? 'Keeps the base warm & piles dirt over the roof'
        : 'Active thermal heating loop & regolith sintering rovers',
      currentKw: allocations.shieldThermalKw,
      minKw: 0.5,
      maxKw: 6.0,
      step: 0.5,
      nominalKw: 3.5,
      warningThreshold: 2.5,
      warningText: isCadet ? 'Cabin is freezing! Turn up heaters.' : 'TCS heat loss risk (conductive hull dissipation).',
      accentColor: 'text-amber-400',
      trackColor: 'bg-amber-500',
    },
    {
      id: 'science',
      field: 'scienceIsruKw' as keyof PowerAllocation,
      icon: '🚜',
      name: isCadet ? 'Ice Harvester Rovers' : 'ISRU Ice Mining & Surface Science',
      subtitle: isCadet
        ? 'Digs up underground water-ice in dark craters'
        : 'Cryogenic drilling for subsurface ice volatiles',
      currentKw: allocations.scienceIsruKw,
      minKw: 0.0,
      maxKw: 5.0,
      step: 0.5,
      nominalKw: 2.0,
      warningThreshold: 0.5,
      warningText: isCadet ? 'Rovers idle in garage.' : 'No surface prospecting or ice harvesting active.',
      accentColor: 'text-purple-400',
      trackColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="clean-card p-4 sm:p-5 shadow-card">
      {/* Power Budget Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base" aria-hidden="true">⚡</span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {isCadet ? 'Power Allocation Controls' : 'Subsystem Power Allocations (kW)'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isCadet
              ? 'Distribute available electricity. Leftover power charges your battery!'
              : `1 Sol = ${solHours} hours. Unallocated power (${netPowerDeltaKw > 0 ? `+${netPowerDeltaKw} kW` : `${netPowerDeltaKw} kW`}) feeds battery storage.`}
          </p>
        </div>

        {/* Budget Status Metric Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-space-950 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Solar + Base</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-sky-400">
              {availablePowerKw.toFixed(1)} kW
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-space-950 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Allocated</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-white">
              {totalAllocatedKw.toFixed(1)} kW
            </span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border font-mono ${
              isDeficit
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            <span className="text-[10px] uppercase block">
              {isDeficit ? '⚠️ Battery Drain' : '✅ Net Battery Gain'}
            </span>
            <span className="text-xs sm:text-sm font-bold">
              {netPowerDeltaKw > 0 ? '+' : ''}
              {netPowerDeltaKw.toFixed(1)} kW{' '}
              <span className="text-[11px] font-normal">
                ({netDailyEnergyKWh > 0 ? '+' : ''}
                {netDailyEnergyKWh} kWh/Sol)
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {subsystems.map((sub) => {
          const isBelowThreshold = sub.currentKw < sub.warningThreshold;
          const isFocused = focusedSlider === sub.id;

          return (
            <div
              key={sub.id}
              className={`clean-card-subtle p-3.5 transition-all ${
                isFocused
                  ? 'border-sky-400 bg-sky-950/20'
                  : 'hover:border-slate-700 hover:bg-space-850/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg p-1 rounded-md bg-space-950 border border-slate-800/80" aria-hidden="true">
                    {sub.icon}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{sub.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{sub.subtitle}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`text-base font-bold font-mono ${sub.accentColor}`}>
                    {sub.currentKw.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {(sub.currentKw * solHours).toFixed(1)} kWh/Sol
                  </span>
                </div>
              </div>

              {/* Slider Input Track */}
              <div className="mt-3 mb-1">
                <input
                  type="range"
                  aria-label={`${sub.name} power allocation slider`}
                  min={sub.minKw}
                  max={sub.maxKw}
                  step={sub.step}
                  value={sub.currentKw}
                  onChange={(e) => handleSliderChange(sub.field, parseFloat(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>

              {/* Min, Nominal Benchmark & Warning Indicator */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>{sub.minKw} kW</span>
                <span className="text-slate-400">
                  Target: <strong className="text-slate-300">{sub.nominalKw} kW</strong>
                </span>
                <span>{sub.maxKw} kW</span>
              </div>

              {isBelowThreshold && (
                <div className="mt-2 text-[11px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                  <span aria-hidden="true">⚠️</span>
                  <span>{sub.warningText}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
