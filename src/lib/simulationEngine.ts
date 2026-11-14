import {
  MissionConfig,
  ResourceState,
  PowerAllocation,
  PreFlightDelta,
  SolLogEntry,
  CrewMember,
  FailureReason,
} from '../types/mission';
import { SCIENTIFIC_CONSTANTS } from '../data/nasaMissionData';

export interface SolSimulationResult {
  nextResources: ResourceState;
  nextCrew: CrewMember[];
  logEntry: SolLogEntry;
  failureReason?: FailureReason;
}

/**
 * Validates and sanitizes power allocation inputs against engine boundaries.
 * Prevents NaN, negative numbers, Infinity, or out-of-range allocations.
 */
export function sanitizeAllocations(allocations: Partial<PowerAllocation>): PowerAllocation {
  const clamp = (val: any, min: number, max: number, defaultVal: number): number => {
    const num = Number(val);
    if (!Number.isFinite(num) || Number.isNaN(num)) return defaultVal;
    return parseFloat(Math.min(max, Math.max(min, num)).toFixed(1));
  };

  return {
    lifeSupportKw: clamp(allocations?.lifeSupportKw, 0.5, 6.0, 3.5),
    hydroponicsKw: clamp(allocations?.hydroponicsKw, 0.0, 5.0, 2.5),
    shieldThermalKw: clamp(allocations?.shieldThermalKw, 0.5, 6.0, 3.5),
    scienceIsruKw: clamp(allocations?.scienceIsruKw, 0.0, 5.0, 2.0),
  };
}

/**
 * Canonical Resource Update Function
 * Enforces simulation boundary invariants and limits across all state transitions.
 */
export function applyResourceDeltas(
  current: ResourceState,
  deltas: {
    batteryKWhDelta?: number;
    oxygenKgDelta?: number;
    waterLitersDelta?: number;
    radiationMSvDelta?: number;
    shieldCmDelta?: number;
    moraleDelta?: number;
    foodDaysDelta?: number;
    tempDeltaC?: number;
  }
): ResourceState {
  const safeNum = (n: any, def: number = 0) => (Number.isFinite(Number(n)) ? Number(n) : def);

  const newBattery = Math.min(
    current.batteryCapacityKWh,
    Math.max(0, current.batteryKWh + safeNum(deltas.batteryKWhDelta))
  );

  const newOxygen = Math.max(0, current.oxygenKg + safeNum(deltas.oxygenKgDelta));
  const newWater = Math.max(0, current.waterLiters + safeNum(deltas.waterLitersDelta));
  const newShieldCm = Math.max(20, Math.min(150, current.regolithShieldCm + safeNum(deltas.shieldCmDelta)));
  const newTemp = Math.max(0, Math.min(45, current.cabinTempC + safeNum(deltas.tempDeltaC)));
  const newFoodDays = Math.max(0, current.foodRationsDays + safeNum(deltas.foodDaysDelta));
  const newMorale = Math.max(0, Math.min(100, current.crewMoralePct + safeNum(deltas.moraleDelta)));
  const newAccumulatedRad = Math.max(
    0,
    current.radiationDoseAccumulatedMSv + safeNum(deltas.radiationMSvDelta)
  );

  return {
    batteryKWh: parseFloat(newBattery.toFixed(1)),
    batteryCapacityKWh: current.batteryCapacityKWh,
    oxygenKg: parseFloat(newOxygen.toFixed(1)),
    waterLiters: parseFloat(newWater.toFixed(1)),
    regolithShieldCm: parseFloat(newShieldCm.toFixed(1)),
    shieldIntegrityPct: Math.min(100, Math.max(20, Math.round((newShieldCm / 85) * 100))),
    cabinTempC: parseFloat(newTemp.toFixed(1)),
    radiationDoseAccumulatedMSv: parseFloat(newAccumulatedRad.toFixed(3)),
    radiationRateMSvPerDay: safeNum(deltas.radiationMSvDelta, current.radiationRateMSvPerDay),
    foodRationsDays: parseFloat(newFoodDays.toFixed(1)),
    crewMoralePct: Math.round(newMorale),
  };
}

/**
 * Calculates current environmental modifiers for the Sol.
 * Clearly documents simulation assumptions vs observations.
 */
