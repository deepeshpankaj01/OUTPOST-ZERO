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
 * Calculates current environmental modifiers for the Sol
 * (e.g., lunar eclipse on Sol 6, Mars dust storm on Sol 3).
 */
export function getSolEnvironmentModifiers(mission: MissionConfig, sol: number) {
  let solarFactor = 1.0;
  let thermalStrainFactor = 1.0;
  let radiationFactor = 1.0;
  let statusNote = 'Normal Orbital Flux';

  if (mission.id === 'moon_shackleton') {
    if (sol >= 5 && sol <= 7) {
      // 72-hour lunar shadow / eclipse
      solarFactor = 0.05; // 95% loss of solar
      thermalStrainFactor = 2.4; // ChaSTE -170°C subsurface gradient
      statusNote = '72-Hour Penumbral Shadow Eclipse (ChaSTE -170°C)';
    } else if (sol === 3) {
      radiationFactor = 8.0;
      statusNote = 'Orbital Solar Particle Event (SPE) Active';
    }
  } else if (mission.id === 'mars_jezero') {
    if (sol >= 3 && sol <= 4) {
      // Martian dust storm (Tau = 3.5)
      solarFactor = 0.25; // 75% loss of solar irradiance
      thermalStrainFactor = 1.5;
      statusNote = 'Martian Regional Dust Storm (MEDA Tau = 3.5)';
    } else if (sol === 6) {
      statusNote = 'WRS Recycler Valve Degradation';
    } else if (sol === 8) {
      statusNote = 'Dense Atmospheric Pressure Front (+O2 Yield)';
    }
  }

  return { solarFactor, thermalStrainFactor, radiationFactor, statusNote };
}

/**
 * Calculates power generation for a given Sol based on mission parameters and solar flux.
 */
export function calculatePowerGenerationKw(mission: MissionConfig, sol: number): {
  solarKw: number;
  kilopowerKw: number;
  totalKw: number;
} {
  const { solarFactor } = getSolEnvironmentModifiers(mission, sol);

  // Baseline Kilopower / Stirling radioisotope generator (stable baseline power)
  const kilopowerKw = mission.id === 'moon_shackleton' ? 7.0 : 6.0;

  // Solar array generation based on destination irradiance
  const baseSolarCapacityKw = mission.maxPowerBudgetKw - kilopowerKw;
  const solarKw = Math.max(0, baseSolarCapacityKw * solarFactor);

  return {
    solarKw: parseFloat(solarKw.toFixed(2)),
    kilopowerKw: parseFloat(kilopowerKw.toFixed(2)),
    totalKw: parseFloat((solarKw + kilopowerKw).toFixed(2)),
  };
}

/**
 * Pre-Flight Real-Time Calculator: Computes projected deltas before player commits the Sol.
 */
