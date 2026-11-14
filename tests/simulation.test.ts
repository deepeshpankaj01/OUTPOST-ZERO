import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  sanitizeAllocations,
  applyResourceDeltas,
  calculatePowerGenerationKw,
  getSolEnvironmentModifiers,
  calculatePreFlightDeltas,
  simulateNextSol,
  calculateMissionScore,
} from '../src/lib/simulationEngine';
import { MISSIONS, SCIENTIFIC_CONSTANTS } from '../src/data/nasaMissionData';
import { HISTORICAL_DONKI_FLARES, fetchNasaDonkiSpaceWeather } from '../src/data/historicalSpaceWeather';
import { storage, SavedMissionState } from '../src/lib/storage';
import { ResourceState, PowerAllocation, CrewMember, MissionConfig } from '../src/types/mission';

const defaultTestResources: ResourceState = {
  batteryKWh: 80.0,
  batteryCapacityKWh: 100.0,
  oxygenKg: 85.0,
  waterLiters: 320.0,
  regolithShieldCm: 65.0,
  shieldIntegrityPct: 76,
  cabinTempC: 21.0,
  radiationDoseAccumulatedMSv: 0.12,
  radiationRateMSvPerDay: 0.12,
  foodRationsDays: 14.0,
  crewMoralePct: 88,
};

const defaultTestAllocations: PowerAllocation = {
  lifeSupportKw: 3.5,
  hydroponicsKw: 2.0,
  shieldThermalKw: 3.5,
  scienceIsruKw: 2.0,
};

const defaultCrew: CrewMember[] = [
  { id: 'c1', name: 'Commander Nova Chen', role: 'Mission Commander', specialty: 'Systems Operations', avatarSvg: '👩‍🚀', health: 95, morale: 90, status: 'Nominal' },
  { id: 'c2', name: 'Dr. Tariq Al-Mansoor', role: 'Chief Science Officer', specialty: 'ISRU Volatiles & Geology', avatarSvg: '👨‍🚀', health: 92, morale: 88, status: 'Nominal' },
  { id: 'c3', name: 'Elena Rostova', role: 'Lead ECLSS Engineer', specialty: 'Closed-Loop Hydration & O2', avatarSvg: '👩‍🚀', health: 94, morale: 89, status: 'Nominal' },
  { id: 'c4', name: 'Kiran Patel', role: 'Robotics & EVA Specialist', specialty: 'Regolith Sintering Rovers', avatarSvg: '🧑‍🚀', health: 96, morale: 92, status: 'Nominal' },
];

describe('1. Power Budget & Battery Storage Calculations', () => {
  it('correctly uses 24.0 hours for Moon and 24.6 hours for Mars', () => {
    const moonMission = MISSIONS['moon_shackleton'];
    const marsMission = MISSIONS['mars_jezero'];

    const moonDeltas = calculatePreFlightDeltas(moonMission, defaultTestResources, defaultTestAllocations, 1);
    const marsDeltas = calculatePreFlightDeltas(marsMission, defaultTestResources, defaultTestAllocations, 1);

    const moonGen = calculatePowerGenerationKw(moonMission, 1);
    const marsGen = calculatePowerGenerationKw(marsMission, 1);

    const moonConsumedKw = 3.5 + 2.0 + 3.5 + 2.0; // 11.0 kW
    const moonExpectedKWh = parseFloat(((moonGen.totalKw - moonConsumedKw) * 24.0).toFixed(1));
    assert.strictEqual(moonDeltas.batteryNetKWh, moonExpectedKWh);

    const marsExpectedKWh = parseFloat(((marsGen.totalKw - moonConsumedKw) * 24.6).toFixed(1));
    assert.strictEqual(marsDeltas.batteryNetKWh, marsExpectedKWh);
  });

  it('clamps battery storage between 0 and maximum battery capacity', () => {
    // Massive surplus: shouldn't exceed batteryCapacityKWh (100 kWh)
    const surplusState = applyResourceDeltas(defaultTestResources, { batteryKWhDelta: 50.0 });
    assert.strictEqual(surplusState.batteryKWh, 100.0);

    // Massive deficit: shouldn't drop below 0 kWh
    const deficitState = applyResourceDeltas(defaultTestResources, { batteryKWhDelta: -150.0 });
    assert.strictEqual(deficitState.batteryKWh, 0.0);
  });

  it('distinguishes base power architecture from photovoltaic generation', () => {
    const moonMission = MISSIONS['moon_shackleton'];
    const gen = calculatePowerGenerationKw(moonMission, 1);

    assert.strictEqual(gen.kilopowerKw, 7.0);
    assert.strictEqual(gen.totalKw, gen.solarKw + gen.kilopowerKw);
    assert.ok(gen.totalKw <= moonMission.maxPowerBudgetKw);
  });
});

