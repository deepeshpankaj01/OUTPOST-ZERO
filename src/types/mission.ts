export type MissionId = 'moon_shackleton' | 'mars_jezero';

export type AudienceMode = 'cadet' | 'flight_director';

export type ProvenanceType =
  | 'OBSERVED_SOURCE_DATA'
  | 'DERIVED_CALCULATION'
  | 'SIMULATION_ASSUMPTION';

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarColor: string;
  morale: number; // 0-100%
  health: number; // 0-100%
  status: 'Nominal' | 'Fatigued' | 'Sheltered' | 'Stressed';
}

export interface ResourceState {
  batteryKWh: number;        // Current stored energy (kWh)
  batteryCapacityKWh: number; // Max stored energy (kWh)
  oxygenKg: number;           // Current O2 (kg)
  waterLiters: number;        // Current potable water (L)
  regolithShieldCm: number;   // Shield thickness (cm)
  shieldIntegrityPct: number; // 0-100% (illustrative simulation metric)
  cabinTempC: number;         // Target 18.3-26.7°C (NASA-STD-3001 nominal: 22°C)
  radiationDoseAccumulatedMSv: number; // Illustrative cumulative exposure index (mSv)
  radiationRateMSvPerDay: number;      // Scenario estimated daily exposure (mSv/day)
  foodRationsDays: number;    // Hydroponic/preserved food days
  crewMoralePct: number;      // 0-100%
}

export interface PowerAllocation {
  lifeSupportKw: number; // Scaled O2 generation & water recovery plant (kW)
  hydroponicsKw: number; // Food dome & supplemental O2 lighting (kW)
  shieldThermalKw: number; // Habitat thermal heaters & sintering rover power (kW)
  scienceIsruKw: number;  // Geological survey & cryo-drill rovers (kW)
}

export interface SolLogEntry {
  sol: number;
  powerGeneratedKw: number;
  powerConsumedKw: number;
  batteryPct: number;
  oxygenKg: number;
  waterLiters: number;
  radiationDoseMSv: number; // Scenario estimate
  cabinTempC: number;
  moralePct: number;
  eventTitle?: string;
  choiceMade?: string;
}

export interface FailureReason {
  cause: 'battery' | 'oxygen' | 'water' | 'thermal' | 'radiation' | 'morale';
  title: string;
  scientificExplanation: string;
  nasaReference: string;
  recommendation: string;
}

export interface CrisisChoice {
  id: string;
  title: string;
  cadetDescription: string;
  engineeringDescription: string;
  resourceImpacts: {
    batteryKWhDelta?: number;
    oxygenKgDelta?: number;
    waterLitersDelta?: number;
    radiationMSvDelta?: number;
    shieldCmDelta?: number;
    moraleDelta?: number;
    foodDaysDelta?: number;
    tempDeltaC?: number;
  };
  tradeOffSummary: string;
  provenanceType?: ProvenanceType;
}

export interface CrisisEvent {
  id: string;
  sol: number;
  title: string;
  cadetTitle: string;
  subtitle: string;
  sourceDataset: string;
  cadetBriefing: string;
  flightDirectorBriefing: string;
  warningLevel: 'caution' | 'warning' | 'critical';
  choices: CrisisChoice[];
  provenanceType?: ProvenanceType;
  scientificContext?: string;
}

export interface MissionConfig {
  id: MissionId;
  name: string;
  cadetName: string;
  destination: string;
  destinationName: string;
  missionDurationSols: number;
  solarIrradianceWPerM2: number;
  baselineSurfaceTempC: number;
  ambientRadiationMSvPerDay: number;
  description: string;
  cadetDescription: string;
  primaryHazard: string;
  nasaIsroCitations: string[];
  initialResources: ResourceState;
  maxPowerBudgetKw: number;
  crises: CrisisEvent[];
  provenanceNotes?: {
    observed: string[];
    derived: string[];
    assumptions: string[];
  };
}

export interface PreFlightDelta {
  batteryNetKWh: number;
  projectedBatteryPct: number;
  oxygenNetKg: number;
  projectedOxygenKg: number;
  waterNetLiters: number;
  projectedWaterLiters: number;
  projectedTempC: number;
  projectedRadiationDoseMSv: number;
  projectedMoraleDeltaPct: number;
  warningAlerts: string[];
  nominalAlerts: string[];
}

export interface SpaceWeatherEvent {
  flareId: string;
  classType: string; // e.g., "X2.4", "M5.1" (GOES 0.1-0.8 nm soft X-ray peak flux)
  beginTime: string;
  peakTime: string;
  sourceLocation: string;
  radiationFactor: number; // Simulation scenario modifier (NOT a measured particle fluence)
  description: string;
  observedDate?: string;
  isExtrapolatedScenarioModifier?: boolean;
}
