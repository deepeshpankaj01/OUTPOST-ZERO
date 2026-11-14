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

  const isMoon = mission.id === 'moon_shackleton';
  const isCadet = mode === 'cadet';

  // Module statuses
  const lifeSupportStatus =
    allocations.lifeSupportKw >= 3.0 ? 'Nominal' : allocations.lifeSupportKw >= 2.0 ? 'Throttled' : 'Critical';
  const hydroStatus =
    allocations.hydroponicsKw >= 3.0 ? 'Flourishing' : allocations.hydroponicsKw >= 1.5 ? 'Conserving' : 'Wilting';
  const shieldStatus =
    resources.shieldIntegrityPct >= 80 ? 'Fortified' : resources.shieldIntegrityPct >= 50 ? 'Moderate' : 'Vulnerable';
  const powerStatus =
    resources.batteryKWh > 100 ? 'Fully Charged' : resources.batteryKWh > 40 ? 'Sufficient' : 'Low Power';

  const handleModuleClick = (modId: string) => {
    if (onSelectModule) {
      onSelectModule(modId);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-space-950/90 border border-slate-800 p-3 sm:p-5 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-neon animate-ping" />
          <h3 className="text-sm font-bold tracking-wider uppercase text-cyan-300 font-mono">
            {isCadet ? '🗺️ Interactive Outpost Base Map' : 'Outpost Zero Architectural Schematic & Telemetry HUD'}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Active
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Throttled
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Click module to inspect
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[300px] max-h-[460px]">
        <svg
          viewBox="0 0 960 540"
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
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

            <linearGradient id="domeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
              <stop offset="80%" stopColor="#0284C7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.3" />
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

            {/* Glowing Filters */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Sky & Distant Stars */}
          <rect width="960" height="540" fill="url(#spaceSky)" />

          {/* Distant celestial background */}
          {isMoon ? (
            <g transform="translate(800, 70)">
              {/* Earth visible in black lunar sky */}
              <circle cx="0" cy="0" r="32" fill="#0284C7" />
              <path d="M -20,-10 Q -5,-25 15,-15 Q 25,5 10,20 Q -15,22 -20,-10 Z" fill="#10B981" opacity="0.8" />
              <circle cx="0" cy="0" r="32" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.7" />
            </g>
          ) : (
            <g transform="translate(800, 60)">
              {/* Phobos moon in Mars sky */}
              <ellipse cx="0" cy="0" rx="14" ry="10" fill="#CBD5E1" opacity="0.7" />
              <circle cx="-3" cy="-2" r="3" fill="#64748B" opacity="0.6" />
            </g>
          )}

          {/* Random Stars in sky */}
          {[
            [120, 40], [220, 80], [340, 30], [450, 75], [580, 50],
            [700, 90], [80, 110], [880, 130], [290, 140], [640, 120]
          ].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={i % 2 === 0 ? 1.5 : 1} fill="#FFFFFF" opacity={0.6 + (i % 4) * 0.1} />
          ))}

          {/* Surface Terrain / Regolith Ground */}
          <path
            d="M 0,380 Q 240,360 480,385 T 960,375 L 960,540 L 0,540 Z"
            fill="url(#terrainGrad)"
          />
          {/* Crater contours */}
          <ellipse cx="240" cy="410" rx="90" ry="18" fill={isMoon ? '#1E293B' : '#450A0A'} opacity="0.6" />
          <ellipse cx="780" cy="425" rx="120" ry="22" fill={isMoon ? '#1E293B' : '#450A0A'} opacity="0.7" />

          {/* Connecting Pressurized Tunnel Conduits between Modules */}
          <path
            d="M 190,360 L 360,360 L 530,360 L 710,360"
            stroke="#1E293B"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M 190,360 L 710,360"
            stroke="#00F0FF"
            strokeWidth="3"
            strokeDasharray="8 6"
            opacity="0.7"
          />

          {/* ========================================================= */}
          {/* MODULE 1: SOLAR & KILOPOWER REACTOR ARRAY (Left Top) */}
          {/* ========================================================= */}
          <g
            className="cursor-pointer transition-transform group"
            onClick={() => handleModuleClick('power')}
            onMouseEnter={() => setHoveredModule('power')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {/* Selection highlight ring */}
            {(selectedModule === 'power' || hoveredModule === 'power') && (
              <rect x="50" y="160" width="170" height="230" rx="16" fill="#00F0FF" fillOpacity="0.08" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 4" />
            )}

            {/* Solar Arrays (Dual Mast) */}
            <g transform="translate(80, 180)">
              {/* Mast */}
              <line x1="45" y1="180" x2="45" y2="40" stroke="#94A3B8" strokeWidth="6" />
              {/* Crossbar */}
              <line x1="0" y1="60" x2="90" y2="60" stroke="#64748B" strokeWidth="4" />
              {/* Photovoltaic Panels */}
              <rect x="-10" y="20" width="48" height="36" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5" />
              <rect x="52" y="20" width="48" height="36" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5" />
              {/* Solar cell grid lines */}
              <line x1="-10" y1="38" x2="38" y2="38" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
              <line x1="52" y1="38" x2="100" y2="38" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
              <line x1="14" y1="20" x2="14" y2="56" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
              <line x1="76" y1="20" x2="76" y2="56" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />

              {/* Sun rays animation */}
              <line x1="10" y1="0" x2="25" y2="18" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
              <line x1="70" y1="0" x2="80" y2="18" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            </g>

            {/* Kilopower Stirling Reactor Housing */}
            <g transform="translate(145, 290)">
              <rect x="0" y="0" width="45" height="70" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
              {/* Stirling radiator fins */}
              <line x1="-8" y1="15" x2="0" y2="15" stroke="#F59E0B" strokeWidth="2.5" />
              <line x1="-8" y1="25" x2="0" y2="25" stroke="#F59E0B" strokeWidth="2.5" />
              <line x1="-8" y1="35" x2="0" y2="35" stroke="#F59E0B" strokeWidth="2.5" />
              <line x1="45" y1="15" x2="53" y2="15" stroke="#F59E0B" strokeWidth="2.5" />
              <line x1="45" y1="25" x2="53" y2="25" stroke="#F59E0B" strokeWidth="2.5" />
              <line x1="45" y1="35" x2="53" y2="35" stroke="#F59E0B" strokeWidth="2.5" />
              {/* Core glow */}
              <circle cx="22.5" cy="45" r="10" fill="#F59E0B" opacity="0.75" />
              <circle cx="22.5" cy="45" r="6" fill="#FEF08A" />
            </g>

            {/* Label badge */}
            <g transform="translate(65, 395)">
              <rect width="135" height="24" rx="6" fill="#0B132B" stroke="#38BDF8" strokeWidth="1" />
              <text x="67" y="16" fill="#00F0FF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                ⚡ KILOPOWER & SOLAR
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* MODULE 2: ECLSS / MOXIE LIFE SUPPORT CORE (Center-Left) */}
          {/* ========================================================= */}
          <g
            className="cursor-pointer transition-transform"
            onClick={() => handleModuleClick('lifesupport')}
            onMouseEnter={() => setHoveredModule('lifesupport')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {(selectedModule === 'lifesupport' || hoveredModule === 'lifesupport') && (
              <rect x="220" y="240" width="160" height="180" rx="16" fill="#00F0FF" fillOpacity="0.08" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 4" />
            )}

            {/* Life Support Cylindrical Module */}
            <g transform="translate(240, 270)">
              <rect x="0" y="0" width="120" height="90" rx="16" fill="#0F172A" stroke="#00F0FF" strokeWidth="2.5" />
              {/* O2 Gas Tanks */}
              <rect x="15" y="15" width="22" height="60" rx="8" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="26" cy="30" r="4" fill="#FFFFFF" opacity="0.8" />
              <text x="26" y="55" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">O2</text>

              {/* Water Recovery Distillation Column */}
              <rect x="45" y="15" width="30" height="60" rx="6" fill="#075985" stroke="#38BDF8" strokeWidth="1.5" />
              {/* Water level */}
              <rect x="47" y="32" width="26" height="41" rx="4" fill="#06B6D4" opacity="0.7" />
              {/* Bubbles */}
              <circle cx="55" cy="60" r="2.5" fill="#FFFFFF" opacity="0.9" />
              <circle cx="64" cy="48" r="2" fill="#FFFFFF" opacity="0.8" />
              <circle cx="58" cy="38" r="1.5" fill="#FFFFFF" opacity="0.9" />
              <text x="60" y="26" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">H2O</text>

              {/* MOXIE / Catalytic SOXE Chamber */}
              <rect x="83" y="22" width="25" height="46" rx="4" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
              <circle cx="95" cy="45" r="5" fill="#10B981" opacity="0.8" />
            </g>

            {/* Label badge */}
            <g transform="translate(230, 395)">
              <rect width="140" height="24" rx="6" fill="#0B132B" stroke="#00F0FF" strokeWidth="1" />
              <text x="70" y="16" fill="#00F0FF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🌬️ ECLSS & MOXIE
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* MODULE 3: HYDROPONIC ASTRO-GARDEN DOME (Center) */}
          {/* ========================================================= */}
          <g
            className="cursor-pointer transition-transform"
            onClick={() => handleModuleClick('hydroponics')}
            onMouseEnter={() => setHoveredModule('hydroponics')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {(selectedModule === 'hydroponics' || hoveredModule === 'hydroponics') && (
              <rect x="390" y="210" width="170" height="210" rx="16" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
            )}

            {/* Glass Geodesic Dome */}
            <path
              d="M 410,360 A 65,65 0 0,1 540,360 Z"
              fill="url(#hydroDomeGrad)"
              stroke="#10B981"
              strokeWidth="2.5"
            />
            {/* Geodesic frame lattice */}
            <path d="M 475,295 L 435,335 M 475,295 L 515,335 M 435,335 L 515,335" stroke="#34D399" strokeWidth="1.2" opacity="0.6" />

            {/* Grow Light LED Bar */}
            <rect x="445" y="305" width="60" height="6" rx="3" fill="#EC4899" />
            <line x1="450" y1="311" x2="450" y2="340" stroke="#F472B6" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
            <line x1="475" y1="311" x2="475" y2="340" stroke="#F472B6" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
            <line x1="500" y1="311" x2="500" y2="340" stroke="#F472B6" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />

            {/* Hydroponic Green Crop Beds */}
            <g transform="translate(425, 342)">
              <rect x="0" y="8" width="100" height="10" rx="3" fill="#166534" />
              {/* Sprouting leafy plants */}
              <circle cx="15" cy="5" r="5" fill="#22C55E" />
              <circle cx="35" cy="4" r="6" fill="#4ADE80" />
              <circle cx="55" cy="5" r="5" fill="#22C55E" />
              <circle cx="75" cy="4" r="6" fill="#4ADE80" />
              <circle cx="90" cy="6" r="4" fill="#22C55E" />
            </g>

            {/* Label badge */}
            <g transform="translate(405, 395)">
              <rect width="140" height="24" rx="6" fill="#0B132B" stroke="#10B981" strokeWidth="1" />
              <text x="70" y="16" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🌱 ASTRO-GARDEN
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* MODULE 4: REGOLITH SHIELD & STORM SHELTER (Center-Right) */}
          {/* ========================================================= */}
          <g
            className="cursor-pointer transition-transform"
            onClick={() => handleModuleClick('shield')}
            onMouseEnter={() => setHoveredModule('shield')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {(selectedModule === 'shield' || hoveredModule === 'shield') && (
              <rect x="560" y="210" width="165" height="210" rx="16" fill="#F59E0B" fillOpacity="0.08" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
            )}

            {/* Thick Compacted Regolith Berm Overlay */}
            <path
              d="M 570,360 Q 640,250 710,360 Z"
              fill="url(#regolithLayer)"
              stroke="#94A3B8"
              strokeWidth="3"
            />

            {/* Internal Reinforced Storm Bunker */}
            <rect x="600" y="300" width="80" height="60" rx="8" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
            {/* Water-Wall hydronic perimeter */}
            <rect x="606" y="306" width="68" height="48" rx="4" fill="none" stroke="#00F0FF" strokeWidth="2.5" strokeDasharray="5 3" />
            <text x="640" y="335" fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="middle">
              WATER-WALL
            </text>

            {/* Deflecting cosmic rays animation vectors */}
            <path d="M 570,260 L 610,285 L 615,260" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M 670,240 L 650,270 L 680,260" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

            {/* Label badge */}
            <g transform="translate(575, 395)">
              <rect width="145" height="24" rx="6" fill="#0B132B" stroke="#F59E0B" strokeWidth="1" />
              <text x="72" y="16" fill="#F59E0B" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🛡️ REGOLITH & SHELTER
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* MODULE 5: CREW HABITAT & ROVER BAY (Right) */}
          {/* ========================================================= */}
          <g
            className="cursor-pointer transition-transform"
            onClick={() => handleModuleClick('crew')}
            onMouseEnter={() => setHoveredModule('crew')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {(selectedModule === 'crew' || hoveredModule === 'crew') && (
              <rect x="730" y="240" width="180" height="180" rx="16" fill="#A855F7" fillOpacity="0.08" stroke="#A855F7" strokeWidth="2" strokeDasharray="4 4" />
            )}

            {/* Crew Habitat Cylinder */}
            <rect x="745" y="275" width="100" height="85" rx="14" fill="#0F172A" stroke="#A855F7" strokeWidth="2" />
            {/* Porthole Windows */}
            <circle cx="770" cy="300" r="9" fill="#0284C7" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="800" cy="300" r="9" fill="#0284C7" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="830" cy="300" r="9" fill="#0284C7" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* 4 Astronaut Silhouettes */}
            {crew.map((member, i) => (
              <circle
                key={member.id}
                cx={765 + i * 20}
                cy={338}
                r="6"
                fill={member.avatarColor}
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            ))}

            {/* Autonomous Surface Rover */}
            <g transform="translate(850, 340)">
              {/* Rover body */}
              <rect x="0" y="0" width="40" height="16" rx="4" fill="#475569" stroke="#E2E8F0" strokeWidth="1" />
              {/* High-gain antenna */}
              <line x1="30" y1="0" x2="35" y2="-12" stroke="#FBBF24" strokeWidth="1.5" />
              <circle cx="35" cy="-12" r="2.5" fill="#F59E0B" />
              {/* Robotic drill arm */}
              <line x1="5" y1="8" x2="-8" y2="18" stroke="#94A3B8" strokeWidth="2" />
              {/* Rocker-bogie wheels */}
              <circle cx="6" cy="18" r="5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
              <circle cx="20" cy="18" r="5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
              <circle cx="34" cy="18" r="5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
            </g>

            {/* Label badge */}
            <g transform="translate(745, 395)">
              <rect width="145" height="24" rx="6" fill="#0B132B" stroke="#A855F7" strokeWidth="1" />
              <text x="72" y="16" fill="#C084FC" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🚀 CREW & ROVER BAY
              </text>
            </g>
          </g>
        </svg>

        {/* Selected Module Floating Diagnostic Card */}
        {selectedModule && (
          <div className="absolute top-3 left-3 max-w-xs sm:max-w-sm p-3 rounded-xl bg-space-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
              <span className="font-bold text-xs uppercase tracking-wider text-cyan-neon font-mono">
                {selectedModule === 'power' && '⚡ Power Subsystem'}
                {selectedModule === 'lifesupport' && '🌬️ ECLSS & MOXIE Core'}
                {selectedModule === 'hydroponics' && '🌱 Astro-Garden Dome'}
                {selectedModule === 'shield' && '🛡️ Regolith Storm Shelter'}
                {selectedModule === 'crew' && '🚀 Crew Quarters & Rover'}
              </span>
              <button
                onClick={() => onSelectModule && onSelectModule('')}
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
                    {isMoon
                      ? 'Kilopower Stirling baseline (7 kW) + dual solar tracking arrays.'
                      : 'Perseverance-inspired solar array (43% irradiance) + auxiliary RTG.'}
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
                    Status: <strong className="text-cyan-200">{lifeSupportStatus}</strong>.
                    NASA-STD-3001 specifies 0.96 kg O2/day/crewmember. Closed-loop WRS recycles up to 90% at full power.
                  </p>
                </>
              )}

              {selectedModule === 'hydroponics' && (
                <>
                  <p>
                    <span className="text-slate-400">Crop Health:</span>{' '}
                    <strong className="text-emerald-400">{hydroStatus}</strong> | Food:{' '}
                    <strong>{resources.foodRationsDays.toFixed(1)} Sols</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    High power produces fresh microgreens & bonus oxygen (+Morale). Throttling forces emergency ration packs.
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
                    ChaSTE & LRO data prove &gt;85 cm regolith cuts cosmic radiation by &gt;85%. Water-wall hydronic shelter active.
                  </p>
                </>
              )}

              {selectedModule === 'crew' && (
                <>
                  <p>
                    <span className="text-slate-400">Crew Morale:</span>{' '}
                    <strong className="text-purple-300">{resources.crewMoralePct}%</strong> | Temp:{' '}
                    <strong>{resources.cabinTempC}°C</strong>
                  </p>
                  <div className="flex gap-1.5 mt-1">
                    {crew.map((c) => (
                      <span
                        key={c.id}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-200"
                        title={`${c.name} (${c.role}): ${c.status}`}
                      >
                        {c.name.split(' ')[0]} ({c.status})
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