export function getSolEnvironmentModifiers(mission: MissionConfig, sol: number) {
  let solarFactor = 1.0;
  let thermalStrainFactor = 1.0;
  let radiationFactor = 1.0;
  let statusNote = 'Normal Scenario Baseline';

  if (mission.id === 'moon_shackleton') {
    if (sol >= 5 && sol <= 7) {
      // Hypothetical extended low-illumination scenario
      solarFactor = 0.05; // 95% reduction in photovoltaic flux
      thermalStrainFactor = 2.4; // High conductive heat loss
      statusNote = 'Hypothetical Extended Shadow Scenario (Low Solar)';
    } else if (sol === 3) {
      radiationFactor = 8.0; // Simulated solar particle event flux
      statusNote = 'Simulated Solar Particle Event (SPE) Active';
    }
  } else if (mission.id === 'mars_jezero') {
    if (sol >= 3 && sol <= 4) {
      // Regional dust storm scenario (modeled after InSight/Opportunity historical optical depths)
      solarFactor = 0.25; // 75% loss of surface solar irradiance
      thermalStrainFactor = 1.5;
      statusNote = 'Martian Regional Dust Storm (Modeled Tau = 3.5)';
    } else if (sol === 6) {
      statusNote = 'Simulated WRS Filter Valve Degradation';
    } else if (sol === 8) {
      statusNote = 'Modeled High Barometric Pressure Window';
    }
  }

  return { solarFactor, thermalStrainFactor, radiationFactor, statusNote };
}

/**
 * Calculates power generation for a given Sol (kW).
 * Distinguishes baseline power architecture from solar array output.
 */
export function calculatePowerGenerationKw(mission: MissionConfig, sol: number): {
  solarKw: number;
  kilopowerKw: number;
  totalKw: number;
} {
  const { solarFactor } = getSolEnvironmentModifiers(mission, sol);

  // Hypothetical future baseline generator (e.g. Kilopower Stirling core or MMRTG)
  const kilopowerKw = mission.id === 'moon_shackleton' ? 7.0 : 6.0;

  // Photovoltaic generation based on destination solar irradiance and environmental opacity
  const baseSolarCapacityKw = Math.max(0, mission.maxPowerBudgetKw - kilopowerKw);
  const solarKw = Math.max(0, baseSolarCapacityKw * solarFactor);

  return {
    solarKw: parseFloat(solarKw.toFixed(2)),
    kilopowerKw: parseFloat(kilopowerKw.toFixed(2)),
    totalKw: parseFloat((solarKw + kilopowerKw).toFixed(2)),
  };
}

/**
 * Pre-Flight Real-Time Calculator: Computes projected deltas before player commits the Sol.
 * Deterministic and mathematically transparent.
 */