export function calculatePreFlightDeltas(
  mission: MissionConfig,
  currentResources: ResourceState,
  allocations: PowerAllocation,
  sol: number
): PreFlightDelta {
  const { totalKw: generatedKw } = calculatePowerGenerationKw(mission, sol);
  const { thermalStrainFactor, radiationFactor } = getSolEnvironmentModifiers(mission, sol);

  const consumedKw =
    allocations.lifeSupportKw +
    allocations.hydroponicsKw +
    allocations.shieldThermalKw +
    allocations.scienceIsruKw;

  // 1 Sol = 24.6 hrs on Mars, 24 hrs on Moon
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

  // --- Oxygen Calculation (NASA-STD-3001) ---
  // Crew demand: 3.84 kg/day
  const crewO2Demand = 3.84;
  let o2Production = 0;

  if (mission.id === 'moon_shackleton') {
    // ISS OGA Electrolysis: full 3.5 kW yields ~4.2 kg O2
    const ogaEfficiency = Math.min(1.2, allocations.lifeSupportKw / 3.5);
    o2Production = 4.0 * ogaEfficiency;
  } else {
    // Mars MOXIE: 3.0 kW yields ~3.84 kg O2
    const moxieEfficiency = Math.min(1.4, allocations.lifeSupportKw / 3.0);
    o2Production = 3.84 * moxieEfficiency;
  }

  // Hydroponics supplemental oxygen (photosynthesis)
  const hydroO2 = (allocations.hydroponicsKw / 3.0) * 0.45;
  const oxygenNetKg = parseFloat((o2Production + hydroO2 - crewO2Demand).toFixed(2));
  const projectedOxygenKg = Math.max(0, currentResources.oxygenKg + oxygenNetKg);

  // --- Water Calculation (ISS WRS) ---
  // Crew consumes 15.48 L/day
  const crewWaterDemand = 15.48;
  // Recycler efficiency: 90% at full power (>=3.0 kW), drops to 50% at <1.5 kW
  const wrsRatio = Math.min(1.0, allocations.lifeSupportKw / 3.5);
  const recyclingEfficiency =
    wrsRatio >= 0.8
      ? SCIENTIFIC_CONSTANTS.lifeSupportEngineering.issWrsNominalRecycleEfficiency
      : SCIENTIFIC_CONSTANTS.lifeSupportEngineering.issWrsLowPowerRecycleEfficiency +
        wrsRatio * 0.3;

  const recoveredWater = crewWaterDemand * recyclingEfficiency;

  // Science / ISRU water ice mining bonus
  const isruWaterHarvested = (allocations.scienceIsruKw / 4.0) * 4.5;
  const waterNetLiters = parseFloat(
    (recoveredWater + isruWaterHarvested - crewWaterDemand).toFixed(1)
  );
  const projectedWaterLiters = Math.max(0, currentResources.waterLiters + waterNetLiters);

  // --- Thermal Cabin Temperature ---
  // Baseline thermal requirement: 3.5 kW * thermalStrainFactor
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

  // --- Radiation Shielding & Daily Dose ---
  const unshieldedDailyMSv = mission.ambientRadiationMSvPerDay * radiationFactor;
  // Regolith attenuation: optimal 85cm gives 85% attenuation
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
    warningAlerts.push(`Battery Critical: Projected to drop to ${projectedBatteryPct.toFixed(0)}%!`);
  } else {
    nominalAlerts.push(`Power Budget Stable (${projectedBatteryPct.toFixed(0)}% storage)`);
  }

  if (oxygenNetKg < 0) {
    warningAlerts.push(`Oxygen Deficit: Net ${oxygenNetKg} kg/day drawdown`);
  } else {
    nominalAlerts.push(`O2 Surplus: +${oxygenNetKg} kg/day generated`);
  }

  if (projectedTempC < 19.0) {
    warningAlerts.push(`Thermal Alert: Cabin cooling to ${projectedTempC}°C (Target: 22°C)`);
  } else {
    nominalAlerts.push(`Cabin Temperature Nominal (${projectedTempC}°C)`);
  }

  if (projectedRadiationDoseMSv > 1.5) {
    warningAlerts.push(`Radiation Alert: High flux ${projectedRadiationDoseMSv} mSv/day`);
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
 * Advances the simulation by 1 Sol, committing the allocations and checking failure conditions.
 */
export function simulateNextSol(
  mission: MissionConfig,
  currentResources: ResourceState,
  allocations: PowerAllocation,
  crew: CrewMember[],
  currentSol: number
): SolSimulationResult {
  const { totalKw: generatedKw } = calculatePowerGenerationKw(mission, currentSol);
  const deltas = calculatePreFlightDeltas(mission, currentResources, allocations, currentSol);

  // Calculate new resources
  const newBatteryKWh = Math.min(
    currentResources.batteryCapacityKWh,
    Math.max(0, currentResources.batteryKWh + deltas.batteryNetKWh)
  );

  const newOxygenKg = Math.max(0, currentResources.oxygenKg + deltas.oxygenNetKg);
  const newWaterLiters = Math.max(0, currentResources.waterLiters + deltas.waterNetLiters);

  // Regolith sintering rovers add regolith if power allocated to shield/thermal
  const regolithAdded = allocations.shieldThermalKw >= 3.5 ? 3.0 : 0;
  const newRegolithShieldCm = Math.min(100, currentResources.regolithShieldCm + regolithAdded);

  // Food days update
  let newFoodDays = currentResources.foodRationsDays - 1; // 1 day eaten
  if (allocations.hydroponicsKw >= 3.0) {
    newFoodDays += 1.5; // fresh harvest compensates
  }
  newFoodDays = parseFloat(Math.max(0, newFoodDays).toFixed(1));

  // Morale update
  const newMorale = Math.min(
    100,
    Math.max(0, currentResources.crewMoralePct + deltas.projectedMoraleDeltaPct)
  );

  const accumulatedRadiation = parseFloat(
    (currentResources.radiationDoseAccumulatedMSv + deltas.projectedRadiationDoseMSv).toFixed(3)
  );

  const nextResources: ResourceState = {
    batteryKWh: parseFloat(newBatteryKWh.toFixed(1)),
    batteryCapacityKWh: currentResources.batteryCapacityKWh,
    oxygenKg: parseFloat(newOxygenKg.toFixed(1)),
    waterLiters: parseFloat(newWaterLiters.toFixed(1)),
    regolithShieldCm: parseFloat(newRegolithShieldCm.toFixed(1)),
    shieldIntegrityPct: Math.min(100, Math.max(20, Math.round((newRegolithShieldCm / 85) * 100))),
    cabinTempC: deltas.projectedTempC,
    radiationDoseAccumulatedMSv: accumulatedRadiation,
    radiationRateMSvPerDay: deltas.projectedRadiationDoseMSv,
    foodRationsDays: newFoodDays,
    crewMoralePct: newMorale,
  };

  // Update crew statuses
  const nextCrew: CrewMember[] = crew.map((member) => {
    let status: CrewMember['status'] = 'Nominal';
    let moraleChange = deltas.projectedMoraleDeltaPct;

    if (nextResources.cabinTempC < 16) {
      status = 'Fatigued';
      moraleChange -= 5;
    } else if (deltas.projectedRadiationDoseMSv > 2.0) {
      status = 'Sheltered';
      moraleChange -= 8;
    } else if (newMorale < 40) {
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

  // Check for non-punitive failure analysis trigger
  let failureReason: SolSimulationResult['failureReason'] = undefined;

  if (nextResources.batteryKWh <= 5) {
    failureReason = {
      cause: 'battery',
      title: 'Electrical Brownout: Battery Depleted (0 kWh)',
      scientificExplanation:
        'The total power consumed by Life Support, Heaters, and Rovers exceeded incoming Solar and Kilopower generation. In space habitats, battery storage is life-critical to bridge nighttime and dust storm deficits.',
      nasaReference: 'NASA-STD-3001 Vol 2 & ISS Electrical Power Subsystem (EPS) Flight Architecture',
      recommendation:
        'Rewind 1 Sol and reduce non-essential rover mining or dim hydroponics to preserve electrical buffer.',
    };
  } else if (nextResources.oxygenKg <= 10) {
    failureReason = {
      cause: 'oxygen',
      title: 'Hypoxia Threat: Oxygen Reserves Critically Depleted',
      scientificExplanation:
        'At 0.96 kg O2 per astronaut per day (NASA-STD-3001), 4 crew members consume 3.84 kg daily. The ECLSS / MOXIE allocation was insufficient to replace metabolic consumption.',
      nasaReference: 'NASA-STD-3001 Section 6.2 (Atmospheric Composition & Partial Pressure)',
      recommendation:
        'Allocate at least 3.0 kW to Life Support & MOXIE to keep O2 generation above 3.84 kg/day.',
    };
  } else if (nextResources.waterLiters <= 25) {
    failureReason = {
      cause: 'water',
      title: 'Severe Dehydration Hazard: Potable Water Exhausted',
      scientificExplanation:
        'Water Recovery Systems (WRS) require at least 3.0 kW to maintain 90% closed-loop distillation. Under low power, recycling fell to 50%, depleting the water storage tank.',
      nasaReference: 'ISS Water Recovery System (WRS) Distillation & Catalytic Assembly Operations',
      recommendation:
        'Increase Life Support power or dispatch ISRU rovers to drill lunar/martian water-ice.',
    };
  } else if (nextResources.cabinTempC <= 10.0) {
    failureReason = {
      cause: 'thermal',
      title: 'Cabin Hypothermia: Extreme Thermal Dissipation',
      scientificExplanation:
        'Surface temperatures swung dramatically (ChaSTE recorded -170°C in shadow). Without sufficient electrical thermal heater allocation, the habitat pressure hull radiated heat into the vacuum of space.',
      nasaReference: 'ISRO Chandrayaan-3 ChaSTE Soil Thermal Gradient & NASA-STD-3001 Thermal Control',
      recommendation:
        'Increase Active Thermal & Shielding allocation to at least 4.0 kW during shadow or eclipse phases.',
    };
  } else if (nextResources.crewMoralePct <= 5) {
    failureReason = {
      cause: 'morale',
      title: 'Mission Abort: Crew Psychological Exhaustion',
      scientificExplanation:
        'Extreme environmental stressors—rationing, radiation alarm stress, and freezing cabin temperatures—overwhelmed crew cognitive reserves.',
      nasaReference: 'NASA Behavioral Health & Performance (BHP) Spaceflight Countermeasures',
      recommendation:
        'Rewind 1 Sol and restore hydroponic fresh meals, warm quarters, and active radiation shielding.',
    };
  }

  return {
    nextResources,
    nextCrew,
    logEntry,
    failureReason,
  };
}
