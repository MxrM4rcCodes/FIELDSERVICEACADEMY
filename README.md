# CGS ORIS FIELD SERVICE ACADEMY
> **Learn the Systems. Diagnose the Faults. Master the Workflow.**

An independent, full-stack, database-backed educational web application engineered for candidates preparing for the **CGS ORIS Americas Field Service Technician** role in **Plymouth, Minnesota**, and for professionals studying industrial printing, surface scanning, color management, safety, and field customer service.

*Disclaimer: This independent educational platform is not affiliated with or endorsed by CGS Publishing Technologies International GmbH, METIS Systems s.r.l., or Platinum Technologies. All schematics and diagrams are conceptual educational models.*

---

## 🚀 Live Features & Functional Modules

### 1. Two Unified Learning Tracks
- **Track A: 3-Day Interview Bootcamp** (8 hours of high-intensity preparation):
  - Day 1: Systems & Company Knowledge (Plymouth MN hub, ORIS software, METIS scanners, Platinum printers, 60–90 second hook).
  - Day 2: Technical Troubleshooting (Safety, LOTO, defect isolation, hydraulics, networking, Delta E, customer communication).
  - Day 3: Interview Simulation (STAR behavioral answers, customer troubleshooting role-play, readiness score).
- **Track B: Comprehensive 14-Day Technical Course** (21 hours across 14 deep modules):
  - 14 substantive days covering Foundations, Platinum Architecture, Inkjet Troubleshooting, Networking/RIPs, Color Science & CIELAB, ORIS Ecosystem, METIS Material Imaging, Installation/Commissioning, Advanced Multi-Variable Fault Isolation, Customer Service & Field Documentation, Interview Preparation, and Full Capstone Mock Interview.
  - Every day contains objectives, prerequisites, >= 3 substantial teaching sections, annotated visual explanations, realistic field examples, interactive practice, 5-question knowledge checks with rationales for all choices, and printable reference notes.

### 2. Candidate Dashboard & Operations Center
- Dynamic interview date countdown with inline editable date picker.
- Track toggle between 3-Day Bootcamp and 14-Day Full Course.
- Real-time overall course completion percentage and module counts.
- **Competency Mastery Radar**: Weighted breakdown tracking:
  - Hardware, Diagnostics & Safety: **35% priority weight**
  - Color Science & ORIS Workflows: **25% priority weight**
  - METIS Material Scanning: **15% priority weight**
  - Customer Support & Documentation: **15% priority weight**
  - Company & Interview Knowledge: **10% priority weight**
- **Adaptive Recommendation Engine**: Dynamically analyzes the learner's weakest competency domain and recommends specific lessons and diagnostic scenarios to close the gap.
- "Resume Learning" action and recent saved field notes.

### 3. Interactive Systems Map (`/systems-map`)
- Scalable, vector-rendered interactive workflow diagram:
  `Artwork / Requirements → Optional METIS Capture → ORIS Color Management → RIP / Job Preparation → Industrial Printer → Output Inspection & Measurement → Closed-Loop Feedback`.
- 5 Selectable Pathways:
  1. Digital Artwork to Industrial Print
  2. Physical Material to METIS Scanning
  3. Contract Proofing & Color Approval
  4. Production Printing & Verification
  5. Troubleshooting Feedback & Correction
- Interactive node drawer revealing inputs, outputs, core components, CGS products, failure modes, diagnostic inquiries, and confidence labels.
- Zoom, pan, reset, and print layout.

### 4. Platinum Printer Anatomy Lab (`/printer-lab`)
- 13 Clickable Electromechanical Subsystems:
  - Main Printer Controller (CPU & FPGA)
  - RIP & Print-Job Interface
  - Sensors, Interlocks & E-Stops
  - Bulk Ink Reservoirs & Agitation
  - Ink Lines & Carriage Drag Chain
  - Negative Pressure (Meniscus) System (-3.2 kPa)
  - Piezoelectric Printheads & Nozzles
  - Carriage & Linear Guideway (X-Axis)
  - Linear Optical Encoder & Reader Head
  - Vacuum Bed & Media Handling
  - Media Advance (Step Feed / Y-Axis)
  - UV-LED Curing Lamp Arrays (395nm)
  - Finished Output & Verification
- Detailed explanations, common failure symptoms, observable evidence, and interactive practice questions.
- **"Trace the Fault" Mode**: Highlights all subsystems implicated by specific symptoms (Horizontal Banding, Uncured Ink, Head Strike Risk, Severe Color Shift).

### 5. Interactive Troubleshooting Decision Tree (`/troubleshooting`)
- Multi-branch interactive flowchart based on:
  `Customer Report → Safety Assessment → Gather Evidence → Identify Symptom → Isolate Subsystem → Select Test → Interpret Result → Correct or Escalate → Verify → Document`.
- Enforces OSHA Lockout/Tagout and PPE stops whenever hazardous kinetic or optical conditions are presented.

### 6. Branching Diagnostic Simulator (All 10 Real-World Cases) (`/scenarios`)
1. Banding caused by missing or deflected nozzles.
2. Banding despite a clean nozzle check (media step feed calibration / overlap).
3. Color mismatch after changing substrate (kraft board white-point shift & white underprint).
4. Job stuck in the RIP or print queue (scratch disk saturation & locked temp file).
5. Inconsistent curing or adhesion (dirty quartz window & low substrate dyne level).
6. METIS scan with lighting/calibration artifacts (silicone film on white reference tile).
7. Head-strike risk from substrate irregularity (warped corrugated board & vacuum masking).
8. Recurring fault following earlier service visit (loose encoder bracket without threadlocker).
9. Network communication interruption (IP address conflict & dedicated subnetting).
10. Unsafe equipment condition requiring shutdown and escalation (bypassed interlock & charred drag chain harness).
- Evaluates Safety, Least-Invasive Diagnostics, and Cost.
- Reveals test evidence only when authorized tests are selected.
- Generates official Field Service Tickets upon resolution!

