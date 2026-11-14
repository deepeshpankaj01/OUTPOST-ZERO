# OUTPOST ZERO: Junior Astronaut Mission Trainer

> **2026 NASA Space Apps Challenge Submission**  
> **Challenge Category:** *Build a Junior Astronaut Mission Trainer*  
> **Created by:** **Team Parakram**  
> **Repository:** [https://github.com/deepeshpankaj01/OUTPOST-ZERO](https://github.com/deepeshpankaj01/OUTPOST-ZERO)  
> **Live Deployment:** [https://outpost-zero-coral.vercel.app/](https://outpost-zero-coral.vercel.app/)  

---
ppt-
https://drive.google.com/drive/folders/1ls0msgb-PkGluAJ8rhiUuRbwJq72qMOR

> [!NOTE]
> **Scientific Integrity & Simulation Scope Statement**  
> *OUTPOST ZERO is an interactive educational simulation designed for students and educators; it is not an engineering design tool, operational flight procedure, radiation safety assessment, or NASA/ISRO-certified software.*

---

## 1. Executive Summary & Challenge Alignment

**OUTPOST ZERO** is an interactive, browser-based space habitat simulation and mission trainer built by **Team Parakram** for the **2026 NASA Space Apps Challenge** under the category *"Build a Junior Astronaut Mission Trainer"*.

The application places cadets and students into the seat of a **Junior Astronaut Flight Director**, commanding humanity's first permanent surface outposts on either:
1. **The Moon — Shackleton Rim Outpost (89.9°S):** Balancing cryogenic crater shadow thermal loss with elevated solar rim illumination and regolith compaction inspired by ISRO Chandrayaan-3 ChaSTE soil observations.
2. **Mars — Jezero Crater Habitat (18.38°N):** Managing atmospheric carbon dioxide extraction with a 16× scaled oxygen habitat plant inspired by NASA Perseverance MOXIE, while navigating severe regional dust storms and photovoltaic obscuration.

Rather than relying on ungrounded arcade mechanics or magical resources, OUTPOST ZERO teaches real-world aerospace systems engineering through trade-offs: power allocation, life support recycling efficiencies, thermal dissipation, metabolic demands, and space weather events.

---

## 2. NASA Space Apps Compliance & Rules Adherence

1. **No NASA/ISRO Logos or Official Insignia:**  
   Per NASA Space Apps rules, neither the official NASA "Meatball", NASA "Worm", nor ISRO emblem is rendered anywhere in the application. OUTPOST ZERO features an original, procedurally designed vector mission patch created by Team Parakram.
2. **Zero Login Wall for Judges & Educators:**  
   The application requires zero account creation, email registration, or credentials. Judges and students can play immediately. All progress, earned badges, customized callsigns, and high scores are saved locally via `localStorage`.
3. **Super Intelligence (SI) & AI Assistance Disclosure:**  
   - Declared in HTML `<head>`:
     ```html
     <meta name="ai-disclosure" content="Code, UI scaffolding, and procedural SVG/audio assets accelerated using Super Intelligence (SI) tools by Team Parakram for the 2026 NASA Space Apps Challenge." />
     ```
   - Transparently stated in the application footer and Science Lab modal:
     > *"SI Transparency: Application code and procedural visual/audio elements were accelerated with AI/SI tools; all simulation physics are grounded in curated NASA & ISRO datasets."*
4. **Three-Tier Scientific Provenance Framework:**  
   Every metric and formula across the dashboard is categorized under one of three visible badges:
   - 🟢 `OBSERVED SOURCE DATA` — Directly reported by a named NASA or ISRO mission/dataset.
   - 🟡 `DERIVED / EDUCATIONAL CALCULATION` — Mathematically derived from verified observations via explicit equations.
   - 🟣 `SIMULATION ASSUMPTION` — A configurable gameplay rule or toy model, clearly labeled as non-certified.

---

## 3. Real Implemented Features

### Dual Audience Modes (Seamless 1-Click Toggle)
- 🧒 **Cadet Mode (Ages 7–12):** Simplified percentages (0–100%), colorful visual telemetry bars, intuitive status badges, and **Commander Aria Patel** (an animated SVG astronaut mentor) explaining subsystem trade-offs with kid-friendly analogies.
- 🚀 **Flight Director Mode (Ages 13+ / High School, University & Judges):** Rigorous engineering metrics (`kW`, `kWh`, `kg O2/day`, `L H2O/day`, `mSv/day`, `°C`), explicit chemical equations, and direct citations.

### Interactive Outpost Visualization
- **Architectural Cross-Section:** Animated, clickable vector schematic detailing 5 critical habitat modules:
  1. *Solar Photovoltaic & Kilopower Stirling Core*
  2. *ECLSS Oxygen Generation & Water Recovery Core*
  3. *Hydroponic Astro-Garden Dome*
  4. *Regolith Shield Berm & Water-Wall Storm Shelter*
  5. *Crew Habitat Quarters & ISRU Geological Rover Bay*
- **NASA Orbital Imagery & Illumination Toggle:** Direct toggle between habitat schematic and high-resolution NASA Lunar Reconnaissance Orbiter (LRO Diviner/LOLA) and Mars Reconnaissance Orbiter (MRO HiRISE) orbital observation maps with direct links to NASA Scientific Visualization Studio (SVS) data products.

### Subsystem Power Allocation Engine
Players allocate finite continuous power (`kW`) each Sol across four competing subsystems:
- **ECLSS Life Support & O2 Synthesis:** Runs the water processor and oxygen generation assembly.
- **Hydroponic Astro-Garden:** Drives artificial LED grow spectra, supplementing caloric rations and crew morale.
- **Active Thermal Control & Shielding:** Operates heating loops against cryogenic ambient temperatures and powers sintering rovers to deposit regolith berms.
- **Science & ISRU Mining Rovers:** Dispatches prospecting rovers to harvest volatiles and subsurface water-ice in permanently shadowed craters.

### Real-Time Pre-Flight Calculator ("Consequence Preview")
Before committing the day's allocations, the dashboard computes instantaneous projected deltas for battery storage, oxygen reserves, water recovery, cabin temperature, radiation exposure, and crew morale, preventing blind trial-and-error.

### Dynamic Aerospace Crises with Transparent Trade-Offs
Every 2–3 Sols, authentic crisis events challenge the player (e.g., Solar Particle Storms, Cryogenic Eclipses, Regional Dust Storms, WRS Distillation Filter Degradation). Every crisis offers 3 distinct engineering directives with transparent physical trade-offs—no single choice provides a consequence-free solution.

### Non-Punitive "What-If Time Machine"
Failure is treated as an essential aerospace learning experience. If battery, oxygen, water, or thermal thresholds are breached, the simulation displays an **Engineering Failure Analysis** modal explaining the physical root cause and provides a **⏪ Rewind 1 Sol** feature that restores the pre-crisis state snapshot without score penalties.

### Live NASA DONKI Space Weather API & Deterministic Fallback
A dedicated header status pill connects to the **NASA DONKI Space Weather API (`api.nasa.gov/DONKI/FLR`)** to query real-time solar flare events over a 30-day window. When offline or rate-limited, the system falls back deterministically to the curated historical record `FLR-2024-X2.4` (2024-10-09), clearly distinguishing live telemetry from historical archives and empty observation windows.

### Zero-Dependency Web Audio API Procedural Synthesizer
The audio subsystem synthesizes all radar pings, button clicks, alarm klaxons, victory fanfares, and failure drones in real time via the browser's Web Audio API (`AudioContext`). It requires zero external MP3 files, introduces zero bandwidth overhead, and includes a persistent mute toggle.

### End-of-Mission Telemetry Debrief & Printable Certificate
Upon completing Sol 10, cadets receive a dynamically generated **Certified Junior Astronaut Flight Director** debrief certificate displaying their custom callsign, verified telemetry score, and mastered trade-offs, complete with confetti celebrations and exportable debrief summaries.

---

## 4. Scientific Foundations & Direct Dataset Citations

OUTPOST ZERO embeds authentic aerospace data in `src/data/nasaMissionData.ts`. Below are the primary citations and direct data links:

| Domain | Dataset / Mission Source | Direct Source URL | Parameter Cited in Outpost Zero |
| :--- | :--- | :--- | :--- |
| **Human Physiology** | NASA-STD-3001 Vol 2 | [NASA Standard 3001](https://www.nasa.gov/hhp/nasa-std-3001) | Baseline metabolic demand: `0.96 kg O2/day`, `2.5 L potable water/day`, `3.87 kg total fluid turnover load/day`, `3,035 kcal/day` |
| **Radiation Standard** | NASA Space Flight Standards | [NASA Radiation Health](https://www.nasa.gov/hrp/elements/radiation) | Astronaut career limit `<600 mSv`; ALARA principle (*As Low As Reasonably Achievable*). Scenario numbers are illustrative exposure indices. |
| **Space Station ECLSS** | NASA ISS Life Support | [NASA ISS Water Recovery](https://www.nasa.gov/missions/station/iss-research/water-recovery-system/) | ISS Water Recovery System (WRS) + Brine Processor Assembly (BPA) demonstrated `~98%` closed-loop water recovery in 2023. |
| **Lunar Thermophysics** | ISRO Chandrayaan-3 ChaSTE | [ISRO ChaSTE Observations](https://www.isro.gov.in/Chaste_first_observations.html) | In-situ temperature probe at Shiv Shakti Point (69.37°S) observed surface `+50°C` dropping to `-10°C` at 8 cm depth (~60°C gradient across top 10 cm). |
| **Lunar Illumination** | NASA LRO Diviner & LOLA | [NASA LRO Mission Archives](https://www.nasa.gov/mission_pages/LRO/main/index.html) | Permanently shadowed crater interiors reach cryogenic minimums below `-170°C` (e.g. Shackleton PSRs at 89.9°S). |
| **Mars O2 In-Situ** | NASA Perseverance MOXIE | [NASA Mars 2020 MOXIE](https://mars.nasa.gov/mars2020/spacecraft/instruments/moxie/) | Technology demonstrator operated at `~300 W`, producing `~10 to 12 g O2/hour`. A full 4-person crew habitat requires a hypothetical 16× scaled plant (~3.0 kW, 160 g/h). |
| **Mars Meteorology** | NASA Perseverance MEDA | [NASA Mars 2020 MEDA](https://mars.nasa.gov/mars2020/spacecraft/instruments/meda/) | Atmospheric dust storms attenuate surface solar irradiance by 60%–85% (atmospheric optical depth Tau = 3.5). |
| **Space Weather** | NASA DONKI Space Weather | [NASA DONKI API Portal](https://kauai.ccmc.gsfc.nasa.gov/DONKI/) | Live solar flare GOES X-ray flux feed. X-ray flare class is treated as an illustrative scenario trigger for simulated particle storms. |

---

## 5. Explicit Simulation Assumptions Registry

In accordance with strict scientific integrity principles, OUTPOST ZERO maintains an open registry of simulation assumptions and educational simplifications:

1. **Hypothetical Scaled Oxygen Plant (Mars):**  
   NASA Perseverance MOXIE is a 300 W rover demonstrator producing ~10 g O2/hour. For a 4-person crew requiring 3.84 kg O2/day (160 g/hour), the game models a **hypothetical 16× scaled plant** consuming ~3.0 kW. The scaled system is explicitly labeled as a hypothetical concept, never confused with MOXIE itself.
2. **ISRO ChaSTE Regional Specificity:**  
   ChaSTE took measurements at Vikram's landing site (69.37°S) across the top ~10 cm of lunar regolith. The simulation cites ChaSTE as an ISRO case study for topsoil insulating properties, but does not claim ChaSTE landed at Shackleton Crater (89.9°S) or measured permanent cryogenic shadow.
3. **Lumped-Parameter Radiation Toy Model:**  
   Deep-space radiation consists of complex GCR spectra and sporadic SPE protons with anisotropic secondary particle showers. OUTPOST ZERO utilizes a simplified regolith attenuation curve and active electromagnetic bonus to yield an **Illustrative Exposure Index** (mSv/Sol). It does not represent an operational dose calculation.
4. **Water Recovery Response Curve:**  
   While ISS BPA demonstrated ~98% water recovery, the game's dynamic curve (90% at ≥3.0 kW life support, declining to 50% during electrical brownouts) is an **educational simulation mechanic** designed to demonstrate power-water interdependencies.
5. **Deterministic Sol Timestep:**  
   Resource rates are integrated over 1 Sol (24.0 hours on the Moon, 24.6 hours on Mars) rather than continuous sub-second differentials, matching junior educational comprehension goals.

---

## 6. Architecture & Tech Stack

```
OUTPOST-ZERO/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with AI disclosure metadata & font imports
│   │   └── page.tsx           # Mission dashboard, state controller & modal orchestrator
│   ├── components/
│   │   ├── AllocationSliders.tsx      # Subsystem power sliders with kW vs kWh indicators
│   │   ├── BriefingModal.tsx          # Comprehensive mission briefing & subsystem manual
│   │   ├── CommanderAria.tsx          # Illustrated animated SVG mentor astronaut
│   │   ├── CrisisModal.tsx            # Dynamic crisis directives with trade-off matrices
│   │   ├── DebriefCertificateModal.tsx# Printable mission completion certificate & telemetry
│   │   ├── DonkiStatusPill.tsx        # NASA DONKI live telemetry & fallback indicator
│   │   ├── Footer.tsx                 # Compliance footer with persistent simulation disclaimer
│   │   ├── Navbar.tsx                 # Navigation bar with audience toggle & audio mute
│   │   ├── OutpostMapSvg.tsx          # Interactive habitat cross-section + orbital map toggle
│   │   ├── PreFlightCalculator.tsx    # Projected resource deltas consequence preview
│   │   ├── ScienceLabModal.tsx        # Provenance registry & scientific dataset laboratory
│   │   └── TimeMachineModal.tsx       # Non-punitive failure analysis & rewind time machine
│   ├── data/
│   │   ├── historicalSpaceWeather.ts  # Curated NASA DONKI flares & API fetcher
│   │   └── nasaMissionData.ts         # Verified constants, mission configs & citations
│   ├── lib/
│   │   ├── audioSynthesizer.ts        # Procedural Web Audio API sound synthesizer
│   │   ├── simulationEngine.ts        # Core mathematical engine & boundary validators
│   │   └── storage.ts                 # LocalStorage persistence, snapshots & error handling
│   └── types/
│       └── mission.ts                 # Full TypeScript schemas and provenance interfaces
├── tests/
│   └── simulation.test.ts             # 21 unit tests covering engine, math, DONKI & storage
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

- **Framework:** Next.js 14 (App Router, React 18, TypeScript)
- **Styling:** Tailwind CSS with an obsidian space palette (`#030712`, `#0F172A`)
- **Telemetry Charts:** Recharts responsive SVG telemetry
- **Icons & Badges:** Lucide React + custom SVG insignia
- **Celebrations:** Canvas Confetti
- **Testing:** Node.js native test runner via `tsx` (21 unit tests, 0 failures)

---

## 7. How to Run Locally

### Prerequisites
- Node.js `v18.17.0` or higher (Node `v20+` or `v24+` recommended)
- npm `v9+`

### Installation & Execution
```bash
# 1. Clone the repository
git clone https://github.com/deepeshpankaj01/OUTPOST-ZERO.git

# 2. Enter directory
cd OUTPOST-ZERO

# 3. Install dependencies
npm install

# 4. Run the automated test suite (21 unit tests)
npm test

# 5. Build for production
npm run build

# 6. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 8. Accessibility & Performance

- **Keyboard Navigability:** Full tab index support across sliders, modal dialogs, and interactive map modules.
- **ARIA Standards:** `role="dialog"`, `role="region"`, `aria-label`, and `aria-live` status regions implemented throughout crisis and consequence preview components.
- **Contrast & Legibility:** Designed to WCAG 2.1 AA contrast standards for dark mission-control themes.
- **Offline Capability:** Once loaded, the application functions 100% offline using client-side `localStorage`, built-in procedural Web Audio, and deterministic space weather fallbacks.

---

## 9. Known Limitations & Educational Scope

1. **Lumped-Parameter Daily Timestep:** The simulation computes discrete daily balances rather than sub-second CFD, thermodynamics, or transient battery charging curves.
2. **Point-Estimate Crew Psychology:** Crew morale is modeled through cumulative environmental stress indices rather than multi-dimensional psychological profiling.
3. **Non-Personalized Radiation:** Radiation exposure is tracked as a habitat ambient index rather than organ-specific biological equivalent doses (tissue weighting factors $w_T$).

---

## 10. Team Parakram & Credits

Created by **Team Parakram** for the **2026 NASA Space Apps Challenge**.  
Dedicated to inspiring the next generation of engineers, flight directors, and junior astronauts who will lead humanity back to the Moon and onward to Mars!
