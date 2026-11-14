'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MissionId,
  AudienceMode,
  ResourceState,
  PowerAllocation,
  SolLogEntry,
  CrewMember,
  CrisisEvent,
  CrisisChoice,
  FailureReason,
} from '../types/mission';
import { MISSIONS, DEFAULT_CREW } from '../data/nasaMissionData';
import {
  fetchNasaDonkiSpaceWeather,
  DonkiApiResult,
} from '../data/historicalSpaceWeather';
import {
  calculatePowerGenerationKw,
  calculatePreFlightDeltas,
  simulateNextSol,
  SolSimulationResult,
  getSolEnvironmentModifiers,
  applyResourceDeltas,
  calculateMissionScore,
} from '../lib/simulationEngine';
import { storage, SavedMissionState } from '../lib/storage';
import { audioEngine } from '../lib/audioEngine';

// Components
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CommanderAria } from '../components/CommanderAria';
import { OutpostMapSvg } from '../components/OutpostMapSvg';
import { AllocationSliders } from '../components/AllocationSliders';
import { PreFlightCalculator } from '../components/PreFlightCalculator';
import { TelemetryCharts } from '../components/TelemetryCharts';
import { AstroProfileCard } from '../components/AstroProfileCard';
import { CrisisModal } from '../components/CrisisModal';
import { TimeMachineModal } from '../components/TimeMachineModal';
import { DebriefCertificateModal } from '../components/DebriefCertificateModal';
import { ScienceLabModal } from '../components/ScienceLabModal';
import { BriefingModal } from '../components/BriefingModal';