### 7. Color Science & Spectrophotometry Lab (`/color-lab`)
- Interactive **Delta E Calculator** comparing CIE DE2000 ($\Delta E_{00}$) and CIE 1976 ($\Delta E_{76}$) with commercial tolerance ratings.
- Substrate Influence Simulator: visualizes white-point shifts across High-Gloss White Vinyl, Uncoated Kraft Corrugated, and Fluted Polypropylene.
- ISO 13655 Measurement Modes Guide (M0, M1, M2, M3).
- Educational instrument disclaimers on sRGB browser limits vs physical spectrophotometry.

### 8. ORIS Product Explorer (`/oris`)
- Learning cards for COLOR TUNER, PRESS MATCHER, X GAMUT, FLEX PACK, CERTIFIED & EVALUATE, and CxF TOOLBOX.
- Interactive Customer-Needs Matching game with instant scoring and feedback.

### 9. METIS Surface Imaging Lab (`/metis`)
- SynchroLight multi-angle directional lighting simulator demonstrating photometric stereo 3D relief, normal, and gloss maps.
- Product family comparisons (PM3D HAWK, DRS, EDS).
- Scanner artifact vs printer defect triage matrix.

### 10. Flashcards & Glossary (`/flashcards`)
- 66 terms across 8 categories (Printer Hardware, Defects, Color Science, Scanning, RIP/Networking, Safety, ORIS Products, Customer Service).
- Category filtering, live search, 3D card flip, and Leitner spaced-repetition mastery tracking backed by PostgreSQL.

### 11. Interview Studio (`/interview`)
- Technical and STAR behavioral interview question simulator.
- 5-part rubric scoring: Technical Reasoning (20%), Safety Awareness (20%), Customer Communication (20%), Verification & Documentation (20%), and Clarity (20%).
- Model answers and transferable skills framing guidance.

### 12. Service Documentation Lab (`/service-tickets`)
- 10-field audit-compliant Field Service Ticket editor and historical log.
- Clean `@media print` formatting for official print reports.

### 13. Study & Print Center (`/print-center`)
- Print-optimized sheets for Safety & LOTO, Installation Checklist, Inkjet Defect Isolation Matrix, and Blank FST forms.

### 14. Server-Enforced Content Administration (`/admin`)
- Accessible strictly to users with `role === 'admin'`. Normal learners receive 403 Forbidden.
- Real-time system metrics, curriculum lesson editor, user registry, and content revision audit trail.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Database**: PostgreSQL via `@electric-sql/pglite` with persistent local disk storage in `./data/pgdata/`, executing real relational SQL, foreign keys, constraints, and indexes. (Compatible with external PostgreSQL databases via connection string).
- **Authentication**: JWT session cookies with bcryptjs password hashing and role-based access control (`admin` and `learner`).
- **Testing**: Vitest automated test runner executing 23 integration and acceptance tests.

---

## 🔐 Default Seed User Accounts

| Role | Email | Password | Full Name & Role Description |
| :--- | :--- | :--- | :--- |
| **Learner / Candidate** | `technician@cgs-oris.academy` | `FieldTech2026!` | Alex Morgan (Field Service Candidate) |
| **Administrator** | `admin@cgs-oris.academy` | `Admin123!` | Sarah Jenkins (Technical Director) |

*A Quick Role Switcher dropdown is available in the top right of the navigation bar for instant evaluation testing.*

---

## 🧪 Automated Testing & Verification

Run the test suite:
```bash
npm run test
```

All 23 automated tests pass across 6 test suites:
- `tests/db.test.ts`: Database schema, 14 curriculum days, 70 quiz questions, 10 scenarios, 66 flashcards.
- `tests/auth.test.ts`: Credentials authentication, role isolation, and session token verification.
- `tests/scenarios.test.ts`: Scenario branching engine, initial/terminal states, safety penalties.
- `tests/color.test.ts`: Delta E 76 and Delta E 2000 calculations and commercial tolerances.
- `tests/competency.test.ts`: Weighted competency model (35%, 25%, 15%, 15%, 10%).
- `tests/e2e-acceptance.test.ts`: End-to-end execution of all 10 acceptance workflows.

---

## 📦 Build & Deployment

To create a production build:
```bash
npm run build
```

To run the production server:
```bash
npm run start
```
The server binds to `0.0.0.0:3000`.

---

## 📚 Technical Sources & References

1. **OSHA 29 CFR 1910.147**: The Control of Hazardous Energy (Lockout/Tagout).
2. **ISO 13655:2017**: Graphic technology — Spectral measurement and colorimetric computation for graphic arts images.
3. **ISO 12647-7**: Proofing processes working directly from digital data.
4. **ISO 17972 (CxF)**: Graphic technology — Colour exchange format (CxF3).
5. **ASTM D3359**: Standard Test Methods for Rating Adhesion by Tape Test.
6. **CGS ORIS Americas Operations Guidelines**: Plymouth, Minnesota facility specifications.
7. **METIS Systems s.r.l. Documentation**: PM3D HAWK, DRS, and EDS technical manuals.
8. **Platinum Technologies Printer Service Architecture**: Industrial UV-LED flatbed and hybrid printer manuals.

---

*CGS ORIS Field Service Academy — Engineered for Arena.ai.*
