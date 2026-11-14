import { MissionConfig, CrewMember } from '../types/mission';

/**
 * SCIENTIFIC CONSTANTS & PROVENANCE REGISTRY
 *
 * PROVENANCE CLASSIFICATIONS:
 * 1. OBSERVED SOURCE DATA: Directly reported by a named NASA or ISRO mission/dataset.
 * 2. DERIVED / EDUCATIONAL CALCULATION: Mathematically derived from identified observations with stated methods.
 * 3. SIMULATION ASSUMPTION: Configurable game rule or hypothetical architecture; explicitly not flight-certified.
 */
export const SCIENTIFIC_CONSTANTS = {
  crewSize: 4,

  // --- HUMAN PHYSIOLOGY (NASA-STD-3001 Vol 2) ---
  humanPhysiology: {
    // OBSERVED SOURCE DATA: NASA-STD-3001 Vol 2 metabolic rates
    o2NominalKgPerAstronautDay: 0.96, // 0.84 to 1.08 kg O2/day range per astronaut; nominal 0.96 kg
    o2CrewTotalKgPerDay: 3.84,        // DERIVED: 0.96 kg * 4 crewmembers = 3.84 kg O2/day
    waterHydrationMinLPerAstronautDay: 2.50, // OBSERVED: NASA-STD-3001 minimum potable hydration intake
    waterTurnoverKgPerAstronautDay: 3.87,    // OBSERVED: NASA-STD-3001 technical brief combined urine, respiration & perspiration fluid turnover
    waterCrewTotalLPerDay: 15.48,            // DERIVED: 3.87 L * 4 crewmembers = 15.48 L/day total fluid turnover
    caloricIntakeKcalPerDay: 3035,           // OBSERVED: NASA-STD-3001 technical brief average caloric intake per crewmember
    co2ExhaledKgPerAstronautDay: 1.00,       // OBSERVED: Typical human metabolic CO2 exhalation
    idealCabinTempMinC: 18.3,                // OBSERVED: NASA-STD-3001 cabin thermal envelope minimum
    idealCabinTempMaxC: 26.7,                // OBSERVED: NASA-STD-3001 cabin thermal envelope maximum
    idealCabinTempNominalC: 22.0,            // SIMULATION ASSUMPTION: Habitat target operational temperature
  },

  // --- LIFE SUPPORT ENGINEERING & SCALED OXYGEN PRODUCTION ---
  lifeSupportEngineering: {
    // OBSERVED SOURCE DATA: NASA Perseverance MOXIE Technology Demonstrator (Hecht et al. 2022)
    moxieDemonstratorPowerWatts: 300,        // OBSERVED: Actual MOXIE rover unit electrical power
    moxieDemonstratorProductionGramsPerHour: 10, // OBSERVED: Nominal rate (~10 g/h; peak run reached 12 g/h)

    // DERIVED / EDUCATIONAL CALCULATION: Hypothetical Scaled Oxygen Plant
    // To support a 4-person crew consuming 3.84 kg O2/day (= 160 g O2/hour),
    // a future habitat plant requires a 16x scale-up of MOXIE's demonstrator cell stack:
    scaledO2PlantScaleFactor: 16.0,          // DERIVED: 160 g/h / 10 g/h = 16x scale factor
    scaledO2PlantNominalPowerKw: 3.0,        // SIMULATION ASSUMPTION: Estimated electrical draw for 16x SOXE cell stack & compressors (~3.0 kW)
    scaledO2ProductionGramsPerHour: 160,     // DERIVED: 16 * 10 g/h = 160 g/h = 3.84 kg/day

    // OBSERVED: ISS ECLSS Water Recovery System (WRS) + Brine Processor Assembly (BPA) achieved ~98% water recovery in 2023
    issBpaDemonstratedRecyclePct: 98,

    // SIMULATION ASSUMPTION: Educational power-vs-recovery response curve
    // NOTE: This curve is an educational simulation mechanic, NOT an official NASA flight curve.
    simWrsNominalEfficiency: 0.90,           // SIMULATION ASSUMPTION: Modeled baseline recycling efficiency
    simWrsLowPowerEfficiency: 0.50,          // SIMULATION ASSUMPTION: Degraded recycling during power brownout
    simWrsNominalPowerKw: 3.5,               // SIMULATION ASSUMPTION: Habitat WRS subsystem power budget
  },

  // --- LUNAR ENVIRONMENT & ISRO Chandrayaan-3 ChaSTE CASE STUDY ---
  lunarScience: {
    // OBSERVED SOURCE DATA: ISRO Chandrayaan-3 ChaSTE Probe (Shiv Shakti Point, 69.37°S, August 2023)
    // Reference: ISRO (isro.gov.in/Chaste_first_observations.html)
    chasteLandingLatitude: '69.37°S',
    chasteProbeDepthCm: 10.0,
    chasteSurfaceTempC: 50.0,                // OBSERVED: Topsoil surface reached ~+50°C in direct sun
    chasteDepthTempC: -10.0,                 // OBSERVED: Temp dropped to ~-10°C at 8 cm depth (60°C gradient across top 10 cm at landing site)
    chasteGradientCPer10cm: 60.0,            // OBSERVED: ~60°C drop in first 10 cm at Shiv Shakti Point

    // OBSERVED SOURCE DATA: NASA LRO Diviner & LOLA (Shackleton Rim, 89.9°S)
    // Shackleton crater rim receives high seasonal illumination (~80-92% seasonally on select ridge peaks, not 100% eternal)
    lunarOrbitSolarIrradianceWPerM2: 1361.0,  // OBSERVED: Solar constant in lunar orbit
    shadowedCraterDivinerMinTempC: -170.0,   // OBSERVED: LRO Diviner measured cryogenic minimums inside permanently shadowed craters (PSR)

    // SIMULATION ASSUMPTION: Habitat Radiation Model (Illustrative Exposure Index)
    // NOTE: Space radiation consists of GCR and SPE ions. The values below are educational scenario estimates.
    baselineGcrEstimateMSvPerDay: 0.65,      // SIMULATION ASSUMPTION: Illustrative deep-space quiet-Sun daily dose rate
    regolithShieldingSimAttenuationPer10cm: 0.12, // SIMULATION ASSUMPTION: Illustrative attenuation factor
  },

  // --- MARS JEZERO ENVIRONMENT (NASA Perseverance MEDA / InSight) ---
  marsScience: {
    // OBSERVED SOURCE DATA: NASA Mars 2020 Perseverance MEDA & InSight
    solarIrradianceSurfaceNominalWPerM2: 590.0, // DERIVED / OBSERVED: Mean Martian surface solar flux (~43.3% of Earth)
    meanSurfaceTempC: -62.0,                  // OBSERVED: Perseverance MEDA mean surface air temperature
    atmosphericPressureMeanKPa: 0.61,         // OBSERVED: Surface barometric pressure (~95% CO2)

    // SIMULATION ASSUMPTION: Dust Storm Scenario
    // Dust storms elevate atmospheric optical depth (Tau). In 2018/2022 events, solar arrays lost 60-85% output.
    dustStormTauIllustrative: 3.5,            // SIMULATION ASSUMPTION: Modeled regional storm opacity
    dustStormSolarLossPct: 75.0,              // SIMULATION ASSUMPTION: 75% reduction in photovoltaic yield
  },

  // --- RADIATION SAFETY STANDARDS (NASA-STD-3001) ---
  radiationSafety: {
    // OBSERVED SOURCE DATA: NASA-STD-3001 Standard
    // NASA limits career effective dose to < 600 mSv for all astronaut age and sex groups.
    // There is NO fixed daily operational "safe" threshold in space; missions apply ALARA.
    nasaCareerEffectiveDoseLimitMSv: 600.0,
    alaraPrinciple: 'As Low As Reasonably Achievable (ALARA)',
  },
};

