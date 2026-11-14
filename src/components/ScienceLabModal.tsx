'use client';

import React, { useState } from 'react';
import { SCIENTIFIC_CONSTANTS } from '../data/nasaMissionData';

interface ScienceLabModalProps {
  onClose: () => void;
}

export const ScienceLabModal: React.FC<ScienceLabModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'physics' | 'chaste_moxie' | 'teacher_guide'>('physics');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-space-900 border border-cyan-500/50 shadow-2xl p-5 sm:p-8 my-auto text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔬</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-cyan-neon font-mono">
                NASA & ISRO SCIENCE LAB & CURRICULUM
              </h2>
              <p className="text-xs text-slate-400">
                Peer-reviewed aerospace physics, real telemetry constants & STEM lesson plan for judges & educators
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-space-850 hover:bg-space-800 text-slate-400 hover:text-white flex items-center justify-center font-mono border border-slate-700"
          >
            ✕
          </button>
        </div>

        {/* SI Transparency Badge */}
        <div className="mb-5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-200 leading-relaxed font-mono flex items-start gap-2">
          <span className="text-cyan-neon text-base">🤖</span>
          <div>
            <strong>SI Transparency:</strong> Application code and procedural visual/audio elements were accelerated with AI/SI tools by Team Parakram; all simulation physics and life support metrics are grounded in curated NASA & ISRO datasets.
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('physics')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'physics'
                ? 'bg-cyan-500/20 text-cyan-neon border border-cyan-500/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 NASA-STD-3001 & ECLSS Constants
          </button>
          <button
            onClick={() => setActiveTab('chaste_moxie')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'chaste_moxie'
                ? 'bg-emerald-500/20 text-emerald-neon border border-emerald-500/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌕 ChaSTE & Mars MOXIE Engineering
          </button>
          <button
            onClick={() => setActiveTab('teacher_guide')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'teacher_guide'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🍎 45-Min STEM Classroom Lesson Plan
          </button>
        </div>

        {/* TAB 1: NASA-STD-3001 & ECLSS */}
        {activeTab === 'physics' && (
          <div className="space-y-5 text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
              <h3 className="font-bold text-white text-base mb-2 text-cyan-300 flex items-center gap-2">
                <span>🌬️</span>
                <span>Human Spaceflight Life Support Telemetry (NASA-STD-3001 Vol 2)</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                NASA Standard 3001 establishes the physiological bounds required to sustain 4 astronauts in deep-space exploration habitats.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Daily Oxygen Demand</div>
                  <div className="text-cyan-neon font-bold text-sm mt-0.5">
                    {SCIENTIFIC_CONSTANTS.humanPhysiology.o2NominalKgPerAstronautDay} kg / astronaut / day
                  </div>
                  <div className="text-[10px] text-slate-400">Total crew of 4: 3.84 kg/day</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Daily Potable Water</div>
                  <div className="text-cyan-neon font-bold text-sm mt-0.5">
                    {SCIENTIFIC_CONSTANTS.humanPhysiology.waterTotalLPerAstronautDay} L / astronaut / day
                  </div>
                  <div className="text-[10px] text-slate-400">2.5 L hydration + 1.37 L hygiene</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">ISS WRS Recycling</div>
                  <div className="text-emerald-neon font-bold text-sm mt-0.5">
                    90% closed loop (&gt;3.0 kW)
                  </div>
                  <div className="text-[10px] text-coral-neon">Drops to 50% under brownout</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Caloric Expenditure</div>
                  <div className="text-amber-neon font-bold text-sm mt-0.5">
                    {SCIENTIFIC_CONSTANTS.humanPhysiology.caloricIntakeKcalPerDay.toLocaleString()} kcal / day
                  </div>
                  <div className="text-[10px] text-slate-400">Microgravity / EVA labor</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Cabin Thermal Limit</div>
                  <div className="text-emerald-neon font-bold text-sm mt-0.5">
                    18.3°C - 26.7°C (Nominal: 22°C)
                  </div>
                  <div className="text-[10px] text-slate-400">Target cabin thermal setpoint</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">CO2 Exhalation</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">
                    {SCIENTIFIC_CONSTANTS.humanPhysiology.co2ExhaledKgPerAstronautDay} kg / astronaut / day
                  </div>
                  <div className="text-[10px] text-slate-400">Scrubbed via Amine beds</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
              <h3 className="font-bold text-white text-base mb-2 text-cyan-300">
                🛡️ Radiation Shielding Physics (NASA OLTARIS & LRO CRaTER)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In deep space, unshielded Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE) impart up to <strong>0.65 mSv/day to 450 mSv/day</strong> during severe flares.
                Regolith exhibits a half-value thickness of <strong>~22.5 cm</strong>. Compacting <strong>85 cm of regolith</strong> over habitat modules attenuates &gt;85% of primary ion tracks. Incorporating internal potable water walls absorbs secondary neutrons, reducing crew dose to nominal career-safe levels.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: ChaSTE & MOXIE */}
        {activeTab === 'chaste_moxie' && (
          <div className="space-y-5 text-sm text-slate-300">
            {/* ISRO ChaSTE */}
            <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
              <h3 className="font-bold text-white text-base mb-2 text-amber-300 flex items-center gap-2">
                <span>🇮🇳</span>
                <span>ISRO Chandrayaan-3 ChaSTE (Chandra&apos;s Surface Thermophysical Experiment)</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                In August 2023, the Vikram lander deployed the ChaSTE 10-sensor thermal probe into the lunar high-latitude topsoil near 69°S.
                ChaSTE documented one of the steepest natural thermal gradients in the solar system:
              </p>
              <div className="p-3 rounded-lg bg-space-900 border border-amber-500/30 font-mono text-xs text-amber-200">
                📌 <strong>Groundbreaking ChaSTE Finding:</strong> Surface soil reached ~+50°C in direct sunlight, but plunged to <strong>-10°C just 8 cm below the surface</strong>—a staggering <strong>60°C temperature drop within 10 cm</strong> of porous regolith!
              </div>
              <p className="text-xs text-slate-400 mt-2">
                <strong>Outpost Zero Application:</strong> The simulator models this thermal property. During the 72-hour eclipse (-170°C exterior), burying modules under regolith acts as an ultra-high-efficiency thermal insulator.
              </p>
            </div>

            {/* NASA MOXIE */}
            <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
              <h3 className="font-bold text-white text-base mb-2 text-cyan-300 flex items-center gap-2">
                <span>🔴</span>
                <span>NASA Mars 2020 MOXIE (Mars Oxygen ISRU Experiment)</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Mounted on the Perseverance rover in Jezero Crater, MOXIE proved that human explorers can produce breathable oxygen from the thin Martian atmosphere (95% CO2) via Solid Oxide Electrolysis (SOXE):
              </p>
              <div className="p-3 rounded-lg bg-space-900 border border-cyan-500/30 font-mono text-xs text-cyan-200">
                ⚗️ <strong>Electrochemical Reaction:</strong> 2 CO₂ → 2 CO + O₂ (operated at 800°C)
              </div>
              <p className="text-xs text-slate-400 mt-2">
                <strong>Outpost Zero Trade-off:</strong> Scaling MOXIE to sustain a 4-person crew demands ~3.0 kW of steady electrical power. During Martian dust storms (MEDA atmospheric opacity Tau &gt; 3.0), solar arrays lose 60%–85% of their output—forcing the flight director to balance MOXIE oxygen synthesis against cabin thermal survival!
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: TEACHER CLASSROOM GUIDE */}
        {activeTab === 'teacher_guide' && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40">
              <h3 className="font-bold text-white text-base mb-1 text-purple-300">
                🍎 Outpost Zero 45-Minute STEM Lesson Plan (Grades 3–8)
              </h3>
              <p className="text-xs text-slate-400">
                Theme: <em>Systems Thinking, Energy Conservation, and Aerospace Engineering Trade-Offs</em>
              </p>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="font-bold text-cyan-300 font-mono">00:00 - 00:10 (Engage):</span>
                <p className="text-slate-300 mt-1">
                  Introduce the challenge: Astronauts on the Moon and Mars cannot open a window or call a delivery truck. Ask students: <em>&quot;If you only had enough electricity to power your refrigerator OR your heater in Antarctica, which would you pick?&quot;</em>
                </p>
              </div>

              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="font-bold text-emerald-300 font-mono">00:10 - 00:30 (Simulate & Explore):</span>
                <p className="text-slate-300 mt-1">
                  Students launch Outpost Zero in Cadet Mode (or Flight Director Mode for middle school). In pairs, they tackle <strong>Mission 1 (Moon)</strong>. They test what happens when they maximize rover mining vs life support, observing the Pre-Flight Calculator before each Sol.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="font-bold text-amber-300 font-mono">00:30 - 00:40 (Crisis Resolution & Science Tie-In):</span>
                <p className="text-slate-300 mt-1">
                  When the Sol 3 Solar Storm or Sol 6 Eclipse hits, students must choose a crisis directive. If battery or oxygen fails, students use the <strong>What-If Time Machine</strong> to rewind 1 Sol and explain the root cause using the NASA failure debrief.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="font-bold text-purple-300 font-mono">00:40 - 00:45 (Certification & Reflection):</span>
                <p className="text-slate-300 mt-1">
                  Students generate their personalized <strong>Junior Astronaut Certificate</strong> and compare their efficiency scores and trade-off strategies as a class.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
