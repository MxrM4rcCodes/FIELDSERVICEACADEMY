# CGS ORIS FIELD SERVICE ACADEMY
## Comprehensive Technical Documentation & Operating Manual

> **Subtitle:** *Learn the Systems. Diagnose the Faults. Master the Workflow.*  
> **Target Role:** CGS ORIS Americas Field Service Technician (Plymouth, Minnesota Depot)  
> **Platform Version:** 1.0.0 (Production Release)

---

## 1. PROJECT OVERVIEW & ACCOMPLISHMENTS

The **CGS ORIS Field Service Academy** is a database-backed, multi-user web application engineered to prepare candidates for the CGS ORIS Americas Field Service Technician interview and to serve as an ongoing training platform for industrial inkjet printing, surface scanning, color management, safety, and customer service.

### Core Implementation Highlights
1. **Full-Stack Architecture**: Built on Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, and Lucide icons.
2. **Relational PostgreSQL Database**: Powered by `@electric-sql/pglite` with persistent local disk storage in `./data/pgdata/`. Features 26 relational tables, strict foreign keys, cascade rules, and indexes. Fully compatible with external PostgreSQL instances via connection strings.
3. **Session Authentication & Security**: JWT session cookies (`jose`), password hashing (`bcryptjs`), and server-enforced role-based access control (`admin` and `learner`).
4. **Curriculum Scope**:
   - **Track A (3-Day Interview Bootcamp)**: 8-hour accelerated interview sprint.
   - **Track B (14-Day Full Technical Course)**: 21-hour structured curriculum covering all 14 instructional days with >= 3 substantial teaching blocks, annotated visual explanations, realistic field examples, interactive practice drills, 5-question knowledge checks (70 questions total) with rationales for all choices, and printable reference sheets.
5. **Interactive Diagnostic Simulator**: All 10 required real-world field scenarios with hidden underlying root causes, dynamic choice branching, safety penalties, least-invasive diagnostic scoring, revealed evidence audit logs, and automatic service ticket generation.
6. **Vector-Based Visual Systems**:
   - **Interactive Systems Map (`/systems-map`)**: Vector workflow with 5 selectable pathways and node detail panels.
   - **Printer Anatomy Lab (`/printer-lab`)**: 13 clickable electromechanical subsystems with "Trace the Fault" symptom mapping.
   - **Troubleshooting Decision Tree (`/troubleshooting`)**: Systematic flowchart enforcing OSHA LOTO and PPE stops.
7. **Metrology & Specialized Labs**:
   - **Color Science Lab (`/color-lab`)**: Interactive $\Delta E_{00}$ and $\Delta E_{76}$ calculator, substrate white-point simulator, and ISO 13655 M-modes guide.
   - **ORIS Product Explorer (`/oris`)**: Product breakdown and customer-needs matching game.
   - **METIS Surface Imaging Lab (`/metis`)**: SynchroLight multi-angle directional lighting simulator and artifact triage matrix.
   - **Flashcards & Glossary (`/flashcards`)**: 66 technical terms across 8 categories with 3D flip animations and Leitner spaced-repetition mastery tracking.
   - **Interview Studio (`/interview`)**: Technical and STAR behavioral question practice with 5-part rubric scoring.
   - **Service Documentation Lab (`/service-tickets`)**: 10-field audit-compliant field service ticket generator and printable report engine.
   - **Study & Print Center (`/print-center`)**: Print-optimized sheets (`@media print`) with zero clipped labels.
   - **Content Administration Console (`/admin`)**: Server-enforced administrative oversight (`role === 'admin'`).
8. **Automated Verification**: 23 automated tests across 6 Vitest suites covering all 10 acceptance workflows.

---

## 2. SYSTEM ARCHITECTURE & DATABASE DESIGN

