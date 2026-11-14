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

  const handleSliderChange = (field: keyof PowerAllocation, val: number) => {
    audioEngine.playSliderTick(val / 8.0);
    const updated = {
      ...allocations,
      [field]: parseFloat(val.toFixed(1)),
    };
    onChange(updated);
  };

  return (
    <div className="rounded-2xl bg-space-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header with Power Budget & Deficit Meter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚙️</span>
            <span>
              {isCadet
                ? 'Power Budget Allocation (The 4 Big Decisions!)'
                : 'EPS (Electrical Power Subsystem) Bus Allocation Matrix'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isCadet
              ? 'You have a fixed amount of electricity. Choose where to send it!'
              : 'Allocate total available generation across ECLSS, Greenhouse, Thermal/Shielding, and ISRU.'}
          </p>
        </div>

        {/* Budget Status Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-space-950 border border-slate-700 text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Generation</div>
            <div className="text-sm font-bold font-mono text-cyan-neon">
              {availablePowerKw.toFixed(1)} kW
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-space-950 border border-slate-700 text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Allocated</div>
            <div
              className={`text-sm font-bold font-mono ${
                isDeficit ? 'text-coral-neon' : 'text-emerald-neon'
              }`}
            >
              {totalAllocatedKw.toFixed(1)} kW
            </div>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border text-right ${
              isDeficit
                ? 'bg-red-950/40 border-red-500/50 text-coral-neon'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-neon'
            }`}
          >
            <div className="text-[10px] uppercase font-mono">
              {isDeficit ? '⚠️ Battery Drain' : '✅ Stored in Battery'}
            </div>
            <div className="text-sm font-bold font-mono">
              {isDeficit ? `${netPowerDeltaKw} kW` : `+${netPowerDeltaKw} kW`}
            </div>
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* SLIDER 1: LIFE SUPPORT & ECLSS / MOXIE */}
        <div
          className={`p-4 rounded-xl transition-all border ${
            focusedSlider === 'lifesupport'
              ? 'bg-cyan-950/40 border-cyan-400 shadow-cyan-glow/20'
              : 'bg-space-850/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌬️</span>
              <div>
                <h4 className="font-bold text-sm text-cyan-300">
                  {isCadet
                    ? isMars
                      ? 'MOXIE Oxygen & Water Machine'
                      : 'Oxygen Maker & Water Recycler'
                    : isMars
                    ? 'ECLSS / MOXIE SOXE Stack'
                    : 'ECLSS OGA & WRS Recycler'}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  {isMars ? 'NASA Perseverance MOXIE In-Situ CO2 to O2' : 'NASA-STD-3001 & ISS WRS'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold text-cyan-neon">
                {allocations.lifeSupportKw.toFixed(1)} kW
              </span>
              <div className="text-[10px] text-slate-400">
                {allocations.lifeSupportKw >= 3.0 ? '90% Recycled' : '50% Low Power'}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {isCadet
              ? 'Gives clean air to breathe and cleans dirty water back into drinking water.'
              : 'Powers high-temperature Solid Oxide Electrolysis and Catalytic Oxidation distillation.'}
          </p>

          <input
            type="range"
            min="0.5"
            max="6.0"
            step="0.1"
            value={allocations.lifeSupportKw}
            onChange={(e) => handleSliderChange('lifeSupportKw', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-neon"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0.5 kW (Emergency)</span>
            <span className="text-cyan-400 font-bold">3.0 kW (NASA Nominal)</span>
            <span>6.0 kW (Surplus)</span>
          </div>
        </div>

        {/* SLIDER 2: HYDROPONIC ASTRO-GARDEN */}
        <div
          className={`p-4 rounded-xl transition-all border ${
            focusedSlider === 'hydroponics'
              ? 'bg-emerald-950/40 border-emerald-400 shadow-emerald-glow/20'
              : 'bg-space-850/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <div>
                <h4 className="font-bold text-sm text-emerald-300">
                  {isCadet ? 'Hydroponic Astro-Garden' : 'Hydroponic Biomass & O2 Loop'}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  NASA Veggie / Advanced Plant Habitat
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold text-emerald-neon">
                {allocations.hydroponicsKw.toFixed(1)} kW
              </span>
              <div className="text-[10px] text-slate-400">
                {allocations.hydroponicsKw >= 3.0 ? '+Fresh Crops & Morale' : 'Wilting Warning'}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {isCadet
              ? 'Grows fresh tomatoes and lettuce for the crew, lifting astronaut spirits!'
              : 'Powers high-efficiency red/blue LED arrays and nutrient dosing pumps.'}
          </p>

          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.1"
            value={allocations.hydroponicsKw}
            onChange={(e) => handleSliderChange('hydroponicsKw', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0 kW (Dark)</span>
            <span className="text-emerald-400 font-bold">2.5 kW (Nominal)</span>
            <span>5.0 kW (Max Harvest)</span>
          </div>
        </div>

        {/* SLIDER 3: ACTIVE THERMAL & RADIATION SHELTER */}
        <div
          className={`p-4 rounded-xl transition-all border ${
            focusedSlider === 'shield'
              ? 'bg-amber-950/40 border-amber-400 shadow-amber-glow/20'
              : 'bg-space-850/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <div>
                <h4 className="font-bold text-sm text-amber-300">
                  {isCadet
                    ? 'Space Blanket Heaters & Radiation Shield'
                    : 'TCS Heaters & Regolith Sintering Shield'}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  ISRO ChaSTE Gradient & NASA OLTARIS Shield
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold text-amber-neon">
                {allocations.shieldThermalKw.toFixed(1)} kW
              </span>
              <div className="text-[10px] text-slate-400">
                {allocations.shieldThermalKw >= 3.5 ? '22°C Safe & Shielded' : 'Hypothermia Risk'}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {isCadet
              ? 'Keeps the habitat cozy warm and powers robot rovers that pile moon dirt to block solar radiation.'
              : 'Counters deep space conductive/radiative thermal flux and operates regolith microwave sintering rovers.'}
          </p>

          <input
            type="range"
            min="0.5"
            max="6.0"
            step="0.1"
            value={allocations.shieldThermalKw}
            onChange={(e) => handleSliderChange('shieldThermalKw', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0.5 kW (Freezing)</span>
            <span className="text-amber-400 font-bold">3.5 kW (22°C Target)</span>
            <span>6.0 kW (Active Storm Shelter)</span>
          </div>
        </div>

        {/* SLIDER 4: SCIENCE & ISRU MINING ROVERS */}
        <div
          className={`p-4 rounded-xl transition-all border ${
            focusedSlider === 'science'
              ? 'bg-purple-950/40 border-purple-400 shadow-purple-500/20'
              : 'bg-space-850/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔬</span>
              <div>
                <h4 className="font-bold text-sm text-purple-300">
                  {isCadet
                    ? 'Robot Rover Ice Drills & Science Lab'
                    : 'ISRU Volatiles Extraction & Autonomous Rovers'}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  {isMars ? 'Perseverance Sample Handling' : 'Artemis Subsurface Cryo Drills'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold text-purple-400">
                {allocations.scienceIsruKw.toFixed(1)} kW
              </span>
              <div className="text-[10px] text-slate-400">
                {allocations.scienceIsruKw >= 2.5 ? '+Ice Water Extracted' : 'Idle Rovers'}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {isCadet
              ? 'Sends rovers into dark craters to drill for buried ice and discover alien geological secrets!'
              : 'Powers autonomous deep drills and sublimation heaters to extract in-situ water and minerals.'}
          </p>

          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.1"
            value={allocations.scienceIsruKw}
            onChange={(e) => handleSliderChange('scienceIsruKw', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0 kW (Standby)</span>
            <span className="text-purple-400 font-bold">2.0 kW (Survey)</span>
            <span>5.0 kW (Heavy Mining)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