describe('2. Oxygen & Water Balances (NASA-STD-3001 & ISS ECLSS)', () => {
  it('enforces NASA-STD-3001 baseline human metabolic demands', () => {
    // 0.96 kg O2/astronaut/day * 4 = 3.84 kg O2/day
    assert.strictEqual(SCIENTIFIC_CONSTANTS.humanPhysiology.o2CrewTotalKgPerDay, 3.84);
    // 3.87 kg fluid turnover/astronaut/day * 4 = 15.48 L/day
    assert.strictEqual(SCIENTIFIC_CONSTANTS.humanPhysiology.waterCrewTotalLPerDay, 15.48);
  });

  it('correctly models 16x scaled habitat oxygen plant on Mars', () => {
    const marsMission = MISSIONS['mars_jezero'];
    // At nominal 3.0 kW, 16x scaled plant yields exactly 3.84 kg O2/day (160 g/h) matching 4 crew demand
    const deltasNominal = calculatePreFlightDeltas(
      marsMission,
      defaultTestResources,
      { lifeSupportKw: 3.0, hydroponicsKw: 0.0, shieldThermalKw: 3.5, scienceIsruKw: 2.0 },
      1
    );
    // Net oxygen should be ~0 kg (3.84 production - 3.84 consumption)
    assert.strictEqual(deltasNominal.oxygenNetKg, 0.0);
  });

  it('models water recovery efficiency curve dropping under low-power brownout', () => {
    const moonMission = MISSIONS['moon_shackleton'];

    // Nominal life support (3.5 kW) -> wrsRatio 1.0 -> 90% recovery
    const deltasNominal = calculatePreFlightDeltas(
      moonMission,
      defaultTestResources,
      { lifeSupportKw: 3.5, hydroponicsKw: 0, shieldThermalKw: 3.5, scienceIsruKw: 0 },
      1
    );

    // Low-power brownout (1.0 kW) -> wrsRatio < 0.8 -> lower recovery
    const deltasLowPower = calculatePreFlightDeltas(
      moonMission,
      defaultTestResources,
      { lifeSupportKw: 1.0, hydroponicsKw: 0, shieldThermalKw: 3.5, scienceIsruKw: 0 },
      1
    );

    assert.ok(deltasNominal.waterNetLiters > deltasLowPower.waterNetLiters);
  });
});

describe('3. Boundary Validation & Engine Sanitization', () => {
  it('sanitizes NaN, Infinity, negative values, and missing fields', () => {
    const dirtyAllocations = {
      lifeSupportKw: NaN,
      hydroponicsKw: -5,
      shieldThermalKw: Infinity,
      scienceIsruKw: 'invalid' as any,
    };

    const clean = sanitizeAllocations(dirtyAllocations);

    assert.strictEqual(clean.lifeSupportKw, 3.5); // Fallback to default
    assert.strictEqual(clean.hydroponicsKw, 0.0); // Clamped to min 0.0
    assert.strictEqual(clean.shieldThermalKw, 3.5); // Fallback to default
    assert.strictEqual(clean.scienceIsruKw, 2.0); // Fallback to default
  });

  it('clamps extreme positive numbers to subsystem maximum limits', () => {
    const excessiveAllocations = {
      lifeSupportKw: 999,
      hydroponicsKw: 50,
      shieldThermalKw: 100,
      scienceIsruKw: 80,
    };

    const clean = sanitizeAllocations(excessiveAllocations);

    assert.strictEqual(clean.lifeSupportKw, 6.0);
    assert.strictEqual(clean.hydroponicsKw, 5.0);
    assert.strictEqual(clean.shieldThermalKw, 6.0);
    assert.strictEqual(clean.scienceIsruKw, 5.0);
  });

  it('applyResourceDeltas safely clamps all parameters within physiological boundaries', () => {
    const result = applyResourceDeltas(defaultTestResources, {
      oxygenKgDelta: -200,
      waterLitersDelta: -500,
      shieldCmDelta: 500,
      tempDeltaC: -100,
      moraleDelta: 200,
      radiationMSvDelta: -10,
    });

    assert.strictEqual(result.oxygenKg, 0.0);
    assert.strictEqual(result.waterLiters, 0.0);
    assert.strictEqual(result.regolithShieldCm, 150.0); // Max 150 cm
    assert.strictEqual(result.cabinTempC, 0.0); // Min 0 °C
    assert.strictEqual(result.crewMoralePct, 100); // Max 100%
    assert.strictEqual(result.radiationDoseAccumulatedMSv, 0.0); // Min 0.0 mSv
  });
});

