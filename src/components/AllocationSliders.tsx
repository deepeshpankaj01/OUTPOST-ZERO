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

  return (
    <div className="rounded-2xl bg-space-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header with Power Budget & Deficit Meter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span aria-hidden="true">⚙️</span>
            <span>
              {isCadet
                ? 'Power Budget Allocation (The 4 Big Decisions!)'
                : 'EPS (Electrical Power Subsystem) Bus Allocation Matrix'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isCadet
              ? 'Allocate continuous power (kW) across base modules. Unused power charges the battery bank!'
              : `Continuous power allocations (kW). 1 Sol = ${solHours} hours. Daily Energy (kWh) = Allocated kW × ${solHours} h.`}
          </p>
        </div>

        {/* Budget Status Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-space-950 border border-slate-700 text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Continuous Gen</div>
            <div className="text-sm font-bold font-mono text-cyan-neon">
              {availablePowerKw.toFixed(1)} kW
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-space-950 border border-slate-700 text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Allocated</div>
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
              {isDeficit ? '⚠️ Daily Battery Draw' : '✅ Stored in Battery'}
            </div>
            <div className="text-sm font-bold font-mono">
              {isDeficit ? `${netDailyEnergyKWh} kWh/Sol` : `+${netDailyEnergyKWh} kWh/Sol`}
            </div>
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* SLIDER 1: LIFE SUPPORT & SCALED O2 / ECLSS */}
        <div
          className={`p-4 rounded-xl transition-all border ${
            focusedSlider === 'lifesupport'
              ? 'bg-cyan-950/40 border-cyan-400 shadow-cyan-glow/20'
              : 'bg-space-850/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">🌬️</span>
              <div>
                <h4 className="font-bold text-sm text-cyan-300">
                  {isCadet
                    ? isMars
                      ? 'Scaled Oxygen Plant & Water Recycler'
                      : 'Oxygen Maker & Water Recycler'
                    : isMars
                    ? 'Hypothetical Scaled Oxygen Plant (16x MOXIE Scale)'
                    : 'ECLSS OGA Electrolysis & WRS Assembly'}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  {isMars
                    ? '[DERIVED] 16x MOXIE Scale-Up (~3.0 kW nominal for 4 crew)'
                    : '[OBSERVED & DERIVED] NASA-STD-3001 4-Crew Baseline'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold text-cyan-neon">
                {allocations.lifeSupportKw.toFixed(1)} kW
              </span>
              <div className="text-[10px] text-slate-400">
                {(allocations.lifeSupportKw * solHours).toFixed(0)} kWh/Sol
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {isCadet
              ? 'Generates fresh oxygen for the crew and purifies wastewater back into drinking water.'
              : isMars
              ? 'Powers high-temperature Solid Oxide Electrolysis (SOXE) cell stack and closed-loop distillation.'
              : 'Powers water electrolysis and catalytic closed-loop water recovery.'}
          </p>

          <input
            type="range"
            min="0.5"
            max="6.0"
            step="0.1"
            aria-label="Power allocation for Life Support and Oxygen Generation in kilowatts"
            aria-valuemin={0.5}
            aria-valuemax={6.0}
            aria-valuenow={allocations.lifeSupportKw}
            aria-valuetext={`${allocations.lifeSupportKw} kilowatts`}
            value={allocations.lifeSupportKw}
            onChange={(e) => handleSliderChange('lifeSupportKw', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-neon focus:ring-2 focus:ring-cyan-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0.5 kW (Emergency)</span>
            <span className="text-cyan-400 font-bold">3.0–3.5 kW (Baseline Target)</span>
            <span>6.0 kW (High Yield)</span>
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
              <span className="text-lg" aria-hidden="true">🌱</span>
              <div>
                <h4 className="font-bold text-sm text-emerald-300">
                  {isCadet ? 'Hydroponic Astro-Garden' : 'Hydroponic Biomass & O2 Loop'}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  [SIMULATION ASSUMPTION] Plant Habitat Modeling
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold text-emerald-neon">
                {allocations.hydroponicsKw.toFixed(1)} kW
              </span>
              <div className="text-[10px] text-slate-400">
                {(allocations.hydroponicsKw * solHours).toFixed(0)} kWh/Sol
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {isCadet
              ? 'Grows fresh astronaut vegetables and strawberries, boosting morale and oxygen!'
              : 'Powers red/blue LED arrays and nutrient dosing loops to produce biomass and supplemental O2.'}
          </p>

          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.1"
            aria-label="Power allocation for Hydroponic Astro-Garden in kilowatts"
            aria-valuemin={0.0}
            aria-valuemax={5.0}
            aria-valuenow={allocations.hydroponicsKw}
            aria-valuetext={`${allocations.hydroponicsKw} kilowatts`}
            value={allocations.hydroponicsKw}
            onChange={(e) => handleSliderChange('hydroponicsKw', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:ring-2 focus:ring-emerald-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0 kW (Dark)</span>
            <span className="text-emerald-400 font-bold">2.5 kW (Nominal Growth)</span>
            <span>5.0 kW (Max Harvest)</span>
          </div>
        </div>

        {/* SLIDER 3: ACTIVE THERMAL & REGOLITH SHIELDING */}
        <div
          className={`p-4 rounded-xl transition-all border ${
            focusedSlider === 'shield'
              ? 'bg-amber-950/40 border-amber-400 shadow-amber-glow/20'
              : 'bg-space-850/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">🛡️</span>
              <div>
                <h4 className="font-bold text-sm text-amber-300">
                  {isCadet
                    ? 'Habitat Heaters & Radiation Shielding'
                    : 'TCS Heaters & Regolith Sintering Rovers'}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  [SIMULATION ASSUMPTION] Thermal &amp; Radiation Control
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold text-amber-neon">
                {allocations.shieldThermalKw.toFixed(1)} kW
              </span>
              <div className="text-[10px] text-slate-400">
                {(allocations.shieldThermalKw * solHours).toFixed(0)} kWh/Sol
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {isCadet
              ? 'Powers heaters to keep the base at 22°C and runs rovers that pile moon soil to shield radiation.'
              : 'Maintains NASA-STD-3001 cabin thermal setpoint (22°C) against outer cold and powers sintering rovers.'}
          </p>

          <input
            type="range"
            min="0.5"
            max="6.0"
            step="0.1"
            aria-label="Power allocation for Thermal Control and Shielding in kilowatts"
            aria-valuemin={0.5}
            aria-valuemax={6.0}
            aria-valuenow={allocations.shieldThermalKw}
            aria-valuetext={`${allocations.shieldThermalKw} kilowatts`}
            value={allocations.shieldThermalKw}
            onChange={(e) => handleSliderChange('shieldThermalKw', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:ring-2 focus:ring-amber-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0.5 kW (Cold Risk)</span>
            <span className="text-amber-400 font-bold">3.5 kW (22°C Target)</span>
            <span>6.0 kW (Storm Defense)</span>
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
              <span className="text-lg" aria-hidden="true">🔬</span>
              <div>
                <h4 className="font-bold text-sm text-purple-300">
                  {isCadet
                    ? 'Robot Rover Ice Drills & Science Lab'
                    : 'ISRU Volatiles Extraction & Autonomous Rovers'}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  [SIMULATION ASSUMPTION] Educational In-Situ Resource Loop
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold text-purple-400">
                {allocations.scienceIsruKw.toFixed(1)} kW
              </span>
              <div className="text-[10px] text-slate-400">
                {(allocations.scienceIsruKw * solHours).toFixed(0)} kWh/Sol
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {isCadet
              ? 'Dispatches rovers into dark craters to drill for buried ice and study geological history!'
              : 'Drives autonomous drills and microwave sublimation ovens to prospect for volatiles.'}
          </p>

          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.1"
            aria-label="Power allocation for Science and ISRU Drills in kilowatts"
            aria-valuemin={0.0}
            aria-valuemax={5.0}
            aria-valuenow={allocations.scienceIsruKw}
            aria-valuetext={`${allocations.scienceIsruKw} kilowatts`}
            value={allocations.scienceIsruKw}
            onChange={(e) => handleSliderChange('scienceIsruKw', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:ring-2 focus:ring-purple-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0 kW (Standby)</span>
            <span className="text-purple-400 font-bold">2.0 kW (Survey)</span>
            <span>5.0 kW (Active Extraction)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