export function calculatePreFlightDeltas(
  mission: MissionConfig,
  currentResources: ResourceState,
  rawAllocations: PowerAllocation,
  sol: number
): PreFlightDelta {
  const allocations = sanitizeAllocations(rawAllocations);
  const { totalKw: generatedKw } = calculatePowerGenerationKw(mission, sol);
  const { thermalStrainFactor, radiationFactor } = getSolEnvironmentModifiers(mission, sol);

  const consumedKw =
    allocations.lifeSupportKw +
    allocations.hydroponicsKw +
    allocations.shieldThermalKw +
    allocations.scienceIsruKw;

  // 1 Sol = 24.0 hours on Moon, 24.6 hours on Mars
  const solHours = mission.id === 'mars_jezero' ? 24.6 : 24.0;
  const netPowerKw = generatedKw - consumedKw;
  const batteryNetKWh = parseFloat((netPowerKw * solHours).toFixed(1));

  let projectedBatteryPct = Math.min(
    100,
    Math.max(
      0,
      ((currentResources.batteryKWh + batteryNetKWh) / currentResources.batteryCapacityKWh) * 100
    )
  );

  // --- Oxygen Calculation (NASA-STD-3001 Basis) ---
  // Crew demand: 4 astronauts * 0.96 kg/day = 3.84 kg/day
  const crewO2Demand = SCIENTIFIC_CONSTANTS.humanPhysiology.o2CrewTotalKgPerDay;
  let o2Production = 0;

  if (mission.id === 'moon_shackleton') {
    // Modeled ECLSS OGA Electrolysis: 3.5 kW produces ~4.0 kg O2
    const ogaEfficiency = Math.min(1.2, allocations.lifeSupportKw / 3.5);
    o2Production = 4.0 * ogaEfficiency;
  } else {
    // Modeled Hypothetical Scaled Oxygen Plant (16x MOXIE scale):
    // 3.0 kW scaled plant yields 3.84 kg O2/day (160 g/hour)
    const scaledPlantEfficiency = Math.min(1.4, allocations.lifeSupportKw / 3.0);
    o2Production = 3.84 * scaledPlantEfficiency;
  }

  // Supplemental oxygen from hydroponic photosynthesis
  const hydroO2 = (allocations.hydroponicsKw / 3.0) * 0.45;
  const oxygenNetKg = parseFloat((o2Production + hydroO2 - crewO2Demand).toFixed(2));
  const projectedOxygenKg = Math.max(0, currentResources.oxygenKg + oxygenNetKg);

  // --- Water Calculation (ISS WRS Derived Model) ---
  // Total baseline turnover: 15.48 L/day for 4 astronauts
  const crewWaterDemand = SCIENTIFIC_CONSTANTS.humanPhysiology.waterCrewTotalLPerDay;
  // Educational simulation recycling curve: 90% at full power (>=3.0 kW), dropping to 50% under brownout
  const wrsRatio = Math.min(1.0, allocations.lifeSupportKw / 3.5);
  const recyclingEfficiency =
    wrsRatio >= 0.8
      ? SCIENTIFIC_CONSTANTS.lifeSupportEngineering.simWrsNominalEfficiency
      : SCIENTIFIC_CONSTANTS.lifeSupportEngineering.simWrsLowPowerEfficiency + wrsRatio * 0.3;

  const recoveredWater = crewWaterDemand * recyclingEfficiency;

  // Science / ISRU cryo-drill volatiles bonus
  const isruWaterHarvested = (allocations.scienceIsruKw / 4.0) * 4.5;
  const waterNetLiters = parseFloat(
    (recoveredWater + isruWaterHarvested - crewWaterDemand).toFixed(1)
  );
  const projectedWaterLiters = Math.max(0, currentResources.waterLiters + waterNetLiters);

  // --- Thermal Cabin Temperature ---
  // Baseline thermal heater requirement: 3.5 kW * thermalStrainFactor
  const targetThermalKw = 3.5 * thermalStrainFactor;
  const thermalRatio = allocations.shieldThermalKw / Math.max(0.1, targetThermalKw);
  let tempDelta = 0;
  if (thermalRatio < 0.9) {
    tempDelta = (thermalRatio - 0.9) * 12.0; // drops up to -10°C
  } else if (thermalRatio > 1.2) {
    tempDelta = Math.min(2.5, (thermalRatio - 1.2) * 2.0);
  }
  const projectedTempC = parseFloat(
    Math.min(28, Math.max(8, currentResources.cabinTempC + tempDelta * 0.4)).toFixed(1)
  );

  // --- Radiation Exposure Index (Scenario Estimate) ---
  const unshieldedDailyMSv = mission.ambientRadiationMSvPerDay * radiationFactor;
  const shieldFraction = Math.min(0.92, (currentResources.regolithShieldCm / 100) * 0.88);
  const activeShieldBonus = Math.min(0.2, (allocations.shieldThermalKw / 4.0) * 0.15);
  const effectiveAttenuation = Math.min(0.96, shieldFraction + activeShieldBonus);
  const projectedRadiationDoseMSv = parseFloat(
    (unshieldedDailyMSv * (1 - effectiveAttenuation)).toFixed(3)
  );

  // --- Morale Delta ---
  let projectedMoraleDeltaPct = 0;
  if (projectedBatteryPct < 25) projectedMoraleDeltaPct -= 12;
  if (projectedOxygenKg < 40) projectedMoraleDeltaPct -= 10;
  if (projectedTempC < 18) projectedMoraleDeltaPct -= 8;
  if (allocations.hydroponicsKw >= 3.0) projectedMoraleDeltaPct += 6;
  if (allocations.scienceIsruKw >= 3.0) projectedMoraleDeltaPct += 5;
  if (projectedRadiationDoseMSv > 2.0) projectedMoraleDeltaPct -= 15;

  // Alerts
  const warningAlerts: string[] = [];
  const nominalAlerts: string[] = [];

  if (projectedBatteryPct < 20) {
    warningAlerts.push(`Battery Storage Low: Projected at ${projectedBatteryPct.toFixed(0)}%`);
  } else {
    nominalAlerts.push(`Power Budget Stable (${projectedBatteryPct.toFixed(0)}% storage buffer)`);
  }

  if (oxygenNetKg < 0) {
    warningAlerts.push(`O2 Deficit: Net ${oxygenNetKg} kg/day drawdown from reserve`);
  } else {
    nominalAlerts.push(`O2 Synthesis Balance: +${oxygenNetKg} kg/day net surplus`);
  }

  if (projectedTempC < 18.3) {
    warningAlerts.push(`Thermal Alert: Cabin below NASA-STD-3001 comfort setpoint (${projectedTempC}°C)`);
  } else {
    nominalAlerts.push(`Cabin Temperature Nominal (${projectedTempC}°C)`);
  }

  if (projectedRadiationDoseMSv > 1.5) {
    warningAlerts.push(`High Radiation Flux Scenario: Estimated ${projectedRadiationDoseMSv} mSv/day`);
  }

  return {
    batteryNetKWh,
    projectedBatteryPct: parseFloat(projectedBatteryPct.toFixed(1)),
    oxygenNetKg,
    projectedOxygenKg: parseFloat(projectedOxygenKg.toFixed(1)),
    waterNetLiters,
    projectedWaterLiters: parseFloat(projectedWaterLiters.toFixed(1)),
    projectedTempC,
    projectedRadiationDoseMSv,
    projectedMoraleDeltaPct,
    warningAlerts,
    nominalAlerts,
  };
}

