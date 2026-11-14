'use client';

import React, { useState } from 'react';
import { SCIENTIFIC_CONSTANTS } from '../data/nasaMissionData';

interface ScienceLabModalProps {
  onClose: () => void;
}

export const ScienceLabModal: React.FC<ScienceLabModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'provenance' | 'physics' | 'chaste_moxie' | 'teacher_guide'>('provenance');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="science-lab-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl rounded-2xl bg-space-900 border border-cyan-500/50 shadow-2xl p-5 sm:p-8 my-auto text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🔬</span>
            <div>
              <h2 id="science-lab-title" className="text-lg sm:text-xl font-black text-cyan-neon font-mono">
                NASA &amp; ISRO SCIENCE LAB &amp; PROVENANCE REGISTRY
              </h2>
              <p className="text-xs text-slate-400">
                Aerospace engineering references, verifiable datasets, and educational classroom guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Science Lab Modal"
            className="w-8 h-8 rounded-lg bg-space-850 hover:bg-space-800 text-slate-400 hover:text-white flex items-center justify-center font-mono border border-slate-700 transition-colors focus:ring-2 focus:ring-cyan-400"
          >
            ✕
          </button>
        </div>

        {/* Persistent Educational Simulation Disclaimer */}
        <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 leading-relaxed font-sans flex items-start gap-2.5">
          <span className="text-amber-400 text-base" aria-hidden="true">⚠️</span>
          <div>
            <strong>Persistent Notice:</strong> OUTPOST ZERO is an educational simulation, not an engineering design tool, flight procedure, radiation safety assessment, or NASA/ISRO-endorsed product.
          </div>
        </div>

        {/* SI Transparency Badge */}
        <div className="mb-5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed font-mono flex items-start gap-2">
          <span className="text-cyan-neon text-base" aria-hidden="true">🤖</span>
          <div>
            <strong>SI Transparency:</strong> Application code, UI layout scaffolding, and procedural Web Audio/SVG synthesis were accelerated using Super Intelligence (SI) AI coding tools by Team Parakram; all simulation mechanics and cited data are rigorously cross-referenced against public NASA and ISRO technical documentation.
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('provenance')}
            className={`px-3 py-2 rounded-lg font-bold transition-all focus:ring-2 focus:ring-cyan-400 ${
              activeTab === 'provenance'
                ? 'bg-blue-500/20 text-cyan-neon border border-blue-500/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏷️ Provenance Standard (3 Labels)
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            className={`px-3 py-2 rounded-lg font-bold transition-all focus:ring-2 focus:ring-cyan-400 ${
              activeTab === 'physics'
                ? 'bg-cyan-500/20 text-cyan-neon border border-cyan-500/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 NASA-STD-3001 &amp; Life Support
          </button>
          <button
            onClick={() => setActiveTab('chaste_moxie')}
            className={`px-3 py-2 rounded-lg font-bold transition-all focus:ring-2 focus:ring-cyan-400 ${
              activeTab === 'chaste_moxie'
                ? 'bg-emerald-500/20 text-emerald-neon border border-emerald-500/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌕 ChaSTE Probe &amp; Scaled O2 Plant
          </button>
          <button
            onClick={() => setActiveTab('teacher_guide')}
            className={`px-3 py-2 rounded-lg font-bold transition-all focus:ring-2 focus:ring-cyan-400 ${
              activeTab === 'teacher_guide'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🍎 45-Min STEM Lesson Plan
          </button>
        </div>

        {/* TAB 0: PROVENANCE LABELS */}
        {activeTab === 'provenance' && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
              <h3 className="font-bold text-white text-base mb-2 text-cyan-300">
                Scientific Provenance Taxonomy
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                To guarantee absolute scientific integrity and avoid presenting game design rules as verified NASA/ISRO engineering data, every telemetry metric in OUTPOST ZERO carries one of three explicit labels:
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-[10px] border border-emerald-500">
                      1. OBSERVED SOURCE DATA
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Directly measured and reported by a verified NASA or ISRO flight instrument. Examples: ISRO ChaSTE Vikram probe temperatures at 69.37°S, NASA Perseverance MEDA atmospheric pressure (0.61 kPa), and NASA-STD-3001 metabolic standards.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/50">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
                    <span className="px-2 py-0.5 rounded bg-blue-900/80 text-[10px] border border-cyan-500">
                      2. DERIVED / EDUCATIONAL CALCULATION
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Mathematically derived from observed source data using stated engineering formulas. Examples: 4-crew daily oxygen consumption (3.84 kg/day derived from 0.96 kg/person/day) and the 16× MOXIE scale factor (160 g/h derived from MOXIE’s 10 g/h demonstrator).
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50">
                  <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-900/80 text-[10px] border border-amber-500">
                      3. SIMULATION ASSUMPTION
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    A configurable game rule, educational mechanic, or hypothetical future architecture. Examples: 7.0 kW Kilopower Stirling generator, educational water recovery response curves, and illustrative scenario radiation exposure indices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: NASA-STD-3001 & ECLSS */}
        {activeTab === 'physics' && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-base text-cyan-300 flex items-center gap-2">
                  <span>🌬️</span>
                  <span>Human Spaceflight Standards (NASA-STD-3001 Vol 2)</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700">
                  OBSERVED SOURCE DATA
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                NASA Standard 3001 establishes human physiological requirements for long-duration exploration habitats.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Daily Oxygen Demand</div>
                  <div className="text-cyan-neon font-bold text-sm mt-0.5">
                    {SCIENTIFIC_CONSTANTS.humanPhysiology.o2NominalKgPerAstronautDay} kg / person / day
                  </div>
                  <div className="text-[10px] text-slate-400">Total crew of 4: 3.84 kg/day [DERIVED]</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Minimum Potable Water</div>
                  <div className="text-cyan-neon font-bold text-sm mt-0.5">
                    {SCIENTIFIC_CONSTANTS.humanPhysiology.waterHydrationMinLPerAstronautDay} L / person / day
                  </div>
                  <div className="text-[10px] text-slate-400">NASA-STD-3001 hydration intake</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Total Fluid Turnover</div>
                  <div className="text-cyan-neon font-bold text-sm mt-0.5">
                    {SCIENTIFIC_CONSTANTS.humanPhysiology.waterTurnoverKgPerAstronautDay} kg / person / day
                  </div>
                  <div className="text-[10px] text-slate-400">Combined urine, respiration &amp; sweat load</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Average Caloric Intake</div>
                  <div className="text-amber-neon font-bold text-sm mt-0.5">
                    {SCIENTIFIC_CONSTANTS.humanPhysiology.caloricIntakeKcalPerDay.toLocaleString()} kcal / day
                  </div>
                  <div className="text-[10px] text-slate-400">NASA technical brief crew baseline</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Cabin Thermal Envelope</div>
                  <div className="text-emerald-neon font-bold text-sm mt-0.5">
                    18.3°C – 26.7°C (Nominal: 22°C)
                  </div>
                  <div className="text-[10px] text-slate-400">Target cabin setpoint [ASSUMPTION]</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">ISS WRS + BPA Recovery</div>
                  <div className="text-emerald-neon font-bold text-sm mt-0.5">
                    ~98% demonstrated in 2023
                  </div>
                  <div className="text-[10px] text-slate-400">Closed-loop distillation on ISS</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-base text-cyan-300">
                  🛡️ Radiation Safety Limits (NASA-STD-3001) &amp; Dosimetry
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-cyan-300 border border-cyan-700">
                  NASA STANDARD &amp; SCENARIO MODEL
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                NASA Standard 3001 specifies a universal <strong>&lt; 600 mSv career effective dose limit</strong> for astronauts, based on radiation-induced cancer mortality risk models, accompanied by the <strong>ALARA principle (As Low As Reasonably Achievable)</strong>.
              </p>
              <div className="p-3 rounded-lg bg-space-900 border border-slate-700 text-xs font-mono space-y-1">
                <div>• <strong>No Fixed Daily &quot;Safe&quot; Threshold:</strong> Real-world operational spaceflight does not designate a daily threshold as &quot;safe&quot;. Daily exposure in interplanetary space and at lunar/martian surfaces fluctuates continuously between ~0.3 and &gt;50 mSv/day during solar particle events.</div>
                <div>• <strong>Simulation Modeling:</strong> Radiation numbers in OUTPOST ZERO are labeled as <em>illustrative scenario estimates</em>, not certified medical assessments.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ChaSTE & MOXIE */}
        {activeTab === 'chaste_moxie' && (
          <div className="space-y-4 text-sm text-slate-300">
            {/* ISRO ChaSTE */}
            <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-base text-amber-300 flex items-center gap-2">
                  <span>🇮🇳</span>
                  <span>ISRO Chandrayaan-3 ChaSTE Case Study (Shiv Shakti Point, 69.37°S)</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700">
                  OBSERVED SOURCE DATA
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                In August 2023, ISRO&apos;s Vikram lander deployed the ChaSTE (Chandra&apos;s Surface Thermophysical Experiment) probe into the lunar topsoil near <strong>Shiv Shakti Point (69.37°S, 32.35°E)</strong>. Equipped with 10 precision temperature sensors penetrating ~10 cm, ChaSTE produced the first in-situ thermal profile of high-latitude lunar soil:
              </p>
              <div className="p-3 rounded-lg bg-space-900 border border-amber-500/30 font-mono text-xs text-amber-200 space-y-1">
                <div>📍 <strong>Landing Location:</strong> Shiv Shakti Point (~69.37°S) — <em>Not Shackleton Crater</em>.</div>
                <div>🌡️ <strong>Observed Thermal Gradient:</strong> Surface soil reached ~+50°C in direct sunlight, dropping to ~-10°C at 8 cm depth (~60°C drop over top 10 cm of porous regolith).</div>
                <div>🔗 <strong>Official ISRO Dataset Reference:</strong> <a href="https://www.isro.gov.in/Chaste_first_observations.html" target="_blank" rel="noreferrer" className="text-cyan-400 underline">isro.gov.in/Chaste_first_observations.html</a></div>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-sans">
                <strong>Simulation Context:</strong> Outpost Zero draws pedagogical inspiration from ChaSTE&apos;s finding that regolith is an extraordinary thermal insulator. Note that low temperatures at Shackleton Crater PSR (&lt; -170°C) were measured separately by NASA LRO Diviner radiometer, not ChaSTE.
              </p>
            </div>

            {/* NASA MOXIE */}
            <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-base text-cyan-300 flex items-center gap-2">
                  <span>🔴</span>
                  <span>NASA Perseverance MOXIE vs. Hypothetical Scaled Habitat Plant</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-cyan-300 border border-cyan-700">
                  DEMONSTRATOR + DERIVED SCALE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                NASA&apos;s MOXIE (Mars Oxygen ISRU Experiment) on the Perseverance rover demonstrated Solid Oxide Electrolysis (SOXE) from Martian atmospheric CO₂:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono mb-3">
                <div className="p-3 rounded-lg bg-space-900 border border-slate-700">
                  <div className="text-emerald-400 font-bold mb-1">NASA MOXIE Rover Unit (Observed)</div>
                  <div className="text-slate-300">• Flight Tech Demonstrator on Rover</div>
                  <div className="text-slate-300">• Electrical Power: ~300 W</div>
                  <div className="text-slate-300">• Production: ~10 g O₂/hour (peak: 12 g/h)</div>
                  <div className="text-slate-300">• Source: Hecht et al. 2022 (NASA/MIT)</div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-700">
                  <div className="text-cyan-400 font-bold mb-1">Hypothetical Scaled Plant (Game Model)</div>
                  <div className="text-slate-300">• 16× Scale-Up of MOXIE cell stack</div>
                  <div className="text-slate-300">• Scale Formula: 16 × 10 g/h = 160 g/h</div>
                  <div className="text-slate-300">• Daily Output: 160 g/h × 24 h = 3.84 kg O₂/day</div>
                  <div className="text-slate-300">• Assumed Scaled Power: ~3.0 kW</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                <strong>Distinction:</strong> The habitat oxygen generator in Mission 2 is a <em>hypothetical scaled oxygen-production plant</em>, not the Perseverance rover demonstrator itself.
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
                Topic: <em>Aerospace Engineering Trade-Offs, Energy Conservation, and In-Situ Resource Utilization (ISRU)</em>
              </p>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="font-bold text-cyan-300 font-mono">00:00 – 00:10 (Engage &amp; Orient):</span>
                <p className="text-slate-300 mt-1">
                  Introduce the core constraint: Astronauts on the Moon and Mars must generate their own power, oxygen, and water. Ask students: <em>&quot;If a dust storm cuts your solar power by 75%, do you throttle oxygen production or dim the greenhouse heaters? Why?&quot;</em>
                </p>
              </div>

              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="font-bold text-emerald-300 font-mono">00:10 – 00:30 (Simulate &amp; Pre-Flight Analysis):</span>
                <p className="text-slate-300 mt-1">
                  Students launch Outpost Zero in Cadet Mode (or Flight Director Mode). Working in pairs, they examine the <strong>Pre-Flight Consequence Preview</strong> before each Sol, experimenting with moving sliders to balance battery storage against life support.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="font-bold text-amber-300 font-mono">00:30 – 00:40 (Crisis Resolution &amp; Failure Iteration):</span>
                <p className="text-slate-300 mt-1">
                  When dynamic crisis events occur (Sol 3 and Sol 6), students evaluate trade-offs. If a resource hits zero, they engage the <strong>What-If Time Machine</strong> to understand the root physical cause and rewind 1 Sol to test an improved allocation.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="font-bold text-purple-300 font-mono">00:40 – 00:45 (Debrief &amp; Completion Certificate):</span>
                <p className="text-slate-300 mt-1">
                  Upon completing Sol 10, students generate their personalized <strong>Educational Mission Completion Certificate</strong> and share their trade-off strategies with the class.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
