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
    subtitle: "A focused three-day interview-preparation plan",
    description: "A short, grouped study path through product research, safe fault reasoning, and honest interview practice. Six lessons are grouped across three bootcamp days.",
    total_days: 3,
    estimated_hours: 8.0,
    sort_order: 1,
  },
  {
    id: "trk_course_14",
    slug: "course_14",
    title: "Track B: Full 14-Day Technical Course",
    subtitle: "Self-paced industrial imaging and field-service curriculum",
    description: "Fourteen instructional days covering color workflows, printer and scanner concepts, safety, diagnosis, documentation, and interview practice. Product-specific settings and service actions must be verified in current documentation.",
    total_days: 14,
    estimated_hours: 21.0,
    sort_order: 2,
  },
];

export const seedModules = [
  { id: "mod_foundation", title: "Module 1: Foundations & Workflow", slug: "foundations", category: "systems", sortOrder: 1 },
  { id: "mod_hardware_safety", title: "Module 2: Equipment Concepts & Safety", slug: "hardware-safety", category: "hardware", sortOrder: 2 },
  { id: "mod_imaging_color", title: "Module 3: Color Science & Software", slug: "color-workflow", category: "color", sortOrder: 3 },
  { id: "mod_scanning", title: "Module 4: Scanner Families & Imaging", slug: "metis-scanning", category: "scanning", sortOrder: 4 },
  { id: "mod_field_ops", title: "Module 5: Field Operations & Diagnosis", slug: "field-operations", category: "operations", sortOrder: 5 },
  { id: "mod_interview", title: "Module 6: Documentation & Interview Practice", slug: "interview-mastery", category: "interview", sortOrder: 6 },
];

function section(sectionTitle: string, contentMarkdown: string, blockType = "teaching"): SeedContentBlock {
  return { sectionTitle, contentMarkdown, blockType };
}

let questionIndex = 0;
function question(
  text: string,
  domain: string,
  answer: string,
  rationale: string,
  distractors: Array<{ text: string; explanation: string }>,
): SeedQuestion {
  const choices = [
    { text: answer, isCorrect: true, explanation: rationale },
    ...distractors.map((option) => ({ ...option, isCorrect: false })),
  ];
  const correct = choices.shift()!;
  choices.splice(questionIndex++ % choices.length, 0, correct);
  return { text, domain, explanation: rationale, options: choices };
}

const portfolioOverview = "https://www.cgs-oris.com/en/software/";
const metisOverview = "https://www.cgs-oris.com/en/metis-scanner";
const metisEdsGamma = "https://www.metis-group.com/product/eds-gamma";
const osha1910147 = "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147";
const iso13655 = "https://www.iso.org/standard/65430.html";
const iso126477 = "https://www.iso.org/standard/66426.html";
const ciede2000 = "https://doi.org/10.1002/col.20070";