### Database Relational Schema (26 Tables)
- **Identity & Authorization**: `users`, `profiles`
- **Curriculum Structure**: `learning_tracks`, `courses`, `modules`, `lessons`, `lesson_content_blocks`
- **Assessment & Progress**: `lesson_progress`, `quiz_questions`, `quiz_options`, `quiz_attempts`, `quiz_answers`
- **Diagnostic Simulation Engine**: `troubleshooting_scenarios`, `scenario_nodes`, `scenario_choices`, `scenario_runs`, `scenario_events`
- **Glossary & Mastery**: `flashcards`, `flashcard_mastery`
- **Adaptive Competency Engine**: `competency_scores`
- **Field Operations & Notes**: `user_notes`, `interview_questions`, `interview_attempts`, `service_tickets`
- **Audit & Compliance**: `source_references`, `content_revisions`

### Competency Weight Model
Observed mastery scores are distinguished from curricular priority weights:
- **Hardware, Diagnostics & Safety**: 35% priority weight
- **Color Science & ORIS Workflows**: 25% priority weight
- **METIS Material Scanning**: 15% priority weight
- **Customer Support & Documentation**: 15% priority weight
- **Company & Interview Knowledge**: 10% priority weight

---

## 3. OPERATING INSTRUCTIONS FOR A LEARNER / CANDIDATE

### A. Accessing the Platform & Authentication
1. **Candidate Login Credentials**:
   - **Email**: `technician@cgs-oris.academy`
   - **Password**: `FieldTech2026!`
   - *Alternative*: Click the user icon in the top-right corner of the navigation bar and select **"Alex Morgan (Learner)"** to activate the candidate session instantly.
2. All progress, quiz scores, scenario runs, personal notes, and flashcard mastery persist automatically in the database.

### B. Candidate Dashboard Operations (`/`)
1. **Setting Target Interview Date**:
   - View the **"Days Remaining"** countdown widget.
   - Click the **pencil icon** next to the target interview date to enter your scheduled interview date; click **Save** to update the database.
2. **Switching Active Track**:
   - Toggle between **"Track B: Full 14-Day Technical Course"** (recommended for full preparation) and **"Track A: 3-Day Interview Bootcamp"** (accelerated 8-hour sprint).
3. **Resuming Learning**:
   - Click the primary **"Resume Learning"** button to jump directly to your next uncompleted or in-progress module.
4. **Reviewing Competency Radar**:
   - Monitor observed mastery across the 5 domains. Note the **Adaptive Recommendation Banner**, which suggests the exact lesson or scenario needed to address your lowest competency.

### C. Completing Daily Curriculum Lessons (`/course` and `/lessons/[slug]`)
1. **Structured Learning Sequence**:
   - Read the **Objectives & Prerequisites** to understand target outcomes.
   - Work through the **Teaching Sections**, **Annotated Diagrams**, and **Realistic Field Examples**.
   - Complete the **Interactive Practice Drill**.
2. **Knowledge Check Quizzes**:
   - Each lesson concludes with a **5-question diagnostic assessment**.
   - Select your answers and click **"Submit Knowledge Check"**.
   - Passing threshold is **80% (4 of 5 correct)**.
   - Review the detailed explanations provided for both correct and incorrect options. If you do not pass, review the **Targeted Recommendation** callout and click **"Retry Knowledge Check"**.
3. **Taking Personal Field Notes**:
   - Use the **"Personal Field Notes"** box at the bottom of the lesson to record key machine specifications (e.g., negative pressure tolerances). Notes persist in your database account.

### D. Using Visual Systems & Diagnostic Labs
1. **Interactive Systems Map (`/systems-map`)**:
   - Trace the 7 production stages from raw physical specimen or digital PDF to post-cure measurement.
   - Use the pathway toolbar to highlight specific flows: *Digital to Print*, *Physical to METIS*, *Contract Proofing*, *Production Verify*, or *Closed-Loop Feedback*.
   - Click any node to open the detail panel showing inputs, outputs, failure modes, and field diagnostic questions.
   - Use the **Zoom (+ / -)** and **Reset** buttons for navigation.