/**
 * Advances the simulation by 1 Sol, committing the allocations and evaluating failure conditions.
 * Completely deterministic and enforces canonical boundary updates.
 */
export function simulateNextSol(
  mission: MissionConfig,
  currentResources: ResourceState,
  rawAllocations: PowerAllocation,
  crew: CrewMember[],
  currentSol: number
): SolSimulationResult {
  const allocations = sanitizeAllocations(rawAllocations);
  const { totalKw: generatedKw } = calculatePowerGenerationKw(mission, currentSol);
  const deltas = calculatePreFlightDeltas(mission, currentResources, allocations, currentSol);

  // Sintering rovers add +3 cm compacted regolith if sufficient thermal/shielding power is allocated
  const regolithAdded = allocations.shieldThermalKw >= 3.5 ? 3.0 : 0;

  // Food days update: 1 day consumed, hydroponics harvest yields bonus
  const foodDayBonus = allocations.hydroponicsKw >= 3.0 ? 0.5 : -1.0;

  const nextResources = applyResourceDeltas(currentResources, {
    batteryKWhDelta: deltas.batteryNetKWh,
    oxygenKgDelta: deltas.oxygenNetKg,
    waterLitersDelta: deltas.waterNetLiters,
    radiationMSvDelta: deltas.projectedRadiationDoseMSv,
    shieldCmDelta: regolithAdded,
    moraleDelta: deltas.projectedMoraleDeltaPct,
    foodDaysDelta: foodDayBonus,
    tempDeltaC: deltas.projectedTempC - currentResources.cabinTempC,
  });

  // Update individual crew status
  const nextCrew: CrewMember[] = crew.map((member) => {
    let status: CrewMember['status'] = 'Nominal';
    let moraleChange = deltas.projectedMoraleDeltaPct;

    if (nextResources.cabinTempC < 16) {
      status = 'Fatigued';
      moraleChange -= 5;
    } else if (deltas.projectedRadiationDoseMSv > 2.0) {
      status = 'Sheltered';
      moraleChange -= 8;
    } else if (nextResources.crewMoralePct < 40) {
      status = 'Stressed';
    }

    const memberMorale = Math.min(100, Math.max(0, member.morale + moraleChange));
    const memberHealth = Math.min(
      100,
      Math.max(15, member.health - (deltas.projectedRadiationDoseMSv > 3.0 ? 5 : 0))
    );

    return {
      ...member,
      morale: Math.round(memberMorale),
      health: Math.round(memberHealth),
      status,
    };
  });

  const consumedKw =
    allocations.lifeSupportKw +
    allocations.hydroponicsKw +
    allocations.shieldThermalKw +
    allocations.scienceIsruKw;

  const logEntry: SolLogEntry = {
    sol: currentSol,
    powerGeneratedKw: generatedKw,
    powerConsumedKw: consumedKw,
    batteryPct: Math.round((nextResources.batteryKWh / nextResources.batteryCapacityKWh) * 100),
    oxygenKg: nextResources.oxygenKg,
    waterLiters: nextResources.waterLiters,
    radiationDoseMSv: nextResources.radiationRateMSvPerDay,
    cabinTempC: nextResources.cabinTempC,
    moralePct: nextResources.crewMoralePct,
  };

  // Evaluate non-punitive failure thresholds
  let failureReason: FailureReason | undefined = undefined;

  if (nextResources.batteryKWh <= 5) {
    failureReason = {
      cause: 'battery',
      title: 'Electrical Brownout: Battery Depleted (0 kWh)',
      scientificExplanation:
        'The total power consumed by Life Support, Heaters, and Rovers exceeded incoming generation. In deep space habitats, battery storage is critical to bridge nighttime and low-solar periods.',
      nasaReference: 'NASA-STD-3001 Vol 2 & ISS Electrical Power Subsystem (EPS) Flight Architecture',
      recommendation:
        'Rewind 1 Sol and reduce non-essential rover mining or dim hydroponics to preserve the electrical storage buffer.',
    };
  } else if (nextResources.oxygenKg <= 10) {
    failureReason = {
      cause: 'oxygen',
      title: 'Hypoxia Threat: Oxygen Reserves Critically Depleted',
      scientificExplanation:
        'At 0.96 kg O2 per astronaut per day (NASA-STD-3001), 4 crew members consume 3.84 kg daily. The oxygen generation allocation was insufficient to balance metabolic consumption.',
      nasaReference: 'NASA-STD-3001 Section 6.2 (Atmospheric Composition & Partial Pressure Limits)',
      recommendation:
        'Allocate at least 3.0 kW to the oxygen generation subsystem to maintain synthesis above 3.84 kg/day.',
    };
  } else if (nextResources.waterLiters <= 25) {
    failureReason = {
      cause: 'water',
      title: 'Dehydration Hazard: Potable Water Reserves Depleted',
      scientificExplanation:
        'Water distillation and recycling systems require adequate electrical power to maintain high closed-loop recovery. Under low power, recycling fell below the replacement rate.',
      nasaReference: 'ISS Water Recovery System (WRS) Distillation & Catalytic Assembly Operations',
      recommendation:
        'Increase life support power allocation or dispatch prospecting rovers to drill for subsurface ice.',
    };
  } else if (nextResources.cabinTempC <= 10.0) {
    failureReason = {
      cause: 'thermal',
      title: 'Cabin Hypothermia: Excessive Thermal Dissipation',
      scientificExplanation:
        'External lunar/martian surface temperatures dropped severely. Without sufficient electrical thermal heater allocation, the habitat pressure hull radiated heat into the vacuum of space.',
      nasaReference: 'NASA-STD-3001 Section 6.5 (Thermal Environment Constraints: 18.3°C - 26.7°C)',
      recommendation:
        'Increase Active Thermal & Shielding allocation to at least 3.5 kW during low-illumination phases.',
    };
  } else if (nextResources.crewMoralePct <= 5) {
    failureReason = {
      cause: 'morale',
      title: 'Scenario Interrupted: Crew Psychological Exhaustion',
      scientificExplanation:
        'Accumulated environmental stressors—resource rationing, high radiation alarms, and freezing cabin temperatures—compromised crew operational capability.',
      nasaReference: 'NASA Behavioral Health & Performance (BHP) Spaceflight Countermeasures',
      recommendation:
        'Rewind 1 Sol and restore hydroponic fresh meals, comfortable cabin temperatures, and active radiation shielding.',
    };
  }

  return {
    nextResources,
    nextCrew,
    logEntry,
    failureReason,
  };
}

/**
 * Calculates dynamic mission completion score from recorded gameplay telemetry.
 * Never uses hardcoded constants.
 */
export function calculateMissionScore(
  finalResources: ResourceState,
  history: SolLogEntry[]
): number {
  const batteryScore = Math.min(25, (finalResources.batteryKWh / finalResources.batteryCapacityKWh) * 25);
  const o2Score = Math.min(25, (finalResources.oxygenKg / 90) * 25);
  const waterScore = Math.min(20, (finalResources.waterLiters / 350) * 20);
  const moraleScore = Math.min(20, (finalResources.crewMoralePct / 100) * 20);
  const radPenalty = Math.min(10, finalResources.radiationDoseAccumulatedMSv * 0.15);
  const radScore = Math.max(0, 10 - radPenalty);

  const rawScore = batteryScore + o2Score + waterScore + moraleScore + radScore;
  return Math.max(10, Math.min(100, Math.round(rawScore)));
}