export const seedLessons: SeedLesson[] = [
  {
    dayNumber: 1,
    bootcampDayNumber: 1,
    title: "CGS ORIS Product Families and Field Service",
    slug: "day-01-cgs-oris-and-field-service",
    summary: "Orient to the independent product families in the learning brief, distinguish documented facts from assumptions, and practice a safe, evidence-led field-service conversation.",
    estimatedMinutes: 75,
    competencyDomain: "company_interview",
    objectives: [
      "Distinguish the ORIS software portfolio from METIS scanner families and the Platinum printer context named in the course brief.",
      "Explain why product names alone do not prove a particular feature, configuration, or integration.",
      "Outline a general service-call sequence: clarify, assess safety, gather evidence, act within authorization, verify, document, and escalate.",
      "Prepare an honest introduction that connects real transferable experience to a current job posting without inventing employer facts.",
    ],
    prerequisites: ["No prior product-specific service experience required", "Bring a real example of a technical problem you have solved"],
    sourceRef: {
      title: "CGS ORIS public product overviews and learner-provided course scope",
      citation: `${portfolioOverview}; ${metisOverview}; Platinum is named in the learner-provided course scope, not treated here as a model-specific specification.`,
      confidenceLevel: "public_overview_and_user_context",
      notes: "Public pages identify portfolio names and broad scope only. This lesson does not assert current hiring requirements, location, ownership, service duties, model features, or product integration. Check the current employer posting before an interview.",
    },
    contentBlocks: [
      section("Product names: useful orientation, not a service specification", `The public CGS ORIS software overview lists products including COLOR TUNER, FLEX PACK, X GAMUT, PRESS MATCHER, CERTIFIED, and EVALUATE. Treat that as a portfolio list—not a promise that every product is included in every installation or that a particular task is supported in every version.

The public METIS overview identifies multiple scanner families. The course brief also names Platinum industrial printers. These are distinct product contexts. A product name does not tell you the serial-specific options, installed software, service authorization, or the customer's workflow.

For a real service visit or interview, record the exact model and version from reliable records and consult the applicable current documentation. Never convert an educational example into an employer claim.`),
      section("A field-service mindset", `A sound general service conversation starts by listening and clarifying what the customer observed, when it began, what changed, and what outcome is needed. Separate the customer's description from your own hypothesis.

Before touching equipment, assess the work area, task scope, authorization, and hazards. If a hazard is uncontrolled or the applicable procedure is unknown, pause and obtain competent site or manufacturer guidance. Use controlled observations and approved tests to distinguish possible causes; change only what is authorized and supported by evidence.

Finish by checking against agreed acceptance criteria, explaining unresolved uncertainty, recording what was and was not done, and arranging a clear follow-up or escalation.`),
      section("Conceptual map: follow a workflow without assuming integration", `A general imaging workflow can include requirements and source material, optional scanning, color management, a configured RIP or controller, an output device, inspection, and a review loop. This is a teaching model, not a proprietary schematic or a required product chain.

For each stage ask: What enters? What output is expected? Which system actually performs this step? Which file, version, target, or measured result can confirm it? The systems map linked on this page makes these questions interactive. The stages and links vary by customer configuration.` , "visual_explanation"),
      section("Practice: a neutral service-call opening", `Prompt: A customer says, “The print no longer matches the approved target.” Start with open questions rather than naming a part.

1. Ask what changed, when the difference first appeared, and whether it affects all jobs or one material.
2. Ask which target, output file, substrate, device configuration, and acceptance criteria are relevant.
3. Confirm the site is safe, your authorization, and which records or approved tests are available.
4. State a next step that gathers evidence without promising a repair or a result prematurely.` , "interactive_practice"),
      section("Summary and interview preparation", `Keep three distinctions clear: a company portfolio page is not a job description; a product family is not a complete specification; and a conceptual workflow is not proof of a particular integration.

For an interview, research current primary sources, bring truthful examples from your own work, and describe your reasoning. If you have not serviced a particular printer or scanner, say so and explain how you would learn its approved procedures. The systems map is optional practice; continue to the knowledge check when you are ready.`, "summary_review"),
    ],
    questions: [
      question("Which statement best describes what a product-overview page can establish?", "company_interview", "It can identify publicly listed products and broad portfolio context, but not prove the installed configuration or exact service procedure.", "Public overviews help orient the learner; model-, version-, and customer-specific claims need appropriate current documentation.", [
        { text: "It proves that every customer owns all listed products and uses them in one integrated chain.", explanation: "An overview does not establish an individual customer's licenses or connections." },
        { text: "It replaces the machine's current service and safety manuals.", explanation: "A high-level product page is not a model-specific service procedure." },
        { text: "It is a current job posting that defines hiring requirements.", explanation: "Product pages and employment postings serve different purposes." },
      ]),
      question("What is the best first response to an unclear customer report?", "company_interview", "Clarify the symptom, timing, scope, recent changes, and agreed outcome before selecting a test.", "A precise customer description helps choose an evidence-based and proportionate next step.", [
        { text: "Promise a specific part replacement so the customer knows the visit will be quick.", explanation: "That commits to an unsupported diagnosis before evidence is gathered." },
        { text: "Assume the newest installed component is the cause.", explanation: "A recent change is a clue, not proof of causation." },
        { text: "Ask the customer to bypass a safety device to reproduce the symptom.", explanation: "Safety devices must not be defeated to obtain a reproduction." },
      ]),
      question("How should a candidate handle a company fact that is not confirmed by a current source?", "company_interview", "Do not present it as fact; check a current primary source or phrase the uncertainty honestly.", "Accurate interview preparation distinguishes verified employer information from assumptions.", [
        { text: "Repeat it confidently because it appears in an old training example.", explanation: "An old or fictional example is not reliable current evidence." },
        { text: "Invent a plausible detail to make the answer sound specific.", explanation: "Fabricated company claims undermine credibility." },
        { text: "Attribute it to the manufacturer without checking.", explanation: "Attribution does not make an unsupported claim reliable." },
      ]),
      question("What is the role of the systems map in this course?", "company_interview", "It is an interactive conceptual model for asking workflow questions, not a product schematic or proof of integration.", "The map supports learning while explicitly separating the educational model from actual installed architectures.", [
        { text: "It is an official wiring diagram for every printer and scanner.", explanation: "The map contains no proprietary or model-specific wiring information." },
        { text: "It proves that every job passes through the same seven systems.", explanation: "Customer workflows and equipment configurations vary." },
        { text: "It confirms that a symptom originates in the stage nearest the output.", explanation: "A workflow stage is not a diagnosis." },
      ]),
      question("Which interview introduction is most credible?", "company_interview", "A concise, truthful example of relevant experience, diagnostic method, safety mindset, and customer communication.", "A candidate can connect transferable skills without claiming experience they do not have.", [
        { text: "A story claiming hands-on repairs on models the candidate has never used.", explanation: "Fabricated experience is not a credible transferable-skills answer." },
        { text: "A memorized list of unverified company locations and travel percentages.", explanation: "Current role details should come from the current posting or employer." },
        { text: "A promise to replace parts quickly whenever a customer is under pressure.", explanation: "Pressure does not justify unsupported or unsafe actions." },
      ]),
    ],
  },
  {
    dayNumber: 2,
    bootcampDayNumber: 1,
    title: "Digital Imaging and Print Workflow",
    slug: "day-02-complete-digital-imaging-workflow",
    summary: "Trace a general digital-image workflow and learn to distinguish file, color-management, RIP/controller, device, and verification questions without assuming a particular integration.",
    estimatedMinutes: 75,
    competencyDomain: "color_oris",
    objectives: [
      "Map common stages from job requirements to output verification.",
      "Distinguish source data, color transformation, RIP/controller processing, and physical output.",
      "Identify what configuration records and reference data should be confirmed before interpreting a color complaint.",
      "Describe a controlled comparison that preserves the customer's agreed target and material.",
    ],
    prerequisites: ["Day 1 portfolio and service-call orientation"],
    sourceRef: {
      title: "General graphic-arts workflow concepts and CGS ORIS public portfolio overview",
      citation: `${portfolioOverview}; ISO/TC 130 print-production standards overview: https://committee.iso.org/sites/tc130/home/projects/published/iso-standards.html`,
      confidenceLevel: "industry_concept_and_public_overview",
      notes: "This lesson teaches a conceptual workflow. It does not require a particular file format, RIP, network topology, printer connection, or ORIS feature.",
    },
    contentBlocks: [
      section("A workflow is a set of questions, not a universal product chain", `A digital print workflow commonly handles a customer request and source file, validates the job, applies an output-specific color workflow when configured, processes data for a device, produces a physical result, and compares that result with agreed criteria.

Some jobs include a scan of a physical sample; others do not. A color-management application and a RIP may be separate products, combined, or absent from a particular task. Confirm the real installation rather than inferring it from a diagram.`),
      section("Separate the layers of evidence", `When a job fails, ask which stage first diverges from expectation:

- **Input:** Is the supplied file the expected revision? Is the issue visible in the source data?
- **Color workflow:** Which source and destination conditions, profiles, spot-color rules, and substrate are configured?
- **RIP or controller:** Was the job accepted, processed, queued, or reported with an error?
- **Output device:** Does the device show a status or error? What does its approved test produce?
- **Verification:** Which target, instrument condition, and acceptance limit did the customer specify?

These are diagnostic prompts, not repair steps. Logs and settings are useful only when authorized and interpreted using the installed product's current documentation.`, "visual_explanation"),
      section("Field example: only one material looks different", `A synthetic customer example: the same artwork appears different on a new stock, while an earlier job looked acceptable. Several explanations remain possible: the stock itself differs, the selected media configuration or output profile is wrong, the process changed, or the sample was measured under different conditions.

First compare job identity, material identity, configuration, target, and measurement method. Preserve the approved baseline. Do not assume that adding white ink, changing a profile, or choosing a named software product is appropriate; those choices depend on the device, workflow, and customer specification.` , "field_example"),
      section("Interactive practice: mark where the evidence belongs", `For each observation—source file differs, job remains queued, output color shifts, or measurement conditions differ—name the stage it informs and one record that could confirm it. Then state one alternative explanation.

A useful answer connects a symptom to evidence without jumping from correlation to cause. If you cannot identify an authorized way to obtain the evidence, ask the system owner or technical support for the approved process.` , "interactive_practice"),
      section("Summary", `A workflow diagram helps organize questions, but actual system boundaries are determined by the installed products and customer configuration. Keep source data, color transformation, job processing, physical output, and measurement distinct. Continue to the knowledge check when ready; the lesson remains available for review.`, "summary_review"),
    ],
    questions: [
      question("A job prints with a color difference. Which information is most useful before changing settings?", "color_oris", "The job revision, material, configured workflow, approved target, and measurement conditions.", "These facts make comparisons meaningful and help identify which stage changed.", [
        { text: "A generic list of every product in the vendor's portfolio.", explanation: "A portfolio list does not identify the customer's actual configuration." },
        { text: "A random new profile chosen because its name sounds similar.", explanation: "An unverified profile change can introduce new errors." },
        { text: "The assumption that every color difference is caused by the printer.", explanation: "File, settings, substrate, measurement, and other stages can contribute." },
      ]),
      question("What can the systems map's arrows establish?", "color_oris", "An illustrative way to discuss possible relationships; actual connections must be checked in the installed workflow.", "The arrows are conceptual learning aids, not an integration specification.", [
        { text: "A mandatory route used by every customer job.", explanation: "Workflows vary by product, license, customer, and task." },
        { text: "That ORIS software directly controls every printer.", explanation: "The diagram does not establish a specific control connection." },
        { text: "That METIS scanning is required before printing.", explanation: "Scanning is optional and depends on the job." },
      ]),
      question("Which stage handles translation of a job for a specific output device, when a configured RIP/controller is present?", "color_oris", "The RIP or device-controller stage, as documented for that installation.", "A configured RIP/controller commonly processes job data, but its function and boundary depend on the actual system.", [
        { text: "The customer interview stage.", explanation: "Interview preparation is not job processing." },
        { text: "The physical substrate itself.", explanation: "The substrate is output material, not the job processor." },
        { text: "A color difference value such as ΔE.", explanation: "ΔE describes a difference; it does not process the job." },
      ]),
      question("Why should the approved target and measurement conditions be recorded?", "color_oris", "Because results are only comparable when the reference and method are understood and appropriate.", "Measurement conditions can affect reported values; customer acceptance terms must be explicit.", [
        { text: "To make all materials produce identical color without calibration.", explanation: "A record does not remove physical or process differences." },
        { text: "Because every customer uses the same tolerance.", explanation: "Acceptance criteria are job-specific." },
        { text: "Because the meter itself decides the contractual acceptance limit.", explanation: "A measurement instrument does not define a customer's contract." },
      ]),
      question("A physical sample scan appears in one customer's workflow. What should you infer?", "color_oris", "Only that this workflow includes a scan; do not infer all workflows require one.", "The scanner is an optional stage depending on job requirements and installed products.", [
        { text: "Every job must be captured by METIS before it can be printed.", explanation: "The course map does not imply that universal requirement." },
        { text: "The printer and scanner share a proprietary file connection.", explanation: "A workflow example does not prove a particular format or connection." },
        { text: "The scan is necessarily a 3D surface map.", explanation: "Capture capabilities vary by scanner family and model." },
      ]),
    ],
  },
  {
    dayNumber: 3,
    bootcampDayNumber: 2,
    title: "Hazardous Energy and LOTO Principles",
    slug: "day-03-equipment-safety",
    summary: "Learn the distinction between stopping a machine and controlling hazardous energy, how to recognize stop-work conditions, and why site-specific authorized procedures govern all service work.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Explain why an emergency stop is not an energy-isolating device or a substitute for an applicable energy-control procedure.",
      "Recognize stored and residual energy as well as electrical, mechanical, pneumatic, hydraulic, thermal, chemical, and optical hazards.",
      "Describe the purpose of an employer's energy-control program without treating this lesson as an equipment-specific LOTO procedure.",
      "Choose safe stop-work and escalation actions when training, authorization, documentation, or hazard control is missing.",
    ],
    prerequisites: ["Day 1-2 workflow and service-call fundamentals"],
    sourceRef: {
      title: "OSHA 29 CFR 1910.147 — Control of Hazardous Energy",
      citation: osha1910147,
      confidenceLevel: "primary_regulatory_source",
      notes: "The standard establishes employer energy-control program requirements for covered servicing and maintenance. Applicability, exceptions, other applicable electrical-safety rules, training, and the machine-specific procedure must be determined by the employer and qualified personnel. This lesson is not a lockout procedure.",
    },
    contentBlocks: [
      section("Stop is not isolate", `An emergency stop or control-panel stop can request that motion or a process stop. It does not, by itself, prove that hazardous energy has been isolated, that stored energy is safe, or that unexpected restart is prevented.

OSHA 29 CFR 1910.147 addresses the control of hazardous energy for covered servicing and maintenance. The standard requires an employer energy-control program and procedures; authorized employees must be trained to follow applicable procedures. Do not substitute a generic lesson, a stop button, an interlock, or a verbal assurance for the actual site procedure.`),
      section("Recognize energy sources and stored energy", `Possible hazards depend on the machine and task. Examples include electrical supply, moving or gravity-loaded assemblies, pneumatic or hydraulic pressure, springs, thermal energy, chemical exposure, optical radiation, and stored energy that remains after a control is switched off.

A zero-motion display does not establish a safe work condition. Never infer that equipment is isolated from a single indicator, estimated wait time, or a procedure from another model. If a hazard source, control, or verification method is unknown, stop and contact the site's authorized safety or technical lead.`, "visual_explanation"),
      section("What an authorized energy-control process addresses", `At a high level, an employer procedure identifies the equipment, energy sources, hazards, energy-isolating devices, authorized roles, shutdown and isolation steps, methods to control stored or residual energy, verification, and restoration of service. OSHA also describes notification, lockout/tagout devices, and continued control where stored energy may reaccumulate.

The actual order, devices, verification method, exceptions, and people involved depend on the workplace's written procedure, equipment, applicable standards, and training. This academy deliberately does not provide disconnect locations, voltage tests, discharge times, PPE ratings, or model-specific service-menu directions.`),
      section("Chemical, motion, and optical hazards", `Read the current safety data sheet and site risk assessment for the exact material. Required protective equipment depends on the actual chemical, task, and employer guidance; do not select a glove or eye-protection rating from a generic training example.

Do not defeat a guard, interlock, emergency stop, or other safety device. If a guard is damaged, missing, or bypassed, keep people away from the hazard, do not continue operation, and follow site shutdown and escalation procedures.`, "teaching"),
      section("Scenario: an interlock is taped", `Synthetic practice case: an operator has taped over a guard switch so production can continue. Do not touch the machine to test the bypass, remove or restore a device outside your authorization, or use an emergency stop as a substitute for energy control.

Stop the task, warn affected people without creating additional exposure, keep clear of the hazard, notify the responsible site contact, and document the observed condition and escalation. Restart only when an authorized person confirms the approved safety requirements are met.`, "field_example"),
      section("Summary", `If the hazard is not controlled, stop. If the required procedure or your authorization is unclear, stop and escalate. An E-stop is not energy isolation. This is safety education, not authorization to service equipment or a substitute for employer training and machine-specific written procedures.`, "summary_review"),
    ],
    questions: [
      question("What does an emergency stop prove about hazardous energy?", "hardware_safety", "It may request a stop, but it does not by itself prove energy isolation or control of stored energy.", "Control functions and energy-isolating devices are different; use the applicable employer procedure.", [
        { text: "That all sources of energy are isolated and locked.", explanation: "An E-stop is not, by itself, an energy-isolating device." },
        { text: "That all stored energy has dissipated.", explanation: "A stop command does not establish stored-energy control." },
        { text: "That a technician may enter any guarded area.", explanation: "Entry depends on risk, task authorization, and the applicable procedure." },
      ]),
      question("Who determines the required energy-control procedure for covered work?", "hardware_safety", "The employer's energy-control program and equipment-specific procedure, followed by trained authorized employees.", "OSHA requires employers to establish a program and procedures; this course cannot define a site procedure.", [
        { text: "A generic web lesson for every machine.", explanation: "A generic lesson cannot identify a machine's actual energy controls." },
        { text: "The customer who wants production resumed fastest.", explanation: "Production pressure does not establish a safe work method." },
        { text: "Any technician who has used a similar model.", explanation: "Experience does not replace required authorization and site-specific training." },
      ]),
      question("You cannot identify the approved isolation or verification method. What is the safe choice?", "hardware_safety", "Stop work, keep people clear as appropriate, and obtain the authorized site procedure and competent assistance.", "Unknown energy control is a stop-work condition; do not improvise an isolation method.", [
        { text: "Assume that waiting several minutes makes the machine safe.", explanation: "A guessed delay does not verify energy control." },
        { text: "Use the E-stop and begin the repair.", explanation: "An E-stop is not a substitute for the required energy-control procedure." },
        { text: "Ask an operator to hold the control panel while you work.", explanation: "A verbal or manual control does not establish isolation." },
      ]),
      question("A guard interlock is bypassed. What should a field learner recommend?", "hardware_safety", "Do not operate or test the bypass; keep clear, alert the responsible site contact, and follow authorized stop-work and escalation procedures.", "A bypassed safety device creates an uncontrolled condition that requires safe containment and competent action.", [
        { text: "Leave the tape in place for one short diagnostic run.", explanation: "A short test does not make a bypass safe." },
        { text: "Remove the interlock and continue the job without telling the site contact.", explanation: "Unplanned work on safety devices is not an authorized remedy." },
        { text: "Use the emergency stop as the replacement for the guard.", explanation: "A stop button is not a protective guard or energy-isolation process." },
      ]),
      question("Which statement about PPE selection is appropriate?", "hardware_safety", "Use the current SDS, task risk assessment, and employer instructions for the actual material and work.", "Chemical compatibility and PPE depend on the product and task; universal ratings should not be invented.", [
        { text: "One glove material is correct for every ink, cleaner, and service task.", explanation: "Compatibility differs; consult current safety information." },
        { text: "PPE can replace guarding and hazardous-energy controls.", explanation: "PPE does not substitute for required engineering or energy controls." },
        { text: "A visual inspection always identifies the chemical exposure risk.", explanation: "The chemical identity and SDS are important." },
      ]),
    ],
  },
  {
    dayNumber: 4,
    title: "Industrial Printer Systems: A Conceptual Overview",
    slug: "day-04-platinum-printer-architecture-and-subsystems",
    summary: "Build a mental model of common printer functions while learning to verify the actual options, materials, safety systems, and approved service information for each installed model.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Group common printer functions into job processing, motion or transport, imaging, materials, curing or drying where present, controls, and safety.",
      "Explain why printhead, ink, curing, media-handling, and utility configurations vary across models and options.",
      "Gather model, serial, configuration, software, and symptom records before applying product-specific guidance.",
      "Separate conceptual observation from an authorized service action.",
    ],
    prerequisites: ["Days 2-3 workflow and safety fundamentals"],
    sourceRef: {
      title: "Conceptual industrial-printer systems model and learner-provided product scope",
      citation: "Educational synthesis; model-specific details must come from the current manufacturer manual for the exact installed equipment.",
      confidenceLevel: "conceptual_model",
      notes: "No Platinum model numbers, printhead brands, ink types, voltages, pressures, wavelengths, dimensions, firmware, or service procedures are asserted. Configurations vary.",
    },
    contentBlocks: [
      section("Functional areas, not a universal parts list", `Industrial printing systems can include job-processing software, a controller, imaging components, motion or media transport, material supply, curing or drying technology, sensors, and safety controls. The exact architecture varies by device, product generation, options, and customer configuration.

A system diagram is useful for organizing questions. It must not be treated as a bill of materials or an invitation to open a cabinet, adjust an assembly, or replace a component.`),
      section("Follow the installed configuration", `Begin by identifying the manufacturer, exact model, serial number, installed options, software or firmware version, materials in use, and relevant job settings from reliable records. Confirm that each is appropriate for the question and permitted by the site.

Terms such as “flatbed,” “hybrid,” “UV,” “aqueous,” “vacuum,” or a named printhead are not sufficient to infer the remaining specifications. Even products within one family can differ. Use the exact current operator or service documentation and contact the manufacturer or authorized service organization when it is missing.`, "visual_explanation"),
      section("Observe before assigning a cause", `A symptom may involve several layers: job data, device configuration, material handling, environment, motion, imaging, or a safety/control state. Capture the displayed status, reproduce the symptom only when safe and authorized, record material and job identity, and compare with the approved diagnostic target.

Do not probe electrical assemblies, alter motion alignment, adjust fluid pressure, clean an optical or imaging surface, or run a maintenance menu based on this conceptual overview. Those actions require the actual approved procedure and suitable authorization.`),
      section("Synthetic case: new material, different result", `A hypothetical print shop reports that a new material produces a different edge quality. Before proposing any adjustment, compare the material identity and thickness, job revision, selected media configuration, device status, and approved reference test. Ask what changed and whether the new material is supported by the installed configuration.

Record which observations are confirmed and what remains unknown. If the model-specific handling or safety limits are not available, pause and request the current manual or technical support.`, "field_example"),
      section("Practice: model-specific evidence checklist", `Create a short checklist with six items: model/serial, installed options, software version, material, displayed status, and applicable manual or support reference. Mark “unknown” when a record is not available instead of filling in a plausible-looking value.

The purpose is to prepare for a reliable diagnosis, not to infer a specification from another device.`, "interactive_practice"),
      section("Summary", `The useful skill is not memorizing a universal printer architecture. It is identifying functional relationships while verifying the actual device. Features, consumables, service steps, and acceptance values require current model-specific support.`, "summary_review"),
    ],
    questions: [
      question("Why should a technician record the exact printer model and installed options?", "hardware_safety", "Because architecture, supported materials, procedures, and specifications can differ between models and configurations.", "A product-family label alone is not enough to select a safe, relevant procedure.", [
        { text: "To assume that every model in a family has identical parts.", explanation: "The point is to avoid assuming configurations are identical." },
        { text: "To avoid consulting the current manual.", explanation: "Exact identification helps locate the applicable documentation." },
        { text: "To guarantee that a reported symptom is a hardware fault.", explanation: "Model identification does not establish the cause." },
      ]),
      question("What does a conceptual subsystem map provide?", "hardware_safety", "A way to organize questions about functions and evidence; it is not a service manual or universal bill of materials.", "Conceptual models support reasoning but do not authorize service work.", [
        { text: "A complete list of parts and settings for every Platinum printer.", explanation: "No universal part list is implied." },
        { text: "Authorization to probe inside a live electrical cabinet.", explanation: "An educational diagram cannot authorize hazardous work." },
        { text: "Proof that a printer uses one specific ink or curing technology.", explanation: "That depends on the exact model and installed options." },
      ]),
      question("A device shows an unfamiliar service message. What should you do?", "hardware_safety", "Record the message and exact model/version, then consult the current approved documentation or authorized support.", "A status message should be interpreted against the installed product and its documentation.", [
        { text: "Search for a similar phrase and run the first maintenance menu found.", explanation: "A procedure for another model or version may be wrong or unsafe." },
        { text: "Replace the nearest-looking component.", explanation: "A status message does not justify part replacement." },
        { text: "Disable a safety sensor to see whether the message clears.", explanation: "Safety devices must not be defeated to diagnose a message." },
      ]),
      question("Which statement about print technology is best supported by this lesson?", "hardware_safety", "Technology, ink, curing, transport, and utilities can differ by model and configuration.", "The course avoids applying a single architecture or specification across a product family.", [
        { text: "Every Platinum printer uses the same head, ink, and curing system.", explanation: "That is an unsupported family-wide claim." },
        { text: "Every industrial printer has the same printhead brands and pressures.", explanation: "Those values are model-specific and were not asserted." },
        { text: "All device service menus use identical procedures.", explanation: "Menus and procedures vary by product and software version." },
      ]),
      question("If the applicable safety procedure is missing, what is the correct next step?", "hardware_safety", "Stop the task and obtain the correct procedure and competent authorization before proceeding.", "Missing safety information is a stop-work condition, not a reason to improvise.", [
        { text: "Use a procedure from a visually similar machine.", explanation: "Similarity does not establish equivalent hazards or controls." },
        { text: "Let the customer choose an unverified repair step.", explanation: "Customer urgency does not replace authorization." },
        { text: "Proceed carefully without checking the energy sources.", explanation: "Caution alone does not control hazardous energy." },
      ]),
    ],
  },
  {
    dayNumber: 5,
    bootcampDayNumber: 2,
    title: "Print-Defect Reasoning and Safe Fault Isolation",
    slug: "day-05-inkjet-troubleshooting-and-print-defect-isolation",
    summary: "Compare nozzle-pattern, feed, alignment, job, material, and intermittent possibilities without treating one visual symptom or one clean test as a complete diagnosis.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Describe multiple plausible causes of banding and distinguish a visual clue from a confirmed cause.",
      "Explain why a clean nozzle check does not rule out every printhead or dynamic fault.",
      "Plan a safe sequence of authorized, low-impact evidence gathering and controlled comparisons.",
      "Define what to record and when to stop for manufacturer guidance.",
    ],
    prerequisites: ["Days 3-4 safety and conceptual printer-system foundations"],
    sourceRef: {
      title: "General print-defect isolation principles",
      citation: "Conceptual educational material. Use the exact printer's current operator/service documentation for tests, maintenance, limits, and corrective actions.",
      confidenceLevel: "conceptual_model",
      notes: "No nozzle count, pressure, feed compensation, alignment value, cleaning fluid, purge sequence, replacement threshold, or universal dark/light band rule is supplied.",
    },
    contentBlocks: [
      section("Banding is a symptom, not a root cause", `Banding can originate in different parts of a production chain. Possibilities include a missing or deflected nozzle, an intermittent imaging or firing problem, media movement, pass or alignment settings, job data, substrate behavior, or an environmental/process change. A dark or light appearance can help describe the symptom but does not uniquely identify its cause.

Start with the direction, spacing, repeatability, affected colors, coverage, job, and material. Compare a fresh sample with the source file and an approved device test. Preserve both the original and the test results.`),
      section("Interpret a nozzle pattern cautiously", `A nozzle or diagnostic pattern can reveal a visible dropout or deflection under that test condition. It is useful evidence, not proof that every nozzle, firing condition, or dynamic behavior is fault-free. A clean pattern therefore does not rule out every head, electrical, intermittent, configuration, or production-speed issue.

If the pattern indicates a problem, follow only the exact approved maintenance or service instruction for the installed model and your role. Do not scrape a nozzle plate, choose a cleaning fluid, force a purge, disconnect a head, or replace a component from advice in this lesson.`, "visual_explanation"),
      section("A controlled diagnostic sequence", `1. Clarify the customer-visible defect and its operational impact.
2. Check safety, task scope, and authorization before testing.
3. Record the device identity, job revision, media, settings, status messages, and recent changes.
4. Use documented, approved diagnostic patterns and controlled comparisons; change one variable at a time.
5. Compare observations with a reference and consider alternative explanations.
6. Stop and escalate when a procedure, hazard control, or qualification is missing.
7. Verify only against the customer's agreed criteria, then document the evidence and uncertainty.`, "teaching"),
      section("Synthetic case: regular dark bands, clean static pattern", `A hypothetical customer sees regularly spaced dark bands, while a static diagnostic pattern appears clean. The pattern reduces support for one visible static dropout under that test condition, but it does not eliminate every printhead or dynamic fault. Other hypotheses may include media movement, pass alignment, job data, material response, or a condition that appears only during production.

Ask what changed, preserve the job and material details, run only approved comparisons, and avoid announcing a root cause until the evidence supports one.`, "field_example"),
      section("Practice: build a hypothesis table", `For the case, make three columns: hypothesis, discriminating safe test from the current manual, and result that would support or weaken the hypothesis. Include at least two competing explanations. If you cannot name an approved test, write “escalate for test procedure” rather than inventing a menu or setting.

This is fault isolation, not a repair recipe.`, "interactive_practice"),
      section("Summary", `Visual patterns guide questions; they do not prove causes. A clean nozzle check is informative but not conclusive. Separate observations from hypotheses, use approved tests, change one variable at a time, and verify the outcome against agreed requirements.`, "summary_review"),
    ],
    questions: [
      question("A clean static nozzle pattern is observed. What does it establish?", "hardware_safety", "That the pattern looked clean under that specific test condition; it does not rule out every printhead or dynamic fault.", "A static pattern is one piece of evidence, not a complete test of all operating conditions.", [
        { text: "That all head-related faults are impossible.", explanation: "Intermittent, dynamic, and other head-related faults may not appear in one static test." },
        { text: "That media advance is definitely the root cause.", explanation: "The test does not prove a different subsystem is at fault." },
        { text: "That the printer is safe to service without the applicable procedure.", explanation: "A print-quality test is not an energy-control procedure." },
      ]),
      question("What is the correct way to interpret periodic banding?", "hardware_safety", "Record its appearance and compare several plausible causes using approved, discriminating tests.", "Banding is a symptom with multiple possible causes; a visual description alone is not a diagnosis.", [
        { text: "Every dark band means exactly the same feed error.", explanation: "Appearance alone does not uniquely identify a cause." },
        { text: "Every white band means a clogged nozzle.", explanation: "Missing/deflected output is one possibility, not the only one." },
        { text: "Replace a printhead before gathering evidence.", explanation: "Part replacement is not justified by an unconfirmed symptom." },
      ]),
      question("Which is an appropriate initial evidence record for a print defect?", "hardware_safety", "Device identity, job revision, material, settings, status, recent changes, and the observed pattern.", "Context allows repeatable comparison and prevents unsupported assumptions.", [
        { text: "Only the technician's favorite hypothesis.", explanation: "A hypothesis is not an observation record." },
        { text: "Only a customer estimate of the replacement cost.", explanation: "Cost matters operationally but does not identify the fault." },
        { text: "An assumed model and a guessed pressure value.", explanation: "Unknown configuration values should be recorded as unknown." },
      ]),
      question("Why should a diagnostic test change one variable at a time where practicable?", "hardware_safety", "It helps associate an observed change with a particular controlled test.", "Changing multiple variables at once makes the result harder to interpret.", [
        { text: "It guarantees that the first hypothesis was correct.", explanation: "A controlled test can still disconfirm a hypothesis." },
        { text: "It removes the need to verify customer acceptance.", explanation: "Verification remains necessary." },
        { text: "It permits bypassing an interlock for cleaner results.", explanation: "A safety device must never be defeated for a test." },
      ]),
      question("The manual for the exact model is unavailable and a proposed test could affect a head. What should you do?", "hardware_safety", "Do not invent the procedure; stop and obtain authorized model-specific guidance.", "Maintenance steps and consumables are product-specific and must be authorized.", [
        { text: "Try a cleaning fluid from a different manufacturer.", explanation: "Chemical compatibility and procedure are not established." },
        { text: "Scrape deposits away with a soft metal tool.", explanation: "This is an unsupported, potentially damaging action." },
        { text: "Run multiple high-pressure purges to see what happens.", explanation: "An unapproved purge can create damage or additional hazards." },
      ]),
    ],
  },
  {
    dayNumber: 6,
    title: "RIP, Job Queues, and Network Troubleshooting",
    slug: "day-06-networking-rips-and-print-jobs",
    summary: "Use a layered approach to stalled or interrupted print jobs while distinguishing file processing, queue, controller, and network evidence.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Sketch the configured job path from workstation to output device without assuming a particular RIP or topology.",
      "Distinguish file/preflight, processing, queue, communications, and device-status evidence.",
      "Plan safe, authorized observations before changing network or workstation settings.",
      "Document job identifiers, timestamps, errors, and escalation evidence while protecting credentials and customer data.",
    ],
    prerequisites: ["Day 2 workflow and Day 4 conceptual printer systems"],
    sourceRef: {
      title: "General networked-application troubleshooting concepts",
      citation: "Internet Engineering Task Force, RFC 9293 — Transmission Control Protocol: https://www.rfc-editor.org/rfc/rfc9293; consult the actual RIP, operating-system, and device documentation for configuration.",
      confidenceLevel: "protocol_reference_and_conceptual_model",
      notes: "No specific RIP, NIC count, IP range, switch, disk path, frame size, command, or vendor error code is assumed.",
    },
    contentBlocks: [
      section("Map the actual job path", `A typical print path may include a design or prepress workstation, a configured RIP or job processor, a queue or spool, a communications path, and a device controller. Product boundaries vary. First identify the applications, versions, hosts, queues, and interfaces actually in use.

Capture where the job stops: before submission, during processing, in a queue, during transfer, or after the device reports receipt. A job stuck at a progress percentage does not by itself identify disk, network, software, or hardware as the cause.`),
      section("Separate observations by layer", `- **File:** Does the job open and pass the configured preflight checks?
- **Processing:** Is the application still rendering or reporting an error?
- **Queue:** Is the job paused, held, or waiting for another job?
- **Communication:** Do the approved status tools show a connection or transfer error?
- **Device:** What status or error does the device itself report?
- **Resources:** Is there documented evidence of a constrained system resource?

Compare a known-good small job only when permitted and record its identity. Do not delete queues, reset network settings, disable security controls, alter addressing, install software, or collect credentials without the system owner's approval.`, "visual_explanation"),
      section("Use timestamps and logs responsibly", `For an intermittent interruption, record the job ID, source host, time, device status, error text, and relevant software versions. Compare the host and device timelines if authorized. Keep customer files and logs within approved access and retention rules; never place passwords or secrets in a service ticket.

A ping or link indicator can show limited connectivity evidence; neither proves that the complete application-to-device workflow is healthy. Use the tools designated by the network or system owner.`),
      section("Synthetic case: job does not leave the queue", `A hypothetical job remains queued while the device appears available. Ask whether other jobs or users are affected. Compare the exact queue state, processor status, error logs, host and device identity, and a controlled known-good job if authorized. If only one file fails, the issue may differ from a case in which all hosts fail.

Escalate with a concise timeline and sanitized logs. Do not assume an IP conflict, full scratch disk, jumbo-frame mismatch, or any specific vendor fault without evidence.`, "field_example"),
      section("Practice: create a handoff", `Write a five-line handoff: affected job and time; affected hosts or queues; exact observed error; authorized checks already completed; and the specific technical help requested. Mark unknowns explicitly. Redact customer content and credentials according to policy.`, "interactive_practice"),
      section("Summary", `Troubleshoot the real configured pipeline one layer at a time. A status indicator is evidence, not proof that every layer works. Protect customer data and obtain authorization before changing a workstation or network.`, "summary_review"),
    ],
    questions: [
      question("A job remains at a progress indicator. What is the best first diagnostic question?", "hardware_safety", "At which configured stage did the job stop, and what status or error is recorded there?", "Locating the first observed failure narrows the relevant layer without guessing.", [
        { text: "Which printer board should be replaced?", explanation: "No hardware cause has been established." },
        { text: "Which safety setting can be disabled to speed up the queue?", explanation: "Security or safety controls should not be disabled without authorization." },
        { text: "Which random IP address should be assigned?", explanation: "Changing addressing without evidence and authorization can disrupt a network." },
      ]),
      question("What does a successful ping prove?", "hardware_safety", "Limited reachability for that test; it does not prove the entire job-processing workflow is healthy.", "Application processing, queues, protocols, files, and device state can still fail.", [
        { text: "That the RIP rendered the file correctly.", explanation: "A ping does not test file processing." },
        { text: "That every print job can reach the device.", explanation: "One basic network test is not an end-to-end job test." },
        { text: "That the printer has no active faults.", explanation: "Device faults are independent of a basic reachability test." },
      ]),
      question("Which information helps a technical escalation?", "hardware_safety", "Job identity, timestamp, observed stage, exact error text, versions, and authorized checks already performed.", "A concise timeline and evidence help the system owner investigate efficiently.", [
        { text: "Passwords, customer artwork, and a guessed root cause.", explanation: "Secrets and unnecessary customer content should not be shared." },
        { text: "Only a statement that the system is broken.", explanation: "That provides no discriminating evidence." },
        { text: "A copied error from a different model.", explanation: "Errors must be tied to the actual system and version." },
      ]),
      question("What is appropriate before changing network settings?", "hardware_safety", "Obtain approval from the responsible system owner and use the documented configuration process.", "Network changes can affect other systems and require ownership and change control.", [
        { text: "Disable endpoint security until printing resumes.", explanation: "Disabling security is not an authorized default diagnostic step." },
        { text: "Change a device address based on a guess.", explanation: "An IP change can create a conflict or make the system unreachable." },
        { text: "Connect a personal laptop to an unknown network.", explanation: "Unauthorized connection can create security risks." },
      ]),
      question("All users report a stalled queue, while a single job previously failed. What should you consider?", "hardware_safety", "Whether the wider shared processor, queue, host, or communication path is affected, while confirming the actual configuration.", "Scope across users and jobs is useful evidence; it still does not identify a specific cause by itself.", [
        { text: "Every printhead has failed simultaneously.", explanation: "A shared queue symptom does not prove a printhead fault." },
        { text: "The customer artwork is definitely corrupt.", explanation: "An issue affecting many jobs may have a different scope." },
        { text: "The device must use a dual-NIC topology.", explanation: "No topology is universal or implied here." },
      ]),
    ],
  },
  {
    dayNumber: 7,
    title: "Color Science, ICC Profiles, and Measurement",
    slug: "day-07-color-science-icc-profiles-and-delta-e",
    summary: "Understand CIELAB, CIEDE2000, profiles, substrate influence, and measurement conditions while avoiding universal color pass/fail claims.",
    estimatedMinutes: 90,
    competencyDomain: "color_oris",
    objectives: [
      "Explain the purpose and limits of CIELAB and common color-difference calculations.",
      "Distinguish CIE 1976 ΔE*ab from the CIEDE2000 formula.",
      "Explain why substrate, measurement condition, instrument, and reference affect comparisons.",
      "Separate calibration, characterization, profile selection, and contractual acceptance criteria.",
    ],
    prerequisites: ["Day 2 workflow foundations"],
    sourceRef: {
      title: "ISO 13655, ISO 12647-7, and CIEDE2000 implementation paper",
      citation: `${iso13655}; ${iso126477}; Sharma, Wu & Dalal, “The CIEDE2000 Color-Difference Formula,” https://doi.org/10.1002/col.20070`,
      confidenceLevel: "standards_and_peer_reviewed_formula_reference",
      notes: "A ΔE value is not a universal acceptance decision. Contract, target, backing, material, illuminant/measurement condition, instrument geometry, and applicable standard must be agreed and matched.",
    },
    contentBlocks: [
      section("CIELAB and color difference", `CIELAB represents a color with lightness L* and opponent axes a* and b* under specified reference conditions. A color-difference formula compares two Lab values; it does not, on its own, define a customer's acceptance limit.

CIE 1976 ΔE*ab is a Euclidean distance in Lab. CIEDE2000, often written ΔE00, applies additional weighting terms intended to improve perceptual uniformity. It is not simply another name for the 1976 formula. The color lab uses a CIEDE2000 calculation on illustrative values; those sliders are not instrument data.`),
      section("Measurement conditions matter", `ISO 13655 specifies measurement and computation procedures for graphic-arts images. Conditions M0, M1, M2, and M3 can produce different spectral and colorimetric results, particularly for fluorescent materials or optical brighteners. The condition must be selected and recorded according to the applicable specification; it is not safe to assume one condition for every job.

The instrument, geometry, calibration, backing, sample preparation, target, and measurement time can also matter. Repeatability requires following the agreed method rather than comparing numbers obtained under unmatched conditions.`, "visual_explanation"),
      section("Calibration, characterization, and profiles", `Calibration or process control aims to bring a device to a repeatable state. Characterization measures how a device/material/process combination behaves. An ICC profile describes a color transform for specified conditions; it is not a guarantee that another substrate, ink set, or device will reproduce the same appearance.

Do not create or select a profile, change an ink limit, or add a white layer based on a color difference alone. Confirm installed tools, supported workflow, material, target, license, and customer specification.`, "teaching"),
      section("Synthetic case: a target misses tolerance", `A hypothetical report states that a printed target misses an agreed value. Before deciding it is a printer fault, verify that the correct reference, formula, measurement condition, instrument status, substrate, and sample are being compared. Review the job configuration and repeat a measurement only when the documented method permits it.

If the current agreement is missing or unclear, ask the customer or quality owner to define the target and acceptance rule. Do not invent a threshold such as “below two always passes.”`, "field_example"),
      section("Practice: write a measurement record", `Record: target identifier and revision; sample and substrate; instrument and measurement condition; relevant profile/process; result and formula; agreed acceptance limit; and any deviation from the method. Add “unknown” rather than inferring a setting.

A ΔE value is a measured or calculated difference—not an acceptance rule.`, "interactive_practice"),
      section("Summary", `Use the correct formula and matching measurement conditions; treat Lab and ΔE as evidence, not a universal quality verdict. The color calculator compares the actual CIEDE2000 formula with CIE 1976 ΔE*ab.`, "summary_review"),
    ],
    questions: [
      question("Which statement correctly distinguishes ΔE*ab and ΔE00?", "color_oris", "ΔE*ab uses the CIE 1976 Lab Euclidean distance; ΔE00 uses the CIEDE2000 weighting formula.", "The formulas are related but not interchangeable labels.", [
        { text: "They are identical formulas with different names.", explanation: "CIEDE2000 includes additional weighting terms." },
        { text: "ΔE00 is an ink-volume measurement.", explanation: "It is a color-difference formula, not an ink-volume metric." },
        { text: "ΔE*ab automatically decides contractual acceptance.", explanation: "A formula does not define an acceptance threshold." },
      ]),
      question("A reported ΔE00 value is below two. Can you conclude it passes?", "color_oris", "Not without the specified target, formula, measurement method, material, and agreed acceptance limit.", "There is no single universal pass/fail threshold for every job and product.", [
        { text: "Yes; below two always passes all print contracts.", explanation: "Tolerances are job-specific and method-dependent." },
        { text: "Yes; every observer sees the same difference identically.", explanation: "Perception and application criteria vary." },
        { text: "No color measurements can ever be used for acceptance.", explanation: "Measurements can support acceptance when the method and limits are agreed." },
      ]),
      question("Why can two instruments report different values for the same fluorescent substrate?", "color_oris", "Different measurement conditions, instrument characteristics, or procedures can affect the result.", "Optical brighteners and condition choices make method consistency important.", [
        { text: "The CIELAB axes change whenever a printer model changes.", explanation: "CIELAB coordinates use defined reference conditions; model identity is not the reason stated." },
        { text: "A ΔE calculation removes every instrument difference.", explanation: "The formula cannot fix mismatched measurement conditions." },
        { text: "Substrate fluorescence has no effect on a measurement.", explanation: "Fluorescence is one reason measurement conditions matter." },
      ]),
      question("What does an ICC profile describe?", "color_oris", "A color transformation associated with specified device and process conditions.", "A profile depends on the conditions for which it was created and does not guarantee other setups.", [
        { text: "A universal color recipe that works on every substrate and device.", explanation: "Profiles are condition-dependent." },
        { text: "A mechanical adjustment procedure for printer heads.", explanation: "An ICC profile is color-management data, not mechanical service guidance." },
        { text: "A customer's acceptance contract.", explanation: "Acceptance criteria are separately agreed." },
      ]),
      question("Which record best supports a repeatable color comparison?", "color_oris", "Target, material, instrument, measurement condition, formula, result, and agreed tolerance.", "These details allow another person to interpret and reproduce the comparison.", [
        { text: "Only the number from the instrument display.", explanation: "Without context, the number may not be comparable." },
        { text: "The color name and a monitor screenshot.", explanation: "A screen image does not specify a physical measurement method." },
        { text: "An assumed standard chosen after seeing the result.", explanation: "The method and acceptance rule must be defined before interpretation." },
      ]),
    ],
  },
  {
    dayNumber: 8,
    title: "ORIS Software Portfolio: Requirements and Verification",
    slug: "day-08-oris-software-ecosystem",
    summary: "Use the public ORIS product overview to orient to product names, then practice verifying the installed product, version, license, and task-specific behavior from current documentation.",
    estimatedMinutes: 90,
    competencyDomain: "color_oris",
    objectives: [
      "Recognize the product names listed on the public ORIS software overview.",
      "Avoid assigning unsupported functions or integrations from a product name alone.",
      "Translate a customer request into workflow questions and required evidence.",
      "Use installed-version help, current documentation, and authorized support to confirm a feature.",
    ],
    prerequisites: ["Days 2 and 7 workflow and color foundations"],
    sourceRef: {
      title: "CGS ORIS official software overview",
      citation: portfolioOverview,
      confidenceLevel: "official_public_product_overview",
      notes: "The linked overview supports portfolio names only. Detailed functions, interfaces, version behavior, licenses, and service procedures must be confirmed in current product documentation for the customer's installation.",
    },
    contentBlocks: [
      section("Start from the public portfolio, not folklore", `The current public overview lists ORIS COLOR TUNER, FLEX PACK, X GAMUT, PRESS MATCHER, CERTIFIED, and EVALUATE. Names help locate official material. This lesson does not assign an unverified feature matrix, file format, automation capability, certification claim, or connection to a specific printer.

Different software versions, licenses, and customer workflows can change what is available. Confirm what is installed and licensed before recommending a product or menu.`),
      section("Translate a request into requirements", `A request such as “match this color,” “prepare a proof,” or “compare output” needs more detail. Ask what device and process are involved, what target and material apply, which measurements or proof standard are required, what output the customer needs, and which software tools are already in use.

Record the outcome the customer expects and the evidence that will demonstrate it. Then locate the current product-specific documentation. If the requested operation is not covered there, escalate rather than inventing a menu or promising a result.`, "visual_explanation"),
      section("Feature verification checklist", `Before describing an ORIS feature, verify: exact product name; release/version; licensed modules; operating environment; documented inputs and outputs; supported integrations; and current help or release notes. Separate what the official source says from your interpretation.

Do not infer that two products are bundled together, that a given profile is supplied, or that a software tool operates directly on a printer. Confirm the configured route with the system owner.`),
      section("Synthetic customer conversation", `A hypothetical customer asks whether an ORIS product can automatically tune every printer after a measurement. A safe answer is: “Let us check the exact software version and your configured workflow. Which device, target, and measurement are you using, and what result do you want? I will verify the documented capability before recommending a change.”

This answer is useful because it acknowledges the need without fabricating a feature or integration.`, "field_example"),
      section("Practice: build a source-backed product note", `Choose one product name from the official overview. Write two columns: “confirmed by the public overview” and “still needs current product documentation.” Include version, license, input/output, and integration questions in the second column.` , "interactive_practice"),
      section("Summary", `Learn product names accurately, then verify product behavior at the version and installation level. Official high-level pages are portfolio orientation, not service manuals or proof that a particular customer has a given capability.`, "summary_review"),
    ],
    questions: [
      question("What does the official ORIS software overview establish for this lesson?", "color_oris", "A list of public product names and broad portfolio context.", "It does not establish every product feature or customer configuration.", [
        { text: "A complete feature matrix for every customer installation.", explanation: "Detailed functions and versions require product-specific documentation." },
        { text: "That all listed products are bundled into one license.", explanation: "A product list does not state a customer's license." },
        { text: "That every product directly controls every printer.", explanation: "A portfolio overview does not prove a device integration." },
      ]),
      question("A customer asks whether a named software feature is available. What should you verify?", "color_oris", "Installed product, version, license, documented capability, inputs, and configured integration.", "The customer's installation—not only the product name—determines the answer.", [
        { text: "Whether the feature name sounds familiar.", explanation: "Familiarity is not product documentation." },
        { text: "Whether a different customer used it on another version.", explanation: "Another installation does not establish this one." },
        { text: "Whether the vendor's entire portfolio contains the word “color.”", explanation: "Portfolio wording does not confirm a feature." },
      ]),
      question("What is a safe answer when a requested automation is not yet verified?", "color_oris", "Ask about the workflow and state that you will confirm capability in the current documentation before recommending a change.", "This is accurate, customer-focused, and avoids promising unsupported behavior.", [
        { text: "Promise it works on every supported printer.", explanation: "Universal support has not been established." },
        { text: "Invent a menu name and ask the customer to try it.", explanation: "An invented procedure risks error and loss of trust." },
        { text: "Change the device profile before defining the target.", explanation: "A profile change needs a documented requirement and authorization." },
      ]),
      question("Why does the exact software version matter?", "color_oris", "Features, interfaces, supported environments, and behavior can vary by version and license.", "Current release notes and product documentation are needed for detailed claims.", [
        { text: "It changes the meaning of all measured Lab coordinates.", explanation: "A software version does not redefine the color space." },
        { text: "It determines the exact printer's electrical service procedure.", explanation: "That is a separate model-specific manual." },
        { text: "It means a profile can be used on any material.", explanation: "Profiles remain condition-dependent." },
      ]),
      question("Which note best separates source from interpretation?", "color_oris", "“The overview lists the product; its operation on this installation remains unverified pending version and license check.”", "It states what is known and explicitly labels the remaining uncertainty.", [
        { text: "“This product always closes the loop automatically.”", explanation: "This is an unsupported universal feature claim." },
        { text: "“The customer has every module because the product appears online.”", explanation: "Public availability does not establish the customer's license." },
        { text: "“The product probably works; no need to check.”", explanation: "A guess is not a source-backed product note." },
      ]),
    ],
  },
  {
    dayNumber: 9,
    title: "METIS Scanner Families and Surface Imaging",
    slug: "day-09-metis-scanning-and-material-surface-imaging",
    summary: "Distinguish public METIS scanner families, including decor and cultural-heritage contexts, and practice model-aware capture and artifact reasoning without generalizing features across scanners.",
    estimatedMinutes: 90,
    competencyDomain: "metis_scanning",
    objectives: [
      "Distinguish METIS DRS, EDS, SURF 3D, and PM3D-Hawk family contexts from the official overview.",
      "Recognize EDS GAMMA as a member of the EDS cultural-heritage family, not a decor DRS model.",
      "Describe image capture, reference data, and raw-file comparison as general diagnostic concepts.",
      "Use the exact scanner and current software documentation before handling a reference, calibration, or maintenance task.",
    ],
    prerequisites: ["Day 2 workflow and Day 7 color-measurement concepts"],
    sourceRef: {
      title: "Official METIS scanner family and EDS GAMMA product pages",
      citation: `${metisOverview}; ${metisEdsGamma}; https://www.metis-group.com/cultural-heritage`,
      confidenceLevel: "official_public_product_pages",
      notes: "The sources distinguish product families and describe the EDS GAMMA at a high level. Features, software, calibration, targets, formats, and procedures vary by model; no family-wide scanner specifications are assumed.",
    },
    contentBlocks: [
      section("Several scanner contexts, not one universal product", `The official METIS overview lists DRS models, SURF 3D, PM3D HAWK, and cultural-heritage products. The EDS GAMMA page describes it as an A1 desktop reproduction system and a member of the EDS (Easy Digital Scanner) family; the official cultural-heritage page lists EDS family members.

That family distinction matters. Do not transfer a capability, target, sample size, file output, capture mode, or calibration step from one scanner to another without checking the exact model and software.`),
      section("Describe the capture chain", `For any scanner, document the original or sample, capture goal, model, optics or illumination configuration when documented, software version, reference/calibration status, output file, and observed artifact. The exact variables are product-specific.

A scan workflow may create different kinds of image or surface data, but not all models capture the same information. Do not assume a gloss map, relief map, normal map, synchronized lighting mode, file type, or calibration routine exists on every METIS device.`, "visual_explanation"),
      section("Separate capture defects from downstream defects", `If a defect appears in a printed result, compare the source file and any scan before assigning the cause. If an artifact is present in the captured file, investigate capture conditions using that scanner's approved method. If the file appears clean, downstream processing, device settings, material, or measurement may still be involved; a clean file does not prove a particular printer fault.

Use the current manufacturer procedure for handling reference objects, cleaning optics, and calibration. Do not apply generic cleaners, touch optical references, or change scanner settings based on this lesson.`, "teaching"),
      section("Synthetic case: a repeated stripe in a captured file", `A hypothetical operator reports a stripe in repeated captures. Record whether it appears in the raw file, which model and software produced it, the original setup, when the last approved calibration was performed, and whether a second approved capture changes the result.

The cause could involve setup, the original, software, illumination, reference data, or hardware. A recurring pattern is a clue, not a diagnosis. Escalate when the model's calibration or cleaning procedure is unavailable.`, "field_example"),
      section("Practice: product-family evidence card", `Select a named model from an official METIS page. Write down the exact page, product family, stated application, and one item the page does not establish for the installed unit. Use current model-specific documentation for the unknown.

This exercise rewards careful source reading, not memorization of unverified specifications.`, "interactive_practice"),
      section("Summary", `EDS GAMMA is in the EDS family and is described by METIS as an A1 desktop reproduction system for cultural heritage. DRS, SURF 3D, and PM3D-Hawk belong to different listed product contexts. Verify exact features at model level; do not infer all scanners share one imaging architecture.`, "summary_review"),
    ],
    questions: [
      question("How does the official METIS site describe EDS GAMMA?", "metis_scanning", "As an A1 desktop reproduction system and a member of the EDS family, in a cultural-heritage context.", "This reflects the linked official product and family pages without extending the description to other models.", [
        { text: "As a DRS decor printer with a universal gloss-map workflow.", explanation: "EDS GAMMA is a scanner in the EDS family, not a printer or DRS model." },
        { text: "As a Platinum industrial printer.", explanation: "Platinum is a separate product context in the course scope." },
        { text: "As a mandatory scanner for every ORIS software installation.", explanation: "No such integration or requirement is stated." },
      ]),
      question("A feature appears on the SURF 3D product page. What can you infer about every METIS scanner?", "metis_scanning", "Nothing beyond the need to check the exact product documentation; family features are not automatically universal.", "A feature listed for a specific model must not be generalized to other families.", [
        { text: "Every model produces that output in the same workflow.", explanation: "Scanner models and outputs vary." },
        { text: "The EDS family uses the same decor capture process.", explanation: "The sources distinguish product contexts." },
        { text: "The feature is present whenever the customer owns ORIS software.", explanation: "Software ownership does not establish scanner hardware features." },
      ]),
      question("A stripe is visible in the captured file. What is an appropriate next step?", "metis_scanning", "Record the model, version, setup, and file evidence, then use its approved diagnostic and calibration documentation.", "This preserves evidence while avoiding unsupported cleaning or calibration steps.", [
        { text: "Clean the reference with any optical solvent.", explanation: "Materials and procedures are model-specific; a generic solvent can damage a reference." },
        { text: "Assume the camera sensor has failed.", explanation: "The artifact is not a root-cause proof." },
        { text: "Replace the connected printer printhead.", explanation: "A captured-file artifact does not establish a printer fault." },
      ]),
      question("What is the value of comparing a raw scan with downstream output?", "metis_scanning", "It helps determine whether an artifact is already in captured data or appears later in the workflow.", "This narrows the stage to investigate but does not alone prove the ultimate cause.", [
        { text: "It proves that a clean scan means the printer hardware failed.", explanation: "A clean input does not uniquely identify a downstream fault." },
        { text: "It determines the scanner's exact calibration setting.", explanation: "A file comparison does not supply model-specific settings." },
        { text: "It confirms that every scanner uses the same file format.", explanation: "Output formats vary by product and workflow." },
      ]),
      question("What should be checked before using a calibration or cleaning routine?", "metis_scanning", "The exact model's current manufacturer procedure and the technician's authorization.", "Scanner references and optics require product-specific handling instructions.", [
        { text: "A procedure from any camera or scanner.", explanation: "A procedure may not be compatible with the actual device." },
        { text: "An old forum post for a different software version.", explanation: "Current product documentation is required." },
        { text: "A guessed routine that changes several settings together.", explanation: "This risks equipment damage and obscures results." },
      ]),
    ],
  },
  {
    dayNumber: 10,
    bootcampDayNumber: null,
    title: "Installation Planning and Acceptance Evidence",
    slug: "day-10-installation-commissioning-and-acceptance",
    summary: "Plan an installation around site readiness, assigned responsibilities, manufacturer documentation, safety, customer requirements, and recorded acceptance evidence—without inventing utilities or tolerances.",
    estimatedMinutes: 90,
    competencyDomain: "customer_docs",
    objectives: [
      "Separate site-readiness planning from equipment-specific installation instructions.",
      "Identify the documents and responsible people needed before arrival.",
      "Define acceptance criteria with the customer before conducting a test.",
      "Create a factual handoff of completed checks, deviations, training, and follow-up.",
    ],
    prerequisites: ["Days 3-7 safety, device, and workflow concepts"],
    sourceRef: {
      title: "Conceptual installation and customer-acceptance planning",
      citation: `Use the current installation and site-preparation documentation for the exact equipment, plus the employer and site safety program. General hazardous-energy reference: ${osha1910147}`,
      confidenceLevel: "conceptual_model_and_primary_safety_reference",
      notes: "No utility rating, room condition, leveling tolerance, calibration setting, startup sequence, or acceptance threshold is specified in this lesson.",
    },
    contentBlocks: [
      section("Plan before equipment arrives", `An installation plan should identify the exact equipment and options, delivery constraints, site access, environmental and utility requirements from the current manual, customer contacts, safety responsibilities, approved work scope, software or network owners, and the acceptance documents to be used.

Do not copy utility values or room tolerances from a different product or from an educational example. Qualified site personnel confirm facility services. If readiness evidence is incomplete, record the gap and agree on next steps before attempting work.`),
      section("Roles and safety boundaries", `Clarify which tasks belong to the service technician, customer, qualified electrician, network owner, rigging crew, or other contractor. Verify training and authorization for each task. Facility work, hazardous energy, lifting, electrical work, chemical handling, and equipment movement must follow applicable rules and the actual site procedures.

A schedule or customer request does not authorize work outside your qualification. Stop and escalate when the required safe conditions or responsible person is missing.`, "visual_explanation"),
      section("Acceptance is agreed before the test", `Acceptance criteria should specify the target, material or configuration, approved test, measurement method, tolerances, environmental or timing conditions when relevant, responsible witness, and method for recording deviations. “Looks good” is not a reproducible criterion; nor is an invented universal value.

Use manufacturer and customer documentation to select the actual checks. Record what was demonstrated and what was not. Training, open issues, and follow-up owners should be explicit.`),
      section("Synthetic case: site not ready", `A hypothetical system is scheduled, but the site cannot produce the required current installation documents or a qualified contact for a facility service. Do not choose a voltage, connect a utility, or infer that a similar model's requirement applies.

Record the missing prerequisite, notify the project owner, request the correct documentation and responsible contact, and re-plan. No installation result should be recorded for work that did not occur.`, "field_example"),
      section("Practice: draft a readiness handoff", `Write a one-page outline with equipment identity; documents received; site readiness evidence; assigned roles; safety and access issues; acceptance target and method; open prerequisites; and decision owner. Use “pending” for unverified conditions.

This is a planning exercise, not an installation procedure.`, "interactive_practice"),
      section("Summary", `Installation depends on exact equipment instructions, competent site roles, safe facility readiness, and acceptance criteria agreed in advance. Record evidence and gaps; do not invent numerical specifications or claim work was completed when it was not.`, "summary_review"),
    ],
    questions: [
      question("A utility value is missing from the installation packet. What is appropriate?", "customer_docs", "Obtain the exact current equipment requirement and have the qualified site owner confirm the facility before proceeding.", "A value from another model or a generic course is not a safe specification.", [
        { text: "Use the highest voltage listed for a similar machine.", explanation: "A similar model is not authoritative for this installation." },
        { text: "Estimate the value from the room's other equipment.", explanation: "Other equipment does not establish this device's requirement." },
        { text: "Connect the device and see whether it starts.", explanation: "Trial connection is not a safe readiness check." },
      ]),
      question("When should acceptance criteria be agreed?", "customer_docs", "Before the verification test, using the customer and equipment-specific documents.", "Clear criteria make a later result interpretable and reduce disputes.", [
        { text: "After seeing the test result so the limit can be adjusted.", explanation: "Changing criteria afterward undermines the acceptance decision." },
        { text: "Only after the customer has signed an empty form.", explanation: "A signature does not define a test target or method." },
        { text: "By copying a tolerance from an unrelated printer.", explanation: "Tolerances must match the actual requirement." },
      ]),
      question("Who should perform a facility task outside the technician's qualification?", "customer_docs", "The appropriately qualified and authorized site professional, coordinated under the project plan.", "Scope and competence must match the task and applicable rules.", [
        { text: "Any available employee under time pressure.", explanation: "Availability is not qualification." },
        { text: "The customer by guessing the connection.", explanation: "Facility work needs competent authorization." },
        { text: "The service technician regardless of training.", explanation: "A role does not establish competence for every task." },
      ]),
      question("What should an installation handoff record?", "customer_docs", "Equipment identity, checks actually performed, evidence, deviations, training, and named follow-up owners.", "A factual handoff lets the customer understand status and unresolved work.", [
        { text: "Only that the installer was on site.", explanation: "Presence does not show readiness, testing, or acceptance." },
        { text: "A list of steps copied from a different model's manual.", explanation: "Documentation must reflect the actual unit and completed work." },
        { text: "A pass mark for every test whether or not it ran.", explanation: "Records must be truthful and evidence-based." },
      ]),
      question("The site lacks a required safety contact. What is the correct response?", "customer_docs", "Pause the affected work, document the prerequisite, notify the project owner, and arrange competent support.", "Safe work depends on assigned responsibility and required controls.", [
        { text: "Proceed because the delivery appointment is fixed.", explanation: "Schedule pressure does not override safety prerequisites." },
        { text: "Ask an untrained operator to assume the role.", explanation: "A role cannot be assigned without appropriate competence and authorization." },
        { text: "Skip documentation so the installation can be closed.", explanation: "An incomplete record hides a material gap." },
      ]),
    ],
  },
  {
    dayNumber: 11,
    title: "Advanced Fault Isolation and Competing Hypotheses",
    slug: "day-11-advanced-fault-isolation",
    summary: "Practice structured diagnosis of intermittent and multi-cause symptoms using observations, competing hypotheses, controlled approved tests, uncertainty, and safe escalation.",
    estimatedMinutes: 90,
    competencyDomain: "hardware_safety",
    objectives: [
      "Separate observed facts from interpretations and suspected causes.",
      "Create competing hypotheses with a discriminating, approved test for each.",
      "Change one variable at a time where safe and practical, then record the result.",
      "Recognize when the evidence or authorization is insufficient and escalate.",
    ],
    prerequisites: ["Days 3-6 safety, systems, defect, and network foundations"],
    sourceRef: {
      title: "Evidence-based troubleshooting and causal reasoning",
      citation: "Conceptual educational model. Manufacturer tests and site safety procedures must be selected for the exact equipment and task.",
      confidenceLevel: "conceptual_model",
      notes: "Examples are synthetic; no board-level repair, cable swap, electrical measurement, service-menu procedure, or part replacement is prescribed.",
    },
    contentBlocks: [
      section("Observation is not explanation", `“The device stopped during a job” is an observation. “The controller board is defective” is a hypothesis. Keep the two separate. Record the time, job, material, status, conditions, recent changes, and repeatability before deciding what the event means.

A timeline can reveal whether several symptoms share a trigger. Temporal association alone does not establish cause; seek evidence that could distinguish alternatives.`),
      section("Build competing hypotheses", `For each hypothesis, write: supporting evidence; evidence that would weaken it; a safe approved test; expected result under each possibility; and the person authorized to perform the test. Prioritize low-impact observation before invasive action.

If a proposed test requires opening a guarded area, accessing electrical parts, moving an assembly, or changing protected settings, first verify task scope, training, controls, and the actual procedure. This lesson does not authorize those actions.`, "visual_explanation"),
      section("Intermittent symptoms", `Intermittent faults are easy to misdiagnose because the condition may disappear during a visit. Preserve error logs and timestamps, ask about workload and environment, and compare event and non-event conditions. Avoid cycling a device repeatedly or making several changes simply to “see what happens.”

If the problem cannot be reproduced safely, document the evidence and uncertainty, agree on monitored follow-up, and escalate with the best available data.`),
      section("Synthetic case: fault after recent service", `A hypothetical customer reports that a symptom began after maintenance. This establishes a useful timeline, not proof that the prior technician caused it. Review the authorized work record, current configuration, symptom conditions, and observable evidence. Ask what changed without assigning blame.

Use approved tests to compare the suspected area with alternatives. Do not retighten, rewire, re-align, swap cables, or apply thread-locking products without explicit model-specific instructions and authorization.`, "field_example"),
      section("Practice: falsify one hypothesis", `Choose two plausible causes for an intermittent stop. For each, name one authorized observation that could distinguish it from the other. State what a negative result would mean and what additional evidence remains necessary.

A good diagnosis can conclude “not yet isolated.”`, "interactive_practice"),
      section("Summary", `Use timelines, alternatives, controlled tests, and honest uncertainty. Correlation is not proof; a negative test is limited to its conditions. Escalate before actions outside authorization or when safe evidence is unavailable.`, "summary_review"),
    ],
    questions: [
      question("What is the difference between an observation and a hypothesis?", "hardware_safety", "An observation records what happened; a hypothesis proposes an explanation that needs testing.", "Maintaining the distinction prevents premature conclusions.", [
        { text: "They are interchangeable labels for a confirmed root cause.", explanation: "A hypothesis is not confirmed merely because it is plausible." },
        { text: "An observation is always a measurement from a meter.", explanation: "Observations may include visible status, logs, timing, or customer report." },
        { text: "A hypothesis is the same as an approved service procedure.", explanation: "A hypothesis explains; a procedure governs a task." },
      ]),
      question("A problem started after a maintenance visit. What can be concluded?", "hardware_safety", "The timing is relevant evidence, but it does not by itself prove the prior work caused the problem.", "Causal attribution requires evidence and fair consideration of alternatives.", [
        { text: "The previous technician definitely caused it.", explanation: "Temporal order alone does not establish causation." },
        { text: "The previous technician's work must not be reviewed.", explanation: "Authorized work records may help construct a testable timeline." },
        { text: "The entire device should be replaced immediately.", explanation: "The cause and scope have not been established." },
      ]),
      question("Why write down what result would weaken a hypothesis?", "hardware_safety", "It makes the test discriminating and reduces confirmation bias.", "A useful test can disconfirm as well as support an explanation.", [
        { text: "To guarantee a chosen part is defective.", explanation: "Testing does not guarantee a result in advance." },
        { text: "To avoid recording negative results.", explanation: "Negative findings should be documented with their conditions." },
        { text: "To justify changing several settings at once.", explanation: "Multiple changes make outcomes harder to interpret." },
      ]),
      question("An intermittent symptom cannot be reproduced during a safe visit. What is a useful outcome?", "hardware_safety", "Record the evidence and conditions, communicate uncertainty, and agree on a monitored follow-up or escalation.", "An unresolved but well-documented case is better than an unsupported repair.", [
        { text: "Declare the device fixed because it ran once.", explanation: "One successful moment does not resolve an intermittent issue." },
        { text: "Change settings until an error appears.", explanation: "Uncontrolled changes are unsafe and obscure causality." },
        { text: "Invent a failure code to justify a replacement.", explanation: "Records must be factual." },
      ]),
      question("A proposed test goes beyond your authorization. What should you do?", "hardware_safety", "Pause and obtain the qualified authorized person and applicable procedure.", "An educational diagnosis does not expand role boundaries.", [
        { text: "Proceed carefully because the test is short.", explanation: "Duration does not create authorization or control hazards." },
        { text: "Ask an operator to hold a guard while you work.", explanation: "That does not make an unauthorized hazardous task safe." },
        { text: "Skip the procedure if you have seen a similar device.", explanation: "Experience cannot substitute for the exact procedure." },
      ]),
    ],
  },
  {
    dayNumber: 12,
    bootcampDayNumber: null,
    title: "Customer Support and Factual Service Documentation",
    slug: "day-12-customer-support-and-documentation",
    summary: "Use clear customer communication and an owner-scoped educational ticket to document facts, actual work, verification, uncertainty, and follow-up without implying an OEM form or compliance status.",
    estimatedMinutes: 90,
    competencyDomain: "customer_docs",
    objectives: [
      "Acknowledge business impact while setting truthful expectations.",
      "Separate the customer report, observations, hypotheses, tests, actions, and conclusions.",
      "Record only work actually performed and verification actually obtained.",
      "Leave clear ownership for unresolved issues and protect sensitive customer information.",
    ],
    prerequisites: ["Days 3, 5, and 11 safety and diagnostic reasoning"],
    sourceRef: {
      title: "Educational service-record and customer-communication practices",
      citation: "Independent educational material; follow the employer's and customer's actual ticketing, privacy, retention, and service-report policies.",
      confidenceLevel: "educational_best_practice",
      notes: "This application's ticket is an independent training form, not an OEM, audit-certified, warranty, or legal compliance document.",
    },
    contentBlocks: [
      section("Acknowledge the impact, then establish the facts", `Start by listening, restating the operational impact, and clarifying the desired outcome. Ask neutral questions about the symptom, scope, timing, recent changes, and what has already been tried. Avoid blame and promises before a safe plan is known.

Set a realistic update time, explain what information you need, and distinguish a temporary production workaround from a verified correction. If the customer asks for an unsafe or unauthorized action, explain the boundary and identify a safe escalation.`),
      section("A useful record preserves the reasoning", `An educational service record can include customer and equipment identity, reported concern, safety assessment, configuration notes, tests performed, observations, actions actually taken, verification results, customer communication, and follow-up. Local employer forms may use different fields.

Label each statement accurately. “Customer reports” is not a technician observation. A suspected cause is not a confirmed cause. An empty field is not evidence that a test passed. Record not performed or unknown when that is the truth.`, "visual_explanation"),
      section("Customer privacy and accountable changes", `Share only the information needed for the approved service record. Do not store passwords, access tokens, unnecessary personal data, or unapproved customer artwork in a ticket. Follow the organization’s approved retention and access policies.

For any authorized configuration change, record the prior value if policy permits, the documented basis, who approved it, what changed, and the verification performed. Do not make an invisible or undocumented change to appease a deadline.`),
      section("Synthetic example: a clear follow-up", `Hypothetical close-out: “The reported banding was not reproduced during today's approved test. The static pattern was recorded; it does not rule out an intermittent production condition. The customer provided two affected job samples. No hardware adjustment was made. We agreed to collect the next occurrence's job ID and timestamp and review it with authorized support.”

This is more useful than “fixed” because it separates evidence, action, limitation, and next owner.`, "field_example"),
      section("Practice: draft an honest ticket", `Create an educational ticket for a hypothetical symptom. Mark the scenario as synthetic, name only tests you actually performed in the exercise, and make no physical repair claim. State which information is unknown and who owns the next follow-up.

Use the service-ticket page to save, edit, print, and review your own records; the application labels them as independent training simulations.`, "interactive_practice"),
      section("Summary", `Accurate documentation is a service skill. Separate report from observation and inference; record actual work and results; state uncertainty; identify follow-up; and respect privacy. A saved educational ticket is not an official employer record.`, "summary_review"),
    ],
    questions: [
      question("How should a ticket describe a test that was not performed?", "customer_docs", "State clearly that it was not performed and do not report a result.", "A factual record must not imply a test occurred when it did not.", [
        { text: "Mark the test as passed to complete the form.", explanation: "An unperformed test has no pass result." },
        { text: "Copy a result from a similar customer case.", explanation: "Another case does not establish this equipment's result." },
        { text: "Leave the field ambiguous so the reader assumes success.", explanation: "Ambiguity can mislead the customer and future technician." },
      ]),
      question("Which entry best separates evidence from interpretation?", "customer_docs", "“Customer reports intermittent stops; error log not available; cause not yet isolated.”", "The entry identifies who reported the event and explicitly records uncertainty.", [
        { text: "“Controller board failed” when no test supports it.", explanation: "That presents a hypothesis as a confirmed finding." },
        { text: "“Customer was wrong; machine is fine.”", explanation: "It is dismissive and not evidence-based." },
        { text: "“Repaired” when no action was taken.", explanation: "It misrepresents the work performed." },
      ]),
      question("Which information should not be put in a service ticket?", "customer_docs", "Passwords, session tokens, or unnecessary sensitive customer data.", "Tickets should follow approved privacy and access policies and avoid secrets.", [
        { text: "The time of the reported error.", explanation: "A relevant timestamp supports troubleshooting." },
        { text: "The actual device identity when authorized.", explanation: "Device identity is commonly needed to understand scope." },
        { text: "The status message observed during an approved check.", explanation: "A factual status can be relevant evidence." },
      ]),
      question("What makes a useful customer update under production pressure?", "customer_docs", "Acknowledge impact, explain the next evidence-based step, and give a realistic time for an update.", "Clear communication sets expectations without promising an unverified fix.", [
        { text: "Guarantee the machine will be fixed before the next shift.", explanation: "A guarantee may be unsupported by current evidence." },
        { text: "Promise a replacement part before diagnosis.", explanation: "The cause and remedy are not established." },
        { text: "Avoid speaking to the customer until the case is closed.", explanation: "Silence creates uncertainty and undermines service." },
      ]),
      question("What is this application's service-ticket form?", "customer_docs", "An independent educational training record, not an OEM, warranty, or compliance-certified form.", "The application disclaims manufacturer endorsement and formal status.", [
        { text: "An official CGS ORIS warranty document.", explanation: "The platform is independent and not endorsed by the manufacturer." },
        { text: "Proof that work was performed at a real customer site.", explanation: "The form can be used for simulations and must not misrepresent work." },
        { text: "A substitute for an employer's service-record policy.", explanation: "Use the actual employer and customer process in the field." },
      ]),
    ],
  },
  {
    dayNumber: 13,
    bootcampDayNumber: 3,
    title: "Interview Preparation and Transferable Skills",
    slug: "day-13-interview-and-company-preparation",
    summary: "Prepare a truthful, role-specific interview story using a current job posting, documented company information, transferable technical skills, STAR structure, and clear safety boundaries.",
    estimatedMinutes: 90,
    competencyDomain: "company_interview",
    objectives: [
      "Research company and role facts from current primary sources.",
      "Translate relevant experience without claiming product expertise or repairs you have not performed.",
      "Structure a behavioral example using Situation, Task, Action, and Result.",
      "Explain how you would pause, consult documentation, and communicate uncertainty when faced with an unfamiliar system.",
    ],
    prerequisites: ["Days 1 and 11 portfolio and diagnostic practice"],
    sourceRef: {
      title: "Current employer posting and public product information as interview sources",
      citation: `${portfolioOverview}; ${metisOverview}; use the live job listing supplied by the employer for current role requirements.`,
      confidenceLevel: "public_sources_and_candidate_context",
      notes: "No hiring rubric, headquarters, salary, travel percentage, interview date, or current job requirement is asserted by this lesson. Tailor answers to the current posting and the candidate's actual experience.",
    },
    contentBlocks: [
      section("Research before you rehearse", `Use the current role posting and primary company product pages. Record the source and date for statements about responsibilities, travel, training, location, qualifications, and product scope. If a detail is not published or provided, ask the recruiter or omit it rather than guessing.

The public product pages describe portfolios; they are not a job posting. Do not quote old training examples as evidence about current company operations.`),
      section("Translate experience honestly", `Transferable skills can include fault isolation, reading approved documentation, customer communication, safety practice, system commissioning, data analysis, or learning unfamiliar tools. Explain a real situation and what you personally did.

If you have never serviced a certain printer, scanner, or software package, say so. Then explain how you would identify the exact configuration, obtain current training and procedures, work within authorization, and verify results.`, "visual_explanation"),
      section("STAR with technical clarity", `- **Situation:** What was the context and customer or production impact?
- **Task:** What were you responsible for, and what was outside your role?
- **Action:** What evidence did you collect, which alternatives did you consider, and how did you stay safe?
- **Result:** What changed, how was it verified, what did you document, and what did you learn?

Choose a real story. Do not add a dramatic fault, meter reading, part number, dollar amount, or time saved that you cannot substantiate.`),
      section("Practice: an unfamiliar-system question", `Prompt: “You arrive at a device you have not serviced before. The customer asks you to adjust it immediately. What would you do?”

A strong response acknowledges the customer's impact, clarifies the symptom, checks site safety and work authorization, identifies the model and version, reviews the current manual, gathers approved evidence, and asks for help when the task exceeds your training. It avoids both bluffing and unnecessary delay.` , "interactive_practice"),
      section("Interview checklist", `Before the interview, prepare: one truthful troubleshooting story; one safety example; one customer-communication example; a concise statement of transferable skills; two genuine questions about the role; and verified company facts with their source.

Use this as practice, not as an employer-issued rubric.`, "summary_review"),
    ],
    questions: [
      question("Where should a candidate verify current responsibilities and travel requirements?", "company_interview", "The current employer job posting or direct employer communication.", "A public portfolio page or old training example does not define a current role.", [
        { text: "An old synthetic scenario in an independent learning app.", explanation: "An educational case is not a current job description." },
        { text: "A guess based on similar companies.", explanation: "Similar roles can have different requirements." },
        { text: "A product-family overview.", explanation: "Product pages are not employment postings." },
      ]),
      question("How should a candidate discuss equipment they have never serviced?", "company_interview", "Be candid and explain a safe, structured approach to learning and using current procedures.", "Transferable skills can be presented without fabricating hands-on product experience.", [
        { text: "Claim to have repaired it because the systems look familiar.", explanation: "That misrepresents experience and can create safety concerns." },
        { text: "Avoid answering and change the subject.", explanation: "An honest response can explain a useful learning method." },
        { text: "Promise to replace parts until it works.", explanation: "This is unsafe and not an evidence-based plan." },
      ]),
      question("Which elements are part of the STAR structure?", "company_interview", "Situation, Task, Action, and Result.", "STAR helps organize an actual behavioral example and its outcome.", [
        { text: "Specification, Test, Adjustment, Repair.", explanation: "That is not the STAR interview structure." },
        { text: "Safety, Timing, Assumption, Replacement.", explanation: "That is not the STAR interview structure." },
        { text: "Source, Target, Average, Rating.", explanation: "That is not the STAR interview structure." },
      ]),
      question("Which technical example should not be added to an interview story?", "company_interview", "A reading, part number, or repair result that the candidate cannot substantiate.", "Credibility requires truthful and supportable detail.", [
        { text: "A real observation and how it was recorded.", explanation: "A real, relevant observation can strengthen an answer." },
        { text: "A clear explanation of personal responsibility.", explanation: "Ownership helps the interviewer understand the candidate's work." },
        { text: "A lesson learned from a verified outcome.", explanation: "Reflection is appropriate when truthful." },
      ]),
      question("A customer asks for an immediate adjustment to an unfamiliar device. What is a strong interview response?", "company_interview", "Clarify, assess safety and authorization, identify the exact model, consult its current procedure, and escalate when needed.", "A good answer balances customer communication, safety, evidence, and role boundaries.", [
        { text: "Make a likely adjustment based on another device.", explanation: "Settings are model-specific and an adjustment is unverified." },
        { text: "Agree to the adjustment so the customer remains satisfied.", explanation: "Customer pressure does not establish safety or authorization." },
        { text: "Refuse to learn any unfamiliar system.", explanation: "A technician can learn through training and approved documentation." },
      ]),
    ],
  },
  {
    dayNumber: 14,
    bootcampDayNumber: 3,
    title: "Mock Interview and Readiness Review",
    slug: "day-14-full-mock-interview-readiness",
    summary: "Integrate safety, evidence-led troubleshooting, workflow knowledge, communication, verification, and honest interview delivery using this academy's transparent practice rubric—not an employer assessment.",
    estimatedMinutes: 90,
    competencyDomain: "company_interview",
    objectives: [
      "Structure an unfamiliar fault response around safety, facts, hypotheses, approved tests, verification, and documentation.",
      "Explain relevant color, scanning, software, or printer concepts with appropriate uncertainty.",
      "Deliver a concise STAR story using only supportable personal experience.",
      "Interpret academy practice feedback as coaching evidence rather than proof of field competence or hiring readiness.",
    ],
    prerequisites: ["Days 1-13 or equivalent guided preparation"],
    sourceRef: {
      title: "Independent academy mock interview and disclosed practice rubric",
      citation: "This academy's educational rubric and course content; not an employer examination, certification, or hiring score.",
      confidenceLevel: "educational_assessment",
      notes: "The interview API uses a disclosed rule-based keyword/structure heuristic. It does not evaluate technical truth, verify experience, or use an AI technical assessor. Compare responses with the lesson, primary sources, and qualified human feedback.",
    },
    contentBlocks: [
      section("A repeatable answer framework", `For an unfamiliar technical complaint, explain: (1) how you clarify impact and scope; (2) what safety and authorization checks govern the task; (3) which facts, versions, and records you would capture; (4) competing explanations; (5) one approved test that distinguishes them; (6) how you would verify an outcome; and (7) how you would document or escalate.

State when you lack information. A good answer does not require pretending to know a product-specific value or procedure.`),
      section("Assessment evidence versus practice coaching", `The academy's quiz results record submitted answers. The interview studio applies a simple disclosed text-and-structure rubric to selected keywords and response organization. It cannot determine whether a technical statement is true, whether a story happened, or whether the candidate is qualified for field work.

Use feedback to choose a topic to review. For technical accuracy, consult current primary documentation and a qualified instructor. For hiring decisions, use the employer's real process; no academy score predicts an offer.`, "visual_explanation"),
      section("Mock prompt: customer pressure and missing documentation", `Prompt: “A production-critical machine has stopped. The customer demands a quick electrical adjustment, but you do not have the exact model procedure.”

A responsible response acknowledges impact, keeps people safe, does not probe or alter equipment without proper training and authorization, identifies the model, requests the current procedure and qualified site support, and gives the customer a clear update. Explain what evidence you would collect without crossing the safety boundary.` , "field_example"),
      section("Self-review rubric", `After recording or writing an answer, ask yourself:

- Did I distinguish what I know from what I infer?
- Did I put safety, authorization, and current documentation first?
- Did I choose evidence that could distinguish competing causes?
- Did I define a customer-agreed verification and a factual ticket?
- Did I describe only my real experience?

These are learning prompts, not an employer's scoring criteria.`, "interactive_practice"),
      section("Next steps", `Revisit the relevant day, save a private study note, retry a knowledge check after review, or practice a different interview prompt. Persistent course completion is based on a passing saved lesson knowledge check; scenarios, flashcards, and interview exercises are tracked separately.

A completed course is evidence of study activity—not a professional license, safety qualification, field-service certification, or hiring decision.`, "summary_review"),
    ],
    questions: [
      question("What does a passing academy knowledge check establish?", "company_interview", "That the learner passed that saved course assessment under the academy's scoring rule.", "It records course evidence; it does not certify safe field competence or predict hiring.", [
        { text: "That the learner is authorized to service industrial equipment.", explanation: "Course completion does not grant employer or site authorization." },
        { text: "That the learner will be hired.", explanation: "A course result is not an employer decision." },
        { text: "That every interview answer is technically accurate.", explanation: "A quiz score does not verify every technical claim." },
      ]),
      question("What does the interview studio's rule-based rubric evaluate?", "company_interview", "Selected keywords and response-structure markers, as disclosed in its feedback.", "The tool is a transparent practice heuristic, not a technical-truth evaluator.", [
        { text: "The full technical truth of every claim.", explanation: "The heuristic does not verify technical truth." },
        { text: "Whether the candidate's story actually happened.", explanation: "The application cannot independently verify experience." },
        { text: "The employer's hiring decision.", explanation: "The employer uses its own process." },
      ]),
      question("A requested service action lacks an exact procedure. What belongs in a strong answer?", "company_interview", "Pause the action, identify the equipment, obtain authorized guidance, and explain the next safe step to the customer.", "Missing product-specific documentation should lead to verification or escalation, not improvisation.", [
        { text: "Make the adjustment from memory of a different device.", explanation: "A different device may use different procedures and settings." },
        { text: "Promise a repair to avoid disappointing the customer.", explanation: "A promise cannot replace evidence and procedure." },
        { text: "Use a live electrical test because the machine is urgent.", explanation: "Urgency does not authorize hazardous work." },
      ]),
      question("Which response best demonstrates evidence-led reasoning?", "company_interview", "State observations, offer competing hypotheses, propose an approved discriminating test, and define verification.", "This sequence makes reasoning testable and keeps conclusions tied to evidence.", [
        { text: "Name the most expensive part and request replacement.", explanation: "A part guess is not evidence or diagnosis." },
        { text: "Say the symptom is always caused by one common fault.", explanation: "Symptoms can have multiple causes." },
        { text: "Make several changes and report success if the symptom disappears.", explanation: "Multiple uncontrolled changes obscure cause and may create risk." },
      ]),
      question("What does completing the full course mean?", "company_interview", "The learner completed the academy's saved learning and assessment requirements; it is not a license or professional certification.", "The platform distinguishes study records from external qualification and employment decisions.", [
        { text: "The learner is a certified OEM service technician.", explanation: "The independent academy does not issue OEM certification." },
        { text: "The learner can ignore employer safety procedures.", explanation: "Employer and site rules still govern field work." },
        { text: "The learner has passed every real-world scenario.", explanation: "Educational simulations do not prove real-world performance." },
      ]),
    ],
  },
];