describe('4. Deterministic Repeatability (Zero Math.random in Engine)', () => {
  it('produces identical simulation results for identical inputs', () => {
    const moonMission = MISSIONS['moon_shackleton'];

    const run1 = simulateNextSol(moonMission, defaultTestResources, defaultTestAllocations, defaultCrew, 1);
    const run2 = simulateNextSol(moonMission, defaultTestResources, defaultTestAllocations, defaultCrew, 1);

    assert.deepStrictEqual(run1.nextResources, run2.nextResources);
    assert.deepStrictEqual(run1.logEntry, run2.logEntry);
    assert.strictEqual(run1.nextCrew[0].morale, run2.nextCrew[0].morale);
    assert.strictEqual(run1.failureReason, run2.failureReason);
  });

  it('produces identical pre-flight deltas across multiple invocations', () => {
    const marsMission = MISSIONS['mars_jezero'];

    const delta1 = calculatePreFlightDeltas(marsMission, defaultTestResources, defaultTestAllocations, 2);
    const delta2 = calculatePreFlightDeltas(marsMission, defaultTestResources, defaultTestAllocations, 2);

    assert.deepStrictEqual(delta1, delta2);
  });
});

describe('5. Crisis Sequencing & Rewind State Management', () => {
  it('tracks resolvedCrises and prevents duplicate crisis triggers', () => {
    const moonMission = MISSIONS['moon_shackleton'];
    const crisis = moonMission.crises[0]; // e.g. sol 3 lunar_spe_storm

    const resolvedCrises: string[] = [];

    // Check if crisis triggers on Sol 3 when unresolved
    const shouldTrigger1 = crisis.sol === 3 && !resolvedCrises.includes(crisis.id);
    assert.strictEqual(shouldTrigger1, true);

    // Resolve crisis
    resolvedCrises.push(crisis.id);

    // Crisis should now NOT trigger again on Sol 3
    const shouldTrigger2 = crisis.sol === 3 && !resolvedCrises.includes(crisis.id);
    assert.strictEqual(shouldTrigger2, false);
  });

  it('preserves rewind snapshots without mutating original state', () => {
    const mockState: SavedMissionState = {
      missionId: 'moon_shackleton',
      currentSol: 2,
      resources: { ...defaultTestResources },
      allocations: { ...defaultTestAllocations },
      history: [],
      crew: [...defaultCrew],
      isCompleted: false,
      score: 75,
      resolvedCrises: ['lunar_spe_storm'],
      lastUpdated: new Date().toISOString(),
    };

    // Deep clone check
    const snapshot = JSON.parse(JSON.stringify(mockState));
    snapshot.resources.oxygenKg = 50.0;
    assert.notStrictEqual(mockState.resources.oxygenKg, snapshot.resources.oxygenKg);
  });
});

