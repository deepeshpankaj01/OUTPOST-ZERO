export type MissionId = 'moon_shackleton' | 'mars_jezero';

export type AudienceMode = 'cadet' | 'flight_director';

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
  shieldIntegrityPct: number; // 0-100%
  cabinTempC: number;         // Target 21-22°C
  radiationDoseAccumulatedMSv: number; // Total accumulated mSv
  radiationRateMSvPerDay: number;      // Current rate mSv/day
  foodRationsDays: number;    // Hydroponic/preserved food days
  crewMoralePct: number;      // 0-100%
}

export interface PowerAllocation {
  lifeSupportKw: number; // ECLSS / MOXIE
  hydroponicsKw: number; // Food dome & supplemental O2
  shieldThermalKw: number; // Regolith sintering & thermal heating
  scienceIsruKw: number;  // Mining rovers & science drills
}

export interface SolLogEntry {
  sol: number;
  powerGeneratedKw: number;
  powerConsumedKw: number;
  batteryPct: number;
  oxygenKg: number;
  waterLiters: number;
  radiationDoseMSv: number;
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
  classType: string; // e.g., "X2.4", "M5.1"
  beginTime: string;
  peakTime: string;
  sourceLocation: string;
  radiationFactor: number; // Multiplier on ambient radiation
  description: string;
}
