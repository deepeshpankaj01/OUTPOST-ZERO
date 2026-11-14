# OUTPOST ZERO: Junior Astronaut Mission Trainer

> **2026 NASA Space Apps Challenge Submission**  
> **Challenge Category:** *Build a Junior Astronaut Mission Trainer*  
> **Created by:** **Team Parakram**  
> **Live Deployment:** Ready for 1-click Vercel / Netlify / Node deployment.

---

## 🌟 Executive Summary
**OUTPOST ZERO** is a production-ready, interactive space habitat simulation game designed for classrooms, science centers, and aspiring junior astronauts worldwide. 

Players step into the shoes of a **Junior Astronaut Flight Director**, commanding humanity's first permanent surface bases on either the **Moon (Shackleton Rim Outpost)** or **Mars (Jezero Crater Habitat)**.

Rather than relying on fantasy arcade mechanics, Outpost Zero grounds every game loop in verifiable aerospace engineering datasets from **NASA-STD-3001**, the **International Space Station (ISS) ECLSS**, **ISRO Chandrayaan-3 ChaSTE payload**, and **NASA Mars Perseverance (MEDA & MOXIE)**.

---

## ⚖️ Hackathon & NASA Space Apps Compliance
1. **Zero NASA Meatball / Official Insignia Used:**  
   Per strict NASA Space Apps Challenge guidelines, no official NASA meatball, worm logo, or ISRO seal is rendered. Outpost Zero features an original custom vector mission patch designed by Team Parakram.
2. **Zero Login Wall for Judges:**  
   The application is 100% playable instantly in any modern web browser with zero registration or credentials required. Mission progress, customized astronaut callsigns, badges, and high scores automatically persist in `localStorage`.
3. **Super Intelligence (SI) Transparency Disclosure:**  
   - Included in HTML `<head>`:
     ```html
     <meta name="ai-disclosure" content="Code, UI scaffolding, and procedural SVG/audio assets accelerated using Super Intelligence (SI) tools by Team Parakram for the 2026 NASA Space Apps Challenge." />
     ```
   - Transparently stated across the app footer and in the Science Lab modal:
     > *"SI Transparency: Application code and procedural visual/audio elements were accelerated with AI/SI tools; all simulation physics are grounded in curated NASA & ISRO datasets."*
4. **Zero Broken Features / Zero Placeholders:**  
   Every slider, sound synthesizer effect, telemetry chart, decision card, and failure rewind time machine is 100% operational out of the box.

---

## 🚀 Key Features

### 1. Dual Audience Mode Toggle
- 🧒 **Cadet Mode (Ages 7–12):** Simplified percentages (0–100%), colorful visual badges, intuitive icons, and **Commander Aria** (an illustrated SVG astronaut mentor) explaining every trade-off with kid-friendly analogies (e.g., *"Running MOXIE at 100% is like powering 30 hairdryers at once—our battery will drain unless we dim the greenhouse grow lights!"*).
- 🚀 **Flight Director Mode (Ages 13+ / Classroom & Judges):** Exact aerospace engineering metrics (`kW`, `kWh`, `kg O2/day`, `L H2O/day`, `mSv/day`, `°C`), chemical equations, and specific dataset citations.

### 2. Interactive SVG Visual Outpost Map
An animated architectural cross-section of Outpost Zero featuring 5 interactive, clickable modules:
1. ⚡ **Solar & Kilopower Stirling Array:** Tracks photovoltaic tracking arrays, radiator fins, and nuclear stirling core.
2. 🌬️ **ECLSS & MOXIE Life Support Core:** Animated oxygen cylinders and closed-loop water recovery distillation columns.
3. 🌱 **Hydroponic Astro-Garden Dome:** Geodesic dome with dynamic red/blue LED grow bars and sprouting leafy greens.
4. 🛡️ **Regolith Shield & Water-Wall Storm Shelter:** Compacted lunar/martian regolith berm deflecting cosmic ray radiation.
5. 🚀 **Crew Quarters & Rover Bay:** Porthole habitat displaying real-time status of the 4 astronauts and autonomous geological rovers.

### 3. The 4 Engineering Allocation Sliders (Core Educational Mechanic)
Players manage a finite **Power Budget (kW)** each Sol/Day across 4 competing subsystems:
- **Life Support & O2/Water Recycling (ECLSS / MOXIE):** High power = 90% closed-loop recycling and O2 surplus; low power = hypoxia and dehydration hazard.
- **Hydroponic Food Dome:** High power = fresh astronaut crops and morale bonuses; low power = wilting crops and forced rationing.
- **Active Thermal & Radiation Shielding:** Maintains 22°C cabin temperature against outer space (-170°C in lunar shadow) and operates regolith sintering rovers.
- **Science & ISRU Mining Rovers:** Drills subsurface water-ice in permanently shadowed craters, replenishing long-term reserves at the cost of high battery draw.