/**
 * MISSION 1: MOON — SHACKLETON RIM OUTPOST
 * Destination: Shackleton Crater Rim (89.9°S)
 * Features an educational scenario modeling high seasonal illumination,
 * a hypothetical extended low-illumination period, and a simulated solar particle event.
 */
export const MOON_MISSION: MissionConfig = {
  id: 'moon_shackleton',
  name: 'Shackleton Rim Outpost (Moon)',
  cadetName: 'Lunar South Pole Station (Moon Base)',
  destination: 'The Moon (Lunar South Pole, 89.9°S)',
  destinationName: 'Shackleton Crater Rim High-Illumination Ridge',
  missionDurationSols: 10,
  solarIrradianceWPerM2: 1361,
  baselineSurfaceTempC: 15,
  ambientRadiationMSvPerDay: 0.65,
  description:
    'Establish Outpost Zero near the rim of Shackleton Crater. Manage power allocations, evaluate regolith insulation inspired by ISRO ChaSTE soil findings, and survive a hypothetical extended low-illumination scenario.',
  cadetDescription:
    'You are commanding our first Moon Base near the South Pole! The Sun shines across elevated crater rims, but deep craters are dark and freezing. Keep your 4 astronauts warm, hydrated, and protected from space radiation!',
  primaryHazard: 'Hypothetical Extended Shadow Phase & Simulated Solar Particle Storm',
  nasaIsroCitations: [
    'ISRO Chandrayaan-3 ChaSTE (Chandra\'s Surface Thermophysical Experiment) In-Situ Soil Probe (69.37°S, 2023) — https://www.isro.gov.in/Chaste_first_observations.html',
    'NASA LRO (Lunar Reconnaissance Orbiter) Diviner Radiometer & LOLA Illumination Archives — https://www.nasa.gov/mission_pages/LRO/main/index.html',
    'NASA-STD-3001 Space Flight Human-System Standard: Volume 2 (Crew Health and Life Support Requirements)',
    'NASA OLTARIS (On-Line Tool for the Assessment of Radiation in Space)',
  ],
  provenanceNotes: {
    observed: [
      'ISRO ChaSTE measured a 60°C drop across the top 10 cm of lunar topsoil at Vikram\'s landing site (69.37°S).',
      'NASA LRO Diviner observed cryogenic temperatures below -170°C in permanently shadowed craters (PSR).',
      'NASA-STD-3001 Vol 2 sets minimum potable water intake at 2.5 L/day per astronaut.',
    ],
    derived: [
      'Crew oxygen demand of 3.84 kg/day derived from 0.96 kg/astronaut/day nominal baseline for 4 astronauts.',
      'Total fluid turnover of 15.48 L/day derived from 3.87 L/astronaut/day NASA-STD-3001 technical brief load.',
    ],
    assumptions: [
      'Continuous 10-day base power generation is a game scenario setting; actual rim illumination varies seasonally (80-92%).',
      'Kilopower Stirling baseline (7.0 kW) is a hypothetical future architecture, not currently deployed.',
      'The 72-hour eclipse on Sol 6 is a hypothetical extended low-illumination game scenario, not an astronomical event.',
      'Radiation exposure is an illustrative scenario estimate applying ALARA; it is not a certified safety calculation.',
    ],
  },
  initialResources: {
    batteryKWh: 320,
    batteryCapacityKWh: 400,
    oxygenKg: 85,
    waterLiters: 350,
    regolithShieldCm: 60,
    shieldIntegrityPct: 100,
    cabinTempC: 22.0,
    radiationDoseAccumulatedMSv: 1.2,
    radiationRateMSvPerDay: 0.65,
    foodRationsDays: 20,
    crewMoralePct: 92,
  },
  maxPowerBudgetKw: 18.0,
  crises: [
    {
      id: 'moon_sol_3_solar_flare',
      sol: 3,
      title: 'Solar Particle Event Simulation (DONKI Alert Correlation)',
      cadetTitle: '☀️ Solar Particle Storm Alert!',
      subtitle: 'Simulated Galactic Particle Flux Elevation',
      sourceDataset: 'NASA DONKI Space Weather Archive (Illustrative Scenario Mode)',
      provenanceType: 'SIMULATION_ASSUMPTION',
      scientificContext:
        'Note: Soft X-ray flare classifications (X/M/C) measure electromagnetic irradiance in the 0.1-0.8 nm band, not proton fluence. This event models a hypothetical Solar Particle Event (SPE) associated with strong solar eruptions.',
      cadetBriefing:
        'Commander Aria warns: Satellite monitors report a major solar flare pointing our way! Deep space has no Earth magnetic field to shelter us. We must choose how to shield our crew bunker.',
      flightDirectorBriefing:
        'Orbital space weather telemetry indicates an energetic Solar Particle Event (SPE) following an X-class flare. Unshielded scenario radiation index surges to 65.0 mSv/day. Flight Director must select an active mitigation directive.',
      warningLevel: 'critical',
      choices: [
        {
          id: 'choice_water_wall_shelter',
          title: 'Activate Water-Wall Storm Shelter (Hydronic Perimeter)',
          cadetDescription: 'Circulate habitat water through the storm shelter walls to absorb cosmic protons like a water shield!',
          engineeringDescription: 'Divert 200 L of potable water into storm shelter perimeter hydronic loop. Hydrogen atoms in water moderate secondary neutrons; draws 4.5 kW pump power and pauses distillation.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -45,
            waterLitersDelta: -10,
            radiationMSvDelta: 1.8,
            moraleDelta: +5,
          },
          tradeOffSummary: 'Lowers scenario exposure index (+1.8 mSv) at the cost of 45 kWh battery drain and temporary water recycling pause.',
        },
        {
          id: 'choice_regolith_sintering_overdrive',
          title: 'Deploy Autonomous Rovers to Sinter 30cm Additional Regolith',
          cadetDescription: 'Send robot rovers outside to pile and fuse 30 cm of lunar soil over the base roof!',
          engineeringDescription: 'Operate dual robotic sintering rovers to deposit 30 cm compacted regolith over primary pressure hull. High mechanical battery consumption.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -65,
            shieldCmDelta: +30,
            radiationMSvDelta: 4.2,
            moraleDelta: -2,
          },
          tradeOffSummary: 'Increases regolith shield depth to 90 cm, but consumes 65 kWh electrical energy during high-flux hours.',
        },
        {
          id: 'choice_minimal_shielding_maintain_power',
          title: 'Shelter in Rover Bay Chassis & Maintain ECLSS',
          cadetDescription: 'Stay inside the aluminum rover hull while keeping all power for life support.',
          engineeringDescription: 'Sustain full power to ECLSS and hydroponics; crew shelters inside metallic rover chassis without active hydronic shielding.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -10,
            radiationMSvDelta: 24.5,
            oxygenKgDelta: +2,
            moraleDelta: -18,
          },
          tradeOffSummary: 'Conserves 55 kWh power, but crew receives high scenario exposure (24.5 mSv) and morale drops.',
        },
      ],
    },
    {
      id: 'moon_sol_6_shadow_eclipse',
      sol: 6,
      title: 'Hypothetical Extended Low-Illumination Scenario (72 Hours)',
      cadetTitle: '❄️ 72-Hour Low-Illumination Period!',
      subtitle: 'Solar Panels Go Dark — Thermal Heaters Must Sustain 22°C',
      sourceDataset: 'Educational Scenario (Thermal Gradient inspired by ISRO ChaSTE)',
      provenanceType: 'SIMULATION_ASSUMPTION',
      scientificContext:
        'Note: While ISRO ChaSTE demonstrated that lunar regolith is an exceptional thermal insulator (60°C drop in 10 cm at 69.37°S), this 72-hour dark period is an educational game scenario, not an astronomical ChaSTE observation.',
      cadetBriefing:
        'Sunlight has dropped to near zero for the next 3 days! Outside surface regolith is extremely cold. If our thermal heaters fail, our greenhouse plants and cabin will freeze.',
      flightDirectorBriefing:
        'Outpost enters a 72-hour low-illumination scenario. Photovoltaic output drops to near 0 kW. Subsurface regolith boundary conditions demand continuous thermal heater power to maintain NASA-STD-3001 cabin target (22°C).',
      warningLevel: 'warning',
      choices: [
        {
          id: 'choice_heat_crew_dim_hydroponics',
          title: 'Prioritize Crew Cabin Thermal Heaters & Throttle Greenhouse',
          cadetDescription: 'Keep astronaut quarters warm at 22°C and dim greenhouse grow lights until the Sun returns.',
          engineeringDescription: 'Divert 8.0 kW to crew cabin ceramic heaters; throttle hydroponic LED arrays to survival baseline (0.5 kW).',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -75,
            tempDeltaC: +0.5,
            foodDaysDelta: -3,
            moraleDelta: -4,
          },
          tradeOffSummary: 'Maintains nominal 22°C cabin temperature; sacrifices 3 days of hydroponic fresh growth.',
        },
        {
          id: 'choice_kilopower_stirling_burst',
          title: 'Overdrive Stirling Reactor Core to Full Thermal Output',
          cadetDescription: 'Run the backup nuclear Stirling generator at high power to warm both crew and crops!',
          engineeringDescription: 'Command auxiliary Kilopower Stirling core to maximum thermal loop capacity to heat both crew quarters and greenhouse.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -50,
            oxygenKgDelta: +1.5,
            shieldCmDelta: -5,
            moraleDelta: +8,
          },
          tradeOffSummary: 'Maintains thermal comfort and crop growth; incurs minor mechanical wear on drill linkages.',
        },
        {
          id: 'choice_cryo_conserve_battery',
          title: 'Low-Power Conservation: Lower Cabin Setpoint to 14°C',
          cadetDescription: 'Put on extra flight layers and hot rations while keeping battery usage low.',
          engineeringDescription: 'Drop cabin thermal setpoint to 14°C (lower physiological limit per NASA-STD-3001 guidelines). Conserves 50 kWh battery storage.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -25,
            tempDeltaC: -7.5,
            moraleDelta: -12,
            oxygenKgDelta: -1.0,
          },
          tradeOffSummary: 'Saves 50 kWh battery storage, but cold crew incurs fatigue and morale penalties.',
        },
      ],
    },
    {
      id: 'moon_sol_8_ice_drill_strike',
      sol: 8,
      title: 'Hypothetical Crater Volatiles Extraction Scenario',
      cadetTitle: '💎 Rover Explores Dark Crater Floor!',
      subtitle: 'Permanently Shadowed Region (PSR) Ice Prospecting Simulation',
      sourceDataset: 'Educational Scenario (Informed by NASA LCROSS / LRO Diviner Data)',
      provenanceType: 'SIMULATION_ASSUMPTION',
      scientificContext:
        'Note: NASA LCROSS and LRO Diviner confirmed hydroxyl/water spectral signatures in lunar polar cold traps. This prospecting event is an educational scenario, not an operational mining record.',
      cadetBriefing:
        'Commander Aria reports: Our prospecting rover drilled into the dark crater floor! Do we spend battery power melting the volatiles into drinking water, or electrolyze it into oxygen?',
      flightDirectorBriefing:
        'Prospecting rover R-1 completes test drill in crater floor cold trap. Player can allocate electrical power to microwave volatilization to replenish potable reserves.',
      warningLevel: 'caution',
      choices: [
        {
          id: 'choice_melt_water_reserves',
          title: 'Melt & Condense 60 Liters of Potable Water (Illustrative)',
          cadetDescription: 'Use rover heaters to melt the volatiles into fresh drinking water for the crew!',
          engineeringDescription: 'Operate volatilization thermal reactor to capture and condense 60.0 L water into ECLSS storage tanks.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -38,
            waterLitersDelta: +60,
            moraleDelta: +10,
          },
          tradeOffSummary: 'Adds 60 Liters of water to storage, requiring 38 kWh rover battery power.',
        },
        {
          id: 'choice_electrolyze_o2_surge',
          title: 'Electrolyze Extracted Volatiles into Surplus Oxygen',
          cadetDescription: 'Split the extracted water into pure breathable oxygen for base reserve tanks!',
          engineeringDescription: 'Direct extracted volatiles through high-pressure electrolysis cell, manufacturing +18 kg of oxygen reserves.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -42,
            oxygenKgDelta: +18,
            waterLitersDelta: +15,
            moraleDelta: +6,
          },
          tradeOffSummary: 'Produces +18 kg oxygen reserve; consumes 42 kWh electrical energy.',
        },
        {
          id: 'choice_sample_preservation_science',
          title: 'Preserve Pristine Cryogenic Core Samples for Analysis',
          cadetDescription: 'Keep the ice samples frozen solid for scientific study and Earth return!',
          engineeringDescription: 'Maintain cryogenic core integrity in insulated sample containers. Minimum melting energy consumed.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -12,
            waterLitersDelta: +5,
            moraleDelta: +14,
          },
          tradeOffSummary: 'Low battery draw (-12 kWh) while boosting crew science morale (+14%).',
        },
      ],
    },
  ],
};