export default function MissionControlPage() {
  // --- State Initialization ---
  const [missionId, setMissionId] = useState<MissionId>('moon_shackleton');
  const [mode, setMode] = useState<AudienceMode>('cadet');
  const [currentSol, setCurrentSol] = useState<number>(1);
  const [resources, setResources] = useState<ResourceState>(
    MISSIONS.moon_shackleton.initialResources
  );
  const [allocations, setAllocations] = useState<PowerAllocation>({
    lifeSupportKw: 3.5,
    hydroponicsKw: 2.5,
    shieldThermalKw: 3.5,
    scienceIsruKw: 2.0,
  });
  const [history, setHistory] = useState<SolLogEntry[]>([
    {
      sol: 1,
      powerGeneratedKw: 18.0,
      powerConsumedKw: 11.5,
      batteryPct: 80,
      oxygenKg: 85.0,
      waterLiters: 350.0,
      radiationDoseMSv: 0.65,
      cabinTempC: 22.0,
      moralePct: 92,
    },
  ]);
  const [crew, setCrew] = useState<CrewMember[]>(DEFAULT_CREW);
  const [resolvedCrises, setResolvedCrises] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Modals & Overlays
  const [activeCrisis, setActiveCrisis] = useState<CrisisEvent | null>(null);
  const [failureReason, setFailureReason] = useState<FailureReason | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showScienceLab, setShowScienceLab] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);

  // DONKI Live API state
  const [donkiState, setDonkiState] = useState<DonkiApiResult | null>(null);
  const [isLoadingDonki, setIsLoadingDonki] = useState(false);

  const mission = MISSIONS[missionId] || MISSIONS.moon_shackleton;
  const isCadet = mode === 'cadet';

  // --- Initialize on Client Mount ---
  useEffect(() => {
    // Check saved audience mode
    try {
      const savedMode = localStorage.getItem('outpost_zero_audience_mode');
      if (savedMode === 'flight_director' || savedMode === 'cadet') {
        setMode(savedMode);
      }
    } catch (e) {}

    // Check saved mission state
    const saved = storage.getMissionState();
    if (saved && saved.missionId && MISSIONS[saved.missionId]) {
      setMissionId(saved.missionId);
      setCurrentSol(saved.currentSol);
      setResources(saved.resources);
      setAllocations(saved.allocations);
      setHistory(saved.history);
      setCrew(saved.crew);
      setResolvedCrises(saved.resolvedCrises || []);
      if (saved.isCompleted) {
        setShowCertificate(true);
      }
    }

    // Auto-fetch DONKI space weather
    handleSyncDonki();
  }, []);

  // --- Save State to LocalStorage ---
  const saveCurrentMission = useCallback(
    (
      overrides?: Partial<{
        sol: number;
        res: ResourceState;
        alloc: PowerAllocation;
        hist: SolLogEntry[];
        crw: CrewMember[];
        resolved: string[];
        completed: boolean;
      }>
    ) => {
      const currentHist = overrides?.hist ?? history;
      const currentRes = overrides?.res ?? resources;
      const derivedScore = calculateMissionScore(currentRes, currentHist);

      const stateToSave: SavedMissionState = {
        missionId,
        currentSol: overrides?.sol ?? currentSol,
        resources: currentRes,
        allocations: overrides?.alloc ?? allocations,
        history: currentHist,
        crew: overrides?.crw ?? crew,
        resolvedCrises: overrides?.resolved ?? resolvedCrises,
        isCompleted: overrides?.completed ?? showCertificate,
        score: derivedScore,
        lastUpdated: new Date().toISOString(),
      };
      storage.saveMissionState(stateToSave);
    },
    [missionId, currentSol, resources, allocations, history, crew, resolvedCrises, showCertificate]
  );

  // --- Live NASA DONKI Fetch ---
  const handleSyncDonki = async () => {
    setIsLoadingDonki(true);
    try {
      const res = await fetchNasaDonkiSpaceWeather();
      setDonkiState(res);
    } catch (e) {
      console.warn('DONKI fetch failed, fallback used');
    } finally {
      setIsLoadingDonki(false);
    }
  };

  // --- Switch Mission ---
  const handleSelectMission = (newMissionId: MissionId) => {
    if (newMissionId === missionId) return;
    const newMission = MISSIONS[newMissionId];
    if (!newMission) return;

    setMissionId(newMissionId);
    setCurrentSol(1);
    setResources(newMission.initialResources);
    setAllocations({
      lifeSupportKw: newMissionId === 'mars_jezero' ? 3.0 : 3.5,
      hydroponicsKw: 2.5,
      shieldThermalKw: 3.5,
      scienceIsruKw: 2.0,
    });
    setHistory([
      {
        sol: 1,
        powerGeneratedKw: newMission.maxPowerBudgetKw,
        powerConsumedKw: 11.0,
        batteryPct: Math.round(
          (newMission.initialResources.batteryKWh /
            newMission.initialResources.batteryCapacityKWh) *
            100
        ),
        oxygenKg: newMission.initialResources.oxygenKg,
        waterLiters: newMission.initialResources.waterLiters,
        radiationDoseMSv: newMission.ambientRadiationMSvPerDay,
        cabinTempC: newMission.initialResources.cabinTempC,
        moralePct: newMission.initialResources.crewMoralePct,
      },
    ]);
    setCrew(DEFAULT_CREW);
    setResolvedCrises([]);
    setActiveCrisis(null);
    setFailureReason(null);
    setShowCertificate(false);
    storage.clearMissionState();
  };

  // --- Reset Current Scenario ---
  const handleResetCurrentScenario = () => {
    const currentConfig = MISSIONS[missionId];
    setCurrentSol(1);
    setResources(currentConfig.initialResources);
    setAllocations({
      lifeSupportKw: missionId === 'mars_jezero' ? 3.0 : 3.5,
      hydroponicsKw: 2.5,
      shieldThermalKw: 3.5,
      scienceIsruKw: 2.0,
    });
    setHistory([
      {
        sol: 1,
        powerGeneratedKw: currentConfig.maxPowerBudgetKw,
        powerConsumedKw: 11.0,
        batteryPct: Math.round(
          (currentConfig.initialResources.batteryKWh /
            currentConfig.initialResources.batteryCapacityKWh) *
            100
        ),
        oxygenKg: currentConfig.initialResources.oxygenKg,
        waterLiters: currentConfig.initialResources.waterLiters,
        radiationDoseMSv: currentConfig.ambientRadiationMSvPerDay,
        cabinTempC: currentConfig.initialResources.cabinTempC,
        moralePct: currentConfig.initialResources.crewMoralePct,
      },
    ]);
    setCrew(DEFAULT_CREW);
    setResolvedCrises([]);
    setActiveCrisis(null);
    setFailureReason(null);
    setShowCertificate(false);
    storage.clearMissionState();
  };

  // --- Toggle Audience Mode ---
  const handleToggleMode = () => {
    const nextMode: AudienceMode = mode === 'cadet' ? 'flight_director' : 'cadet';
    setMode(nextMode);
    try {
      localStorage.setItem('outpost_zero_audience_mode', nextMode);
    } catch (e) {}
  };

  // --- Advance to Next Sol ---
  const handleAdvanceSol = () => {
    // 1. Check if an unresolved space crisis is scheduled for the current Sol
    const crisisForSol = mission.crises.find(
      (c) => c.sol === currentSol && !resolvedCrises.includes(c.id)
    );

    if (crisisForSol && !activeCrisis) {
      // Snapshot state BEFORE crisis choice is taken
      const snapshot: SavedMissionState = {
        missionId,
        currentSol,
        resources,
        allocations,
        history,
        crew,
        resolvedCrises,
        isCompleted: false,
        score: calculateMissionScore(resources, history),
        lastUpdated: new Date().toISOString(),
      };
      storage.pushRewindSnapshot(snapshot);
      setActiveCrisis(crisisForSol);
      return;
    }

    // Snapshot state BEFORE advancing the Sol
    const snapshot: SavedMissionState = {
      missionId,
      currentSol,
      resources,
      allocations,
      history,
      crew,
      resolvedCrises,
      isCompleted: false,
      score: calculateMissionScore(resources, history),
      lastUpdated: new Date().toISOString(),
    };
    storage.pushRewindSnapshot(snapshot);

    // Run deterministic scientific simulation
    const result = simulateNextSol(mission, resources, allocations, crew, currentSol);

    if (result.failureReason) {
      setFailureReason(result.failureReason);
      return;
    }

    const nextSolNumber = currentSol + 1;
    const newHistory = [...history, result.logEntry];

    setResources(result.nextResources);
    setCrew(result.nextCrew);
    setHistory(newHistory);

    if (nextSolNumber > mission.missionDurationSols) {
      // Mission completed
      setShowCertificate(true);
      saveCurrentMission({
        sol: currentSol,
        res: result.nextResources,
        hist: newHistory,
        crw: result.nextCrew,
        completed: true,
      });
    } else {
      setCurrentSol(nextSolNumber);
      saveCurrentMission({
        sol: nextSolNumber,
        res: result.nextResources,
        hist: newHistory,
        crw: result.nextCrew,
      });

      // Check if next sol immediately triggers a crisis
      const nextCrisis = mission.crises.find(
        (c) => c.sol === nextSolNumber && !resolvedCrises.includes(c.id)
      );
      if (nextCrisis) {
        setActiveCrisis(nextCrisis);
      }
    }
  };

  // --- Handle Crisis Decision Choice ---
  const handleCrisisChoice = (choice: CrisisChoice) => {
    if (!activeCrisis) return;

    // Apply choice deltas using canonical update function
    const updatedResources = applyResourceDeltas(resources, choice.resourceImpacts);
    const updatedResolved = [...resolvedCrises, activeCrisis.id];

    setResources(updatedResources);
    setResolvedCrises(updatedResolved);
    setActiveCrisis(null);

    saveCurrentMission({
      res: updatedResources,
      resolved: updatedResolved,
    });
  };

  // --- Time Machine Rewind ---
  const handleRewindOneSol = () => {
    const prev = storage.popRewindSnapshot();
    if (prev) {
      setCurrentSol(prev.currentSol);
      setResources(prev.resources);
      setAllocations(prev.allocations);
      setHistory(prev.history);
      setCrew(prev.crew);
      setResolvedCrises(prev.resolvedCrises || []);
      setFailureReason(null);
      setActiveCrisis(null);
      storage.saveMissionState(prev);
    } else {
      handleResetCurrentScenario();
    }
  };

  // --- Reset to Baseline Parameters ---
  const handleResetToBaseline = () => {
    setAllocations({
      lifeSupportKw: missionId === 'mars_jezero' ? 3.0 : 3.5,
      hydroponicsKw: 2.5,
      shieldThermalKw: 3.5,
      scienceIsruKw: 2.0,
    });
  };

  // Calculate current power generation & projected deltas
  const powerGen = calculatePowerGenerationKw(mission, currentSol);
  const preFlightDeltas = calculatePreFlightDeltas(
    mission,
    resources,
    allocations,
    currentSol
  );
  const envModifiers = getSolEnvironmentModifiers(mission, currentSol);

  return (
    <div className="min-h-screen flex flex-col bg-space-950 text-slate-100 max-w-full overflow-x-hidden">
      {/* Top Navigation Bar */}
      <Navbar
        currentMissionId={missionId}
        mode={mode}
        currentSol={currentSol}
        maxSols={mission.missionDurationSols}
        donkiState={donkiState}
        isLoadingDonki={isLoadingDonki}
        onSelectMission={handleSelectMission}
        onToggleMode={handleToggleMode}
        onSyncDonki={handleSyncDonki}
        onOpenScienceLab={() => setShowScienceLab(true)}
        onOpenBriefing={() => setShowBriefing(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6">
        {/* Persistent Educational Notice Banner */}
        <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 text-amber-200/90 text-xs font-sans flex items-start gap-2 shadow-sm">
          <span className="text-amber-400 text-sm" aria-hidden="true">⚠️</span>
          <div>
            <strong>Persistent Notice:</strong> OUTPOST ZERO is an educational simulation, not an engineering design tool, flight procedure, radiation safety assessment, or NASA/ISRO-endorsed product.
          </div>
        </div>

        {/* Mission Briefing Banner */}
        <section
          aria-label="Mission Briefing and Environmental Conditions"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-slate-800 p-4 sm:p-6 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  {mission.destination}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Site: <strong>{mission.destinationName}</strong>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800/50">
                  {envModifiers.statusNote}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide">
                {isCadet ? mission.cadetName : mission.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                {isCadet ? mission.cadetDescription : mission.description}
              </p>
            </div>

            {/* Quick Stats Pill Group */}
            <div className="flex flex-wrap md:flex-col gap-2 font-mono text-xs text-right">
              <div className="px-3 py-1.5 rounded-lg bg-space-950 border border-slate-800">
                <div className="text-[10px] uppercase text-slate-400">Solar Flux</div>
                <div className="text-cyan-neon font-bold">
                  {mission.solarIrradianceWPerM2} W/m²
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-space-950 border border-slate-800">
                <div className="text-[10px] uppercase text-slate-400">Base Temp</div>
                <div className="text-amber-400 font-bold">
                  {mission.baselineSurfaceTempC}°C
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commander Aria Mentor Card */}
        <section aria-label="Commander Aria Mentor Guidance">
          <CommanderAria
            mode={mode}
            currentSol={currentSol}
            mood={
              preFlightDeltas.warningAlerts.length > 0
                ? 'alert'
                : currentSol > 8
                ? 'proud'
                : 'nominal'
            }
            onQuickTipClick={() => {
              setSelectedModule('lifesupport');
            }}
          />
        </section>

        {/* Interactive SVG Outpost Map */}
        <section aria-label="Interactive Habitat Schematic and Site Imagery">
          <OutpostMapSvg
            mission={mission}
            resources={resources}
            allocations={allocations}
            crew={crew}
            mode={mode}
            selectedModule={selectedModule}
            onSelectModule={(id) => setSelectedModule(id)}
          />
        </section>

        {/* Pre-Flight Calculator & Deltas Preview */}
        <section aria-label="Pre-Flight Consequence Preview Calculator">
          <PreFlightCalculator
            deltas={preFlightDeltas}
            currentResources={resources}
            currentSol={currentSol}
            maxSols={mission.missionDurationSols}
            mode={mode}
            onAdvanceSol={handleAdvanceSol}
            onResetToBaseline={handleResetToBaseline}
          />
        </section>

        {/* 4 Engineering Allocation Sliders */}
        <section aria-label="Electrical Power Allocation Controls">
          <AllocationSliders
            mission={mission}
            allocations={allocations}
            availablePowerKw={powerGen.totalKw}
            mode={mode}
            onChange={(newAlloc) => setAllocations(newAlloc)}
            focusedSlider={selectedModule}
          />
        </section>

        {/* Crew & Player Profile Badges */}
        <section aria-label="Crew Status and Morale">
          <AstroProfileCard crew={crew} mode={mode} />
        </section>

        {/* Multi-Channel Telemetry Historical Charts */}
        <section aria-label="Subsystem Telemetry History Charts">
          <TelemetryCharts history={history} mode={mode} />
        </section>
      </main>

      {/* Footer */}
      <Footer
        onOpenScienceLab={() => setShowScienceLab(true)}
        onOpenBriefing={() => setShowBriefing(true)}
        onResetProgress={handleResetCurrentScenario}
      />

      {/* --- MODALS & OVERLAYS --- */}

      {/* 1. Dynamic Space Crisis Modal */}
      {activeCrisis && (
        <CrisisModal
          crisis={activeCrisis}
          mode={mode}
          onSelectChoice={handleCrisisChoice}
        />
      )}

      {/* 2. What-If Time Machine (Non-Punitive Failure Debrief) */}
      {failureReason && (
        <TimeMachineModal
          failureReason={failureReason}
          currentSol={currentSol}
          mode={mode}
          canRewind={storage.getRewindStack().length > 0}
          onRewindOneSol={handleRewindOneSol}
          onRestartMission={handleResetCurrentScenario}
        />
      )}

      {/* 3. Educational Mission Completion Certificate */}
      {showCertificate && (
        <DebriefCertificateModal
          mission={mission}
          finalResources={resources}
          history={history}
          mode={mode}
          onClose={() => setShowCertificate(false)}
          onRestart={handleResetCurrentScenario}
        />
      )}

      {/* 4. NASA & ISRO Science Lab & Provenance Registry */}
      {showScienceLab && (
        <ScienceLabModal onClose={() => setShowScienceLab(false)} />
      )}

      {/* 5. Mission Briefing Overview Modal */}
      {showBriefing && (
        <BriefingModal
          mission={mission}
          mode={mode}
          onClose={() => setShowBriefing(false)}
        />
      )}
    </div>
  );
}