### 4. Real-Time Pre-Flight Calculator ("Consequence Preview")
Before advancing to the next Sol, the dashboard calculates and visualizes projected deltas (e.g., `Battery: -15 kWh`, `O2: +1.2 kg`, `Radiation: 0.28 mSv/day`, `Cabin Temp: 22.0°C`), allowing players to experiment with trade-offs before committing.

### 5. Dynamic Space Crises (Every 2–3 Sols)
Authentic crisis scenarios derived from real mission telemetry:
- **Moon:** Sol 3 SOHO/DONKI Solar Flare, Sol 6 ChaSTE 72-Hour Eclipse (-170°C), Sol 8 Artemis Water-Ice Strike.
- **Mars:** Sol 3 MEDA Dust Storm (Tau = 3.5), Sol 6 ISS WRS Filter Valve Degradation, Sol 8 MOXIE In-Situ High Pressure Front.
Each crisis offers 3 distinct engineering directives with transparent trade-offs—no single "free lunch" choice!

### 6. "What-If Time Machine" (Non-Punitive Failure Analysis)
Failure is a natural part of aerospace engineering. If a base runs out of power or oxygen, Outpost Zero displays an **Engineering Failure Analysis** modal explaining the root cause using real NASA physics and allows the player to **⏪ Rewind 1 Sol & Adjust Trade-Offs** or restart.

### 7. End-of-Mission Telemetry Report & Junior Astronaut Certificate
Upon surviving Sol 10, players receive a printable, customizable **Certified Junior Astronaut Flight Director** certificate with their callsign, final efficiency score, trade-offs mastered, a 1-click shareable text summary, and procedural victory fanfare with confetti!

### 8. Live NASA Space Weather API (DONKI) Integration
A dedicated header button syncs real-time solar flare (`FLR`) data directly from `https://api.nasa.gov/DONKI/FLR` with a 4-second timeout and graceful fallback to curated historical NASA X-class flare datasets (`🟢 LIVE NASA DONKI TELEMETRY` or `🔵 CURATED NASA HISTORICAL DATASET`).

### 9. Procedural Web Audio API Synthesizer
Built-in procedural audio engine (button clicks, radar pings, emergency klaxons, victory fanfares, and failure drones) requiring **zero external MP3 files**, ensuring zero latency, zero bandwidth overhead, and complete offline capability.

---

## 🔬 Scientific Foundations & Datasets Cited
1. **NASA-STD-3001 Vol 2:** Baseline 4-crew metabolic demand (`0.96 kg O2/day`, `3.87 L water/day`, `3,035 kcal/day`).
2. **ISS ECLSS Operations:** 90% water recycling efficiency at nominal power (3.5 kW), dropping to 50% under brownouts.
3. **ISRO Chandrayaan-3 ChaSTE (2023):** Groundbreaking discovery of a steep 60°C temperature drop within just 10 cm of lunar regolith depth.
4. **NASA Mars 2020 Perseverance MOXIE & MEDA:** Solid Oxide Electrolysis (SOXE) oxygen generation from atmospheric CO2 at ~3.0 kW and atmospheric optical depth (Tau) impact during dust storms.
5. **NASA OLTARIS & LRO CRaTER:** Galactic Cosmic Ray (GCR) and Solar Particle Event (SPE) dosimetry and regolith half-value thickness (~22.5 cm).

---

## 💻 Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS with custom obsidian deep space theme (`#070B19`)
- **Telemetry Charts:** Recharts
- **Audio Engine:** Procedural Web Audio API Sound Synthesizer
- **Celebration Effects:** Canvas Confetti
- **Icons & Badges:** Lucide React + Custom Procedural SVG Badges
- **State & Persistence:** Client-Side `localStorage` with zero login requirements

---

## 🛠️ Local Development & Quickstart
```bash
# Clone the repository
git clone https://github.com/team-parakram/outpost-zero.git

# Navigate into the project directory
cd outpost-zero

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 👥 Credits
Created with passion by **Team Parakram** for the **2026 NASA Space Apps Challenge**.
Dedicated to inspiring the next generation of engineers, scientists, and astronauts who will build humanity's permanent home among the stars!
