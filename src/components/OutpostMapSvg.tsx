'use client';

import React, { useState } from 'react';
import { MissionConfig, ResourceState, PowerAllocation, CrewMember, AudienceMode } from '../types/mission';

interface OutpostMapSvgProps {
  mission: MissionConfig;
  resources: ResourceState;
  allocations: PowerAllocation;
  crew: CrewMember[];
  mode: AudienceMode;
  onSelectModule?: (moduleId: string) => void;
  selectedModule?: string | null;
}

export const OutpostMapSvg: React.FC<OutpostMapSvgProps> = ({
  mission,
  resources,
  allocations,
  crew,
  mode,
  onSelectModule,
  selectedModule,
}) => {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'schematic' | 'orbital_map'>('schematic');

  const isMoon = mission.id === 'moon_shackleton';
  const isCadet = mode === 'cadet';

  // Subsystem statuses
  const lifeSupportStatus =
    allocations.lifeSupportKw >= 3.0 ? 'Nominal' : allocations.lifeSupportKw >= 2.0 ? 'Throttled' : 'Critical';
  const hydroStatus =
    allocations.hydroponicsKw >= 3.0 ? 'Flourishing' : allocations.hydroponicsKw >= 1.5 ? 'Conserving' : 'Wilting';
  const shieldStatus =
    resources.shieldIntegrityPct >= 80 ? 'Fortified' : resources.shieldIntegrityPct >= 50 ? 'Moderate' : 'Vulnerable';
  const powerStatus =
    resources.batteryKWh > 100 ? 'Charged' : resources.batteryKWh > 40 ? 'Sufficient' : 'Low Power';

  const handleModuleClick = (modId: string) => {
    if (onSelectModule) {
      onSelectModule(modId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, modId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleModuleClick(modId);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-space-950/90 border border-slate-800 p-3 sm:p-5 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-neon animate-ping" aria-hidden="true" />
          <h3 className="text-sm font-bold tracking-wider uppercase text-cyan-300 font-mono">
            {isCadet ? '🗺️ Outpost Base & Site Telemetry' : 'Outpost Architectural Schematic & NASA Orbital Telemetry'}
          </h3>
        </div>

        {/* View Switcher: Architectural Schematic vs NASA Orbital Context Map */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-space-900 border border-slate-700 text-xs font-mono">
          <button
            onClick={() => setActiveView('schematic')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeView === 'schematic'
                ? 'bg-cyan-500/20 text-cyan-neon border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📐 Habitat Cross-Section
          </button>
          <button
            onClick={() => setActiveView('orbital_map')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeView === 'orbital_map'
                ? 'bg-cyan-500/20 text-cyan-neon border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛰️ {isMoon ? 'NASA LRO Illumination Map' : 'NASA MRO Jezero Delta Map'}
          </button>
        </div>
      </div>

      {/* Conceptual Illustration Notice Banner */}
      <div className="mb-2 text-[10px] font-mono text-slate-400 flex items-center justify-between flex-wrap gap-1">
        <span className="text-cyan-300/80">
          * Conceptual Educational Outpost Illustration (Not an official NASA or ISRO habitat drawing)
        </span>
        <span className="text-slate-400">Click any habitat module to inspect telemetry</span>
      </div>

      {/* VIEW 1: ARCHITECTURAL SCHEMATIC */}
      {activeView === 'schematic' ? (
        <div className="relative w-full aspect-[16/9] min-h-[300px] max-h-[460px]">
          <svg
            viewBox="0 0 960 540"
            className="w-full h-full select-none"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Conceptual cross-section diagram of Outpost Zero habitat modules"
          >
            <defs>
              <linearGradient id="spaceSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#030611" />
                <stop offset="60%" stopColor="#070C20" />
                <stop offset="100%" stopColor={isMoon ? '#1A2138' : '#2D1616'} />
              </linearGradient>

              <linearGradient id="terrainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isMoon ? '#475569' : '#991B1B'} />
                <stop offset="30%" stopColor={isMoon ? '#334155' : '#7F1D1D'} />
                <stop offset="100%" stopColor={isMoon ? '#1E293B' : '#450A0A'} />
              </linearGradient>

              <linearGradient id="hydroDomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#059669" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.35" />
              </linearGradient>

              <linearGradient id="regolithLayer" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#64748B" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#475569" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#334155" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Background Sky & Distant Stars */}
            <rect width="960" height="540" fill="url(#spaceSky)" />

            {/* Celestial background */}
            {isMoon ? (
              <g transform="translate(800, 70)">
                <circle cx="0" cy="0" r="32" fill="#0284C7" />
                <path d="M -20,-10 Q -5,-25 15,-15 Q 25,5 10,20 Q -15,22 -20,-10 Z" fill="#10B981" opacity="0.8" />
                <circle cx="0" cy="0" r="32" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.7" />
              </g>
            ) : (
              <g transform="translate(800, 60)">
                <ellipse cx="0" cy="0" rx="14" ry="10" fill="#CBD5E1" opacity="0.7" />
                <circle cx="-3" cy="-2" r="3" fill="#64748B" opacity="0.6" />
              </g>
            )}

            {/* Stars */}
            {[
              [120, 40], [220, 80], [340, 30], [450, 75], [580, 50],
              [700, 90], [80, 110], [880, 130], [290, 140], [640, 120]
            ].map(([sx, sy], i) => (
              <circle key={i} cx={sx} cy={sy} r={i % 2 === 0 ? 1.5 : 1} fill="#FFFFFF" opacity={0.6 + (i % 4) * 0.1} />
            ))}

            {/* Surface Terrain */}
            <path
              d="M 0,380 Q 240,360 480,385 T 960,375 L 960,540 L 0,540 Z"
              fill="url(#terrainGrad)"
            />

            {/* Pressurized Tunnel Conduits */}
            <path d="M 190,360 L 710,360" stroke="#1E293B" strokeWidth="24" strokeLinecap="round" />
            <path d="M 190,360 L 710,360" stroke="#00F0FF" strokeWidth="3" strokeDasharray="8 6" opacity="0.7" />

            {/* MODULE 1: POWER SUBSYSTEM */}
            <g
              role="button"
              tabIndex={0}
              aria-label="Inspect Kilopower and Solar Array Subsystem"
              className="cursor-pointer group focus:outline-none"
              onClick={() => handleModuleClick('power')}
              onKeyDown={(e) => handleKeyDown(e, 'power')}
              onMouseEnter={() => setHoveredModule('power')}
              onMouseLeave={() => setHoveredModule(null)}
            >
              {(selectedModule === 'power' || hoveredModule === 'power') && (
                <rect x="50" y="160" width="170" height="230" rx="16" fill="#00F0FF" fillOpacity="0.08" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 4" />
              )}
              {/* Solar Array */}
              <g transform="translate(80, 180)">
                <line x1="45" y1="180" x2="45" y2="40" stroke="#94A3B8" strokeWidth="6" />
                <line x1="0" y1="60" x2="90" y2="60" stroke="#64748B" strokeWidth="4" />
                <rect x="-10" y="20" width="48" height="36" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5" />
                <rect x="52" y="20" width="48" height="36" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5" />
              </g>
              {/* Stirling Housing */}
              <g transform="translate(145, 290)">
                <rect x="0" y="0" width="45" height="70" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="22.5" cy="45" r="10" fill="#F59E0B" opacity="0.75" />
                <circle cx="22.5" cy="45" r="6" fill="#FEF08A" />
              </g>
              <g transform="translate(65, 395)">
                <rect width="135" height="24" rx="6" fill="#0B132B" stroke="#38BDF8" strokeWidth="1" />
                <text x="67" y="16" fill="#00F0FF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  ⚡ EPS &amp; STIRLING
                </text>
              </g>
            </g>

            {/* MODULE 2: OXYGEN & WATER LIFE SUPPORT */}
            <g
              role="button"
              tabIndex={0}
              aria-label="Inspect Scaled Oxygen and Water Life Support Core"
              className="cursor-pointer group focus:outline-none"
              onClick={() => handleModuleClick('lifesupport')}
              onKeyDown={(e) => handleKeyDown(e, 'lifesupport')}
              onMouseEnter={() => setHoveredModule('lifesupport')}
              onMouseLeave={() => setHoveredModule(null)}
            >
              {(selectedModule === 'lifesupport' || hoveredModule === 'lifesupport') && (
                <rect x="220" y="240" width="160" height="180" rx="16" fill="#00F0FF" fillOpacity="0.08" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 4" />
              )}
              <g transform="translate(240, 270)">
                <rect x="0" y="0" width="120" height="90" rx="16" fill="#0F172A" stroke="#00F0FF" strokeWidth="2.5" />
                <rect x="15" y="15" width="22" height="60" rx="8" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="26" y="55" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">O2</text>
                <rect x="45" y="15" width="30" height="60" rx="6" fill="#075985" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="60" y="26" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">H2O</text>
                <rect x="83" y="22" width="25" height="46" rx="4" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
              </g>
              <g transform="translate(225, 395)">
                <rect width="150" height="24" rx="6" fill="#0B132B" stroke="#00F0FF" strokeWidth="1" />
                <text x="75" y="16" fill="#00F0FF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  🌬️ SCALED O2 &amp; WRS
                </text>
              </g>
            </g>

            {/* MODULE 3: HYDROPONIC ASTRO-GARDEN */}
            <g
              role="button"
              tabIndex={0}
              aria-label="Inspect Hydroponic Astro-Garden Dome"
              className="cursor-pointer group focus:outline-none"
              onClick={() => handleModuleClick('hydroponics')}
              onKeyDown={(e) => handleKeyDown(e, 'hydroponics')}
              onMouseEnter={() => setHoveredModule('hydroponics')}
              onMouseLeave={() => setHoveredModule(null)}
            >
              {(selectedModule === 'hydroponics' || hoveredModule === 'hydroponics') && (
                <rect x="390" y="210" width="170" height="210" rx="16" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
              )}
              <path d="M 410,360 A 65,65 0 0,1 540,360 Z" fill="url(#hydroDomeGrad)" stroke="#10B981" strokeWidth="2.5" />
              <rect x="445" y="305" width="60" height="6" rx="3" fill="#EC4899" />
              <g transform="translate(425, 342)">
                <rect x="0" y="8" width="100" height="10" rx="3" fill="#166534" />
                <circle cx="15" cy="5" r="5" fill="#22C55E" />
                <circle cx="35" cy="4" r="6" fill="#4ADE80" />
                <circle cx="55" cy="5" r="5" fill="#22C55E" />
                <circle cx="75" cy="4" r="6" fill="#4ADE80" />
              </g>
              <g transform="translate(405, 395)">
                <rect width="140" height="24" rx="6" fill="#0B132B" stroke="#10B981" strokeWidth="1" />
                <text x="70" y="16" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  🌱 ASTRO-GARDEN
                </text>
              </g>
            </g>

            {/* MODULE 4: REGOLITH & STORM SHELTER */}
            <g
              role="button"
              tabIndex={0}
              aria-label="Inspect Regolith Sintering and Water-Wall Shelter"
              className="cursor-pointer group focus:outline-none"
              onClick={() => handleModuleClick('shield')}
              onKeyDown={(e) => handleKeyDown(e, 'shield')}
              onMouseEnter={() => setHoveredModule('shield')}
              onMouseLeave={() => setHoveredModule(null)}
            >
              {(selectedModule === 'shield' || hoveredModule === 'shield') && (
                <rect x="560" y="210" width="165" height="210" rx="16" fill="#F59E0B" fillOpacity="0.08" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
              )}
              <path d="M 570,360 Q 640,250 710,360 Z" fill="url(#regolithLayer)" stroke="#94A3B8" strokeWidth="3" />
              <rect x="600" y="300" width="80" height="60" rx="8" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
              <rect x="606" y="306" width="68" height="48" rx="4" fill="none" stroke="#00F0FF" strokeWidth="2.5" strokeDasharray="5 3" />
              <text x="640" y="335" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">WATER WALL</text>
              <g transform="translate(575, 395)">
                <rect width="145" height="24" rx="6" fill="#0B132B" stroke="#F59E0B" strokeWidth="1" />
                <text x="72" y="16" fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  🛡️ SHIELD &amp; SHELTER
                </text>
              </g>
            </g>

            {/* MODULE 5: CREW & ROVERS */}
            <g
              role="button"
              tabIndex={0}
              aria-label="Inspect Crew Habitat and Rover Bay"
              className="cursor-pointer group focus:outline-none"
              onClick={() => handleModuleClick('crew')}
              onKeyDown={(e) => handleKeyDown(e, 'crew')}
              onMouseEnter={() => setHoveredModule('crew')}
              onMouseLeave={() => setHoveredModule(null)}
            >
              {(selectedModule === 'crew' || hoveredModule === 'crew') && (
                <rect x="730" y="240" width="180" height="180" rx="16" fill="#A855F7" fillOpacity="0.08" stroke="#A855F7" strokeWidth="2" strokeDasharray="4 4" />
              )}
              <rect x="745" y="275" width="100" height="85" rx="14" fill="#0F172A" stroke="#A855F7" strokeWidth="2" />
              {crew.map((member, i) => (
                <circle key={member.id} cx={765 + i * 20} cy={338} r="6" fill={member.avatarColor} stroke="#FFFFFF" strokeWidth="1" />
              ))}
              <g transform="translate(850, 340)">
                <rect x="0" y="0" width="40" height="16" rx="4" fill="#475569" stroke="#E2E8F0" strokeWidth="1" />
                <circle cx="6" cy="18" r="5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
                <circle cx="20" cy="18" r="5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
                <circle cx="34" cy="18" r="5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
              </g>
              <g transform="translate(745, 395)">
                <rect width="145" height="24" rx="6" fill="#0B132B" stroke="#A855F7" strokeWidth="1" />
                <text x="72" y="16" fill="#C084FC" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  🚀 CREW &amp; ROVER BAY
                </text>
              </g>
            </g>
          </svg>

          {/* Floating Diagnostic Card */}
          {selectedModule && (
            <div className="absolute top-3 left-3 max-w-xs sm:max-w-sm p-3.5 rounded-xl bg-space-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
                <span className="font-bold text-xs uppercase tracking-wider text-cyan-neon font-mono">
                  {selectedModule === 'power' && '⚡ Power Subsystem (Hypothetical Architecture)'}
                  {selectedModule === 'lifesupport' && '🌬️ Scaled O2 Plant & ECLSS'}
                  {selectedModule === 'hydroponics' && '🌱 Astro-Garden Dome'}
                  {selectedModule === 'shield' && '🛡️ Regolith Sintering & Water Wall'}
                  {selectedModule === 'crew' && '🚀 Crew Quarters & Rovers'}
                </span>
                <button
                  onClick={() => onSelectModule && onSelectModule('')}
                  aria-label="Close Diagnostic View"
                  className="text-slate-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>

              <div className="mt-2 text-xs text-slate-300 space-y-1 font-sans">
                {selectedModule === 'power' && (
                  <>
                    <p>
                      <span className="text-slate-400">Stored Energy:</span>{' '}
                      <strong className="text-cyan-300">{resources.batteryKWh.toFixed(0)} kWh</strong> ({powerStatus})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      [SIMULATION ASSUMPTION] Modeled on future Stirling radioisotope core (6-7 kW baseline) + photovoltaic tracking arrays.
                    </p>
                  </>
                )}

                {selectedModule === 'lifesupport' && (
                  <>
                    <p>
                      <span className="text-slate-400">O2 Reserve:</span>{' '}
                      <strong className="text-emerald-400">{resources.oxygenKg.toFixed(1)} kg</strong> |{' '}
                      <span className="text-slate-400">Water:</span>{' '}
                      <strong className="text-cyan-300">{resources.waterLiters.toFixed(1)} L</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {isMoon
                        ? '[DERIVED] ECLSS Electrolysis sized for 3.84 kg O2/day (0.96 kg/person/day for 4 crew per NASA-STD-3001).'
                        : '[DERIVED] Hypothetical scaled oxygen plant (16x MOXIE demonstrator scale = 160 g/h = 3.84 kg/day).'}
                    </p>
                  </>
                )}

                {selectedModule === 'hydroponics' && (
                  <>
                    <p>
                      <span className="text-slate-400">Crop Health:</span>{' '}
                      <strong className="text-emerald-400">{hydroStatus}</strong> | Rations:{' '}
                      <strong>{resources.foodRationsDays.toFixed(1)} Sols</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      [SIMULATION ASSUMPTION] High lighting power yields fresh microgreens and supplemental oxygen (+Morale).
                    </p>
                  </>
                )}

                {selectedModule === 'shield' && (
                  <>
                    <p>
                      <span className="text-slate-400">Regolith Shield:</span>{' '}
                      <strong className="text-amber-400">{resources.regolithShieldCm} cm</strong> ({shieldStatus})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      [SIMULATION ASSUMPTION] Compacted regolith provides thermal insulation and ion shielding. Internal water wall moderates secondary radiation.
                    </p>
                  </>
                )}

                {selectedModule === 'crew' && (
                  <>
                    <p>
                      <span className="text-slate-400">Crew Morale:</span>{' '}
                      <strong className="text-purple-300">{resources.crewMoralePct}%</strong> | Cabin Temp:{' '}
                      <strong>{resources.cabinTempC}°C</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      [OBSERVED SOURCE] NASA-STD-3001 sets cabin thermal envelope at 18.3°C – 26.7°C.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: AUTHENTIC NASA ORBITAL IMAGERY & ILLUMINATION TELEMETRY */
        <div className="p-4 rounded-xl bg-space-900 border border-slate-700 space-y-3 font-sans">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
            <div>
              <span className="font-bold text-xs uppercase font-mono text-cyan-neon">
                {isMoon ? 'NASA LRO (Lunar Reconnaissance Orbiter) Telemetry' : 'NASA MRO (Mars Reconnaissance Orbiter) Telemetry'}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {isMoon ? 'Shackleton Crater Rim Illumination & Diviner Cold Traps' : 'Jezero Crater River Delta Fan Deposits'}
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700">
              OBSERVED SOURCE DATA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <p className="text-slate-300 leading-relaxed">
                {isMoon ? (
                  <>
                    NASA&apos;s Lunar Reconnaissance Orbiter (LRO) Diviner Radiometer and LOLA altimeter revealed that elevated ridge peaks along the rim of <strong>Shackleton Crater (89.9°S)</strong> receive high seasonal illumination (~80–92% seasonally), while the crater interior is in permanent darkness with temperatures plunging below -170°C.
                  </>
                ) : (
                  <>
                    NASA&apos;s Mars 2020 Perseverance rover explores the ancient river delta in <strong>Jezero Crater (18.38°N, 77.58°E)</strong>, where a lake existed billions of years ago. Atmospheric measurements by MEDA document seasonal pressure fluctuations and regional dust devils.
                  </>
                )}
              </p>

              <div className="p-3 rounded-lg bg-space-950 border border-slate-800 font-mono text-[11px] space-y-1">
                <div>• <strong>Location Coordinates:</strong> {isMoon ? '89.9°S, 0.0°E (Lunar South Pole)' : '18.38°N, 77.58°E (Jezero Crater)'}</div>
                <div>• <strong>Primary Orbital Sensor:</strong> {isMoon ? 'LRO Diviner Lunar Radiometer & LOLA' : 'MRO HiRISE & Perseverance MEDA'}</div>
                <div>• <strong>Public Archive Citation:</strong> {isMoon ? 'NASA SVS #3720 (svs.gsfc.nasa.gov/3720)' : 'NASA JPL Photojournal PIA24424'}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-space-950 border border-slate-800 space-y-2">
              <div className="font-mono text-cyan-300 font-bold text-[11px]">
                External Mission Reference Links:
              </div>
              <ul className="space-y-1.5 text-[11px] font-mono">
                <li>
                  <a
                    href={isMoon ? 'https://www.nasa.gov/mission_pages/LRO/main/index.html' : 'https://mars.nasa.gov/mars2020/'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>🔗</span>
                    <span>{isMoon ? 'NASA Lunar Reconnaissance Orbiter Portal' : 'NASA Mars 2020 Perseverance Mission'}</span>
                  </a>
                </li>
                {isMoon && (
                  <li>
                    <a
                      href="https://www.isro.gov.in/Chaste_first_observations.html"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>🔗</span>
                      <span>ISRO Chandrayaan-3 ChaSTE In-Situ Observation (Shiv Shakti Point)</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