/**
 * MISSION 2: MARS — JEZERO CRATER HABITAT
 * Destination: Jezero Crater Ancient River Delta (18.38°N 77.58°E)
 * Features an educational scenario modeling Mars surface solar insolation (~43%),
 * a hypothetical scaled oxygen-production plant (16x MOXIE scale), and a regional dust storm.
 */
export const MARS_MISSION: MissionConfig = {
  id: 'mars_jezero',
  name: 'Jezero Crater Habitat (Mars)',
  cadetName: 'Martian Frontier Dome (Red Planet)',
  destination: 'Mars (Jezero Crater Delta, 18.38°N 77.58°E)',
  destinationName: 'Jezero Crater Ancient River Delta',
  missionDurationSols: 10,
  solarIrradianceWPerM2: 590, // ~43% Earth/Moon orbital irradiance
  baselineSurfaceTempC: -45,
  ambientRadiationMSvPerDay: 0.67,
  description:
    'Lead Outpost Zero at the Jezero ancient river delta on Mars. Power a hypothetical scaled oxygen-production plant (16x MOXIE scale) from Martian CO2, combat a simulated regional dust storm, and balance thermal heaters.',
  cadetDescription:
    'Welcome to the Red Planet! Mars air is 95% carbon dioxide. You command a scaled-up oxygen factory inspired by NASA\'s MOXIE rover test to turn Martian air into fresh air while surviving giant dust storms!',
  primaryHazard: 'Regional Dust Storm (Tau = 3.5) & Scaled Oxygen Plant Energy Trade-Off',
  nasaIsroCitations: [
    'NASA Mars 2020 Perseverance MOXIE (Mars Oxygen ISRU Experiment) Performance Logs (Hecht et al. 2022) — https://www.nasa.gov/mission_pages/mars2020/index.html',
    'NASA Mars 2020 MEDA (Mars Environmental Dynamics Analyzer) Surface Pressure & Optical Depth (Tau)',
    'NASA InSight SEIS & Solar Array Dust Degradation Telemetry (2018-2022)',
    'NASA-STD-3001 ECLSS Potable Water & Gas Composition Standards',
  ],
  provenanceNotes: {
    observed: [
      'NASA MOXIE rover technology demonstrator consumes ~300 W and produces ~10-12 g O2/hour (Hecht et al. 2022).',
      'Perseverance MEDA recorded Jezero atmospheric pressure (~0.61 kPa) and regional dust storm optical depths.',
      'Surface solar irradiance on Mars averages ~590 W/m² max (~43% of Earth/lunar orbital constant).',
    ],
    derived: [
      'The 4-crew habitat oxygen supply (3.84 kg/day = 160 g/h) is derived by mathematically scaling MOXIE\'s 10 g/h demonstrator by 16x.',
      'Water requirements of 15.48 L/day total turnover derived from 3.87 L/astronaut/day for 4 astronauts.',
    ],
    assumptions: [
      'The scaled oxygen plant is a hypothetical future habitat system operating at ~3.0 kW; it is NOT the rover demonstrator itself.',
      'The 10-Sol habitat mission duration and initial battery capacity (450 kWh) are configurable scenario settings.',
      'Regional dust storm (Tau = 3.5, 75% solar loss) is an illustrative scenario modeled after observed Martian storms.',
    ],
  },
  initialResources: {
    batteryKWh: 350,
    batteryCapacityKWh: 450,
    oxygenKg: 90,
    waterLiters: 320,
    regolithShieldCm: 50,
    shieldIntegrityPct: 95,
    cabinTempC: 21.5,
    radiationDoseAccumulatedMSv: 1.5,
    radiationRateMSvPerDay: 0.67,
    foodRationsDays: 22,
    crewMoralePct: 88,
  },
  maxPowerBudgetKw: 16.0,
  crises: [
    {
      id: 'mars_sol_3_dust_storm',
      sol: 3,
      title: 'Perseverance MEDA-Inspired Alert: Regional Dust Storm (Tau = 3.5)',
      cadetTitle: '🌪️ Martian Dust Storm Darkens the Sky!',
      subtitle: 'Atmospheric Opacity Reduces Solar Power by 75% for 48 Hours',
      sourceDataset: 'NASA Perseverance MEDA Optical Depth (Tau) Records (Illustrative Scenario Mode)',
      provenanceType: 'SIMULATION_ASSUMPTION',
      scientificContext:
        'Note: Martian dust storms suspend fine ferric oxide particulates, elevating atmospheric opacity (Tau). In historical InSight/Opportunity missions, dust storms drastically reduced photovoltaic output.',
      cadetBriefing:
        'A gigantic dust storm has swept across Jezero Crater! The sky is dark salmon-pink, and fine Martian dust is coating our solar arrays. Solar power output just plummeted by 75%!',
      flightDirectorBriefing:
        'Atmospheric optical depth (Tau) rises to 3.5. Solar array output drops from 16.0 kW to 4.0 kW. Outpost battery storage must absorb deficits if the scaled oxygen plant and heaters are sustained at full power.',
      warningLevel: 'critical',
      choices: [
        {
          id: 'choice_throttle_moxie_conserve_battery',
          title: 'Throttle Scaled Oxygen Plant to 20% & Draw from O2 Tanks',
          cadetDescription: 'Pause the big oxygen factory and breathe from our saved oxygen tanks while the storm passes!',
          engineeringDescription: 'Step down the hypothetical scaled oxygen plant from 3.0 kW to 0.6 kW. Draw from 90 kg stored O2 tanks. Conserves 45 kWh battery energy.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -30,
            oxygenKgDelta: -7.5,
            moraleDelta: -2,
          },
          tradeOffSummary: 'Conserves 50 kWh battery storage during low-solar storm; uses 7.5 kg of stored oxygen reserves.',
        },
        {
          id: 'choice_run_electrostatic_dust_sweepers',
          title: 'Fire Electrostatic Dust Rejectors on Solar Arrays',
          cadetDescription: 'Zap dust off the solar panels with electric pulses so the Sun can power the base again!',
          engineeringDescription: 'Activate high-voltage alternating piezoelectric pulses along PV panel coatings to reject fine dust grains, recovering 60% solar efficiency.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -55,
            moraleDelta: +6,
            tempDeltaC: -1.0,
          },
          tradeOffSummary: 'Spends 55 kWh immediate power pulse, but recovers solar generation for upcoming Sols.',
        },
        {
          id: 'choice_overdrive_aux_radioisotope_stirling',
          title: 'Overdrive Auxiliary Radioisotope Stirling Core',
          cadetDescription: 'Run the backup nuclear power source at full capacity to keep heaters and grow lights running!',
          engineeringDescription: 'Engage auxiliary radioisotope Stirling core at full rating to keep ECLSS and greenhouse warm at 22°C.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -18,
            tempDeltaC: +0.8,
            foodDaysDelta: +1,
            radiationMSvDelta: +0.4,
            moraleDelta: +4,
          },
          tradeOffSummary: 'Preserves greenhouse crops and warm cabin, with negligible scenario radiation increment (+0.4 mSv).',
        },
      ],
    },
    {
      id: 'mars_sol_6_wrs_valve_failure',
      sol: 6,
      title: 'ECLSS Simulation: Catalytic Water Recycler Clog',
      cadetTitle: '💧 Water Filter Clogged in the Engine Room!',
      subtitle: 'Water Recovery Efficiency Drops from 90% to 45%',
      sourceDataset: 'ISS ECLSS Water Recovery System Telemetry Protocols (Illustrative Scenario Mode)',
      provenanceType: 'SIMULATION_ASSUMPTION',
      scientificContext:
        'Note: Closed-loop water distillation requires periodic catalytic bed maintenance and brine processing. This event is an educational engineering failure scenario.',
      cadetBriefing:
        'Fine Martian dust bypassed an airlock filter and clogged our water recycling pump. Right now, half of our recycled water is lost in the filter loop! What should our crew do?',
      flightDirectorBriefing:
        'Particulate accumulation across WRS catalytic oxidizer inlet drops recycling efficiency to 45%. Without intervention, outpost loses ~7.8 Liters of water per Sol.',
      warningLevel: 'warning',
      choices: [
        {
          id: 'choice_crew_eva_filter_overhaul',
          title: 'Conduct 4-Hour Crew EVA & Backflush Filters',
          cadetDescription: 'Suit up and go outside to swap the filters with fresh spare parts!',
          engineeringDescription: 'Assign Flight Engineer and Astrobiologist to 4-hour airlock EVA. Clean catalytic beds and replace microporous polymer membrane.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            waterLitersDelta: +25,
            radiationMSvDelta: +1.2,
            moraleDelta: -6,
            batteryKWhDelta: -15,
          },
          tradeOffSummary: 'Restores 90% water recycling efficiency immediately, but astronauts incur fatigue and mild EVA exposure (+1.2 mSv).',
        },
        {
          id: 'choice_sonic_clearing_high_frequency',
          title: 'Run Ultrasonic Vibration Self-Cleaning Cycle',
          cadetDescription: 'Shake the pipes with super-fast sound waves to blast the dust away without stepping outside!',
          engineeringDescription: 'Trigger automated 40 kHz acoustic cavitation transducers to shatter mineral scale without astronaut EVA. High electrical consumption.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -38,
            waterLitersDelta: +18,
            moraleDelta: +2,
          },
          tradeOffSummary: 'Zero crew EVA exposure or fatigue risk; drains 38 kWh battery for transducer pulsing.',
        },
        {
          id: 'choice_water_rationing_conserve_filters',
          title: 'Implement Temporary Water Rationing Protocol',
          cadetDescription: 'Take sponge baths and conserve water until a scheduled maintenance Sol.',
          engineeringDescription: 'Restrict potable water allocation to strict hydration only (2.5 L/crew/day); bypass hygiene flush loop. Defer physical repairs.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            waterLitersDelta: -5,
            batteryKWhDelta: +10,
            moraleDelta: -14,
          },
          tradeOffSummary: 'Saves 10 kWh power and requires zero parts, but crew hygiene drops and morale suffers (-14%).',
        },
      ],
    },
    {
      id: 'mars_sol_8_moxie_co2_breakthrough',
      sol: 8,
      title: 'Scaled Oxygen Plant High-Yield Operational Window',
      cadetTitle: '🌿 High-Pressure Front Boosts Oxygen Production!',
      subtitle: 'Barometric High Pressure Creates Oxygen Synthesis Opportunity',
      sourceDataset: 'Educational Scenario (Informed by NASA MOXIE SOXE Principles)',
      provenanceType: 'SIMULATION_ASSUMPTION',
      scientificContext:
        'Note: Higher atmospheric inlet density increases Solid Oxide Electrolysis (SOXE) throughput. This event models an educational operational opportunity for the hypothetical scaled plant.',
      cadetBriefing:
        'Awesome news from Commander Aria! A cold, high-pressure weather front just moved over Jezero Crater. The air is denser. If we feed our oxygen plant extra power, we can synthesize surplus oxygen!',
      flightDirectorBriefing:
        'Barometric pressure rises to 0.74 kPa. Scaled oxygen plant Solid Oxide Electrolysis efficiency increases by 45%. Flight Director can authorize a high-power run (5.2 kW) to produce surplus oxygen.',
      warningLevel: 'caution',
      choices: [
        {
          id: 'choice_moxie_turbo_charge',
          title: 'Overclock Scaled Oxygen Plant to 130% Power (Surplus O2)',
          cadetDescription: 'Crank the oxygen factory to maximum power! Fill every reserve tank on the base!',
          engineeringDescription: 'Supply 5.2 kW electrical power to the scaled SOXE cathode assembly. Synthesize +22.0 kg pure O2 in a single 12-hour cycle.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -52,
            oxygenKgDelta: +22,
            moraleDelta: +12,
          },
          tradeOffSummary: 'Creates +22 kg oxygen surplus, at the cost of 52 kWh heavy battery drain.',
        },
        {
          id: 'choice_moxie_balanced_nominal',
          title: 'Maintain Standard Baseline Scaled Oxygen Cycle',
          cadetDescription: 'Keep the oxygen factory at normal speed so we don\'t drain our batteries too fast.',
          engineeringDescription: 'Maintain standard 3.0 kW scaled oxygen allocation. Generates +6.0 kg net surplus O2 while maintaining steady battery reserves.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -22,
            oxygenKgDelta: +6,
            moraleDelta: +4,
          },
          tradeOffSummary: 'Steady oxygen production (+6 kg) with manageable 22 kWh battery usage.',
        },
        {
          id: 'choice_divert_power_to_hydroponics',
          title: 'Divert Surplus Energy into Hydroponic Astro-Garden',
          cadetDescription: 'Give the extra electricity to our space crops for fresh astronaut meals!',
          engineeringDescription: 'Allow biological photosynthesis to produce oxygen naturally while boosting fresh crop production for crew nutrition.',
          provenanceType: 'SIMULATION_ASSUMPTION',
          resourceImpacts: {
            batteryKWhDelta: -20,
            oxygenKgDelta: +3.5,
            foodDaysDelta: +5,
            moraleDelta: +15,
          },
          tradeOffSummary: 'Adds 5 days of fresh hydroponic food rations and boosts crew morale by +15%.',
        },
      ],
    },
  ],
};

