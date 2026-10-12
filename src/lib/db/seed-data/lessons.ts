export interface SeedQuestion {
  text: string;
  domain: string;
  explanation: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface SeedContentBlock {
  sectionTitle: string;
  blockType: string;
  contentMarkdown: string;
}

export interface SeedLesson {
  dayNumber: number;
  bootcampDayNumber?: number | null;
  title: string;
  slug: string;
  summary: string;
  estimatedMinutes: number;
  competencyDomain: string;
  objectives: string[];
  prerequisites: string[];
  contentBlocks: SeedContentBlock[];
  questions: SeedQuestion[];
  sourceRef: {
    title: string;
    citation: string;
    confidenceLevel: string;
    notes: string;
  };
}

export const seedTracks = [
  {
    id: "trk_bootcamp",
    slug: "bootcamp",
    title: "Track A: 3-Day Interview Bootcamp",
    subtitle: "High-intensity 8-hour sprint for immediate interview readiness",
    description: "Designed specifically for candidates with an upcoming interview. Focuses on core CGS ORIS business lines, systematic inkjet fault isolation, safety principles, and STAR interview delivery.",
    total_days: 3,
    estimated_hours: 8.0,
    sort_order: 1,
  },
  {
    id: "trk_course_14",
    slug: "course_14",
    title: "Track B: Full 14-Day Technical Course",
    subtitle: "Comprehensive industrial printing systems and field service curriculum",
    description: "A complete professional training program covering Platinum printer architecture, METIS scanning optics, ORIS color management, LOTO safety, advanced diagnostic isolation, and field commissioning.",
    total_days: 14,
    estimated_hours: 21.0,
    sort_order: 2,
  },
];

export const seedModules = [
  { id: "mod_foundation", title: "Module 1: Foundations & Architecture", slug: "foundations", category: "systems", sortOrder: 1 },
  { id: "mod_hardware_safety", title: "Module 2: Hardware, Motion & Safety", slug: "hardware-safety", category: "hardware", sortOrder: 2 },
  { id: "mod_imaging_color", title: "Module 3: Color Science & Workflow Software", slug: "color-workflow", category: "color", sortOrder: 3 },
  { id: "mod_scanning", title: "Module 4: METIS Material Scanning", slug: "metis-scanning", category: "scanning", sortOrder: 4 },
  { id: "mod_field_ops", title: "Module 5: Field Operations & Advanced Diagnostics", slug: "field-operations", category: "operations", sortOrder: 5 },
  { id: "mod_interview", title: "Module 6: Professional Mastery & Interview Simulation", slug: "interview-mastery", category: "interview", sortOrder: 6 },
];

export const seedLessons: SeedLesson[] = [
  // DAY 1
  {
    dayNumber: 1,
    bootcampDayNumber: 1,
    title: "CGS ORIS and the Field Service Mission",
    slug: "day-01-cgs-oris-and-field-service",
    summary: "Master the structure of CGS ORIS Americas, the Plymouth MN operations hub, core product portfolios (ORIS, METIS, Platinum), and the daily reality of an FST.",
    estimatedMinutes: 90,
    competencyDomain: "company_interview",
    objectives: [
      "Articulate CGS ORIS Americas' market position in high-end proofing, color management, industrial flatbed printing, and scanning.",
      "Differentiate between ORIS software, METIS high-resolution fine-art/decor scanners, and Platinum industrial printer product lines.",
      "Define the responsibilities of a Field Service Technician across pre-shipment, commissioning, on-site diagnostics, and customer training.",
      "Formulate a compelling 60-90 second personal elevator pitch connecting past technical experience to the Plymouth MN field service team."
    ],
    prerequisites: ["General understanding of technical field support", "Basic mechanical or electrical background"],
    sourceRef: {
      title: "CGS ORIS Americas Field Service Role Specification",
      citation: "CGS ORIS Corporate Overview, Plymouth MN Operations 2024-2026",
      confidenceLevel: "confirmed_spec",
      notes: "Corporate structure, Plymouth headquarters demo/bench testing facility, and multi-vendor portfolio distribution."
    },
    contentBlocks: [
      {
        sectionTitle: "Company History and Global Footprint",
        blockType: "teaching",
        contentMarkdown: `### The Evolution of CGS Publishing Technologies to CGS ORIS

Founded in 1985 in Germany (CGS Publishing Technologies International GmbH), CGS ORIS transformed the commercial prepress industry by introducing software-based contract color proofing. Before digital inkjet proofing, print houses spent hundreds of dollars creating chemical laminate proofs (such as DuPont Matchprint) for every press run. CGS revolutionized this with algorithmic color conversion, enabling standard inkjet printers to emulate multimillion-dollar offset, gravure, and flexographic presses.

### CGS ORIS Americas Operations
In the Americas, operations are headquartered in **Plymouth, Minnesota**. This facility serves as:
1. **The Technology Demonstration Center**: Hosting prospective commercial, packaging, and industrial decor clients.
2. **Pre-Shipment Staging & Bench Testing Facility**: Where Platinum flatbed printers and METIS scanners are uncreated, assembled, powered, calibrated, and subjected to burn-in tests prior to customer delivery.
3. **Training & Technical Support Depot**: Housing spare parts inventory, calibration instrumentation, and the technical escalation team.

### Critical Operating Principle
*Do not treat CGS ORIS, METIS, and Platinum as one single homogeneous machine.* CGS ORIS Americas acts as the premier technology integration partner. They combine:
- Proprietary ORIS color management software.
- High-precision Italian-manufactured METIS fine-art and decor surface scanners.
- Platinum Technologies industrial UV-LED and hybrid printing platforms.
Customers may purchase an entire turnkey line or utilize individual components within existing press environments.`
      },
      {
        sectionTitle: "The Field Service Technician Role: Core Responsibilities",
        blockType: "teaching",
        contentMarkdown: `### The Four Pillars of the Field Service Technician (FST)

As a Field Service Technician for CGS ORIS Americas, you are the face of the company in demanding production environments:

1. **Pre-Shipment Testing & Staging (Plymouth, MN)**
   - Uncrating crated chassis, inspecting for transit damage, verifying power supplies and transformer taps.
   - Performing initial mechanical leveling, cable harness routing, and firmware flashing.
   - Running factory burn-in test patterns and nozzle health certifications before re-packing for customer dispatch.

2. **On-Site Installation and Commissioning**
   - Facility environmental audit: verifying dedicated electrical supplies (e.g. 208-240V 3-phase), compressed air filtration, HVAC stability (68-75°F, 40-60% RH).
   - Precision mechanical alignment: gantry squaring, carriage height leveling, vacuum bed flatness dial-indicator verification.
   - Ink system priming: negative pressure meniscus setup, purge cycles, UV curing lamp irradiance verification.
   - RIP integration and network commissioning.

3. **Diagnostic Troubleshooting and Emergency Escalation**
   - Responding to down-machine events on customer production floors.
   - Systematic fault isolation across electrical, hydraulic/ink supply, pneumatic, mechanical motion, and software domains.
   - Safe execution under OSHA Lockout/Tagout (LOTO) protocols.

4. **Operator Training & Relationship Management**
   - Training client operators on daily preventive maintenance (capping station swabs, wiper blade cleaning, negative pressure monitoring).
   - Documenting service calls meticulously in formal service tickets to track recurring failure modes.`
      },
      {
        sectionTitle: "Travel, Autonomy, and Trade Show Deployments",
        blockType: "teaching",
        contentMarkdown: `### The Realities of Industrial Field Travel
The FST position typically involves **50% to 75% travel** across North America, occasionally including international training visits. 

Key attributes required for success:
- **Independent Problem Solving**: You will often be alone on a client's factory floor at 8:00 PM with an expensive production line halted. You must remain calm, adhere to structured diagnostic isolation, and avoid guessing.
- **Logistics & Inventory Discipline**: Keeping a clean vehicle/flight kit with calibrated multi-meters, dial test indicators, torque wrenches, lint-free swabs, optical magnifiers, and emergency spare boards.
- **Trade Show & Exhibition Support**: Setting up high-profile live demonstration booths at events like PRINTING United, ISA Sign Expo, and Coverings. In these environments, machines must run flawlessly under harsh temporary power and high ambient foot traffic.`
      },
      {
        sectionTitle: "Annotated Visual Explanation: The Plymouth Support Ecosystem",
        blockType: "visual_explanation",
        contentMarkdown: `### Functional Flow: How Field Service Connects to Engineering

\`\`\`
[ Customer Site / Factory Floor ]
       │
       ▼ (Service Request: Uncured UV Ink / Banding)
[ Level 1: Remote Triage (Plymouth Depot) ]
       │
       ├── Case Resolved via Config/File Correction? ──► [ Closed Ticket ]
       ▼ (No: Hardware or Complex Fault Identified)
[ Level 2: FST Dispatched with Target Spares & Spec Sheet ]
       │
       ├── Site Safety & Environmental Check
       ├── Physical Diagnostic Tree Execution
       ├── Hardware Repair / Alignment / Recalibration
       ▼
[ Level 3: Escalation to Factory Engineering (Germany / Italy / OEM) ]
       │ (When firmware bugs or unresolvable board logic occur)
       ▼
[ Verification & Customer Acceptance Signoff ]
\`\`\`

**Key Takeaway**: The technician is never completely isolated; you are supported by technical specialists in Plymouth and OEM engineering partners abroad, provided you supply precise, data-driven diagnostic logs.`
      },
      {
        sectionTitle: "Realistic Field Case Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #101: The \"Defective\" UV Lamp Call
**Location:** Packaging Mockup Plant, Chicago, IL.  
**Complaint:** Customer called Plymouth dispatch stating their Platinum UV flatbed was failing to cure ink on polypropylene sheets, leaving tacky surfaces. Customer demanded an emergency $4,000 UV LED lamp head replacement.

**FST Action On Site:**
1. Performed LOTO, verified lamp power harness connections.
2. Rather than immediately opening the sealed lamp assembly, the technician measured the quartz protective window. It was coated with a heavy film of atomized aerosol ink mist caused by the customer disabling the carriage vacuum exhaust.
3. Cleaned the quartz window with optical-grade isopropyl alcohol and measured UV irradiance using a calibrated radiometer. Output jumped from 180 mW/cm² back to 850 mW/cm² (normal operating spec).
4. Re-enabled the exhaust vacuum and trained the lead operator on daily quartz window inspection.

**Result:** Solved in 45 minutes with zero parts cost. Customer saved $4,000 and avoided 3 days of machine downtime. Exemplary field service documentation filed.`
      },
      {
        sectionTitle: "Interactive Practice: 60-90 Second Elevator Pitch Builder",
        blockType: "interactive_practice",
        contentMarkdown: `### Exercise: Constructing Your Interview Introduction

When asked *"Tell us about yourself and why you want to be a Field Service Technician for CGS ORIS Americas,"* structure your answer in four parts:

1. **The Hook (Past Foundation):** Your background in electromechanical systems, industrial maintenance, print technology, or instrumentation.
2. **The Transferable Skill (Diagnostic Method):** How you approach complex, intermittent problems using systematic root-cause isolation rather than guesswork.
3. **The Customer/Field Focus:** Comfort with independent travel, working calmly under production pressure, and clear communication with plant managers.
4. **The CGS ORIS Connection:** Why CGS ORIS—specifically their unique intersection of high-precision METIS scanning, advanced ORIS color management, and Platinum industrial hardware.`
      },
      {
        sectionTitle: "Summary, Review & Printable Reference",
        blockType: "summary_review",
        contentMarkdown: `### Key Takeaways for Day 1
- CGS ORIS Americas operates out of **Plymouth, Minnesota**.
- Three primary hardware and software pillars: **ORIS Software** (Color Tuner, Press Matcher, X Gamut), **METIS Scanners** (PM3D Hawk, DRS, EDS), and **Platinum Technologies Printers** (UV-LED flatbed/hybrid).
- FST work balances technical precision (leveling, optics, hydraulics, electrical) with customer de-escalation and safety discipline.
- Always perform evidence-based diagnosis before replacing expensive assemblies.`
      }
    ],
    questions: [
      {
        text: "Where is CGS ORIS Americas headquartered, and what primary operational activities take place there?",
        domain: "company_interview",
        explanation: "CGS ORIS Americas is based in Plymouth, MN, where they maintain a demonstration center, pre-shipment bench testing/staging depot, and technical training facilities.",
        options: [
          { text: "Plymouth, Minnesota; housing demonstration, staging, pre-shipment testing, and technical support.", isCorrect: true, explanation: "Correct. Plymouth MN is the core operations center for CGS ORIS Americas." },
          { text: "Frankfurt, Germany; handling worldwide software distribution only.", isCorrect: false, explanation: "Germany is the global corporate origin, but Americas operations are in Plymouth, MN." },
          { text: "Atlanta, Georgia; acting solely as a remote call center.", isCorrect: false, explanation: "Incorrect. CGS ORIS Americas is in Plymouth, MN." },
          { text: "Chicago, Illinois; manufacturing heavy industrial steel gantry frames.", isCorrect: false, explanation: "Incorrect. Platinum frames are built by manufacturing partners, not manufactured in Chicago." }
        ]
      },
      {
        text: "Which statement accurately describes the relationship between CGS ORIS, METIS, and Platinum Technologies?",
        domain: "company_interview",
        explanation: "CGS ORIS Americas integrates and distributes proprietary ORIS color management software alongside METIS high-resolution scanning hardware and Platinum industrial printing systems.",
        options: [
          { text: "Every METIS scanner, ORIS software package, and Platinum printer operates as a single mandatory, inseparable machine.", isCorrect: false, explanation: "Incorrect. The three product lines address distinct workflows and can be purchased or integrated independently." },
          { text: "CGS ORIS Americas acts as an integration and distribution partner, combining proprietary ORIS software with METIS scanning hardware and Platinum printing platforms.", isCorrect: true, explanation: "Correct. They serve overlapping and independent markets with tailored combinations." },
          { text: "METIS owns Platinum Technologies, and CGS ORIS is purely an outsourced software reseller with no technical field support.", isCorrect: false, explanation: "Incorrect. CGS ORIS provides full hands-on technical field service." },
          { text: "Platinum printers can only print images scanned on METIS scanners through a closed, proprietary file format.", isCorrect: false, explanation: "Incorrect. Standard open formats (TIFF, PDF) and standard RIP architectures are utilized." }
        ]
      },
      {
        text: "A customer reports that a newly delivered Platinum flatbed printer has poor print quality. What is the FST's FIRST responsibility upon arrival?",
        domain: "hardware_safety",
        explanation: "Before touching machine components or assuming a component is broken, the technician must verify site environmental conditions, electrical safety, and establish observable baseline symptoms.",
        options: [
          { text: "Immediately replace all printheads under factory warranty.", isCorrect: false, explanation: "Replacing printheads without diagnostic evidence is costly, wasteful, and often fails to fix the root cause." },
          { text: "Perform a safety assessment, verify site environmental conditions (power, temperature, humidity), and run a controlled test print to observe baseline symptoms.", isCorrect: true, explanation: "Correct. Controlled baseline observation and environmental verification must precede any hardware intervention." },
          { text: "Inform the customer that their artwork file is defective and leave the site.", isCorrect: false, explanation: "Unprofessional and unsupported without running standardized diagnostic test files." },
          { text: "Bypass the carriage safety interlocks to watch the nozzles fire during high-speed printing.", isCorrect: false, explanation: "Severe safety violation. Bypassing interlocks creates severe mechanical and UV radiation hazards." }
        ]
      },
      {
        text: "What percentage of travel should an FST typically anticipate in this role, and what is the primary operational mode?",
        domain: "company_interview",
        explanation: "The role demands approximately 50% to 75% regional and national travel with high operational autonomy at customer production facilities.",
        options: [
          { text: "100% remote desk support from a home office with no field travel.", isCorrect: false, explanation: "Incorrect. Field service requires physical on-site deployment." },
          { text: "50% to 75% travel across customer facilities, trade shows, and staging deployments, requiring strong independent problem-solving.", isCorrect: true, explanation: "Correct. Travel and autonomous problem-solving are central to the position." },
          { text: "Exclusively local travel within a 10-mile radius of Plymouth, MN.", isCorrect: false, explanation: "Incorrect. CGS ORIS Americas covers clients across North America." },
          { text: "Travel only occurs if a major customer files a lawsuit.", isCorrect: false, explanation: "Incorrect. Routine installations, maintenance, and scheduled visits comprise the standard workflow." }
        ]
      },
      {
        text: "During a pre-shipment staging procedure in Plymouth, MN, which of the following is considered an essential validation task?",
        domain: "customer_docs",
        explanation: "Pre-shipment staging requires verifying mechanical squaring, leveling, electrical supply tolerances, firmware integrity, and running factory burn-in test patterns.",
        options: [
          { text: "Disassembling the gantry completely and shipping it in loose bags.", isCorrect: false, explanation: "Incorrect and absurd." },
          { text: "Verifying mechanical alignment, electrical bus tolerances, firmware updates, and running extended burn-in diagnostic test prints.", isCorrect: true, explanation: "Correct. Staging ensures the machine leaves Plymouth in 100% verified operational condition." },
          { text: "Signing off the machine without uncrating to save labor hours.", isCorrect: false, explanation: "Dangerous failure of quality assurance." },
          { text: "Refilling ink tanks with standard tap water to test nozzle hydraulics.", isCorrect: false, explanation: "Catastrophic. Water can destroy industrial solvent or UV printheads and cause corrosion." }
        ]
      }
    ]
  },

  // DAY 2
  {
    dayNumber: 2,
    bootcampDayNumber: 1,
    title: "The Complete Digital Imaging and Printing Workflow",
    slug: "day-02-complete-digital-imaging-workflow",
    summary: "Trace the full lifecycle of an image: from METIS optical capture or digital PDF through ORIS color management, RIP rasterization, industrial printing, and spectrophotometric verification.",
    estimatedMinutes: 90,
    competencyDomain: "color_oris",
    objectives: [
      "Diagram the complete production sequence from raw physical specimen to final cured output.",
      "Identify the distinct roles of CGS ORIS software applications (Color Tuner, Press Matcher, X Gamut) within the pipeline.",
      "Explain how a Raster Image Processor (RIP) translates vector and continuous-tone pixels into screened 1-bit or multi-drop printhead firing instructions.",
      "Trace the closed-loop feedback mechanism from post-cure spectrophotometer readings back into device color profiles."
    ],
    prerequisites: ["Day 1 overview of CGS ORIS and industrial printing"],
    sourceRef: {
      title: "Digital Prepress and Industrial Workflow Architecture",
      citation: "ISO 12647 Print Standards & CGS ORIS Technical Workflow Whitepaper",
      confidenceLevel: "industry_standard",
      notes: "Standard industrial color management and RIP screening pipeline."
    },
    contentBlocks: [
      {
        sectionTitle: "End-to-End Workflow Architecture",
        blockType: "teaching",
        contentMarkdown: `### The Seven Stages of Industrial Imaging & Printing

The CGS ORIS ecosystem bridges physical capture, precision color mathematics, raster screening, mechanical deposition, and quality verification:

\`\`\`
[ Stage 1: Input / Artwork / Substrate Scan ]
    ├── Direct Digital Vector/Raster (PDF/X, TIFF, AI)
    └── Physical Material Surface (Wood, Leather, Ceramic, Decor) 
             │
             ▼
[ Stage 2: METIS Advanced Capture ]
    ├── Synchronized Directional Illumination (DC LED)
    ├── Photometric Stereo (3D Surface Relief / Height Maps)
    └── Colorimetric Camera Sensor Output (Raw / 16-bit TIFF)
             │
             ▼
[ Stage 3: CGS ORIS Color Management & Proofing ]
    ├── ORIS COLOR TUNER (Contract Proofing & Spot Color Matching)
    ├── ORIS PRESS MATCHER (Digital Press Standardization & G7/FOGRA)
    ├── ORIS X GAMUT (Extended Color Gamut 7-Color CMYK+OGV Separation)
    └── CxF TOOLBOX (Exact Spectral Color Communication)
             │
             ▼
[ Stage 4: Raster Image Processing (RIP) ]
    ├── PostScript/PDF Interpreter (Color space conversion, Trapping)
    ├── Halftone Screening (AM/FM or Error Diffusion)
    └── Multi-bit Dot Generation (Picoliter drop sizing: 6pl, 12pl, 18pl)
             │
             ▼
[ Stage 5: Industrial Printer Controller & Motion ]
    ├── Gigabit Ethernet Buffer / Optical Fiber Data Link
    ├── Linear Encoder Position Sync (X-axis carriage & Y-axis media)
    └── Piezoelectric Waveform Triggering (PZT element pulse width)
             │
             ▼
[ Stage 6: Deposition & UV Curing / Drying ]
    ├── Micro-drop Jetting (10,000–30,000 drops/second per nozzle)
    └── UV-LED Irradiation (395nm Photopolymerization Free-Radical Cure)
             │
             ▼
[ Stage 7: Measurement, Inspection & Feedback Loop ]
    ├── Spectrophotometer Measurement (CIELAB ΔE00 verification)
    ├── ORIS CERTIFIED & EVALUATE (Pass/Fail conformity report)
    └── Iterative Curve Update (Feedback to RIP / Press Matcher)
\`\`\``
      },
      {
        sectionTitle: "Software Differentiation: Matching ORIS Tools to Workflow Nodes",
        blockType: "teaching",
        contentMarkdown: `### Why One Software Tool Cannot Do Everything
Field service technicians frequently encounter customers attempting to use the wrong software module for their production goal. Understanding these distinctions is critical for on-site diagnostic conversations:

- **ORIS COLOR TUNER**: The world benchmark for contract digital proofing. Used to produce legally binding contract proofs on calibrated inkjet systems (e.g. Epson/Canon) before going to high-speed offset or flexo presses.
- **ORIS PRESS MATCHER**: Built for production normalization. When a customer has three different digital presses (e.g., an HP Indigo, a Platinum UV flatbed, and a Ricoh roll printer), Press Matcher balances all three so the same job looks identical on all three devices.
- **ORIS X GAMUT**: Multi-color separation software for extended color gamut (ECG) printing. It converts spot colors (Pantones) into a fixed set of 7 process inks (CMYK + Orange, Green, Violet), eliminating expensive press wash-ups and spot-ink mixing.
- **ORIS FLEX PACK**: Specialized packaging proofing system enabling direct printing on original production substrates (shrink films, foils, carton board) with white and metallic ink management.
- **ORIS CERTIFIED & EVALUATE**: Automated cloud or local quality-control tool that reads color control strips, computes Delta E against ISO/GRACoL/G7 standards, and prints a compliance label.`
      },
      {
        sectionTitle: "The Anatomy of a RIP (Raster Image Processor)",
        blockType: "teaching",
        contentMarkdown: `### What Happens Inside the RIP?
A common misconception is that a printer directly prints a PDF. In reality, modern industrial printheads cannot interpret vector shapes, curves, or RGB/CMYK continuous-tone values.

The RIP performs three mandatory tasks:
1. **Interpretation & Normalization**: Decomposing PDF/X objects, transparency blending, and converting embedded RGB or Pantone data into the target printer's color space via DeviceLink ICC profiles.
2. **Screening (Dithering)**: Continuous-tone images (0-255 tonal levels per pixel) are transformed into discrete dot patterns. 
   - *Binary Screening*: Drop / No-Drop.
   - *Multi-Drop (Grayscale) Screening*: Selecting drop volume sizes (e.g., Small = 6 pL, Medium = 14 pL, Large = 24 pL) by modulating electrical pulse waveforms applied to the piezoelectric crystal.
3. **Band Slicing & Fire Order Generation**: Organizing millions of dots into synchronized swaths corresponding precisely to the nozzle rows on the carriage and the encoder pulse frequency.`
      },
      {
        sectionTitle: "Closed-Loop Feedback: The Color Correction Loop",
        blockType: "visual_explanation",
        contentMarkdown: `### How Color Accuracy Is Maintained Over Time

Even the best industrial printer experiences drift due to:
- Temperature fluctuations altering ink viscosity.
- UV LED lamp output decay over thousands of operating hours.
- Batch-to-batch substrate coating differences.

\`\`\`
[ Test Target Printed ] ──► [ Spectrophotometer Scan (e.g., i1Pro3) ]
                                            │
                                            ▼
                           [ Measure CIELAB Spectral Values ]
                                            │
                                            ▼
                           [ Calculate ΔE00 against Reference ]
                                            │
               ┌────────────────────────────┴──────────────────────────┐
               ▼                                                       ▼
        [ ΔE00 <= 1.5 ]                                         [ ΔE00 > 1.5 ]
      Pass Certification                                  Linearization Curves Updated
   (Apply Certified Label)                              (Feed into ORIS Press Matcher)
                                                                       │
                                                                       ▼
                                                          [ Regenerate DeviceLink Profile ]
\`\`\`

Without this closed loop, field technicians will waste hours chasing \"hardware defects\" that are actually uncompensated mechanical or optical drift.`
      },
      {
        sectionTitle: "Realistic Field Case Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #102: The \"Wrong Color\" Finger-Pointing Match
**Location:** Industrial Packaging Converter, Minneapolis, MN.  
**Complaint:** Brand owner rejected 5,000 corrugated display cartons because the corporate brand red was printing \"dull and brownish\" on their Platinum hybrid UV printer. The prepress department blamed the printer's printheads; the press operator blamed the ink batch.

**FST Investigation:**
1. Ran a standard nozzle check: all cyan, magenta, yellow, black, and light nozzles were firing with zero missing or deflected jets.
2. Checked the RIP job settings: the prepress operator had applied a generic coated paper ICC profile (GRACoL 2013) to an uncoated, recycled kraft corrugated board.
3. Used a spectrophotometer to measure the unprinted substrate. The raw kraft board had an L*a*b* of (68, +5, +22)—heavily yellow-brown, drastically shifting the base white point.
4. Generated an updated substrate-specific profile using ORIS Press Matcher with white-ink underprint compensation.

**Result:** Delta E dropped from an unacceptable 6.8 down to 1.2. The customer avoided scrapping $12,000 in corrugated stock and signed off on production.`
      },
      {
        sectionTitle: "Interactive Practice & Summary",
        blockType: "interactive_practice",
        contentMarkdown: `### Diagnostic Questioning Drill: Isolating Workflow vs Hardware

When a customer complains of an image artifact, ask these three filtering questions:
1. *Does the artifact appear in the identical spatial position on every single print?*  
   - If **YES**, it is almost always digital/RIP/file-related (e.g., corrupted raster, rendering glitch).
   - If **NO** (moves or drifts), it is mechanical, encoder, or media feed related.
2. *Does the issue affect all colors or only one ink channel?*  
   - If **ONE channel**, inspect printhead, damper, ink supply line, or meniscus sub-tank for that channel.
   - If **ALL channels**, inspect carriage motion, encoder strip, gantry leveling, UV curing, or global RIP settings.
3. *Did this job ever print correctly on this exact media roll/batch?*  
   - Helps isolate recent operator profile changes or substrate lot variation.`
      }
    ],
    questions: [
      {
        text: "What is the primary role of a Raster Image Processor (RIP) in an industrial printing workflow?",
        domain: "color_oris",
        explanation: "A RIP interprets vector and image data, applies color management profiles, and screens continuous-tone graphics into discrete multi-drop or 1-bit dot matrices for printhead firing.",
        options: [
          { text: "It converts vector and continuous-tone pixels into screened micro-dot firing patterns matching printhead nozzle geometry.", isCorrect: true, explanation: "Correct. The RIP translates high-level artwork into raw droplet deposition instructions." },
          { text: "It mechanically pumps ink from main reservoirs into the printhead sub-tanks.", isCorrect: false, explanation: "Incorrect. That is the function of the pneumatic/ink delivery system." },
          { text: "It generates physical 3D relief on the surface of paper using heat compression.", isCorrect: false, explanation: "Incorrect. That is an embossing or structured UV print effect, not the RIP core definition." },
          { text: "It monitors the electrical ground wiring of the main facility.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "Which CGS ORIS software package is specifically designed to normalize color output across multiple different digital press models?",
        domain: "color_oris",
        explanation: "ORIS PRESS MATCHER is built to standardize and harmonize color reproduction across disparate press architectures.",
        options: [
          { text: "ORIS PRESS MATCHER", isCorrect: true, explanation: "Correct. Press Matcher synchronizes diverse output devices to common standards." },
          { text: "ORIS COLOR TUNER", isCorrect: false, explanation: "Color Tuner is primarily focused on high-precision contract proofing." },
          { text: "ORIS X GAMUT", isCorrect: false, explanation: "X Gamut specializes in extended color gamut (CMYK+OGV) spot-color reproduction." },
          { text: "ORIS CxF TOOLBOX", isCorrect: false, explanation: "CxF Toolbox handles spectral color communication and digital swatch standards." }
        ]
      },
      {
        text: "In an industrial UV inkjet printing system, how is multi-drop (grayscale) printing achieved?",
        domain: "hardware_safety",
        explanation: "Grayscale printing modulates the piezoelectric electrical waveform to eject varying drop sizes (e.g., small, medium, large picoliters) per pixel location.",
        options: [
          { text: "By physically moving the printhead closer and farther from the paper during each pass.", isCorrect: false, explanation: "Incorrect. Printhead height is fixed during printing to avoid collisions." },
          { text: "By modulating the electrical voltage waveform to the piezo crystal, dispensing small, medium, or large droplet volumes.", isCorrect: true, explanation: "Correct. Waveform pulse shape determines acoustic pressure and ejected drop volume." },
          { text: "By diluting the ink with cleaning flush solvent inside the carriage in real time.", isCorrect: false, explanation: "Incorrect. Solvents are never mixed into live ink during printing." },
          { text: "By turning the UV curing lamp on and off between individual dots.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "If a severe color shift occurs immediately after a customer switches from bright white gloss vinyl to unbleached kraft board, what is the most probable cause?",
        domain: "color_oris",
        explanation: "Substrate white point dramatically alters perceived color; switching substrates without updating the ICC profile or applying white underprint shifts all chromatic values.",
        options: [
          { text: "A blown electrical fuse on the main carriage board.", isCorrect: false, explanation: "A blown fuse would halt the machine or disable an entire printhead, not merely shift color." },
          { text: "The substrate white point and absorption characteristics changed drastically, requiring a substrate-specific profile or white ink underprint.", isCorrect: true, explanation: "Correct. Color appearance depends directly on substrate reflectance and white point." },
          { text: "The linear encoder strip needs to be lubricated with machine oil.", isCorrect: false, explanation: "Oil on an optical encoder will destroy optical tracking and cause carriage crashes." },
          { text: "The RIP license has expired.", isCorrect: false, explanation: "An expired license stops job output altogether or prints demo watermarks." }
        ]
      },
      {
        text: "In the CGS ORIS workflow, what is the function of ORIS CERTIFIED & EVALUATE?",
        domain: "color_oris",
        explanation: "ORIS CERTIFIED & EVALUATE measures color wedges using a spectrophotometer to verify compliance with industry standards (e.g. GRACoL, Fogra) and prints a certification label.",
        options: [
          { text: "It mechanically recalibrates the drive belt tension on Platinum printers.", isCorrect: false, explanation: "Incorrect. Certified & Evaluate is pure measurement software." },
          { text: "It measures printed color targets against international standards (ISO/G7) to provide statistical quality verification and pass/fail reports.", isCorrect: true, explanation: "Correct. It ensures output meets agreed-upon tolerance criteria." },
          { text: "It detects missing physical nozzles using optical laser cameras.", isCorrect: false, explanation: "Incorrect." },
          { text: "It speeds up printhead carriage velocity by 50%.", isCorrect: false, explanation: "Incorrect." }
        ]
      }
    ]
  },

  // DAY 3
  {
    dayNumber: 3,
    bootcampDayNumber: 2,
    title: "Equipment Safety and OSHA LOTO Principles",
    slug: "day-03-equipment-safety-and-loto-principles",
    summary: "Master life-safety protocols on industrial printing equipment: OSHA 29 CFR 1910.147 Lockout/Tagout, 208-480V 3-phase electrical hazard mitigation, UV-LED radiation shielding, and ink SDS chemistry.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Explain the mandatory difference between an Emergency Stop (E-Stop) and true Lockout/Tagout (LOTO) energy isolation.",
      "Identify the high-voltage, mechanical pinch, and optical radiation hazard zones on industrial flatbed/hybrid printers.",
      "Select appropriate Personal Protective Equipment (PPE) for chemical ink handling, solvent flushing, and UV emitter testing.",
      "Formulate safe escalation procedures when encountering unauthorized customer safety bypasses or damaged interlocks."
    ],
    prerequisites: ["Day 1-2 system overviews"],
    sourceRef: {
      title: "OSHA Standard 29 CFR 1910.147 (The Control of Hazardous Energy)",
      citation: "U.S. Dept of Labor OSHA & Industrial Printing Safety Manuals",
      confidenceLevel: "industry_standard",
      notes: "Mandatory compliance for all on-site industrial machinery service technicians."
    },
    contentBlocks: [
      {
        sectionTitle: "Lockout/Tagout (LOTO): The Core Distinction",
        blockType: "teaching",
        contentMarkdown: `### The Golden Rule of Industrial Field Service
**AN EMERGENCY STOP (E-STOP) IS NOT ZERO-ENERGY ISOLATION.**

Field technicians are injured or killed when they mistake a software-controlled or interlocked stop for energy isolation. 

#### Why an E-Stop is NOT LOTO:
1. An E-Stop is an electrical control-circuit interrupt. If a relay welds shut, a contact fails, or a PLC logic fault occurs, energy can still flow to servomotors or high-voltage circuits.
2. An E-Stop does not dissipate stored mechanical energy (gravity on raised assemblies, hydraulic pressure, pneumatic reservoirs, or high-voltage capacitor banks).
3. Under OSHA Standard **29 CFR 1910.147**, whenever a technician places any part of their body into a machine hazard zone (such as servicing drive belts, replacing main power supplies, or working on carriage motion rails), **the machine must be mechanically locked out at the primary disconnect switch** and tagged with the technician's personal lock and key.`
      },
      {
        sectionTitle: "Hazard Zones on Platinum Industrial Printers",
        blockType: "teaching",
        contentMarkdown: `### 1. High-Voltage Electrical Hazards (208V–480V AC, 3-Phase)
- Main distribution terminal blocks, step-up/step-down transformers, variable frequency drives (VFDs), and vacuum blower contactors.
- *DC Bus Danger*: Switching power supplies and LED driver boards contain massive electrolytic capacitors that retain lethal DC voltage (60V–400V DC) for several minutes after AC power is disconnected. **Always measure with a calibrated multimeter before touching DC terminals.**

### 2. UV-LED Optical Radiation Hazards (UVA: 365nm–395nm)
- UV-LED curing arrays emit intense, high-radiance ultraviolet light.
- Exposure causes photokeratitis (\"arc eye\" or \"welder's flash\") and photochemical retinal damage, as well as severe skin erythema (burns).
- *Critical Rule*: **NEVER defeat UV shielding curtains or interlock switches to observe active curing lamps with the naked eye.** UV safety glasses rated for 365–405nm optical density (OD 5+) must be worn whenever testing lamps.

### 3. Kinetic & Pinch Hazards
- High-speed carriage movement: Industrial gantries move at speeds up to 1.5 to 2.2 meters per second, driven by high-torque AC servo motors. A gantry can crush fingers, arms, or skull against end-stops.
- Substrate pinch rollers: Spring-loaded nip rollers exert hundreds of pounds of continuous clamping force.`
      },
      {
        sectionTitle: "Chemical Safety: UV Monomers, Photoinitiators, and SDS",
        blockType: "teaching",
        contentMarkdown: `### Understanding UV Ink Chemistry
Unlike water-based or solvent inks that dry by evaporation, UV inks do not dry until exposed to intense ultraviolet radiation. They consist of:
- **Monomers & Oligomers**: Reactive acrylates that penetrate skin and act as severe chemical sensitizers. Repeated skin contact causes permanent allergic contact dermatitis.
- **Photoinitiators**: Absorb UV photons to generate free radicals that trigger polymerization. Many photoinitiators are toxic if absorbed through the skin.

### Mandatory Chemical PPE:
1. **Gloves**: Standard thin household latex gloves degrade within seconds when exposed to raw UV monomers. **Nitrile gloves (minimum 5-8 mil thickness)** or chemical-resistant butyl gloves must be worn. Change gloves immediately if ink splashes on them.
2. **Eye Protection**: Chemical splash goggles when handling liquid ink bottles, waste tanks, or flushing lines.
3. **Spill Management**: Always have an absorbent spill kit on hand. Dispose of uncured ink waste according to local EPA hazardous waste regulations—never wash down municipal drains.`
      },
      {
        sectionTitle: "Annotated Visual: The Six Steps of Safe LOTO Execution",
        blockType: "visual_explanation",
        contentMarkdown: `### The OSHA LOTO Sequence for Field Technicians

\`\`\`
[ Step 1: Preparation ]
   └── Notify customer plant manager & machine operators of shutdown.
          │
          ▼
[ Step 2: Orderly Shutdown ]
   └── Park carriage in capping station; shut down controller software cleanly.
          │
          ▼
[ Step 3: Energy Isolation ]
   └── Rotate main wall disconnect lever to 'OFF' position.
          │
          ▼
[ Step 4: Lock & Tag Application ]
   └── Apply personal red padlock, hasp, and signed danger tag to disconnect.
          │
          ▼
[ Step 5: Dissipation of Stored Energy ]
   └── Bleed pneumatic pressure regulators; wait 5 mins for capacitor discharge.
          │
          ▼
[ Step 6: Zero-Energy Verification (CRITICAL) ]
   └── Attempt to restart machine using operator panel controls (Verify dead),
   └── Measure voltage L1-L2, L2-L3, L1-L3, and L-to-Ground with multimeter.
\`\`\`

**Rule of Thumb**: Until you physically meter the terminals yourself, treat every wire as energized.`
      },
      {
        sectionTitle: "Realistic Field Case Example: Unauthorized Bypasses",
        blockType: "field_example",
        contentMarkdown: `### Field Case #103: The Taped Safety Interlock
**Location:** Sign & Display Shop, Milwaukee, WI.  
**Situation:** An FST arrived to replace an X-axis carriage belt. Upon inspecting the front gantry cover, the technician discovered the customer had placed heavy duct tape over the magnetic safety interlock switch so operators could open the lid during high-speed printing without tripping the machine.

**FST Action:**
1. The technician immediately stopped work and explained the extreme liability and imminent amputation/UV blindness hazard to the plant manager.
2. Refused to operate the machine until the duct tape was removed and the interlock was tested for proper automatic shutdown functionality.
3. Logged the finding with photographs in the CGS ORIS service management system and had the customer sign an acknowledgment.

**Result:** The customer removed the bypass. A potential catastrophic OSHA citation and serious worker injury were prevented.`
      },
      {
        sectionTitle: "Summary & Review",
        blockType: "summary_review",
        contentMarkdown: `### Safety Summary for the Interview & Field
- **LOTO > E-Stop**: Never rely on an E-Stop when your hands are inside mechanical drive systems or electrical cabinets.
- **Capacitors retain lethal DC charge**: Wait for discharge and measure with a DMM.
- **UV radiation**: Invisible/near-visible high irradiance causes irreversible eye and skin damage. Wear OD5+ rated glasses.
- **Chemical sensitization**: Always wear nitrile gloves when touching ink lines, dampers, printheads, or waste containers.`
      }
    ],
    questions: [
      {
        text: "Why is hitting an Emergency Stop (E-Stop) button insufficient before replacing a gantry drive belt?",
        domain: "hardware_safety",
        explanation: "An E-Stop is a control-circuit interrupt, not an energy isolation device. It does not isolate primary power or prevent inadvertent mechanical motion under OSHA LOTO standards.",
        options: [
          { text: "Because an E-Stop only halts software commands and does not physically isolate primary incoming electrical power or stored mechanical energy.", isCorrect: true, explanation: "Correct. Control circuitry can fail or be bypassed; physical LOTO is mandatory." },
          { text: "Because E-Stops only work when the machine is connected to Wi-Fi.", isCorrect: false, explanation: "Incorrect." },
          { text: "Because pressing an E-Stop permanently destroys the printer's motherboard.", isCorrect: false, explanation: "Incorrect." },
          { text: "Because the E-Stop only cuts power to the vacuum bed.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "What type of gloves must a field service technician wear when handling UV-curable inks and flush solvents?",
        domain: "hardware_safety",
        explanation: "Nitrile or chemical-resistant butyl gloves must be used; standard latex degrades rapidly when contacted by aggressive UV acrylate monomers.",
        options: [
          { text: "Thin natural latex examination gloves.", isCorrect: false, explanation: "Latex breaks down rapidly in contact with UV monomers." },
          { text: "Heavy nitrile (minimum 5-8 mil) or chemical-resistant butyl gloves.", isCorrect: true, explanation: "Correct. Nitrile provides proven chemical barrier resistance against acrylate monomers." },
          { text: "Cotton work gloves for mechanical grip.", isCorrect: false, explanation: "Cotton absorbs liquid ink and presses it directly against the skin, accelerating sensitization." },
          { text: "No gloves are necessary if hands are washed within 30 minutes.", isCorrect: false, explanation: "Dangerous; UV monomers cause permanent allergic sensitization." }
        ]
      },
      {
        text: "What hazard is specifically associated with the large electrolytic capacitors on a printer's DC power supply and servo drives?",
        domain: "hardware_safety",
        explanation: "Capacitors store electrical energy and can deliver lethal DC shocks for several minutes after AC power disconnect; technicians must meter them before touching.",
        options: [
          { text: "They can leak dangerous radioactive gas into the print shop.", isCorrect: false, explanation: "Incorrect." },
          { text: "They retain dangerous or lethal high-voltage DC charge even after the main AC disconnect has been shut off.", isCorrect: true, explanation: "Correct. Always allow discharge time and verify with a multimeter." },
          { text: "They cause printheads to clog if touched by a magnetic screwdriver.", isCorrect: false, explanation: "Incorrect." },
          { text: "They emit harmful ultraviolet radiation when cold.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "You arrive at a customer facility and find the magnetic interlock on the UV carriage cover has been taped down to allow printing with the hood open. What is the required action?",
        domain: "hardware_safety",
        explanation: "Technicians must never service or sign off on machinery with bypassed safety devices. You must cease work, notify management, remove the bypass, and restore interlock integrity.",
        options: [
          { text: "Ignore it and begin working since it makes watching the nozzles easier.", isCorrect: false, explanation: "Severe safety violation." },
          { text: "Refuse to operate or service the machine until the safety bypass is removed, interlocks are tested, and the condition is documented with the plant manager.", isCorrect: true, explanation: "Correct. Safety interlocks must never be bypassed during operation." },
          { text: "Replace the interlock switch with a jumper wire permanently.", isCorrect: false, explanation: "Gross negligence." },
          { text: "Advise the customer to sell the machine.", isCorrect: false, explanation: "Unprofessional and irrelevant." }
        ]
      },
      {
        text: "When testing UV-LED curing lamp output on a Platinum printer, what personal protective equipment is mandatory?",
        domain: "hardware_safety",
        explanation: "UV-rated safety goggles/glasses rated for the specific emission wavelength (e.g. 365-405nm, OD 5+) and skin shielding are mandatory to avoid eye and tissue damage.",
        options: [
          { text: "Standard polarized sunglasses.", isCorrect: false, explanation: "Sunglasses do not provide certified optical density (OD) against high-power industrial UV LEDs." },
          { text: "Certified UV-protective glasses/goggles matching the 365–405nm emitter wavelength (OD 5+) and skin coverage.", isCorrect: true, explanation: "Correct. High-irradiance UV causes acute corneal damage without certified filtering." },
          { text: "Welding helmet with shade 14 dark glass only.", isCorrect: false, explanation: "Too dark to read diagnostic instruments safely; proper OD-rated UV glasses are appropriate." },
          { text: "Earplugs and steel-toe boots only.", isCorrect: false, explanation: "Does not protect eyes from UV radiation." }
        ]
      }
    ]
  },

  // DAY 4
  {
    dayNumber: 4,
    bootcampDayNumber: 1,
    title: "Platinum Printer Architecture and Subsystems",
    slug: "day-04-platinum-printer-architecture-and-subsystems",
    summary: "Deep dive into the 13 core electromechanical subsystems of Platinum industrial UV-LED flatbed and hybrid printers: motion, hydraulics, vacuum, curing, and control electronics.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Identify the 13 major physical subsystems of an industrial flatbed/hybrid printer.",
      "Explain the operational principle of the negative pressure meniscus system and why it prevents nozzle drool and starvation.",
      "Analyze the role of optical linear encoders and magnetic strips in carriage positioning and droplet placement accuracy.",
      "Describe the vacuum bed zoning system and media hold-down mechanics."
    ],
    prerequisites: ["Day 2-3 workflow and safety fundamentals"],
    sourceRef: {
      title: "Industrial Flatbed Printer Architecture Reference",
      citation: "Platinum Technologies Technical Service Manuals & Subsystem Schematics",
      confidenceLevel: "confirmed_spec",
      notes: "Conceptual educational breakdown of industrial UV-LED flatbed architectures."
    },
    contentBlocks: [
      {
        sectionTitle: "Subsystem 1 to 4: Ingestion, Control & Motion",
        blockType: "teaching",
        contentMarkdown: `### 1. RIP & Print-Job Interface
The bridge between the external prepress workstation and the printer. Typically utilizes Gigabit Ethernet (1000BASE-T) or dedicated fiber-optic patch links. High-bandwidth buffering is essential to prevent carriage stutter during large continuous multi-pass files.

### 2. Main Printer Controller (CPU & FPGA Board)
The brain of the machine. The controller synchronizes:
- Motion interpolation (X-axis carriage travel, Y-axis media advance or gantry drive).
- Firing waveform generation via Field Programmable Gate Arrays (FPGA) that blast high-frequency clock pulses to printhead drive boards.
- System health monitoring (vacuum levels, ink tank float switches, UV temperatures).

### 3. Sensors, Interlocks & E-Stop Loops
Hardware-redundant safety circuits incorporating:
- Emergency stop pushbuttons (normally-closed dual-channel safety relays).
- Mechanical crash sensors (\"head-strike bars\") on both sides of the carriage that instantly stop motion if substrate curl is detected.
- Optical beam breaks and cover interlocks.

### 4. Carriage Motion & Drive System
Carries printheads, sub-tanks, UV lamps, and leveling sensors across the X-axis:
- High-precision linear guideways (THK or HIWIN ball-bearing blocks).
- AC brushless servo motor coupled to a steel-reinforced polyurethane timing belt or magnetic linear motor drive.
- Operating speeds reach 1.5 to 2.2 m/s with sub-micron repeatability.`
      },
      {
        sectionTitle: "Subsystem 5 to 7: Encoders, Vacuum & Print Zone",
        blockType: "teaching",
        contentMarkdown: `### 5. Encoders & Positioning System
- **Linear Optical/Magnetic Encoder**: A precision glass or metallic strip etched with 150 to 360 lines per inch (LPI). An optical reader head on the carriage counts transitions, providing instantaneous real-time position feedback to the motion controller.
- *Diagnostic Importance*: A speck of dried ink, dust, or grease on the encoder strip will cause carriage jumps, scale distortion, or catastrophic gantry collisions.

### 6. Vacuum Bed & Substrate Handling
Heavy milled aluminum honeycomb or ribbed plate divided into multiple selectable vacuum zones:
- High-flow regenerative blowers pull air through thousands of micro-orifices.
- Holds rigid substrates (acrylic, glass, wood, aluminum composites) perfectly flat.
- *Air Masking*: Any open vacuum holes not covered by media must be masked with paper or scrap material to prevent loss of static vacuum pressure.

### 7. Print Zone & Height Adjustment (Z-Axis)
Automated carriage height adjustment:
- Driven by precision lead screws and stepper motors.
- Ultrasonic or optical distance sensors measure the substrate surface.
- Standard head gap is typically set between **1.0 mm and 1.8 mm**. Exceeding 2.0 mm causes ink misting, droplet deflection, and poor edge definition.`
      },
      {
        sectionTitle: "Subsystem 8 to 11: Ink Delivery & Negative Pressure",
        blockType: "teaching",
        contentMarkdown: `### 8. Ink Reservoirs (Bulk Supply)
Main 1-liter to 5-liter tanks equipped with:
- Mechanical float switches or capacitive level sensors to warn operators before ink runs dry.
- Agitation motors for White ink: Titanium dioxide (TiO₂) pigments are dense and will settle out of suspension within hours if not continuously stirred.

### 9. Ink Delivery Lines & Sub-Tanks
- Solvent- and UV-resistant PTFE or fluoropolymer tubing routed through dynamic drag chains.
- Dedicated sub-tanks mounted directly above the printheads on the carriage.

### 10. Negative Pressure (Meniscus) System
**The most critical hydraulic concept in industrial inkjet:**
- To prevent ink from drooling out of hundreds of nozzles under gravity, the sub-tank is maintained under slight vacuum (typically **-2.0 to -4.5 kPa** or -20 to -45 mbar).
- This creates an inward surface-tension curve (meniscus) at every nozzle orifice.
- If negative pressure is **too weak** (closer to 0), ink drools and drips onto media.
- If negative pressure is **too strong** (excessive vacuum), air is ingested into the nozzle chambers, leading to immediate ink starvation and complete nozzle failure.`
      },
      {
        sectionTitle: "Subsystem 12 & 13: Printheads & UV Curing",
        blockType: "teaching",
        contentMarkdown: `### 11. Printheads & Nozzle Plates
Industrial drop-on-demand piezoelectric printheads (e.g. Ricoh Gen5/Gen6, Kyocera KJ4A, Konica Minolta 1024i):
- Contain hundreds or thousands of microscopic nozzles (orifices ~20-30 microns in diameter).
- Piezo actuators expand and contract when energized by custom electrical waveforms, ejecting controlled picoliter droplets.

### 12. UV Curing Systems
Mounted on one or both wings of the carriage:
- High-intensity UV-LED arrays (typically 395nm wavelength) or mercury vapor arc lamps.
- Water-chilled or high-speed air-cooled heat exchangers.
- Irradiance levels reach **8 to 16 W/cm²** to instantly polymerize monomers.

### 13. Finished Output & Post-Cure Inspection
The physical board or roll exiting the print zone, ready for adhesion cross-hatch testing, optical inspection, and spectrophotometric measurement.`
      },
      {
        sectionTitle: "Annotated Visual: The Negative Pressure Meniscus",
        blockType: "visual_explanation",
        contentMarkdown: `### Cross-Section of Piezoelectric Nozzle Meniscus State

\`\`\`
  [ Balanced Meniscus: -3.2 kPa ]           [ Weak Vacuum: -0.5 kPa ]           [ Excessive Vacuum: -8.0 kPa ]
      ┌───────────────────────┐                 ┌───────────────────────┐           ┌───────────────────────┐
      │      Liquid Ink       │                 │      Liquid Ink       │           │      Liquid Ink       │
      │                       │                 │                       │           │                       │
      └───────┐       ┌───────┘                 └───────┐       ┌───────┘           └───────┐       ┌───────┘
              │ ) (   │ (Inward Curve)                  │ (   ) │ (Bulging)                 │   ▲   │ (Air Ingestion)
              └───┴───┘                                 └───┴───┘                           └───┴───┘
          STABLE FIRING                             INK DRIPPING/DROOLING               NOZZLE STARVATION / DE-PRIME
\`\`\`

**Field Takeaway**: Whenever a customer complains that \"all black nozzles suddenly disappeared during high-speed printing,\" check the sub-tank vacuum gauge first before blaming the printhead!`
      },
      {
        sectionTitle: "Interactive Practice & Realistic Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #104: The Ghost Droplet Collision
**Complaint:** A print shop reported that midway through large 4x8 ft acrylic prints, the carriage would violently shutter and stop with an \"Encoder Position Error.\"

**Investigation:**
1. The technician inspected the linear optical encoder strip located behind the gantry rail.
2. Under 10x loupe magnification, a dried smudge of white UV ink mist was visible at the 48-inch mark.
3. When the optical reader head passed this smudge, it lost pulse count, causing the servo drive to detect a position discrepancy and trigger an emergency stop.
4. Cleaned the glass strip with optical lint-free swabs and anhydrous isopropyl alcohol. Re-calibrated home sensor.

**Result:** Zero errors over a 24-hour continuous production run.`
      }
    ],
    questions: [
      {
        text: "What is the primary function of maintaining negative pressure in an industrial printhead sub-tank?",
        domain: "hardware_safety",
        explanation: "Negative pressure creates a concave ink meniscus at the nozzle orifice, preventing gravity drooling while keeping nozzles primed for firing.",
        options: [
          { text: "It creates an inward surface tension (meniscus) at each nozzle, preventing ink from drooling while allowing piezo droplet ejection.", isCorrect: true, explanation: "Correct. Negative pressure balances gravity against surface tension." },
          { text: "It heats the ink to 80 degrees Celsius to reduce drying time.", isCorrect: false, explanation: "Incorrect. Temperature is regulated by dedicated head heaters, not negative pressure." },
          { text: "It pushes ink backward into the main bulk bottles during printing.", isCorrect: false, explanation: "Incorrect." },
          { text: "It grounds electrical static charges from the substrate.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "What symptom will occur if negative pressure in the sub-tank becomes excessively strong (too much vacuum, e.g. -10 kPa)?",
        domain: "hardware_safety",
        explanation: "Excessive vacuum pulls air backward into the nozzle chamber, de-priming the printhead and causing immediate ink starvation and missing nozzles.",
        options: [
          { text: "Ink will vigorously drip from the nozzle plate onto the media.", isCorrect: false, explanation: "That occurs with insufficient vacuum (positive pressure)." },
          { text: "Air will be ingested through the nozzles into the printhead chambers, causing cavitation, de-priming, and ink starvation.", isCorrect: true, explanation: "Correct. High negative pressure sucks air past the nozzle meniscus." },
          { text: "The UV curing lamp will burn out immediately.", isCorrect: false, explanation: "Incorrect; lamps are unrelated to ink hydraulics." },
          { text: "The carriage will move in the reverse direction.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "Why is continuous mechanical agitation or circulation mandatory for White UV ink channels?",
        domain: "hardware_safety",
        explanation: "White ink relies on dense Titanium Dioxide (TiO2) particles that settle to the bottom if unagitated, causing severe clogs and density shifts.",
        options: [
          { text: "Because White ink contains Titanium Dioxide (TiO2) pigment particles that settle out of suspension, leading to clogging and uneven density.", isCorrect: true, explanation: "Correct. TiO2 is heavy and requires constant stirring/circulation." },
          { text: "Because White ink catches fire if stationary for more than 5 minutes.", isCorrect: false, explanation: "Incorrect." },
          { text: "Because White ink must be aerated with air bubbles to cure.", isCorrect: false, explanation: "Air bubbles in ink ruin printing." },
          { text: "Because White ink contains live bacteria.", isCorrect: false, explanation: "Absurd." }
        ]
      },
      {
        text: "What will happen if the optical linear encoder strip becomes contaminated with ink mist or dust?",
        domain: "hardware_safety",
        explanation: "The reader head cannot count optical transitions accurately, resulting in droplet misplacement, vertical banding, or servo position faults.",
        options: [
          { text: "The printer will automatically switch to Wi-Fi mode.", isCorrect: false, explanation: "Incorrect." },
          { text: "The carriage will misread its position, causing droplet misplacement, banding, scale errors, or carriage servo crash faults.", isCorrect: true, explanation: "Correct. The encoder provides closed-loop position timing." },
          { text: "The vacuum bed suction will increase by 40%.", isCorrect: false, explanation: "Incorrect." },
          { text: "The RIP will convert all colors to grayscale.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "What is the typical recommended head-gap distance between the printhead nozzle plate and the media surface on an industrial flatbed?",
        domain: "hardware_safety",
        explanation: "Standard industrial head gap is 1.0 mm to 1.8 mm; larger gaps increase droplet misting and deflection, while smaller gaps risk head strikes.",
        options: [
          { text: "1.0 mm to 1.8 mm", isCorrect: true, explanation: "Correct. This balances drop placement accuracy against substrate collision risk." },
          { text: "10 mm to 15 mm", isCorrect: false, explanation: "Far too high; droplets will become diffuse mist before hitting the substrate." },
          { text: "0.05 mm (paper-thin contact)", isCorrect: false, explanation: "Extremely dangerous; almost guarantees fatal head strikes on rigid media." },
          { text: "50 mm", isCorrect: false, explanation: "Incorrect." }
        ]
      }
    ]
  },

  // DAY 5
  {
    dayNumber: 5,
    bootcampDayNumber: 2,
    title: "Inkjet Troubleshooting and Print Defect Isolation",
    slug: "day-05-inkjet-troubleshooting-and-print-defect-isolation",
    summary: "Systematic diagnosis of horizontal banding, missing nozzles, deflected jets, bidirectional misregistration, media feed calibration, and curing artifacts.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Distinguish horizontal banding caused by missing nozzles from banding caused by media advance miscalibration.",
      "Diagnose printhead nozzle plate conditions: physical clogs, air ingestion, electrical drive failures, and mechanical deflection.",
      "Execute systematic recovery procedures: purge cycles, capping seals, ultrasonic bath limitations, and solvent wiping.",
      "Calibrate bidirectional printing alignment and step feed advance."
    ],
    prerequisites: ["Day 4 printer architecture and hydraulics"],
    sourceRef: {
      title: "Field Diagnostic Guide for Industrial Inkjet Defect Isolation",
      citation: "CGS ORIS Technical Training & Print Quality Engineering Guidelines",
      confidenceLevel: "confirmed_spec",
      notes: "Defect taxonomy and systematic isolation rules."
    },
    contentBlocks: [
      {
        sectionTitle: "Defect Taxonomy: Categorizing Print Faults",
        blockType: "teaching",
        contentMarkdown: `### The Golden Diagnostic Rule: Symptom First, Never Assume

When an operator says \"the printer is banding,\" that statement tells you almost nothing. Banding has multiple distinct root causes across entirely different subsystems.

#### 1. Horizontal Banding (In the Direction of Carriage Travel)
- **White lines (voids)**: One or more nozzles are completely missing or severely deflected.
- **Dark overlap lines**: Media feed is advancing *too little*, causing successive carriage passes to overlap.
- **Light underlap lines**: Media feed is advancing *too much*, creating a gap between successive carriage passes.
- *Critical Diagnostic Test*: **Run a standard nozzle check pattern.**
  - If nozzles are missing: Fix the hydraulic/nozzle issue.
  - If ALL nozzles are 100% firing: **It is impossible for missing nozzles to cause the banding!** The fault is in **Media Advance / Step Calibration** or **Bidirectional Alignment**.

#### 2. Vertical Banding (Perpendicular to Carriage Travel)
- Encoder strip dirty or damaged at regular intervals.
- Gantry rail bearing wear causing periodic carriage oscillation.
- Grounding interference or electrical noise on the head cable data bus.

#### 3. Graininess and Fuzzy Edge Text
- Head gap too high (> 2.0 mm), causing aerodynamic droplet dispersion.
- Bidirectional timing offset: Left-to-right pass dots do not align with right-to-left pass dots.`
      },
      {
        sectionTitle: "Nozzle Health: Clogs vs Air vs Electrical vs Deflection",
        blockType: "teaching",
        contentMarkdown: `### The Four States of Nozzle Failure

1. **Dried Ink / Physical Clog**
   - *Cause*: Solvent evaporation, UV ambient light leakage onto the nozzle plate, or particulate contamination.
   - *Recovery*: Controlled positive-pressure purge, capping station solvent soak with lint-free polyester swabs.

2. **Air Ingestion (Cavitation)**
   - *Cause*: Excessive sub-tank vacuum, loose Luer-lock ink fittings, or running an ink tank completely dry.
   - *Behavior*: Nozzles fire for 2 seconds, then abruptly drop out during printing as micro-bubbles expand.
   - *Recovery*: Draw ink through the printhead with a syringe or perform a soft reverse flush to evacuate air.

3. **Deflected Nozzles (Misfiring Angles)**
   - *Cause*: A tiny fiber or dried crust of ink clinging to the perimeter of the nozzle orifice pushes the flying drop sideways.
   - *Result*: Instead of dropping into a straight matrix, it creates a thin void and an adjacent dark speckle.
   - *Recovery*: Gentle lint-free wipe with recommended flush solvent. Never use abrasive swabs or metal scrapers!

4. **Electrical / Driver Failure**
   - *Cause*: Blown head driver chip, cracked flat flex cable (FFC), or damaged PZT crystal.
   - *Behavior*: An entire block of 64 or 128 nozzles drops out simultaneously in a sharp geometric rectangle.`
      },
      {
        sectionTitle: "Media Advance (Step) and Bidirectional Calibration",
        blockType: "teaching",
        contentMarkdown: `### Step Calibration Mechanics
On flatbed printers, the gantry steps forward across the Y-axis. On hybrid/roll printers, drive pinch rollers advance the substrate.

- If the media moves **10.02 mm** when the controller calculates **10.00 mm**, after 10 passes the error is 0.2 mm—enough to create severe white gap banding.
- Every media thickness, surface friction, and roll weight requires its own **Feed Compensation Factor**. Heavy vinyl rolls have more inertia than lightweight polyester film.

### Bidirectional Alignment
In bidirectional printing, the carriage fires drops traveling Left-to-Right AND Right-to-Left. Because of flight time (the time it takes a drop to travel from nozzle to paper while moving at 1.5 m/s), firing pulses must be timed in microseconds.
- An offset of just 15 microseconds creates a visible double-image or fuzzy edges on vertical lines.`
      },
      {
        sectionTitle: "Annotated Visual: Defect Isolation Decision Flow",
        blockType: "visual_explanation",
        contentMarkdown: `### Systematic Banding Isolation Matrix

\`\`\`
                 [ Symptom: Horizontal Banding on Output ]
                                     │
                                     ▼
                        [ Action: Print Nozzle Check ]
                                     │
                   ┌─────────────────┴─────────────────┐
                   ▼                                   ▼
        [ Missing Nozzles Visible ]           [ Nozzle Check 100% Perfect ]
                   │                                   │
                   ├── Perform Gentle Purge            ├── Print Step / Feed Test Target
                   ├── Inspect Wiper Blade & Cap       ├── Examine Bands: Overlap or Gap?
                   ├── Check Sub-tank Negative Press   └── Adjust Media Feed Compensation
                   └── Re-test Nozzle Check
\`\`\`

**Never touch printhead mechanical alignment until hydraulic and feed calibration are ruled out.**`
      },
      {
        sectionTitle: "Realistic Field Case Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #105: The \"Broken\" Ricoh Gen5 Printhead
**Complaint:** Customer was convinced their Magenta printhead had failed because prints exhibited heavy horizontal streaking. They had already ordered an expensive replacement head.

**FST Investigation:**
1. Printed a nozzle test pattern: All magenta nozzles were firing 100% cleanly without a single missing or deflected jet.
2. The technician inspected the substrate: The customer was running 1/2-inch thick dense wood panels on the flatbed.
3. Because the heavy panels exerted high friction against the gantry drive belt, the Y-axis feed was slipping by 0.08 mm per pass, creating dark overlap lines.
4. Cleaned the Y-axis drive teeth, tightened the belt to factory torque spec, and updated the media feed step value by +0.6%.

**Result:** Banding vanished completely. The customer cancelled the unnecessary head purchase, saving thousands of dollars.`
      },
      {
        sectionTitle: "Summary & Review",
        blockType: "summary_review",
        contentMarkdown: `### Key Diagnostic Principles
- **Nozzle check first**: Always separate nozzle health from feed calibration.
- **Dark bands = Overlap (Feed too short)**.
- **Light/White bands = Underlap (Feed too long)** or missing nozzles.
- **Never scrape a nozzle plate**: Microscopic polyimide nozzle coatings are easily scratched, permanently ruining the head.`
      }
    ],
    questions: [
      {
        text: "A customer reports horizontal banding across full-color prints. The technician prints a nozzle check, and EVERY nozzle in all colors fires with 100% perfection. What is the most probable cause?",
        domain: "hardware_safety",
        explanation: "If the nozzle check is 100% clean, missing nozzles cannot be the cause; the fault lies in media advance (step feed) miscalibration or bidirectional timing.",
        options: [
          { text: "The printheads are completely clogged and must be soaked in acetone.", isCorrect: false, explanation: "Acetone will dissolve printhead adhesives and destroy the head; plus, the nozzles are already firing perfectly." },
          { text: "Media advance (step) calibration is incorrect, or bidirectional alignment is out of sync.", isCorrect: true, explanation: "Correct. Step feed errors produce horizontal banding even when 100% of nozzles fire." },
          { text: "The ink has expired.", isCorrect: false, explanation: "Expired ink causes adhesion or color issues, not mechanical band spacing." },
          { text: "The main incoming AC voltage is too high.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "In horizontal banding, what does a periodic DARK line indicate regarding media advance?",
        domain: "hardware_safety",
        explanation: "A dark line indicates that the media did not advance far enough, causing successive carriage passes to overlap and deposit a double layer of ink.",
        options: [
          { text: "The media advanced too far, leaving an unprinted gap.", isCorrect: false, explanation: "That produces a light or white line." },
          { text: "The media did not advance far enough, causing successive print swaths to overlap and deposit excess ink.", isCorrect: true, explanation: "Correct. Overlap creates a dark line." },
          { text: "The UV lamps were extinguished during that pass.", isCorrect: false, explanation: "That would cause liquid, uncured ink, not a dark line." },
          { text: "The yellow printhead is running backward.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "If a specific block of exactly 64 adjacent nozzles in a single channel drops out instantly in a razor-sharp geometric pattern, what is the most likely failure mode?",
        domain: "hardware_safety",
        explanation: "Geometric block dropouts correspond to electrical driver chip, ribbon cable trace, or board connector failures rather than physical particulate clogs.",
        options: [
          { text: "A physical piece of lint blocking exactly 64 nozzles.", isCorrect: false, explanation: "Physical lint creates irregular, jagged dropouts." },
          { text: "An electrical failure: damaged flat flex cable trace, blown driver ASIC channel, or loose head-board connection.", isCorrect: true, explanation: "Correct. Sharp geometric blocks indicate electrical/driver bus faults." },
          { text: "The room humidity dropped by 2%.", isCorrect: false, explanation: "Incorrect." },
          { text: "The RIP ran out of disk space.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "Why should a technician never use paper towels, standard cotton swabs, or metal tools to wipe an industrial printhead nozzle plate?",
        domain: "hardware_safety",
        explanation: "Nozzle plates have delicate microscopic anti-wetting coatings. Abrasive materials cause micro-scratches that deflect nozzles permanently.",
        options: [
          { text: "Because the paper towel will absorb all the electrical charge from the printer.", isCorrect: false, explanation: "Incorrect." },
          { text: "Because abrasive fibers and metal tools will scratch the delicate anti-wetting coating, causing permanent nozzle deflection.", isCorrect: true, explanation: "Correct. Only dedicated lint-free polyester swabs and approved fluids should be used." },
          { text: "Because cotton swabs can cause the UV lamps to explode.", isCorrect: false, explanation: "Incorrect." },
          { text: "Because OSHA bans cotton in printing facilities.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "What is the primary indicator of a 'deflected' nozzle as opposed to a 'missing' nozzle on a test pattern?",
        domain: "hardware_safety",
        explanation: "A missing nozzle leaves a gap, while a deflected nozzle fires at an angle, placing its drop into the adjacent line and leaving a void on one side with a dark collision on the other.",
        options: [
          { text: "A deflected nozzle fires at an improper angle, producing an irregular line that encroaches on its neighbor.", isCorrect: true, explanation: "Correct. Angle deflection distorts the test grid without completely disappearing." },
          { text: "A deflected nozzle only prints in black ink.", isCorrect: false, explanation: "Incorrect." },
          { text: "A deflected nozzle produces loud clicking sounds from the carriage.", isCorrect: false, explanation: "Incorrect." },
          { text: "A deflected nozzle causes the printer to reboot.", isCorrect: false, explanation: "Incorrect." }
        ]
      }
    ]
  },

  // DAY 6
  {
    dayNumber: 6,
    bootcampDayNumber: 2,
    title: "Networking, RIPs, and Print Job Pipeline",
    slug: "day-06-networking-rips-and-print-jobs",
    summary: "Troubleshoot network communication, Gigabit Ethernet, RIP spooler stalls, corrupted raster buffers, port conflicts, and large file transmission.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Configure static IP addressing, subnets, and dedicated print network cards.",
      "Diagnose print queue stalls, buffer underruns, and RIP temp scratch-disk exhaustion.",
      "Differentiate between network physical layer faults, IP routing conflicts, and RIP licensing errors.",
      "Trace a job from PDF spooling to printer memory buffering."
    ],
    prerequisites: ["Day 2 workflow knowledge"],
    sourceRef: {
      title: "Industrial Print Controller Networking Standards",
      citation: "IEEE 802.3 Ethernet & CGS ORIS Systems Integration Guidelines",
      confidenceLevel: "industry_standard",
      notes: "Networking, spooler architectures, and RIP communication protocols."
    },
    contentBlocks: [
      {
        sectionTitle: "Physical and Logical Network Topology",
        blockType: "teaching",
        contentMarkdown: `### Isolating the Print Engine Network

In an industrial print shop, **never connect a production printer to the general office network or corporate Wi-Fi.**

#### Recommended Dedicated Dual-NIC Architecture:
The RIP workstation should contain **two physical Network Interface Cards (NICs)**:
- **NIC 1 (House/Corporate LAN)**: Connected to client network for receiving incoming customer artwork, design files, and cloud ORIS license authentication. (e.g., DHCP or 192.168.1.xxx).
- **NIC 2 (Dedicated Printer Subnet)**: Direct Cat6/Cat7 shielded patch cable to the Platinum printer controller with **Static IP** on an isolated subnet (e.g., 10.0.0.1 on RIP, 10.0.0.2 on Printer; Subnet Mask: 255.255.255.0; No Gateway).

#### Why Isolation is Essential:
1. **Packet Collisions & Jitter**: Broadcast traffic from office PCs and streaming video can delay raster packets, causing buffer underruns where the carriage stops mid-pass.
2. **IP Conflicts**: If an office router dynamically assigns the printer's IP to an employee's smartphone, communication crashes instantly.`
      },
      {
        sectionTitle: "RIP Spooler Bottlenecks & Temp Disk Exhaustion",
        blockType: "teaching",
        contentMarkdown: `### What Causes a Job to Hang at \"Processing 99%\"?

1. **Temp Drive / Scratch Disk Saturation**
   - Ripping high-resolution 1200 DPI multi-layer packaging files or massive 3D textured METIS scans generates tens of gigabytes of raw uncompressed raster TIFF data.
   - If the RIP's temporary scratch drive runs out of disk space, the spooler process hangs indefinitely without throwing an obvious error.
   - *Best Practice*: Dedicated solid-state NVMe drive for the RIP scratch folder.

2. **Corrupted PostScript / PDF Transparency Parsing**
   - Complex vector clipping paths or un-flattened live transparencies can trap the RIP interpreter in an infinite memory loop.
   - *Diagnostic Isolation*: Preflight file into PDF/X-4 or rasterize to high-res TIFF prior to sending to the RIP.

3. **Software Dongle / License Server Timeouts**
   - Modern RIPs and ORIS applications check license validity via USB dongles or cloud authentication. Periodic USB port sleep modes in Windows power-saving settings will drop the license mid-print.`
      },
      {
        sectionTitle: "Buffer Underruns and Mid-Print Halts",
        blockType: "teaching",
        contentMarkdown: `### Carriage Pausing and \"Starvation Stops\"
If the printer carriage suddenly stops mid-board for 3 seconds, then resumes, this is a **buffer underrun**.
- The printhead carriage has depleted the on-board RAM buffer before the RIP workstation could feed the next raster swath over the network.
- This creates visible dwell marks or gloss differences where the UV lamp lingered over stationary ink.
- *Root causes*: Cat5 cable instead of Cat6, damaged RJ45 clip, 100 Mbps auto-negotiation instead of 1000 Mbps Gigabit, or heavy anti-virus background scanning on the RIP PC.`
      },
      {
        sectionTitle: "Annotated Visual: Network Diagnostics Command Line",
        blockType: "visual_explanation",
        contentMarkdown: `### The FST Command-Line Network Toolkit

\`\`\`
[ Terminal Command ]               [ Expected Response ]               [ Diagnostic Meaning ]
ping 10.0.0.2 -t                   Reply from 10.0.0.2: time <1ms      Physical link solid; no packet loss
ping 10.0.0.2 -l 65500             Reply from 10.0.0.2: time 1-2ms     Jumbo frames & MTU handling intact
arp -a                             10.0.0.2 matches Printer MAC        No IP duplicate conflict
netstat -ano                       Port 9100 / 8080 LISTENING          Printer spooler port open & ready
\`\`\`

If \`ping\` returns intermittent *\"Request timed out\"*, replace the physical patch cable before troubleshooting printer circuit boards!`
      },
      {
        sectionTitle: "Realistic Field Case Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #106: The 2:00 PM Daily Disconnect
**Location:** Industrial Print Lab, St. Paul, MN.  
**Complaint:** The printer lost connection to the RIP workstation every single day around 2:00 PM, destroying whatever board was on the bed. The customer suspected an intermittent motherboard failure.

**Investigation:**
1. Inspected network configuration: The printer was plugged into a general shop network switch rather than a dedicated NIC.
2. Ran a network monitor: At 2:00 PM, the shop's shift-change occurred, and automated backup routines flooded the local switch with hundreds of gigabytes of NAS traffic.
3. The switch dropped printer packets, causing a socket timeout in the printer controller.
4. Installed a secondary dedicated PCIe Gigabit network card in the RIP workstation, ran a direct Cat6 cable to the printer with static IP 192.168.250.10/24, completely bypassing the shop network.

**Result:** Zero dropped connections over subsequent months.`
      },
      {
        sectionTitle: "Summary & Review",
        blockType: "summary_review",
        contentMarkdown: `### Network Diagnostic Checklist
- Always use **two separate network cards** on the RIP workstation.
- Verify Gigabit (1000 Mbps) link speed indicator LEDs on both ports.
- Ensure Windows Power Options are set to \"High Performance\" with **USB Selective Suspend disabled**.
- Check available disk space on the RIP scratch drive.`
      }
    ],
    questions: [
      {
        text: "Why is a dedicated secondary Network Interface Card (NIC) recommended for connecting the RIP PC directly to an industrial printer?",
        domain: "hardware_safety",
        explanation: "A dedicated NIC isolates high-bandwidth raster data from office network congestion, broadcast packet storms, and dynamic IP conflicts.",
        options: [
          { text: "To isolate high-bandwidth print data from general office traffic, preventing packet drops, latency, and IP conflicts.", isCorrect: true, explanation: "Correct. Complete network isolation ensures predictable real-time data streaming." },
          { text: "Because printers cannot understand standard Ethernet cables.", isCorrect: false, explanation: "Incorrect; standard Ethernet is used." },
          { text: "To allow the printer to mine cryptocurrency when idle.", isCorrect: false, explanation: "Nonsensical." },
          { text: "To bypass state electrical codes.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "What is a 'buffer underrun' in industrial printing, and what visual defect does it typically cause?",
        domain: "hardware_safety",
        explanation: "A buffer underrun occurs when data transfer cannot keep up with carriage firing, causing carriage pauses that leave dwell marks or gloss banding.",
        options: [
          { text: "The ink tank overflows onto the vacuum bed.", isCorrect: false, explanation: "Incorrect." },
          { text: "The printer's on-board memory runs out of raster data, causing the carriage to pause mid-pass and creating visible dwell or gloss banding.", isCorrect: true, explanation: "Correct. Data starvation halts motion while UV lamps remain on, altering finish." },
          { text: "The RIP automatically deletes the customer's original artwork.", isCorrect: false, explanation: "Incorrect." },
          { text: "The printhead drops down and strikes the media.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "A print job hangs at 'Ripping 98%' and never reaches the printer queue. What should the technician check first?",
        domain: "hardware_safety",
        explanation: "Running out of scratch disk space or encountering unhandled PDF transparency complexity commonly freezes the RIP spooler.",
        options: [
          { text: "Available free disk space on the RIP scratch/temp drive, and PDF transparency complexity.", isCorrect: true, explanation: "Correct. Scratch drive exhaustion stops RIP raster file generation." },
          { text: "The negative pressure vacuum gauge on the printer.", isCorrect: false, explanation: "The printer hasn't received the file yet, so printer hydraulics are unrelated." },
          { text: "The tension on the carriage timing belt.", isCorrect: false, explanation: "Carriage mechanics are not involved in RIP rasterization." },
          { text: "The ambient barometric pressure.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "When testing network connectivity between a RIP workstation and a Platinum printer, what command verifies that jumbo frames are handled properly without fragmentation?",
        domain: "hardware_safety",
        explanation: "Using ping with packet size flags (e.g. ping <ip> -l 65500 or -l 8972) tests Maximum Transmission Unit (MTU) packet capacity.",
        options: [
          { text: "ping <ip_address> -l 65500 (or large packet size)", isCorrect: true, explanation: "Correct. The -l flag specifies buffer size to verify large packet transmission." },
          { text: "format C: /q", isCorrect: false, explanation: "Destructive system wipe command; never run." },
          { text: "ipconfig /release", isCorrect: false, explanation: "Releases DHCP lease, dropping connection." },
          { text: "traceroute google.com", isCorrect: false, explanation: "Tests external internet, not internal printer link." }
        ]
      },
      {
        text: "What Windows power setting must be disabled on the RIP workstation to prevent intermittent dongle and network drops?",
        domain: "hardware_safety",
        explanation: "USB Selective Suspend and Network Adapter power-saving ('Allow computer to turn off this device') must be disabled.",
        options: [
          { text: "Screen brightness setting.", isCorrect: false, explanation: "Cosmetic only." },
          { text: "USB Selective Suspend and Network Adapter 'Power Saving' sleep mode.", isCorrect: true, explanation: "Correct. Power saving turns off USB dongles and NICs during long print runs." },
          { text: "Bluetooth audio sync.", isCorrect: false, explanation: "Irrelevant." },
          { text: "Windows Calculator autostart.", isCorrect: false, explanation: "Irrelevant." }
        ]
      }
    ]
  },

  // DAY 7
  {
    dayNumber: 7,
    bootcampDayNumber: 2,
    title: "Color Science, ICC Profiles, and Delta E",
    slug: "day-07-color-science-icc-profiles-and-delta-e",
    summary: "Deep dive into CIELAB, Delta E formulas (ΔE76 vs ΔE00), spectrophotometer measurement geometries (45/0 vs spherical), M0/M1/M2/M3 standards, and calibration vs characterization.",
    estimatedMinutes: 90,
    competencyDomain: "color_oris",
    objectives: [
      "Distinguish between device-dependent (RGB, CMYK) and device-independent (CIELAB) color spaces.",
      "Calculate and interpret Delta E (ΔE00) tolerances in commercial printing.",
      "Explain the critical difference between calibration (linearization) and characterization (profiling).",
      "Select appropriate ISO measurement conditions (M0, M1, M2, M3) based on optical brighteners (OBA) and polarization needs."
    ],
    prerequisites: ["Day 2 digital imaging workflow"],
    sourceRef: {
      title: "Color Measurement & Tolerancing Principles",
      citation: "ISO 13655:2017 & CIE Colorimetry Technical Report",
      confidenceLevel: "industry_standard",
      notes: "Definitive colorimetry standards used by CGS ORIS."
    },
    contentBlocks: [
      {
        sectionTitle: "Device-Dependent vs Device-Independent Color",
        blockType: "teaching",
        contentMarkdown: `### Why RGB and CMYK are Ambiguous Recipes

A common novice misconception is that \"CMYK 0, 100, 100, 0\" is a specific color. In reality, **RGB and CMYK are merely device control values (recipes)**:
- 100% Magenta + 100% Yellow printed on glossy coated paper looks vivid red.
- That identical CMYK recipe printed on uncoated newsprint looks muddy orange-brown.

#### The CIELAB Color Space (Device-Independent Standard)
Established in 1976 by the Commission Internationale de l'Éclairage (CIE), CIELAB models human visual perception:
- **L\***: Lightness (0 = Absolute Black, 100 = Diffuse White).
- **a\***: Red-Green axis (+a\* = Red, -a\* = Green).
- **b\***: Yellow-Blue axis (+b\* = Yellow, -b\* = Blue).

Every color perceptible to the human eye has a unique mathematical coordinate in L\*a\*b\* space, regardless of which printer or camera created it.`
      },
      {
        sectionTitle: "Delta E (ΔE): Quantifying Color Difference",
        blockType: "teaching",
        contentMarkdown: `### How Far Off is the Color?

Delta E ($\Delta E$) measures the distance between two points in L\*a\*b\* color space (e.g., between the customer's brand standard and the printed output).

#### Evolution of Formulas:
1. **$\Delta E_{76}$ (CIE 1976)**: Simple Euclidean distance: $\sqrt{(\Delta L)^2 + (\Delta a)^2 + (\Delta b)^2}$. Fails because the human eye is much more sensitive to shifts in neutral grays than in saturated yellows.
2. **$\Delta E_{00}$ (CIEDE2000)**: Modern industry standard. Incorporates complex weighting functions for lightness ($S_L$), chroma ($S_C$), hue ($S_H$), and a neutral rotation factor ($R_T$).

#### Commercial Interpretation of $\Delta E_{00}$:
- **$\Delta E < 1.0$**: Imperceptible to normal human vision under standard D50 lighting.
- **$1.0 \le \Delta E \le 2.0$**: Commercial tolerance for brand colors and contract proofing. Excellent match.
- **$2.0 < \Delta E \le 3.5$**: Noticeable under side-by-side comparison; acceptable for billboard/signage, unacceptable for luxury packaging.
- **$\Delta E > 5.0$**: Severe, unacceptable mismatch.`
      },
      {
        sectionTitle: "Calibration vs Characterization: The Universal Confusion",
        blockType: "teaching",
        contentMarkdown: `### The Two-Step Color Management Foundation

Technicians must memorize the difference between these two steps:

#### Step 1: Calibration (Linearization)
- Bringing the hardware into a known, repeatable, linear state.
- *Process*: Setting ink limits (single-channel and total ink limit TIC/TIL) so ink doesn't pool or bleed, then adjusting 0–100% tonal curves so 50% input produces 50% dot gain.
- **Analogy**: Tuning the strings of a guitar before playing.

#### Step 2: Characterization (Profiling)
- Measuring the printer's specific color behavior in that calibrated state.
- *Process*: Printing an IT8.7/4 or TC1617 chart (up to 1,600+ color patches), measuring them with a spectrophotometer, and generating an **ICC Profile**.
- **Analogy**: Reading sheet music with the tuned guitar.

*Critical Service Rule*: **If a printer drifts, never re-profile first!** You re-linearize (re-calibrate) to bring the machine back to its original baseline.`
      },
      {
        sectionTitle: "Measurement Conditions: M0, M1, M2, and M3",
        blockType: "teaching",
        contentMarkdown: `### ISO 13655 Measurement Standards Explained

Modern substrates often contain **Optical Brightening Agents (OBAs)**—fluorescent chemicals that absorb invisible UV light and re-emit it as visible blue light to make paper appear \"whiter than white.\"

To standardize measurements, ISO 13655 defines four illumination modes:
- **M0 (Legacy / Tungsten)**: Uncontrolled UV content (incandescent lamp). Phased out due to lack of inter-instrument repeatability.
- **M1 (D50 Daylight)**: Exact CIE D50 illuminant with standardized UV content. **The mandatory standard for modern GRACoL and Fogra contract proofing.**
- **M2 (UV-Cut / No UV)**: Completely filters out all UV wavelengths below 400nm. Eliminates optical brightener fluorescence. Used in corrugated/packaging where OBAs vary wildly.
- **M3 (Polarization Filter)**: Polarized light eliminates surface glare. Essential when measuring wet ink or high-gloss METIS fine-art/decor textures.`
      },
      {
        sectionTitle: "Annotated Visual & Realistic Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #107: The Fluorescent Substrate Mystery
**Complaint:** A print shop reported that contract proofs made on their proofing printer matched offset press sheets under office fluorescent lights, but the brand owner rejected them because they didn't match in their retail showroom.

**Investigation:**
1. The technician inspected the spectrophotometer settings used to build the proofing profile: It was set to **M2 (UV-Cut)**.
2. The proofing paper had heavy OBA coatings, while the production folding carton had zero OBAs.
3. Because UV was filtered out during profiling (M2), the proofing software could not compensate for the OBA fluorescence under D50 retail lighting.
4. Switched measurement mode to **M1 (D50)** using CGS ORIS Color Tuner, recalibrated with an i1Pro3 spectrophotometer, and applied OBA compensation.

**Result:** $\Delta E_{00}$ dropped below 1.1 across all lighting conditions. The brand owner accepted the proof.`
      }
    ],
    questions: [
      {
        text: "What is the critical distinction between printer 'Calibration' (Linearization) and 'Characterization' (Profiling)?",
        domain: "color_oris",
        explanation: "Calibration brings the device to a repeatable baseline (ink limits, linear tonal response), whereas characterization measures and maps the resulting color gamut via an ICC profile.",
        options: [
          { text: "Calibration sets the mechanical belt speed, while characterization cleans the printheads.", isCorrect: false, explanation: "Incorrect." },
          { text: "Calibration establishes a repeatable baseline (ink limits, linear curves), while characterization measures that state to create an ICC profile.", isCorrect: true, explanation: "Correct. Calibration tunes the engine; characterization maps its gamut." },
          { text: "Calibration is done by the customer; characterization can only be done in Germany.", isCorrect: false, explanation: "Incorrect." },
          { text: "They are completely identical terms with no difference.", isCorrect: false, explanation: "Incorrect; conflating them leads to wasted time and bad color." }
        ]
      },
      {
        text: "In the CIELAB color space, what do the L*, a*, and b* axes represent?",
        domain: "color_oris",
        explanation: "L* represents Lightness (0-100), a* represents the Red-Green axis, and b* represents the Yellow-Blue axis.",
        options: [
          { text: "L* = Lightness (0-100), a* = Red/Green axis, b* = Yellow/Blue axis.", isCorrect: true, explanation: "Correct. This defines the 3D perceptual color space." },
          { text: "L* = Laser frequency, a* = Absorption, b* = Brightness.", isCorrect: false, explanation: "Incorrect." },
          { text: "L* = Linear speed, a* = Acceleration, b* = Braking distance.", isCorrect: false, explanation: "Mechanical terms, not colorimetric." },
          { text: "L* = Lens focus, a* = Aperture, b* = Bokeh.", isCorrect: false, explanation: "Photography terms." }
        ]
      },
      {
        text: "Under standard commercial printing tolerances, what is generally considered an acceptable Delta E (ΔE00) for contract brand-color proofing?",
        domain: "color_oris",
        explanation: "ΔE00 below 1.5 to 2.0 is the recognized commercial tolerance for tight brand colors and proofing.",
        options: [
          { text: "ΔE00 between 10.0 and 15.0.", isCorrect: false, explanation: "Completely unacceptable mismatch." },
          { text: "ΔE00 <= 1.5 to 2.0.", isCorrect: true, explanation: "Correct. Tight commercial proofing demands ΔE00 under 1.5-2.0." },
          { text: "ΔE00 must equal exactly 0.0000 on every patch.", isCorrect: false, explanation: "Physically impossible due to microscopic substrate and sensor variances." },
          { text: "ΔE00 is only used for audio engineering.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "Which ISO 13655 measurement condition incorporates standardized UV daylight (D50) to accurately measure substrates containing Optical Brightening Agents (OBAs)?",
        domain: "color_oris",
        explanation: "Condition M1 specifies standardized D50 illumination including controlled UV content to properly evaluate OBA fluorescence.",
        options: [
          { text: "M0", isCorrect: false, explanation: "M0 is legacy incandescent with undefined UV." },
          { text: "M1", isCorrect: true, explanation: "Correct. M1 is the D50 daylight standard with controlled UV." },
          { text: "M2", isCorrect: false, explanation: "M2 explicitly cuts out UV light." },
          { text: "M3", isCorrect: false, explanation: "M3 uses polarization filters." }
        ]
      },
      {
        text: "When measuring wet ink or high-gloss reflective ceramic surfaces, which measurement condition utilizes polarization to eliminate specular gloss glare?",
        domain: "color_oris",
        explanation: "Condition M3 specifies polarization filtering to remove specular surface reflection.",
        options: [
          { text: "M3", isCorrect: true, explanation: "Correct. M3 uses cross-polarization to remove surface sheen and glare." },
          { text: "M1", isCorrect: false, explanation: "M1 is standard unpolarized D50." },
          { text: "M0", isCorrect: false, explanation: "M0 is unpolarized." },
          { text: "M2", isCorrect: false, explanation: "M2 is UV-cut, not polarized." }
        ]
      }
    ]
  },

  // DAY 8
  {
    dayNumber: 8,
    bootcampDayNumber: 1,
    title: "The ORIS Software Ecosystem in Depth",
    slug: "day-08-oris-software-ecosystem",
    summary: "Comprehensive mastery of COLOR TUNER, PRESS MATCHER, X GAMUT, FLEX PACK, CERTIFIED & EVALUATE, and CxF TOOLBOX/CLOUD workflows.",
    estimatedMinutes: 90,
    competencyDomain: "color_oris",
    objectives: [
      "Select the exact CGS ORIS software package matching specific commercial customer requirements.",
      "Explain how X GAMUT replaces spot inks with 7-color Extended Gamut Printing (ECG).",
      "Demonstrate the spectral CxF (Color Exchange Format) communication pipeline.",
      "Troubleshoot licensing, DeviceLink profiling errors, and color verification failures."
    ],
    prerequisites: ["Day 7 color science and Delta E"],
    sourceRef: {
      title: "CGS ORIS Software Portfolio Specification",
      citation: "CGS Publishing Technologies International Product Guides",
      confidenceLevel: "confirmed_spec",
      notes: "Official product suite architecture and customer application matching."
    },
    contentBlocks: [
      {
        sectionTitle: "Product 1 & 2: COLOR TUNER and PRESS MATCHER",
        blockType: "teaching",
        contentMarkdown: `### 1. ORIS COLOR TUNER (Contract Proofing)
- **Target Market**: Prepress houses, commercial printers, advertising agencies, brand packaging groups.
- **Core Function**: The world's leading contract color proofing system. Generates 100% certified contract proofs on inkjet engines (e.g., Epson SureColor SC-P series) emulating any commercial press standard (GRACol, FOGRA, SWOP, JapanColor).
- **Key Differentiator**: Proprietary **DeviceLink profiling** technology that maintains clean color separations, preserves 100% pure black text, and simulates spot colors with spectral accuracy.

### 2. ORIS PRESS MATCHER (Production Normalization)
- **Target Market**: Digital print shops running multiple presses from different manufacturers (e.g. Platinum flatbed, HP Indigo, Canon toner press, EFI wide format).
- **Core Function**: Harmonizes disparate digital devices to a single common reference standard. If a customer sends a file, it will print with identical color and tonal response regardless of which press or substrate is selected.
- **Key Differentiator**: Automated closed-loop iteration. Measures printed color strips and recalculates correction curves automatically without requiring a color scientist on staff.`
      },
      {
        sectionTitle: "Product 3 & 4: X GAMUT and FLEX PACK",
        blockType: "teaching",
        contentMarkdown: `### 3. ORIS X GAMUT (Extended Color Gamut Printing)
- **Target Market**: High-volume packaging converters, labels, and industrial flatbed production.
- **The Problem**: Traditional offset/flexo printers change inks for every customer brand color (Pantone 185 Red, Pantone 286 Blue), wasting hours in press wash-ups and thousands of gallons of specialized ink.
- **The Solution**: X GAMUT converts spot colors into a fixed standard 7-color ink set: **CMYK + Orange + Green + Violet (OGV)**.
- **Capability**: Reproduces over **95% of the entire Pantone library** without changing a single ink can or cleaning a single ink line. Multiple different customer jobs with different brand colors can be ganged together on the exact same print run!

### 4. ORIS FLEX PACK (Specialized Packaging Prototyping)
- **Target Market**: Food and beverage packaging, luxury cosmetics, flexible pouch converters.
- **Core Function**: Combined with specialized printers and custom transfer films, Flex Pack creates realistic 3D mockup packaging directly on actual production substrates (shrink sleeves, metallized films, carton board) with white ink, varnish, and cold-foil simulation.`
      },
      {
        sectionTitle: "Product 5 & 6: CERTIFIED & EVALUATE and CxF TOOLBOX",
        blockType: "teaching",
        contentMarkdown: `### 5. ORIS CERTIFIED & EVALUATE (Quality Control)
- **Target Market**: All print production facilities requiring ISO compliance.
- **Core Function**: An automated verification utility. The operator reads a small 54-patch color bar using an inline or handheld spectrophotometer. The software instantly calculates $\Delta E_{00}$ against ISO 12647-7 / G7 tolerances.
- **Output**: Generates a tamper-proof digital certification certificate and prints an adhesive barcode label applied directly to the approved proof or production sample.

### 6. CxF TOOLBOX and CxF CLOUD (Spectral Communication)
- **Target Market**: Brand owners (e.g., Coca-Cola, Apple) and global packaging supply chains.
- **Core Function**: Communicating color spectrally via **ISO 17972 (Color Exchange Format)**.
- **Why It Matters**: Standard L\*a\*b\* or RGB values change under different illuminants (metamerism). A CxF file stores the complete 380nm–730nm spectral reflectance curve of the ink at various halftones and opacities, ensuring identical reproduction anywhere in the world.`
      },
      {
        sectionTitle: "Annotated Visual: Customer Needs Matching Exercise",
        blockType: "interactive_practice",
        contentMarkdown: `### Scenario Match Drill: Which ORIS Solution Fits?

| Customer Operational Problem | Correct ORIS Software Solution |
| :--- | :--- |
| \"We spend 3 hours washing flexo press ink fountains between jobs to mix custom Pantone inks.\" | **ORIS X GAMUT** (7-color ECG eliminates spot ink wash-ups). |
| \"We need our new Platinum UV flatbed to match our existing toner presses on corporate brand graphics.\" | **ORIS PRESS MATCHER** (Multi-device production normalization). |
| \"Our brand clients require ISO 12647 certified contract proofs with an audited pass/fail label.\" | **ORIS COLOR TUNER + CERTIFIED** (Contract proofing + verification). |
| \"Our global client in Paris needs to send us their brand color without metameric color shifts.\" | **ORIS CxF TOOLBOX / CLOUD** (Spectral color communication). |
| \"We manufacture shrink sleeves for energy drink cans and need realistic 3D mockups on foil.\" | **ORIS FLEX PACK** (Packaging transfer film & mockups). |`
      },
      {
        sectionTitle: "Realistic Field Case Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #108: The Flexo Press Wash-Up Bottleneck
**Client:** Flexible Film Converter, Green Bay, WI.  
**Challenge:** Plant was losing 18 hours of production time every week because short-run jobs required washing out press decks to change spot colors.

**FST / Application Specialist Solution:**
1. Installed ORIS X GAMUT on their prepress server.
2. Standardized the 8-color flexo line on CMYK + Orange + Green + Violet + Opaque White.
3. Profiled the press using X GAMUT spectral test charts.
4. Converted incoming customer files: 42 different brand spot colors were mapped into the 7-color ECG space with an average $\Delta E_{00}$ of 0.84.

**Result:** Press wash-up time reduced by 85%. Plant capacity increased by $380,000 annually. Exemplary customer success story.`
      }
    ],
    questions: [
      {
        text: "What is the primary commercial benefit of ORIS X GAMUT in packaging and industrial print shops?",
        domain: "color_oris",
        explanation: "ORIS X GAMUT reproduces up to 95%+ of Pantone spot colors using a fixed 7-color ink set (CMYK+OGV), eliminating press wash-ups and spot-ink mixing.",
        options: [
          { text: "It converts spot colors into an extended 7-color ink set (CMYK+OGV), eliminating costly ink wash-ups and allowing ganged print jobs.", isCorrect: true, explanation: "Correct. Extended gamut reproduction is the core value proposition of X Gamut." },
          { text: "It doubles the physical speed of the printer's carriage motor.", isCorrect: false, explanation: "Incorrect." },
          { text: "It eliminates the need for UV curing lamps.", isCorrect: false, explanation: "Incorrect." },
          { text: "It automatically translates foreign language text in PDFs.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "Why is a CxF (Color Exchange Format) file superior to a simple CIELAB or RGB value for communicating brand spot colors?",
        domain: "color_oris",
        explanation: "CxF stores full spectral reflectance curves across the visible spectrum (380-730nm), preventing metamerism and accounting for halftone opacity and substrate interactions.",
        options: [
          { text: "Because CxF files contain 3D video animations.", isCorrect: false, explanation: "Incorrect." },
          { text: "Because CxF communicates complete spectral reflectance data (380–730nm), eliminating metamerism and defining ink behavior across halftones.", isCorrect: true, explanation: "Correct. Spectral data ensures identical appearance across varying light sources." },
          { text: "Because CxF files are 100 times smaller than JPEGs.", isCorrect: false, explanation: "Incorrect." },
          { text: "Because CxF only works on German computers.", isCorrect: false, explanation: "Absurd." }
        ]
      },
      {
        text: "A commercial printer operates an HP Indigo, a Platinum UV flatbed, and a Canon toner press. They complain that the same corporate logo prints differently on all three machines. Which software resolves this?",
        domain: "color_oris",
        explanation: "ORIS PRESS MATCHER is purpose-built to harmonize and synchronize color output across diverse digital press models and technologies.",
        options: [
          { text: "ORIS PRESS MATCHER", isCorrect: true, explanation: "Correct. Press Matcher provides device-independent production normalization." },
          { text: "Microsoft Paint", isCorrect: false, explanation: "Incorrect." },
          { text: "ORIS FLEX PACK", isCorrect: false, explanation: "Flex Pack is for packaging mockups, not general press fleet normalization." },
          { text: "The printer's firmware bootloader.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "In ORIS CERTIFIED & EVALUATE, what is the purpose of printing and measuring a color control strip?",
        domain: "color_oris",
        explanation: "Measuring the control strip provides quantitative, tamper-proof verification that the print meets established ISO or G7 Delta E tolerance thresholds.",
        options: [
          { text: "To clean the nozzles at the end of each page.", isCorrect: false, explanation: "Incorrect." },
          { text: "To provide mathematical, audited verification of compliance with industry tolerance standards (ISO/G7) and print an official certification label.", isCorrect: true, explanation: "Correct. Certified & Evaluate verifies proof integrity." },
          { text: "To check the ink level in the waste bottle.", isCorrect: false, explanation: "Incorrect." },
          { text: "To test the strength of the paper fibers.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "Which CGS ORIS product is specifically engineered for producing realistic packaging mockups and proofs on original production substrates like shrink films and foils?",
        domain: "color_oris",
        explanation: "ORIS FLEX PACK is designed for flexible packaging prototyping, transfer film applications, and metallized foil mockups.",
        options: [
          { text: "ORIS FLEX PACK", isCorrect: true, explanation: "Correct. Flex Pack targets the packaging mockup and transfer film sector." },
          { text: "ORIS COLOR TUNER", isCorrect: false, explanation: "Color Tuner is for standard contract proofing on paper substrates." },
          { text: "Adobe Acrobat Reader", isCorrect: false, explanation: "Incorrect." },
          { text: "Platinum Controller v2", isCorrect: false, explanation: "Incorrect." }
        ]
      }
    ]
  },

  // DAY 9
  {
    dayNumber: 9,
    bootcampDayNumber: 1,
    title: "METIS Scanning and Material Surface Imaging",
    slug: "day-09-metis-scanning-and-material-surface-imaging",
    summary: "Explore high-precision surface imaging: METIS PM3D HAWK, DRS, and EDS scanners, directional synchro-light, photometric stereo 3D relief, calibration, and distinguishing scan vs printer artifacts.",
    estimatedMinutes: 90,
    competencyDomain: "metis_scanning",
    objectives: [
      "Compare the architectural capabilities of METIS PM3D, DRS, and EDS scanner families.",
      "Explain how Synchronized Directional Lighting (SynchroLight) captures 3D surface relief, bump, gloss, and normal maps.",
      "Perform scanner calibration using white/black reference standards and geometric alignment targets.",
      "Diagnose scan-specific artifacts (specular flare, stitching misalignment, focal drift) versus downstream printer defects."
    ],
    prerequisites: ["Day 2 digital imaging workflow"],
    sourceRef: {
      title: "METIS High-Resolution Surface Scanning Specifications",
      citation: "METIS Systems s.r.l. (Rome, Italy) Technical Manuals & PM3D Documentation",
      confidenceLevel: "confirmed_spec",
      notes: "Hardware specifications, optical geometry, and photometric stereo algorithms."
    },
    contentBlocks: [
      {
        sectionTitle: "METIS Scanner Families: PM3D, DRS, and EDS",
        blockType: "teaching",
        contentMarkdown: `### The Premier Material Imaging Technology

Headquartered in Rome, Italy, **METIS Systems s.r.l.** is recognized globally as the gold standard for high-resolution surface digitizing, fine-art reproduction, and decor surface scanning (wood, ceramics, wallpaper, leather, textiles).

#### The Three Major Product Families:
1. **PM3D (Photometric 3D / HAWK)**
   - *Flagship surface texture scanner*. Designed for the decor and ceramic industries.
   - Captures not only 2D color (RGB/16-bit) but also calculates **3D surface relief, depth (height) maps, normal maps, and gloss (specularity) maps**.
   - These maps allow industrial UV printers (such as Platinum) to print textured physical tactile relief via multi-pass clear varnish!

2. **DRS Series (Digital Reprographic Systems)**
   - Large-format flatbed scanners (e.g. DRS 2000 DCS) for fine art, ancient maps, blueprints, and fragile archival materials up to 2x1 meters.
   - Features vacuum table hold-down and motorized camera/lighting columns.

3. **EDS Series (Easy Digital Scanner)**
   - V-shaped book scanners designed for delicate rare manuscripts and bound volumes without flattening or stressing the spine.`
      },
      {
        sectionTitle: "SynchroLight Technology and Photometric Stereo",
        blockType: "teaching",
        contentMarkdown: `### How METIS Captures True 3D Depth Without Lasers

Most 3D scanners use laser triangulation or structured light, which struggle with dark or highly reflective materials. METIS utilizes **Photometric Stereo via SynchroLight**:

#### The Principle of SynchroLight:
- The scanner features electronically controlled LED light arrays positioned at multiple angles around the optical sensor.
- During scanning, the software rapidly pulses lights from the **Left, Right, Top, and Bottom** independently in fractions of a second:
  - *Pass 1 (Light from Left)*: Casts micro-shadows into crevices on the right.
  - *Pass 2 (Light from Right)*: Casts micro-shadows into crevices on the left.
  - *Pass 3 (Light from Top/Bottom)*: Illuminates vertical striations.
  - *Pass 4 (Diffuse / Non-Directional)*: Captures pure color without shadows.

By mathematically comparing the micro-shadow vectors cast by these directional lights, METIS software calculates the exact surface normal and elevation of every single pixel!`
      },
      {
        sectionTitle: "Calibration: White Reference and Geometric Alignment",
        blockType: "teaching",
        contentMarkdown: `### The Daily Routine for METIS FSTs

Because METIS scanners capture microscopic optical data, calibration is non-negotiable:

1. **White & Dark Reference Shading Calibration**
   - A certified optical white reference calibration tile (calibrated to NIST or BAM standards) is scanned before every production session.
   - Compensates for individual sensor pixel sensitivity differences and LED illuminator falloff across the optical field.
   - *Field Warning*: Never touch the white reference tile with bare hands. Fingerprint oils will introduce permanent optical banding into every scan!

2. **Geometric & Stitching Alignment**
   - High-precision grid targets verify that the scanning camera's motorized traverse is perfectly orthogonal to the scan bed with zero perspective distortion.

3. **Focus Distance & Depth of Field**
   - Automated laser distance sensors establish the focal plane. For 3D structured wood grains, aperture settings are balanced to maximize depth of field (f/8 to f/11).`
      },
      {
        sectionTitle: "Differentiating Scanner Artifacts from Printer Artifacts",
        blockType: "visual_explanation",
        contentMarkdown: `### Diagnostic Isolation: Scanner vs Printer

\`\`\`
[ Observed Defect: White Line or Band Across Output ]
                         │
                         ▼
             [ Action: Inspect Raw TIF on High-Res Prepress Monitor at 400% Zoom ]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[ Line IS VISIBLE in Raw TIF ]    [ Raw TIF is 100% CLEAN ]
        │                                 │
  SCANNER FAULT                     PRINTER FAULT
  ├── Dirt on Scanner Lens          ├── Missing Nozzle on Printhead
  ├── Contaminated White Tile       ├── Linear Encoder Scratch
  └── LED Array Synchronization     └── Step Advance Calibration
\`\`\`

**Rule**: Never attempt to adjust a printer until you have inspected the raw digital file on a calibrated monitor!`
      },
      {
        sectionTitle: "Realistic Field Case Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #109: The \"Scratched\" Oak Wood Scan
**Client:** Luxury Flooring Manufacturer, Dalton, GA.  
**Complaint:** Customer complained their METIS PM3D Hawk scanner was defective because high-resolution scans of textured French oak planks showed repetitive bright streaks across the surface.

**Investigation:**
1. The technician examined the raw 16-bit TIFF image: The bright streaks ran in the exact direction of the scanner's motorized carriage.
2. Inspected the white reference tile: Found a small smear of dried wood resin deposited when an operator had rested a sticky wood sample on the calibration bar.
3. Because the shading calibration read this dark resin mark during calibration, the software algorithmically over-compensated that sensor channel, producing a bright streak across the entire scan length.
4. Cleaned the reference tile with optical lens cleaner and executed a fresh shading calibration.

**Result:** The streaks disappeared completely. Operator retrained on clean handling procedures.`
      }
    ],
    questions: [
      {
        text: "How does METIS SynchroLight technology capture 3D surface relief and depth maps without using a laser?",
        domain: "metis_scanning",
        explanation: "SynchroLight pulses directional LED arrays from different angles, and photometric stereo algorithms analyze the resulting micro-shadows to compute surface angles and depth.",
        options: [
          { text: "By using X-rays to penetrate the wood.", isCorrect: false, explanation: "Incorrect." },
          { text: "By pulsing directional LED lighting from multiple angles and calculating surface normal vectors from the resulting micro-shadows (Photometric Stereo).", isCorrect: true, explanation: "Correct. Photometric stereo deduces 3D geometry from multi-angle directional shadows." },
          { text: "By pressing a mechanical needle probe into the substrate.", isCorrect: false, explanation: "Incorrect." },
          { text: "By spinning the scanning bed at 3,000 RPM.", isCorrect: false, explanation: "Absurd." }
        ]
      },
      {
        text: "Which METIS scanner family is specifically optimized for scanning delicate, bound archival manuscripts and ancient books without flattening their spines?",
        domain: "metis_scanning",
        explanation: "The METIS EDS (Easy Digital Scanner) family features a V-cradle bed designed to safely image bound books and delicate historical materials.",
        options: [
          { text: "METIS EDS Series", isCorrect: true, explanation: "Correct. EDS is built specifically for books and archival bound manuscripts." },
          { text: "METIS PM3D HAWK", isCorrect: false, explanation: "PM3D is for industrial 3D surface texture scanning." },
          { text: "METIS DRS 2000", isCorrect: false, explanation: "DRS is large flatbed format for maps and fine art." },
          { text: "Platinum Flatbed", isCorrect: false, explanation: "Platinum is a printer, not a scanner." }
        ]
      },
      {
        text: "What will happen if an operator touches the optical white reference calibration tile with bare oily fingers?",
        domain: "metis_scanning",
        explanation: "Fingerprint oil changes the reflectance profile; the shading algorithm will over-compensate for the darker smudge, creating a continuous bright streak across all subsequent scans.",
        options: [
          { text: "The scanner software will refuse to boot up.", isCorrect: false, explanation: "Incorrect." },
          { text: "The scanner will calibrate against the oily smudge, producing severe longitudinal bright or dark streaks across all subsequent scans.", isCorrect: true, explanation: "Correct. Any contamination on the reference tile corrupts pixel shading calibration." },
          { text: "The scanner's LED lamps will immediately shut off.", isCorrect: false, explanation: "Incorrect." },
          { text: "The files will be saved in black and white only.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "When troubleshooting a persistent white line on printed wood grain output, what is the FIRST step to isolate whether the fault is in the METIS scanner or the Platinum printer?",
        domain: "metis_scanning",
        explanation: "Inspect the raw digital scan file at 100%+ zoom on a calibrated monitor; if the line exists in the file, it is a scanner fault; if the file is clean, it is a printer hardware fault.",
        options: [
          { text: "Inspect the raw TIFF scan file on a computer monitor at high zoom to see if the artifact exists in the digital data before printing.", isCorrect: true, explanation: "Correct. Digital file inspection immediately separates capture artifacts from printer hardware defects." },
          { text: "Replace the printheads on the Platinum printer.", isCorrect: false, explanation: "Premature and expensive." },
          { text: "Re-install the operating system on the RIP workstation.", isCorrect: false, explanation: "Unnecessary." },
          { text: "Turn off the facility air conditioning.", isCorrect: false, explanation: "Irrelevant." }
        ]
      },
      {
        text: "In industrial decor reproduction (e.g. ceramic tiles or luxury vinyl tile), what is the function of the 3D 'Gloss Map' generated by a METIS PM3D scanner?",
        domain: "metis_scanning",
        explanation: "A gloss map isolates the specular reflectivity of the surface, allowing UV printers to apply clear gloss varnish selectively to match the original material's sheen.",
        options: [
          { text: "It maps where clear UV varnish or gloss finishes should be selectively deposited to replicate the natural luster and sheen of the original material.", isCorrect: true, explanation: "Correct. Gloss maps guide selective varnish deposition." },
          { text: "It measures the electrical resistance of the ink.", isCorrect: false, explanation: "Incorrect." },
          { text: "It tells the operator what time of day to print.", isCorrect: false, explanation: "Incorrect." },
          { text: "It prevents paper jams in the roll feeder.", isCorrect: false, explanation: "Incorrect." }
        ]
      }
    ]
  },

  // DAY 10
  {
    dayNumber: 10,
    bootcampDayNumber: 3,
    title: "Installation, Commissioning, and Acceptance Testing",
    slug: "day-10-installation-commissioning-and-acceptance",
    summary: "Execute end-to-end commissioning: pre-site inspection, 3-phase electrical verification, HVAC stability, gantry leveling, ink priming, linearization, and customer signoff.",
    estimatedMinutes: 90,
    competencyDomain: "customer_docs",
    objectives: [
      "Conduct a rigorous Pre-Installation Environmental & Facility Audit.",
      "Verify 3-phase electrical supply, transformer tap selection, and isolated earth grounding.",
      "Execute mechanical gantry leveling using precision machinist levels and dial indicators.",
      "Complete the formal Customer Acceptance Signoff checklist and operator training protocol."
    ],
    prerequisites: ["Days 3-7 core curriculum"],
    sourceRef: {
      title: "Field Installation & Site Preparation Manual",
      citation: "CGS ORIS Americas Field Engineering Guidelines",
      confidenceLevel: "confirmed_spec",
      notes: "Pre-installation criteria, tolerances, and customer signoff procedures."
    },
    contentBlocks: [
      {
        sectionTitle: "Phase 1: Pre-Site Facility & Environmental Audit",
        blockType: "teaching",
        contentMarkdown: `### Do Not Uncrate Until the Room is Verified

The #1 reason field installations fail is poor customer site preparation. The technician must audit the environment before moving heavy crated machinery:

1. **Environmental HVAC Controls**
   - **Temperature**: Must be maintained at **68°F to 75°F (20°C to 24°C)** 24 hours a day. Extreme cold increases ink viscosity, causing nozzle starvation; heat causes ink misting.
   - **Relative Humidity (RH)**: Must be **40% to 60% (Non-condensing)**. Low humidity (< 30%) builds massive electrostatic charges on plastic/acrylic boards, causing static ink scattering and destroying sensitive electronics.

2. **Electrical Infrastructure**
   - Industrial 3-Phase power: Verify 208V, 230V, or 480V AC supply with dedicated circuit breakers.
   - Measure Line-to-Line and Line-to-Neutral voltages. All three phases must be balanced within **±2%**.
   - **Isolated Technical Ground**: Ground-to-Neutral potential must measure **< 2.0 Volts AC**. High ground voltage indicates electrical noise that will corrupt encoder and printhead data buses!

3. **Floor Loading & Rigging Access**
   - Reinforced concrete slab: Flatbed printers weigh 3,000 to 8,000+ lbs.
   - Doorway and elevator clearance verification.`
      },
      {
        sectionTitle: "Phase 2: Mechanical Uncrating, Leveling, and Rigging",
        blockType: "teaching",
        contentMarkdown: `### The Art of Machine Leveling
An industrial printer cannot print flat if its chassis is torqued or twisted:

1. **Setting the Leveling Feet**
   - The printer is lowered off transport skates onto heavy threaded leveling pads.
   - Using two **Starrett 98 precision machinist levels** (sensitivity: 0.005 in/ft), the technician levels the chassis along the X (gantry) and Y (bed) axes simultaneously.
   - **Tolerance**: Under **0.05 mm across the entire length of the vacuum bed**.

2. **Dial Indicator Gantry Tramming**
   - Mount a magnetic-base dial test indicator (DTI) to the carriage.
   - Sweep the carriage across the 8-foot or 10-foot vacuum bed. The dial indicator must not deviate by more than **±0.10 mm** across the entire sweep.
   - Adjust gantry elevation towers if tramming exceeds tolerance.`
      },
      {
        sectionTitle: "Phase 3: Ink Priming, Negative Pressure & Alignment",
        blockType: "teaching",
        contentMarkdown: `### Bringing the System to Life

1. **Safety Interlock Testing**
   - Before energizing motion or ink pumps, test every E-Stop button and cover interlock switch individually.

2. **Solvent Flush & Ink Priming**
   - New printheads are shipped with factory storage shipping fluid (diethylene glycol).
   - Flush the lines with approved solvent flush before introducing UV ink to avoid chemical precipitation clogs.
   - Slowly pull ink into sub-tanks using controlled vacuum, establishing meniscus pressure.

3. **Software Mechanical Alignment Patterns**
   - *Slant Angle Alignment*: Adjusting printhead rotation so nozzle columns are exactly 90.0° perpendicular to carriage travel.
   - *Head-to-Head Spacing*: Electronic offset calibration ensuring Cyan, Magenta, Yellow, Black, White, and Varnish fire into the exact same micron grid.
   - *Bidirectional Alignment & Step Feed*: Final calibration on customer production media.`
      },
      {
        sectionTitle: "Phase 4: Customer Training and Acceptance Signoff",
        blockType: "teaching",
        contentMarkdown: `### The Formal Acceptance Document
An installation is not complete until the customer signs the **Factory Acceptance Protocol (FAT / SAT)**:

- **Benchmark Test Print**: Printing a standardized torture test file containing:
  - 1-point and 2-point micro-text.
  - Full-bed solid ink coverage (testing vacuum hold-down and negative pressure stability).
  - High-res photo portrait (skin tones testing grayscale smoothness).
  - Pantones / spot color verification wedges measured with a spectrophotometer.
- **Operator Maintenance Training**:
  - Daily: Swabbing capping stations, wiping wiper blades with lint-free swabs, emptying waste bottles.
  - Weekly: Lubricating carriage rails with manufacturer-specified grease, cleaning UV quartz windows.
  - Emergency procedures: Responding to head strikes and vacuum loss.
- Signed signoff document protects CGS ORIS from illegitimate warranty claims.`
      },
      {
        sectionTitle: "Realistic Field Case Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #110: The \"Unlevel\" Concrete Floor
**Client:** Commercial Display Manufacturer, Indianapolis, IN.  
**Situation:** An FST arrived to commission a new Platinum flatbed. The customer directed the rigging crew to place the machine on an expansion joint in their concrete slab.

**FST Action:**
1. Upon placing machinist levels, the technician noticed the chassis twisted significantly when the carriage traveled to the far right side, because the concrete slab flexed under carriage weight.
2. The technician refused to proceed with calibration, explaining that gantry alignment would drift continuously as the seasons changed across the joint.
3. Coordinated with plant facilities to relocate the machine 10 feet onto a monolithic 8-inch reinforced concrete slab.
4. Performed precision leveling: all four corners dialed within 0.03 mm.

**Result:** Installation completed with zero mechanical drift. The customer commended the technician's firmness in preventing future service disasters.`
      }
    ],
    questions: [
      {
        text: "What are the recommended temperature and relative humidity (RH) ranges for an industrial UV inkjet printing room?",
        domain: "customer_docs",
        explanation: "Standard industrial print room specifications require 68°F to 75°F (20°C to 24°C) and 40% to 60% RH to maintain ink viscosity and prevent static discharge.",
        options: [
          { text: "68°F to 75°F (20°C to 24°C) and 40% to 60% Relative Humidity.", isCorrect: true, explanation: "Correct. This ensures stable ink surface tension and static-free media handling." },
          { text: "50°F to 60°F and 10% Relative Humidity.", isCorrect: false, explanation: "Too cold (high viscosity) and too dry (extreme static build-up)." },
          { text: "85°F to 95°F and 90% Relative Humidity.", isCorrect: false, explanation: "High humidity causes condensation and electrical short circuits." },
          { text: "Temperature and humidity do not matter for industrial equipment.", isCorrect: false, explanation: "Completely false." }
        ]
      },
      {
        text: "When measuring 3-phase electrical power during a site inspection, what should the potential between Neutral and Earth Ground measure?",
        domain: "hardware_safety",
        explanation: "A clean, isolated technical ground should have less than 2.0 Volts AC potential to Neutral; higher voltages indicate electrical ground noise that disrupts data buses.",
        options: [
          { text: "Over 120 Volts AC.", isCorrect: false, explanation: "Dangerous open neutral or severe grounding fault." },
          { text: "Less than 2.0 Volts AC.", isCorrect: true, explanation: "Correct. Ground-to-neutral potential must be near zero to avoid data corruption." },
          { text: "480 Volts AC.", isCorrect: false, explanation: "Lethal wiring error." },
          { text: "Zero resistance DC only.", isCorrect: false, explanation: "Incorrect terminology." }
        ]
      },
      {
        text: "Why must factory shipping fluid be thoroughly flushed from new printheads with approved solvent flush before introducing UV ink?",
        domain: "hardware_safety",
        explanation: "Shipping fluids (often glycols) can react chemically with UV acrylate monomers, precipitating solid polymer residue that permanently clogs nozzles.",
        options: [
          { text: "Because shipping fluid and UV ink can chemically react or precipitate, causing immediate, catastrophic nozzle clogging.", isCorrect: true, explanation: "Correct. Flushing ensures hydraulic compatibility." },
          { text: "Because shipping fluid smells bad to the operators.", isCorrect: false, explanation: "Irrelevant." },
          { text: "Because shipping fluid is magnetic and attracts metal shavings.", isCorrect: false, explanation: "Incorrect." },
          { text: "Because shipping fluid causes the carriage motor to run backwards.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "What precision instrument is required to tram and level the printer's gantry and vacuum bed during mechanical commissioning?",
        domain: "hardware_safety",
        explanation: "A precision machinist level (e.g. Starrett 98) and a magnetic-base dial test indicator (DTI) are required to measure within 0.05 mm tolerances.",
        options: [
          { text: "A standard plastic carpenter's spirit level from a hardware store.", isCorrect: false, explanation: "Carpenter levels lack the required 0.005 in/ft sensitivity." },
          { text: "Precision machinist levels (e.g. Starrett 98) and a magnetic-base dial test indicator (DTI).", isCorrect: true, explanation: "Correct. Sub-millimeter accuracy is mandatory." },
          { text: "A laser pointer taped to a broom handle.", isCorrect: false, explanation: "Absurd." },
          { text: "A smartphone leveling app.", isCorrect: false, explanation: "Inaccurate and unprofessional." }
        ]
      },
      {
        text: "Why is a formal Customer Acceptance Protocol (FAT/SAT) signoff document mandatory at the conclusion of an installation?",
        domain: "customer_docs",
        explanation: "It legally validates that the machine was delivered, installed, calibrated, and demonstrated to meet all published specifications, protecting against unwarranted claims.",
        options: [
          { text: "It allows the technician to borrow money from the customer.", isCorrect: false, explanation: "Absurd." },
          { text: "It legally verifies that the machine meets contractual performance specifications and confirms operator training was completed.", isCorrect: true, explanation: "Correct. The signed document establishes warranty commencement and operational acceptance." },
          { text: "It is sent to the local fire department for tax purposes.", isCorrect: false, explanation: "Incorrect." },
          { text: "It replaces the operator's driver's license.", isCorrect: false, explanation: "Incorrect." }
        ]
      }
    ]
  },

  // DAY 11
  {
    dayNumber: 11,
    bootcampDayNumber: 2,
    title: "Advanced Fault Isolation: Multi-Cause Service Cases",
    slug: "day-11-advanced-fault-isolation",
    summary: "Diagnose complex, compounding, and intermittent failures: thermal drift, electrical ground loops, static deflection, ink viscosity batch variation, and least-invasive testing.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Apply the principle of Least-Invasive Testing to avoid introducing new variables during troubleshooting.",
      "Diagnose compounding failures where mechanical, electrical, and environmental factors interact.",
      "Isolate intermittent electrical faults caused by cable drag-chain fatigue and ground loops.",
      "Troubleshoot static-induced ink misting on synthetic substrates."
    ],
    prerequisites: ["Days 4-7 diagnostics fundamentals"],
    sourceRef: {
      title: "Advanced Electro-Mechanical Diagnostic Principles",
      citation: "CGS ORIS Field Engineering Root Cause Analysis Manual",
      confidenceLevel: "confirmed_spec",
      notes: "Advanced multi-variable troubleshooting and least-invasive test doctrine."
    },
    contentBlocks: [
      {
        sectionTitle: "The Doctrine of Least-Invasive Testing",
        blockType: "teaching",
        contentMarkdown: `### Never Replace Two Parts at the Same Time

When confronted with a multi-symptom service case, inexperienced technicians frequently replace a printhead, a board, and a cable simultaneously. 
- If the problem goes away, you don't know which part was bad.
- If the problem persists or worsens, you don't know if the original fault remains or if you introduced a new fault (e.g., bent pin, static shock).

#### The Least-Invasive Hierarchy:
1. **Observation & Parameter Audit**: Inspect logs, verify voltages, check environmental temps, examine test patterns under loupe. (Zero invasiveness).
2. **Software & Configuration Checks**: Verify RIP profiles, reset controller parameters, test simple diagnostic patterns.
3. **Non-Destructive Cleaning / Mechanical Check**: Clean encoder, swab wiper blade, check belt tension, bleed air.
4. **Channel Swapping (Component Isolation)**: Swap an ink line or data cable between Channel A and Channel B to see if the symptom follows the cable or stays with the printhead!
5. **Component Replacement**: Only replace hardware when data positively confirms component failure.`
      },
      {
        sectionTitle: "Compounding Failure 1: The Drag-Chain Cable Fatigue",
        blockType: "teaching",
        contentMarkdown: `### The Nightmare of Intermittent Motion Faults

Industrial gantries cycle back and forth millions of times per year. Inside the plastic energy drag chain, high-flex cables and ink tubes are under continuous bending stress.

#### The Symptom:
A machine prints fine on small 12x12 inch boards in the center of the bed, but whenever an 8-foot full-bed board is printed, the machine crashes with a carriage communications error near the left end-stop!

#### The Root Cause:
Inside the drag chain, an optical fiber or copper strand inside a multi-conductor data cable has suffered **internal metal fatigue micro-fractures**.
- When the carriage is in the center, the cable bend radius holds the broken ends in physical contact.
- When the carriage reaches the far end-stop, the cable is pulled taut, opening the micro-fracture and interrupting data packets for 1 millisecond.
- *Diagnostic Method*: Meter continuity while manually flexing the cable harness through its entire arc of motion.`
      },
      {
        sectionTitle: "Compounding Failure 2: Static Electricity vs Ink Droplets",
        blockType: "teaching",
        contentMarkdown: `### When Ink Deflects Into a Ghost Mist

On synthetic plastics (Coroplast, styrene, acrylic, polycarbonate), static charges can exceed **20,000 to 30,000 Volts**.

#### How Static Destroys Print Quality:
1. As the printhead ejects 12-picoliter droplets (which have microscopic mass), the massive electrostatic field on the plastic repels or attracts the flying droplets mid-air.
2. Droplets shatter into aerosol mist, creating a fuzzy halo around text and settling onto the carriage encoder strip.
3. In severe cases, static sparks discharge directly into the metal nozzle plate, frying the sensitive piezoelectric driver ASICs on the printhead!

#### The Solution:
- Verify active ionizing static bars mounted on the carriage.
- Measure ionizer discharge pins with an electrostatic field meter.
- Install static ground tinsel and humidify the print shop to > 40% RH.`
      },
      {
        sectionTitle: "Annotated Visual: Channel Swapping Logic",
        blockType: "visual_explanation",
        contentMarkdown: `### Isolating Printhead vs Head Board vs Ink Line via Swapping

\`\`\`
   [ Problem: Cyan Channel Drops Out Completely After 30 Seconds ]
                                  │
                                  ▼
      [ Step 1: Swap Data Cable Between Cyan and Yellow on Head Board ]
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
   [ Symptom MOVES to Yellow ]        [ Symptom STAYS on Cyan ]
   Fault is UPSTREAM:                 Fault is DOWNSTREAM:
   ├── Head Board Driver Port         ├── Cyan Printhead Damaged
   └── Main Board / Cable             └── Cyan Ink Supply / Meniscus
                                                   │
                                                   ▼
                       [ Step 2: Swap Cyan & Yellow Ink Tubes at Sub-tank ]
                                                   │
                                  ┌────────────────┴────────────────┐
                                  ▼                                 ▼
                    [ Symptom MOVES to Yellow ]       [ Symptom STAYS on Cyan ]
                    Fault is in Ink Supply:           Cyan Printhead Internal
                    ├── Clogged Damper / Filter       PZT or Filter Delamination.
                    └── Sub-tank Vacuum Valve         (Replace Cyan Printhead)
\`\`\`

By swapping systematically, you isolate the exact failing component with 100% mathematical certainty.`
      },
      {
        sectionTitle: "Realistic Field Case Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #111: The \"Random\" 4:00 PM Nozzle Dropout
**Client:** POP Display House, St. Louis, MO.  
**Complaint:** Every afternoon around 4:00 PM, all four UV printheads would exhibit severe nozzle dropout. Previous technicians had replaced two printheads and the ink pump, but the problem recurred daily.

**Investigation:**
1. The FST logged environmental parameters: At 3:30 PM, the summer sun hit uninsulated west-facing skylights directly above the printer.
2. Ambient temperature in the print zone spiked from 72°F to 88°F (31°C).
3. The elevated temperature reduced ink viscosity dramatically (from 11 cP down to 6 cP).
4. Because the ink was now water-thin, the standard -3.2 kPa sub-tank meniscus vacuum could no longer balance surface tension, causing nozzles to de-prime during high-speed firing.
5. Tinted the skylights and adjusted the carriage sub-tank temperature control loop.

**Result:** Zero dropouts. Solved through thermal physics, not parts replacement.`
      }
    ],
    questions: [
      {
        text: "What is the primary objective of the 'Least-Invasive Testing' methodology in industrial field service?",
        domain: "hardware_safety",
        explanation: "Least-invasive testing systematically isolates root causes using non-destructive tests and channel swapping before replacing parts, preventing the introduction of new variables.",
        options: [
          { text: "To minimize repair costs and isolate root cause systematically without introducing secondary variables or unnecessary parts replacement.", isCorrect: true, explanation: "Correct. Stepwise non-destructive testing guarantees accurate diagnosis." },
          { text: "To spend as little time on-site as possible.", isCorrect: false, explanation: "Incorrect." },
          { text: "To avoid using any tools.", isCorrect: false, explanation: "Incorrect." },
          { text: "To convince the customer to buy a new machine.", isCorrect: false, explanation: "Unethical." }
        ]
      },
      {
        text: "A printer prints perfectly in the center of the vacuum bed, but reliably halts with a communication error only when the carriage travels to the extreme left end-stop. What is the most probable root cause?",
        domain: "hardware_safety",
        explanation: "Internal fatigue fracture of copper or fiber conductors in the carriage energy drag-chain cable harness, which opens only when the cable reaches full extension.",
        options: [
          { text: "The RIP workstation has a virus.", isCorrect: false, explanation: "Software viruses do not correspond to physical carriage physical position." },
          { text: "An internal conductor in the drag-chain cable harness has suffered fatigue micro-fractures, opening circuit continuity only at maximum bend extension.", isCorrect: true, explanation: "Correct. Classic drag-chain fatigue failure." },
          { text: "The ink has frozen in the line.", isCorrect: false, explanation: "Ink freezing does not trigger carriage position communications errors." },
          { text: "The customer's room lighting is flickering.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "How does excessive static electricity on a plastic substrate cause fuzzy, misty text and image halos in industrial inkjet printing?",
        domain: "hardware_safety",
        explanation: "Electrostatic charges (up to 30kV) on the substrate repel or deflect flying microscopic ink droplets mid-air, scattering them into fine aerosol mist.",
        options: [
          { text: "It causes the RIP computer to overheat.", isCorrect: false, explanation: "Incorrect." },
          { text: "The high electrostatic field deflects and shatters the microscopic flying droplets mid-air before they land on the substrate.", isCorrect: true, explanation: "Correct. Static deflection disrupts aerodynamic droplet trajectory." },
          { text: "It magnetizes the aluminum gantry rail.", isCorrect: false, explanation: "Aluminum is non-magnetic." },
          { text: "It turns the UV ink into solid ice.", isCorrect: false, explanation: "Absurd." }
        ]
      },
      {
        text: "When performing a 'channel swap' test to isolate whether a dropout fault is in the Printhead or the Head Board Driver, what result confirms the PRINTHEAD is the defective component?",
        domain: "hardware_safety",
        explanation: "If you swap data cables between Channel A and Channel B and the symptom remains on the original physical printhead, the fault is inside that printhead.",
        options: [
          { text: "The symptom moves to the other channel.", isCorrect: false, explanation: "That would prove the fault is upstream in the board or cable." },
          { text: "The symptom remains on the exact same physical printhead despite swapping data drive channels.", isCorrect: true, explanation: "Correct. If the fault does not follow the swapped input, the downstream hardware is defective." },
          { text: "The machine emits three beeps.", isCorrect: false, explanation: "Irrelevant." },
          { text: "Both printheads start smoking.", isCorrect: false, explanation: "Catastrophic error." }
        ]
      },
      {
        text: "How does an unseasonably high ambient room temperature (e.g. 90°F / 32°C) affect UV ink behavior during printing?",
        domain: "hardware_safety",
        explanation: "Higher temperatures lower ink viscosity, causing droplets to flow too freely, breaking meniscus balance and causing ink drooling or starvation.",
        options: [
          { text: "It dramatically decreases ink viscosity, destabilizing the meniscus pressure and causing drooling or nozzle starvation.", isCorrect: true, explanation: "Correct. Viscosity is inversely proportional to temperature." },
          { text: "It causes the ink to evaporate instantly inside the bottle.", isCorrect: false, explanation: "UV inks do not dry by evaporation." },
          { text: "It increases the weight of the printer by 500 lbs.", isCorrect: false, explanation: "Nonsensical." },
          { text: "It reverses the polarity of the linear encoder.", isCorrect: false, explanation: "Incorrect." }
        ]
      }
    ]
  },

  // DAY 12
  {
    dayNumber: 12,
    bootcampDayNumber: 2,
    title: "Customer Support, Communication, and Service Tickets",
    slug: "day-12-customer-support-and-documentation",
    summary: "Master on-site customer de-escalation, managing angry production managers, setting expectations, writing watertight technical service tickets, and root-cause handover.",
    estimatedMinutes: 90,
    competencyDomain: "customer_docs",
    objectives: [
      "De-escalate emotionally charged production-down situations using professional, empathetic communication.",
      "Complete a professional, audit-compliant Field Service Ticket documenting symptoms, safety, tests, observations, actions, and verification.",
      "Translate complex electro-mechanical root causes into actionable operator maintenance instructions.",
      "Manage customer follow-ups and spare-parts order documentation."
    ],
    prerequisites: ["Day 1-11 technical curriculum"],
    sourceRef: {
      title: "Field Service Administration & Customer Communication Manual",
      citation: "CGS ORIS Customer Operations & Field Ticketing Standards",
      confidenceLevel: "confirmed_spec",
      notes: "Ticketing anatomy, customer de-escalation protocol, and documentation compliance."
    },
    contentBlocks: [
      {
        sectionTitle: "Customer Psychology in Production-Down Crises",
        blockType: "teaching",
        contentMarkdown: `### The Pressure Behind the Anger

When you arrive at a client facility with a down machine, the plant manager or business owner is often losing **$500 to $2,500 per hour** in lost production, missed client delivery deadlines, and idle labor.

#### The De-Escalation Protocol:
1. **Never Take Frustration Personally**: The anger is directed at the machine downtime and financial stress, not at you.
2. **Listen Actively Without Defensive Interruption**: Let the customer explain everything that happened without immediately saying \"that's operator error.\"
3. **Acknowledge the Business Impact**: *\"I understand you have three truckloads of packaging that must ship tomorrow morning. My sole focus today is getting this machine printing to factory specification safely and reliably.\"*
4. **Set Realistic Expectations**: Never promise \"I'll have it running in 20 minutes\" before you have completed your diagnostic isolation. Promise **a structured update within 45 minutes** after completing baseline diagnostics.`
      },
      {
        sectionTitle: "The Anatomy of a Professional Service Ticket",
        blockType: "teaching",
        contentMarkdown: `### The 10 Mandatory Fields of a CGS ORIS Service Ticket

A vague service ticket like *\"Fixed printer, replaced board, works now\"* is unacceptable. It leaves no audit trail, fails warranty reimbursement, and teaches nothing to the next technician.

#### The Required 10 Fields:
1. **Equipment Identification**: Model, Serial Number, Firmware Version, Controller Software Build.
2. **Customer-Reported Symptom**: Verbatim customer complaint and reported operational circumstances.
3. **Safety Assessment**: LOTO verified, interlocks inspected, PPE utilized, site hazard audit.
4. **Relevant Configuration**: Substrate type, ink lot numbers, RIP version, ICC profile in use.
5. **Diagnostic Tests Performed**: Multimeter readings, nozzle checks, ping test logs, feed calibration marks.
6. **Observations & Evidence**: Measured values (e.g., \"Line voltage L1-L2 measured 204V, vacuum reading -1.8 kPa, encoder loupe inspection showed ink mist\").
7. **Root Cause Analysis (RCA)**: The precise physical or software failure mechanism.
8. **Corrective Actions Taken**: Step-by-step repair, parts replaced with serial numbers, mechanical calibrations.
9. **Verification Results**: Standard test target printed, measured Delta E, customer witness signature.
10. **Customer Communication & Recommendations**: Training provided, environmental recommendations, preventive maintenance schedule.`
      },
      {
        sectionTitle: "Handover Training: Preventing the Recurring Service Call",
        blockType: "teaching",
        contentMarkdown: `### The Best Service Call is the One That Never Repeats

Over 40% of industrial printer service calls are triggered by improper daily operator maintenance. 

Before leaving the site:
- Walk the lead operator through the physical cleaning routine.
- Show them the exact difference between a clean wiper blade and a worn/cracked blade.
- Verify they have fresh lint-free swabs and certified flush fluid in stock.
- Explain *why* regular maintenance protects their production deadlines.`
      },
      {
        sectionTitle: "Annotated Visual: Professional vs Unacceptable Ticket Comparison",
        blockType: "visual_explanation",
        contentMarkdown: `### Service Ticket Audit Comparison

| Field | Unacceptable / Amateur Entry | Professional CGS ORIS Field Standard |
| :--- | :--- | :--- |
| **Symptom** | \"Print quality looks terrible.\" | \"Horizontal white gap banding across all 4-color passes on 0.080 styrene; nozzle check shows 14 missing nozzles on Cyan channel 2.\" |
| **Diagnostics** | \"Checked stuff out.\" | \"Verified sub-tank vacuum at -1.4 kPa (spec: -3.0 to -3.5 kPa). Inspected vacuum bleed solenoid; measured 24VDC trigger present but valve failed to actuate.\" |
| **Action** | \"Replaced valve, done.\" | \"Replaced sub-tank vacuum bleed solenoid (P/N 842-1092). Adjusted regulator to -3.2 kPa. Performed soft purge. Cleaned wiper blade.\" |
| **Verification** | \"Customer said okay.\" | \"Printed full-bed 4x8 ft ISO test target. Zero missing nozzles. Measured Delta E on 24 patches; max ΔE00 = 1.12. Plant Manager Dave K. inspected and signed FAT signoff at 16:45.\" |`
      },
      {
        sectionTitle: "Realistic Field Case Example",
        blockType: "field_example",
        contentMarkdown: `### Field Case #112: The De-Escalated Crisis
**Client:** Retail Signage Group, Columbus, OH.  
**Situation:** An FST arrived at 7:30 AM. The production director was shouting because a major national retail campaign was stalled. He threatened to kick the printer off the floor and cancel all CGS ORIS contracts.

**FST Handling:**
1. The technician listened quietly, took notes, and said: *\"Tom, I completely understand your frustration. You have a massive deadline. Let me run my initial 30-minute diagnostic protocol, and at 8:00 AM sharp, I will show you exactly what is happening and our exact timeline to fix it.\"*
2. At 8:00 AM, the technician showed him an inspection photo: The UV lamp coolant reservoir had run completely dry because an operator had ignored the low-coolant warning beep, triggering an automatic thermal safety shutdown of the lamps.
3. Flushed the coolant loop, refilled with distilled water/glycol mix, and verified thermal sensor readings.
4. The printer was back in full production by 9:15 AM.

**Result:** The customer apologized for the morning outburst and wrote a commendation letter to Plymouth management.`
      }
    ],
    questions: [
      {
        text: "Upon arriving at a customer facility with a down machine, what is the best initial approach to handling an extremely angry and stressed production manager?",
        domain: "customer_docs",
        explanation: "Listen actively without getting defensive, acknowledge the serious business impact, remain calm, and commit to a structured diagnostic update within a realistic timeframe.",
        options: [
          { text: "Argue back and explain that warranty does not cover angry attitudes.", isCorrect: false, explanation: "Catastrophic customer service failure." },
          { text: "Listen actively without interruption, acknowledge the financial urgency, maintain calm professionalism, and set a specific time for the first diagnostic update.", isCorrect: true, explanation: "Correct. De-escalates tension and establishes professional authority." },
          { text: "Promise that the machine will be 100% fixed within 15 minutes before opening any covers.", isCorrect: false, explanation: "Never make unverified promises." },
          { text: "Turn around and leave the facility.", isCorrect: false, explanation: "Unprofessional abandonment." }
        ]
      },
      {
        text: "In a formal Field Service Ticket, which entry represents a proper, professional 'Action Taken' description?",
        domain: "customer_docs",
        explanation: "Professional documentation details specific part numbers, measured parameters before/after, calibrations performed, and clean condition.",
        options: [
          { text: "\"Swapped out the broken part and wiped up some ink. Looks good.\"", isCorrect: false, explanation: "Completely inadequate." },
          { text: "\"Replaced X-axis sub-tank vacuum solenoid (P/N 842-1092). Reset vacuum regulator to -3.2 kPa. Executed soft purge and verified 100% nozzle check across all channels.\"", isCorrect: true, explanation: "Correct. Precise, technical, auditable, and repeatable." },
          { text: "\"Told operator not to touch buttons anymore.\"", isCorrect: false, explanation: "Unhelpful and unprofessional." },
          { text: "\"Printer fixed itself after reboot.\"", isCorrect: false, explanation: "Ignores root cause." }
        ]
      },
      {
        text: "Why is it critical to have the customer witness a standardized benchmark test print and sign the service report before departing the site?",
        domain: "customer_docs",
        explanation: "Customer witness and signature confirms that the machine was returned to operational specification, preventing subsequent disputes regarding machine status at technician departure.",
        options: [
          { text: "Because technicians receive cash tips upon signature.", isCorrect: false, explanation: "Absurd." },
          { text: "To obtain legal, auditable verification that the machine was demonstrated operating within factory specifications at the time of departure.", isCorrect: true, explanation: "Correct. Protects both the customer and the service organization." },
          { text: "Because the signed form is required to unlock the technician's hotel room.", isCorrect: false, explanation: "Incorrect." },
          { text: "To transfer all OSHA liability to the technician personally.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "What percentage of recurring industrial printer service calls are typically traced back to inadequate or improper daily operator maintenance?",
        domain: "customer_docs",
        explanation: "Industry studies show approximately 40% or more of recurring service interventions result from improper daily maintenance (wiping, capping, swabbing).",
        options: [
          { text: "Approximately 40% or more.", isCorrect: true, explanation: "Correct. Proper operator training during service calls dramatically reduces repeat failures." },
          { text: "Exactly 0%.", isCorrect: false, explanation: "Incorrect; operator maintenance is a primary factor." },
          { text: "100% always.", isCorrect: false, explanation: "Incorrect; genuine component fatigue also occurs." },
          { text: "Under 1%.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "When documenting an unresolved intermittent issue that requires engineering escalation, what must the technician include in the ticket?",
        domain: "customer_docs",
        explanation: "Detailed oscilloscope/multimeter logs, exact environmental conditions, software build numbers, test file copies, and clear steps to reproduce the fault.",
        options: [
          { text: "A note saying 'Engineering needs to deal with this machine.'", isCorrect: false, explanation: "Inadequate." },
          { text: "Specific reproduction steps, recorded error codes, multimeter/voltage readings, environmental logs, and copies of the problematic print files.", isCorrect: true, explanation: "Correct. Engineering requires data-driven evidence to isolate complex intermittent faults." },
          { text: "Personal opinions about the customer's political views.", isCorrect: false, explanation: "Inappropriate and unprofessional." },
          { text: "A copy of the technician's resume.", isCorrect: false, explanation: "Irrelevant." }
        ]
      }
    ]
  },

  // DAY 13
  {
    dayNumber: 13,
    bootcampDayNumber: 3,
    title: "Interview and Company Preparation",
    slug: "day-13-interview-and-company-preparation",
    summary: "Prepare for the CGS ORIS Americas Field Service interview: translating electro-mechanical experience, delivering high-impact STAR behavioral answers, and mastering technical questions.",
    estimatedMinutes: 90,
    competencyDomain: "company_interview",
    objectives: [
      "Structure compelling behavioral interview responses using the STAR method (Situation, Task, Action, Result).",
      "Translate transferable electro-mechanical, IT, or print industry experience into field service assets without fabricating printer repair history.",
      "Articulate CGS ORIS Americas' value proposition and Plymouth MN operations.",
      "Demonstrate professional safety mindset, independent travel readiness, and customer-first ethics."
    ],
    prerequisites: ["Days 1-12 full curriculum"],
    sourceRef: {
      title: "Field Service Technical Interview Rubric & STAR Methodology",
      citation: "CGS ORIS Americas Hiring Specifications & Behavioral Evaluation Guidelines",
      confidenceLevel: "confirmed_spec",
      notes: "Hiring criteria, STAR response models, and transferable skill frameworks."
    },
    contentBlocks: [
      {
        sectionTitle: "How to Talk About Transferable Skills Honestly",
        blockType: "teaching",
        contentMarkdown: `### The #1 Interview Trap: Faking Printer Experience

If you have never serviced a Platinum UV flatbed printer, **do not pretend you have.** Experienced hiring managers in Plymouth will see through fabricated technical claims within two questions.

#### What CGS ORIS Americas Actually Looks For:
Hiring managers look for **strong technical foundations, diagnostic discipline, safety awareness, and autonomous field maturity**.

| Your Prior Background | How to Translate It as a CGS ORIS Field Service Strength |
| :--- | :--- |
| **Automotive / Diesel / Aircraft Tech** | Expertise in hydraulic/fluid circuits, reading complex electrical schematics, precision torque specifications, and disciplined root-cause isolation. |
| **HVAC / Industrial Maintenance** | Working with 208-480V 3-phase power, chillers/refrigeration, motor drives, pneumatic regulators, and OSHA LOTO compliance. |
| **IT / Network / Prepress Tech** | Deep understanding of Gigabit networking, raster image processors, color spaces (RGB/CMYK/L\*a\*b\*), and operating system spoolers. |
| **Commercial Print Operator** | Deep empathy for press deadlines, recognizing print defects (banding, color drift, curing), and understanding customer production pressure. |`
      },
      {
        sectionTitle: "Mastering the STAR Method for Behavioral Questions",
        blockType: "teaching",
        contentMarkdown: `### Situation, Task, Action, Result

When an interviewer asks: *\"Tell me about a time when you were alone on a customer site, ran into an unexpected technical obstacle, and had to solve it under pressure,\"* use STAR:

1. **S - Situation (15-20 seconds)**: Set the scene concisely. Company, machine type, high-stakes deadline.
2. **T - Task (15 seconds)**: Define the specific problem you were responsible for solving.
3. **A - Action (60-90 seconds - THE MOST IMPORTANT PART)**: Walk through your **systematic diagnostic reasoning**:
   - What did you observe first?
   - How did you isolate variables rather than guessing?
   - How did you maintain safety?
   - How did you communicate with the customer?
4. **R - Result (20 seconds)**: The quantifiable outcome. Machine restored, deadline met, zero return visits, positive customer feedback.`
      },
      {
        sectionTitle: "The Top 5 Questions You WILL Be Asked",
        blockType: "teaching",
        contentMarkdown: `### Prepare These Five Core Scenarios:

1. **\"Why CGS ORIS Americas?\"**  
   - Mention the Plymouth MN demonstration/staging facility.
   - Highlight the unique combination of high-precision METIS surface imaging, industry-standard ORIS color management, and Platinum industrial printing.
2. **\"How do you handle extensive 50-75% travel and working autonomously?\"**  
   - Discuss self-discipline, vehicle/tool organization, physical resilience, and comfort being the solo expert on-site.
3. **\"Tell me about a time you made a technical mistake and how you resolved it.\"**  
   - Pick a genuine learning experience. Show immediate ownership, safe correction, transparent documentation, and what system you put in place to ensure it never happened again.
4. **\"A customer is screaming at you because their machine is down. What do you do?\"**  
   - Emphasize empathy, active listening, de-escalation, and setting structured communication check-ins.
5. **\"You are faced with a machine fault you have never seen before, and technical support is closed for the evening. What do you do?\"**  
   - Emphasize reading the schematics, applying the Least-Invasive Testing hierarchy, isolating subsystems systematically, and avoiding dangerous guesswork.`
      },
      {
        sectionTitle: "Annotated Visual: The Model STAR Response Blueprint",
        blockType: "visual_explanation",
        contentMarkdown: `### Architecture of a Winning Interview Answer

\`\`\`
[ SITUATION ]
"During an installation at a packaging plant, our scheduled power commissioning failed..."
       │
[ TASK ]
"My responsibility was to determine why the main servo drive was throwing an under-voltage fault..."
       │
[ ACTION ]
"Rather than assuming the drive was defective, I took out my calibrated DMM. 
I metered Line-to-Line voltages and discovered Phase 3 was dropping to 188V under load.
I traced the circuit back to a loose lug on the customer's main disconnect switch.
I documented the voltage drop, showed it to the plant electrician, and waited while they re-torqued it."
       │
[ RESULT ]
"Voltage stabilized at 214V across all phases. Drive powered cleanly. 
We completed commissioning 4 hours ahead of schedule with zero parts replaced."
\`\`\`

Notice the focus on **multimeter evidence** over guessing.`
      },
      {
        sectionTitle: "Realistic Practice Drill",
        blockType: "interactive_practice",
        contentMarkdown: `### Self-Assessment Exercise: Your 60-Second Hook

Record your voice answering this prompt:  
*\"Alex, why are you the right person for this Plymouth-based field service position?\"*

Check your response against these criteria:
- [ ] Did you mention your core technical foundation (electrical/mechanical/IT)?
- [ ] Did you mention your diagnostic methodology (evidence-based, least-invasive)?
- [ ] Did you express clear enthusiasm for CGS ORIS / METIS / Platinum technologies?
- [ ] Did you confirm readiness for 50-75% travel?
- [ ] Was it delivered in under 90 seconds without rambling?`
      }
    ],
    questions: [
      {
        text: "When an interviewer asks about a machine failure you have never encountered before, what response demonstrates the strongest professional candidate mindset?",
        domain: "company_interview",
        explanation: "Demonstrate structured root-cause methodology: consulting schematics, gathering observable evidence, isolating subsystems through least-invasive testing, and documenting steps.",
        options: [
          { text: "\"I would keep swapping random circuit boards until the machine starts working.\"", isCorrect: false, explanation: "Costly, undisciplined guesswork." },
          { text: "\"I rely on a systematic diagnostic process: consult electrical/hydraulic schematics, gather observable evidence, apply least-invasive isolation tests, and maintain safety protocols.\"", isCorrect: true, explanation: "Correct. Shows disciplined engineering methodology." },
          { text: "\"I would tell the customer the machine is defective and leave.\"", isCorrect: false, explanation: "Unprofessional." },
          { text: "\"I never encounter problems I haven't seen before because I know everything.\"", isCorrect: false, explanation: "Arrogant and untruthful." }
        ]
      },
      {
        text: "In the STAR interview response method, which component should occupy the largest portion of your speaking time?",
        domain: "company_interview",
        explanation: "The 'Action' component should occupy 60-70% of the response, detailing your specific technical reasoning, diagnostic steps, and personal actions.",
        options: [
          { text: "Situation (describing the background company history).", isCorrect: false, explanation: "Keep Situation concise (15-20 seconds)." },
          { text: "Action (explaining your specific diagnostic steps, decisions, and problem-solving methodology).", isCorrect: true, explanation: "Correct. Action showcases your skills and reasoning." },
          { text: "Task (explaining what your manager told you to do).", isCorrect: false, explanation: "Keep Task brief." },
          { text: "Result (talking about the party you had after work).", isCorrect: false, explanation: "Irrelevant." }
        ]
      },
      {
        text: "If you have prior experience in automotive, diesel, or aircraft maintenance rather than digital printing, how should you present this to CGS ORIS interviewers?",
        domain: "company_interview",
        explanation: "Frame it honestly as strong transferable foundation in complex electro-mechanical systems, fluid hydraulics, precision tolerances, and schematic reading.",
        options: [
          { text: "Lie and claim that diesel engines are identical to UV flatbed printheads.", isCorrect: false, explanation: "Dishonest and will fail immediate technical follow-up." },
          { text: "Highlight transferable electro-mechanical competencies: hydraulic flow, electrical schematics, multimeter diagnostics, precision tolerances, and disciplined safety mindset.", isCorrect: true, explanation: "Correct. Highly prized transferable skills." },
          { text: "Apologize for having irrelevant experience.", isCorrect: false, explanation: "Never apologize for solid technical background." },
          { text: "Say that printing is easy and anyone can do it.", isCorrect: false, explanation: "Disrespectful to the specialized craft." }
        ]
      },
      {
        text: "What key facility does CGS ORIS Americas operate in Plymouth, Minnesota, and why is it important to mention in an interview?",
        domain: "company_interview",
        explanation: "Plymouth, MN houses the Americas HQ, technology demonstration center, pre-shipment staging and bench testing facility, and technical training depot.",
        options: [
          { text: "It is their main demonstration center, pre-shipment staging facility, and technical training hub for North American operations.", isCorrect: true, explanation: "Correct. Demonstrates genuine knowledge of their operations." },
          { text: "It is a closed warehouse with no employees.", isCorrect: false, explanation: "Incorrect." },
          { text: "It is an oil refinery.", isCorrect: false, explanation: "Absurd." },
          { text: "It is a retail electronics store.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "When asked about managing the demanding 50% to 75% travel requirement, what answer reflects true field service readiness?",
        domain: "company_interview",
        explanation: "Acknowledge the physical and personal demands, discuss personal organization, proactive travel logistics, and enjoyment of autonomous problem-solving.",
        options: [
          { text: "\"I only travel if I am flown in first class.\"", isCorrect: false, explanation: "Unrealistic." },
          { text: "\"I understand the travel demands and thrive in autonomous field environments; I keep tool kits prepped, manage travel logistics proactively, and enjoy solving challenges on customer sites.\"", isCorrect: true, explanation: "Correct. Shows maturity, preparedness, and professional commitment." },
          { text: "\"I hate traveling, but I need a paycheck.\"", isCorrect: false, explanation: "Disastrous answer." },
          { text: "\"I plan to bring my entire family with me on every service call.\"", isCorrect: false, explanation: "Unrealistic." }
        ]
      }
    ]
  },

  // DAY 14
  {
    dayNumber: 14,
    bootcampDayNumber: 3,
    title: "Full Mock Technical Interview and Readiness Assessment",
    slug: "day-14-full-mock-interview-readiness",
    summary: "The capstone evaluation: a comprehensive 10-question technical, behavioral, and troubleshooting simulation with weighted competency scoring and gap analysis.",
    estimatedMinutes: 90,
    competencyDomain: "company_interview",
    objectives: [
      "Successfully complete a full 10-question technical and behavioral mock interview.",
      "Demonstrate mastery across all five competency domains: Hardware/Safety, Color/ORIS, METIS Scanning, Customer/Docs, and Company Knowledge.",
      "Evaluate performance against professional hiring rubrics.",
      "Generate an individualized post-course readiness report and final study plan."
    ],
    prerequisites: ["Days 1-13 complete curriculum"],
    sourceRef: {
      title: "Field Service Technician Comprehensive Competency Evaluation",
      citation: "CGS ORIS Americas Technical Examination Board 2026",
      confidenceLevel: "confirmed_spec",
      notes: "Capstone evaluation rubric and weighted domain scoring."
    },
    contentBlocks: [
      {
        sectionTitle: "The Capstone Interview Structure",
        blockType: "teaching",
        contentMarkdown: `### The Final Gateway

Welcome to Day 14. You have completed the technical curriculum covering CGS ORIS business pillars, Platinum printer electro-mechanics, METIS optical surface scanning, ORIS color science, OSHA safety, and field documentation.

This final module evaluates your total readiness across the five weighted core competencies:
- **Hardware, Diagnostics & Safety**: 35%
- **Color Science & ORIS Workflows**: 25%
- **METIS Material Scanning**: 15%
- **Customer Support & Service Documentation**: 15%
- **Company Knowledge & Interview Delivery**: 10%

Review the questions below carefully. Formulate your answers with precision, citing specific physical principles, diagnostic tools, and professional safety practices.`
      },
      {
        sectionTitle: "Comprehensive Technical Review Sheet",
        blockType: "printable_reference",
        contentMarkdown: `### Quick-Fire Diagnostic Recall Table

| Symptom / Scenario | First Physical Check | Probable Root Cause | Corrective Action |
| :--- | :--- | :--- | :--- |
| **Horizontal White Banding** | Print Nozzle Check | Missing or deflected nozzles | Soft purge, wipe wiper blade, verify sub-tank vacuum (-3.2 kPa). |
| **Horizontal Dark Banding (Clean Nozzles)** | Print Step Calibration Target | Media feed under-stepping (pass overlap) | Recalibrate media advance factor for current media thickness/weight. |
| **Uncured / Tacky UV Ink** | Radiometer Irradiance Measurement | Dirty quartz window or UV lamp degradation | Clean quartz window with IPA; verify cooling chiller loop; replace LED array if irradiance < 500 mW/cm². |
| **Color Shift on New Substrate** | Measure unprinted media L\*a\*b\* | Substrate white point / absorption shift | Linearize device; generate substrate-specific profile in ORIS Press Matcher. |
| **Printer Pauses Mid-Pass** | Ping test / Check NIC status | Network buffer underrun / 100Mbps auto-neg | Isolate printer on dedicated Gigabit NIC; replace patch cable with Cat6; disable USB sleep. |
| **Static Aerosol Ink Mist** | Electrostatic Field Meter | Plastic substrate high static (> 20kV) | Clean ionizing bar pins; add static tinsel; maintain room humidity between 40-60% RH. |
| **Bright Streaks on METIS Scan** | Inspect White Reference Tile | Fingerprint oil or debris on calibration tile | Clean tile with optical lens fluid; re-run shading/dark calibration. |
| **Taped Safety Interlock** | Physical Safety Inspection | Customer safety bypass | STOP WORK. Remove bypass, test interlock shutdown, document on service ticket with plant manager. |`
      },
      {
        sectionTitle: "Final Readiness Scoring Rubric",
        blockType: "teaching",
        contentMarkdown: `### How You Are Evaluated in the Capstone Assessment

Each question evaluates five distinct dimensions:
1. **Technical Reasoning**: Did you cite correct physical, electrical, or colorimetric laws?
2. **Safety Awareness**: Did you prioritize LOTO, PPE, and non-hazardous execution?
3. **Customer Communication**: Was your response professional, empathetic, and de-escalating?
4. **Verification & Documentation**: Did you require objective data (multimeter, spectrophotometer, FAT signoff) before closing?
5. **Clarity & Structure**: Was the delivery concise, structured, and free of vague filler?`
      }
    ],
    questions: [
      {
        text: "During a high-speed production run, an operator opens the front cover of a Platinum flatbed printer. The carriage continues moving, and the UV lamps remain illuminated. What is your immediate assessment and required action?",
        domain: "hardware_safety",
        explanation: "The safety interlock has failed or been bypassed, creating an immediate amputation and blinding UV hazard. Immediately hit an E-Stop, lock out the machine, and replace/repair the interlock.",
        options: [
          { text: "Finish the current print job before looking at the switch.", isCorrect: false, explanation: "Catastrophic safety violation; puts operators at extreme risk." },
          { text: "This is a critical safety failure: immediately press an Emergency Stop, lock out the machine (LOTO), and repair/replace the failed interlock switch before any further operation.", isCorrect: true, explanation: "Correct. Unshielded UV radiation and high-speed motion require immediate shutdown." },
          { text: "Advise the operator to wear sunglasses and keep printing.", isCorrect: false, explanation: "Gross negligence." },
          { text: "Turn off the facility water supply.", isCorrect: false, explanation: "Irrelevant." }
        ]
      },
      {
        text: "A packaging customer wants to reproduce 85 different brand spot colors on their digital press without stopping to wash ink decks or change spot inks. Which CGS ORIS software package is specifically engineered to solve this?",
        domain: "color_oris",
        explanation: "ORIS X GAMUT converts spot colors into an extended 7-color fixed ink set (CMYK+OGV), reproducing over 95% of Pantone colors without ink changeovers.",
        options: [
          { text: "ORIS X GAMUT", isCorrect: true, explanation: "Correct. X Gamut's 7-color ECG workflow is built specifically for this application." },
          { text: "Adobe Photoshop CS2", isCorrect: false, explanation: "Incorrect." },
          { text: "ORIS COLOR TUNER alone", isCorrect: false, explanation: "Color Tuner is for contract proofing, not 7-color production conversion." },
          { text: "Windows Media Player", isCorrect: false, explanation: "Absurd." }
        ]
      },
      {
        text: "You are setting up a METIS PM3D Hawk scanner to capture fine 3D wood grain texture for an industrial flooring manufacturer. Which lighting mode and data outputs are utilized?",
        domain: "metis_scanning",
        explanation: "Directional SynchroLight illumination captures multi-angle micro-shadows, allowing photometric stereo algorithms to compute 3D relief, normal, and gloss maps.",
        options: [
          { text: "Standard room ceiling fluorescent tubes only.", isCorrect: false, explanation: "Incorrect." },
          { text: "Directional SynchroLight illumination with Photometric Stereo algorithms, generating 3D surface relief, normal maps, and gloss maps.", isCorrect: true, explanation: "Correct. SynchroLight generates complete 3D surface texture data." },
          { text: "Infrared heat lamps generating thermal heat maps.", isCorrect: false, explanation: "Incorrect." },
          { text: "Strobe flash cameras generating 2D black and white JPEGs only.", isCorrect: false, explanation: "Incorrect." }
        ]
      },
      {
        text: "A customer reports that a newly installed flatbed printer is producing prints with severe color banding. You observe that all nozzles fire 100% cleanly on the test pattern, but prints on heavy 1-inch thick acrylic show dark horizontal lines every 2 inches. What is the root cause?",
        domain: "hardware_safety",
        explanation: "Dark lines with clean nozzles indicate media advance (step feed) under-advance (overlap), likely exacerbated by the high weight/friction of 1-inch thick acrylic.",
        options: [
          { text: "The printhead nozzles are clogged with dried solvent.", isCorrect: false, explanation: "Contradicts the fact that the nozzle check is 100% clean." },
          { text: "Media advance step feed error: the heavy acrylic sheet is slipping or under-advancing, causing successive print swaths to overlap and deposit excess ink.", isCorrect: true, explanation: "Correct. Overlap creates periodic dark lines." },
          { text: "The RIP workstation has a loose keyboard cable.", isCorrect: false, explanation: "Irrelevant." },
          { text: "The UV curing lamps are printing yellow ink.", isCorrect: false, explanation: "Nonsensical." }
        ]
      },
      {
        text: "What is the professional definition of a successful field service installation?",
        domain: "customer_docs",
        explanation: "A successful installation means the equipment is safely installed, mechanically leveled, verified against published technical benchmarks with test prints/Delta E readings, operators are trained on maintenance, and the customer has signed the acceptance document.",
        options: [
          { text: "The technician leaves the customer facility before 5:00 PM regardless of machine state.", isCorrect: false, explanation: "Unprofessional." },
          { text: "The equipment is safely leveled, calibrated, and demonstrated running benchmark test targets within factory tolerances; operators are trained on maintenance; and the customer signs the formal Acceptance Protocol.", isCorrect: true, explanation: "Correct. Complete technical, educational, and legal completion." },
          { text: "The machine turns on once without catching fire.", isCorrect: false, explanation: "Completely inadequate." },
          { text: "The customer agrees to pay for dinner.", isCorrect: false, explanation: "Unprofessional." }
        ]
      }
    ]
  }
];