2. **Printer Anatomy Lab (`/printer-lab`)**:
   - Click through the **13 electromechanical subsystems** to inspect functional operations and failure symptoms.
   - Use **"Trace the Fault Mode"** to select a symptom (e.g., *Horizontal Banding* or *Head-Strike Risk*). Implicated subsystems pulse with amber indicators.
   - Test your knowledge with the practice question inside each subsystem drawer.
3. **Troubleshooting Decision Tree (`/troubleshooting`)**:
   - Follow the step-by-step diagnostic logic: *Customer Report → Safety Assessment → Evidence Gathering → Subsystem Isolation → Action → Verification → Documentation*.
   - Observe mandatory OSHA safety interlock stops before proceeding.

### E. Executing Branching Diagnostic Scenarios (`/scenarios`)
1. Select any of the **10 real-world service cases**.
2. Review the customer complaint, machine context, and recent changes.
3. Choose your diagnostic action or test. Note:
   - Hidden underlying states are revealed **only after** an authorized test is selected.
   - Least-invasive tests (e.g., nozzle checks, loupe inspections) earn diagnostic points.
   - Frantic parts-swapping or bypassing interlocks incurs severe cost or safety penalties.
4. Upon achieving a **Terminal Success**, click **"Generate Official Service Ticket"** to pre-populate a formal service report.

### F. Specialized Metrology Labs
1. **Color Science Lab (`/color-lab`)**:
   - Adjust the **Reference** and **Sample** sliders in the Delta E Calculator to compute real-time $\Delta E_{00}$ and $\Delta E_{76}$ values.
   - Compare commercial tolerance ratings (*Pass*, *Marginal*, *Severe Mismatch*).
   - Test substrate white-point shifts across High-Gloss White Vinyl, Uncoated Kraft Board, and Fluted Polypropylene.
   - Review ISO 13655 measurement modes (**M0, M1, M2, M3**).
2. **ORIS Product Explorer (`/oris`)**:
   - Study product cards for COLOR TUNER, PRESS MATCHER, X GAMUT, FLEX PACK, CERTIFIED & EVALUATE, and CxF TOOLBOX.
   - Play the **Customer-Needs Matching Exercise** to test your solution mapping skills.
3. **METIS Surface Imaging Lab (`/metis`)**:
   - Toggle the **SynchroLight** angles (*Diffuse, Left, Right, Top, Synchro*) to see how directional micro-shadows generate 3D normal, relief, and gloss maps.
   - Review the scanner artifact vs. printer defect triage table.

### G. Flashcards & Glossary (`/flashcards`)
1. Filter 66 technical terms by category or search by keyword.
2. Click any card to trigger the **3D flip animation** to read field context, key takeaways, and common misconceptions.
3. Click **"✓ Mark Known"** or **"Needs Review"** to update your database-backed Leitner spaced-repetition mastery level (Levels 0 to 5).

### H. Interview Studio (`/interview`)
1. Select a technical, behavioral (STAR), or customer-handling question.
2. Read the **Transferable Skills Coaching** tip.
3. Type or dictate your verbal practice answer and click **"Submit for Structured Evaluation"**.
4. Review your **5-part rubric score** (Technical, Safety, Customer, Verification, Clarity) out of 100 points, evaluator feedback, and benchmark model answers.

### I. Service Documentation Lab (`/service-tickets`)
1. Draft formal 10-field Field Service Reports including equipment S/N, complaints, LOTO safety audits, tests, observations, actions taken, verification results, and customer communication.
2. Select any ticket and click **"Print Service Report"** for a clean, audit-compliant physical printout.

### J. Study & Print Center (`/print-center`)
1. Select printable field sheets including the *OSHA LOTO Safety Protocol*, *Installation Checklist*, *Defect Isolation Matrix*, and *Blank FST Forms*.
2. Click **"Print Active Document"** to print or export to PDF with print-optimized CSS.