export const MISSIONS: Record<string, MissionConfig> = {
  moon_shackleton: MOON_MISSION,
  mars_jezero: MARS_MISSION,
};

export const DEFAULT_CREW: CrewMember[] = [
  {
    id: 'aria',
    name: 'Commander Aria Patel',
    role: 'Mission Commander & Pilot',
    specialty: 'Orbital Dynamics & Crew Safety',
    avatarColor: '#00F0FF',
    morale: 95,
    health: 98,
    status: 'Nominal',
  },
  {
    id: 'leo',
    name: 'Dr. Leo Tanaka',
    role: 'Lead Flight Engineer',
    specialty: 'ECLSS & Kilopower Systems',
    avatarColor: '#10B981',
    morale: 92,
    health: 96,
    status: 'Nominal',
  },
  {
    id: 'maya',
    name: 'Dr. Maya Thorne',
    role: 'Chief Astrobiologist',
    specialty: 'Hydroponics & Extremophiles',
    avatarColor: '#F59E0B',
    morale: 89,
    health: 94,
    status: 'Nominal',
  },
  {
    id: 'jax',
    name: 'Jax Henderson',
    role: 'Robotics & Geological Specialist',
    specialty: 'ISRU Drilling & Regolith Sintering',
    avatarColor: '#A855F7',
    morale: 90,
    health: 97,
    status: 'Nominal',
  },
];