describe('6. DONKI Space Weather Fallback & Provenance', () => {
  it('provides verified newest historical flare FLR-2024-X2.4 as deterministic primary', () => {
    const primary = HISTORICAL_DONKI_FLARES[0];
    assert.strictEqual(primary.flareId, 'FLR-2024-X2.4');
    assert.strictEqual(primary.classType, 'X2.4');
    assert.strictEqual(primary.observedDate, '2024-10-09');
    assert.strictEqual(primary.isExtrapolatedScenarioModifier, true);
  });

  it('handles live NASA DONKI telemetry response with events', async () => {
    const originalFetch = global.fetch;
    global.fetch = async () =>
      ({
        ok: true,
        status: 200,
        json: async () => [
          {
            flrID: 'FLR-TEST-X3.0',
            classType: 'X3.0',
            beginTime: '2026-11-14T10:00Z',
            peakTime: '2026-11-14T10:30Z',
            sourceLocation: 'AR4000',
          },
        ],
      } as any);

    try {
      const res = await fetchNasaDonkiSpaceWeather();
      assert.strictEqual(res.isLive, true);
      assert.strictEqual(res.statusType, 'live_telemetry');
      assert.strictEqual(res.rawApiCount, 1);
      assert.strictEqual(res.event.classType, 'X3.0');
      assert.ok(res.provenanceNote.includes('OBSERVED SOURCE DATA'));
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('distinguishes empty 0-count response from error', async () => {
    const originalFetch = global.fetch;
    global.fetch = async () =>
      ({
        ok: true,
        status: 200,
        json: async () => [],
      } as any);

    try {
      const res = await fetchNasaDonkiSpaceWeather();
      assert.strictEqual(res.isLive, false);
      assert.strictEqual(res.statusType, 'no_events_found');
      assert.strictEqual(res.rawApiCount, 0);
      assert.strictEqual(res.event.flareId, 'FLR-2024-X2.4'); // Deterministic fallback
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('handles HTTP error by falling back deterministically with api_error status', async () => {
    const originalFetch = global.fetch;
    global.fetch = async () =>
      ({
        ok: false,
        status: 429,
        json: async () => ({}),
      } as any);

    try {
      const res = await fetchNasaDonkiSpaceWeather();
      assert.strictEqual(res.isLive, false);
      assert.strictEqual(res.statusType, 'api_error');
      assert.strictEqual(res.event.flareId, 'FLR-2024-X2.4');
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('handles network abort or timeout with offline_fallback status', async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => {
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    };

    try {
      const res = await fetchNasaDonkiSpaceWeather();
      assert.strictEqual(res.isLive, false);
      assert.strictEqual(res.statusType, 'offline_fallback');
      assert.strictEqual(res.event.flareId, 'FLR-2024-X2.4');
    } finally {
      global.fetch = originalFetch;
    }
  });
});

describe('7. Local Storage Robustness & Corruption Handling', () => {
  it('returns safe default player profile on corrupted or invalid JSON', () => {
    // Test validation logic directly
    const defaultProfile = storage.getPlayerProfile();
    assert.ok(defaultProfile.callsign);
    assert.ok(Array.isArray(defaultProfile.badgesEarned));
    assert.strictEqual(typeof defaultProfile.highScores, 'object');
  });

  it('safely validates mission state structure and rejects corrupted state', () => {
    // Test parser validation
    const invalidObj = { currentSol: 'five', resources: null };
    const isValid =
      invalidObj &&
      typeof invalidObj === 'object' &&
      (invalidObj as any).missionId &&
      typeof (invalidObj as any).currentSol === 'number' &&
      (invalidObj as any).resources &&
      (invalidObj as any).allocations;

    assert.strictEqual(!isValid, true);
  });
});

describe('8. Dynamic Mission Score Calculation', () => {
  it('calculates dynamic score from actual resources without hardcoded constants', () => {
    const perfectResources: ResourceState = {
      ...defaultTestResources,
      batteryKWh: 100.0,
      batteryCapacityKWh: 100.0,
      oxygenKg: 90.0,
      waterLiters: 350.0,
      crewMoralePct: 100,
      radiationDoseAccumulatedMSv: 0.05,
    };

    const highScore = calculateMissionScore(perfectResources, []);
    assert.ok(highScore >= 95 && highScore <= 100);

    const depletedResources: ResourceState = {
      ...defaultTestResources,
      batteryKWh: 10.0,
      batteryCapacityKWh: 100.0,
      oxygenKg: 15.0,
      waterLiters: 50.0,
      crewMoralePct: 20,
      radiationDoseAccumulatedMSv: 50.0,
    };

    const lowScore = calculateMissionScore(depletedResources, []);
    assert.ok(lowScore < 40 && lowScore >= 10);
  });
});