---

## 4. OPERATING INSTRUCTIONS FOR AN ADMINISTRATOR

### A. Accessing the Admin Console (`/admin`)
1. **Admin Login Credentials**:
   - **Email**: `admin@cgs-oris.academy`
   - **Password**: `Admin123!`
   - *Alternative*: Click the user icon in the top-right corner of the navigation bar and select **"Sarah Jenkins (Admin)"**.
2. **Server-Side Security**:
   - The `/admin` route and `/api/admin` endpoints enforce server-level role verification (`user.role === 'admin'`). Non-admin learners attempting direct access receive an HTTP `403 Forbidden` response.

### B. Administrative Capabilities
1. **System Health & Platform Metrics**:
   - Review live counters for registered users, lessons, quiz questions, diagnostic scenarios, flashcards, and service tickets.
2. **Curriculum Lesson Editing**:
   - Select any of the 14 lessons from the dropdown.
   - Edit the lesson title, summary description, and estimated study minutes.
   - Click **"Commit Lesson Revision"**. Changes take effect immediately in the database.
3. **Content Revision Audit Trail**:
   - The admin console automatically logs all content modifications into the `content_revisions` table with timestamps, entity IDs, author IDs, and diff summaries.
4. **Candidate Account Registry**:
   - Inspect all registered candidate profiles, active tracks, target interview dates, and role assignments.

### C. Server Maintenance & Database Operations
1. **Running Database Seed**:
   ```bash
   npm run seed
   ```
   Re-initializes and verifies all tracks, modules, lessons, content blocks, quiz questions, scenarios, nodes, choices, flashcards, and references.
2. **Running Automated Test Suites**:
   ```bash
   npm run test
   ```
   Executes all 23 unit, integration, and acceptance tests using Vitest.
3. **Building for Production**:
   ```bash
   npm run build
   ```
   Compiles Next.js 14 production bundles and pre-renders static routes.
4. **Starting the Production Server**:
   ```bash
   npm run start
   ```
   Launches the optimized server bound to `0.0.0.0:3000`.

---

## 5. TECHNICAL SOURCE REFERENCES & CONFIDENCE RATINGS

| Reference ID | Title & Citation | Confidence Level | Scope |
| :--- | :--- | :--- | :--- |
| **REF-01** | CGS ORIS Americas Field Service Specification (Plymouth, MN Hub 2024–2026) | `confirmed_spec` | Operations hub, demo/staging depot, pre-shipment bench testing, and travel reality. |
| **REF-02** | OSHA 29 CFR 1910.147 Control of Hazardous Energy (Lockout/Tagout) | `industry_standard` | Mandatory life-safety, physical disconnect padlocks vs. control E-Stops. |
| **REF-03** | ISO 13655:2017 Spectral Measurement and Colorimetric Computation | `industry_standard` | M0, M1 (D50 Daylight with UV), M2 (UV-Cut), and M3 (Polarized) standards. |
| **REF-04** | Industrial UV-LED Inkjet Subsystem Architecture (Platinum Technologies) | `conceptual_model` | 13 electromechanical subsystems, negative pressure hydraulics (-3.2 kPa), encoders. |
| **REF-05** | METIS Systems Surface Digitizing & Photometric Stereo Manual (Rome, Italy) | `confirmed_spec` | SynchroLight directional LED lighting, 3D relief/normal maps, shading calibration. |
| **REF-06** | CGS ORIS Software Suite Technical Guides (International GmbH) | `confirmed_spec` | Color Tuner, Press Matcher, X Gamut, Flex Pack, Certified & Evaluate, CxF Toolbox. |
| **REF-07** | ASTM D3359 Rating Adhesion by Tape Test | `industry_standard` | Cross-hatch lattice cut method for verifying UV photopolymerization and substrate bonding. |

---

*CGS ORIS Field Service Academy — Engineered for Arena.ai.*
