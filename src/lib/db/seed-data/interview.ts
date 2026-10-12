export interface SeedInterviewQuestion {
  id: string;
  questionText: string;
  category: string; // 'technical', 'behavioral', 'customer', 'field_ops'
  competencyDomain: string;
  difficulty: string;
  modelAnswer: string;
  evaluationRubric: {
    technicalCriteria: string;
    safetyCriteria: string;
    communicationCriteria: string;
    verificationCriteria: string;
    clarityCriteria: string;
  };
  transferableSkillsTips: string;
  sortOrder: number;
}

export const seedInterviewQuestions: SeedInterviewQuestion[] = [
  {
    id: "int_q_01",
    questionText: "A customer calls Plymouth support reporting severe horizontal banding across their prints. How do you approach this systematically from your initial questions to physical on-site diagnosis?",
    category: "technical",
    competencyDomain: "hardware_safety",
    difficulty: "intermediate",
    modelAnswer: "I begin with structured remote triage to isolate variables: I ask if the banding is light (voids) or dark (overlaps), whether it affects all colors or a single channel, and if it appears at regular pass intervals. On site, my first physical action before touching components is printing a standardized nozzle test pattern. If nozzles are missing or deflected, I inspect the capping station seal, rubber wiper blade, and sub-tank vacuum gauge (-3.2 kPa spec). If all nozzles are 100% firing, missing nozzles are physically ruled out; I immediately shift to media advance step calibration and bidirectional alignment. Finally, I verify the repair with a high-coverage solid test target and document all nozzle checks and feed adjustments.",
    evaluationRubric: {
      technicalCriteria: "Distinguishes nozzle voids from step-feed overlap; understands sub-tank vacuum and wiper mechanics.",
      safetyCriteria: "Avoids aggressive mechanical scraping; maintains electrical awareness during carriage inspection.",
      communicationCriteria: "Asks structured, non-blaming diagnostic questions during intake.",
      verificationCriteria: "Demands post-repair nozzle check and high-coverage solid print before signoff.",
      clarityCriteria: "Delivered in crisp, sequential logical order without hesitation.",
    },
    transferableSkillsTips: "If your background is automotive or HVAC, explain how this mirrors checking fuel pressure or refrigerant pressures before tearing into the engine block or compressor.",
    sortOrder: 1,
  },
  {
    id: "int_q_02",
    questionText: "Why is hitting an Emergency Stop button insufficient before servicing mechanical drive belts or electrical chassis components? Walk through your safety protocol.",
    category: "technical",
    competencyDomain: "hardware_safety",
    difficulty: "basic",
    modelAnswer: "An E-Stop is a software or control-circuit interrupt, not an energy isolation device under OSHA 29 CFR 1910.147. Control relays can weld shut or fail, and an E-Stop does not dissipate stored mechanical energy or high-voltage capacitor charges. My protocol is full Lockout/Tagout: notify facility operators, cleanly park the carriage and shut down software, turn off the main wall disconnect switch, apply my personal red padlock and danger tag, bleed pneumatic lines, allow 5-10 minutes for DC bus capacitor discharge, and verify zero-energy state with a calibrated multimeter measuring Phase-to-Phase, Phase-to-Neutral, and Phase-to-Ground.",
    evaluationRubric: {
      technicalCriteria: "Clearly explains that control circuits fail and capacitors retain lethal DC voltage.",
      safetyCriteria: "Cites OSHA 1910.147, physical padlocks, and three-phase meter verification.",
      communicationCriteria: "Notifies facility staff prior to energy shutdown.",
      verificationCriteria: "Uses physical DMM to prove zero voltage before touching conductors.",
      clarityCriteria: "Authoritative, zero-compromise safety stance.",
    },
    transferableSkillsTips: "Highlight any OSHA 10/30, NFPA 70E, or industrial equipment lockout experience from past manufacturing or facility roles.",
    sortOrder: 2,
  },
  {
    id: "int_q_03",
    questionText: "Describe a time when you were alone on a customer site, encountered an unexpected technical roadblock, and had to resolve it under intense production pressure.",
    category: "behavioral",
    competencyDomain: "company_interview",
    difficulty: "intermediate",
    modelAnswer: "In a previous role servicing automated machinery, I was commissioning an assembly line alone at a customer plant with a midnight production deadline. During final testing, the main servo axis intermittently tripped with a position error. The plant manager was pacing behind me, visibly stressed about a $50,000 shipment penalty. Instead of guessing or swapping parts frantically, I paused, acknowledged his deadline calmly, and promised a factual update in 30 minutes. I pulled up the electrical schematic, connected my multimeter, and monitored the feedback loop while manually cycling the axis. I noticed the fault only tripped at maximum gantry extension. Inspecting the energy drag chain revealed a fatigued ground conductor that pulled open under full cable flex. I cleanly spliced and heat-shrinked the line, verified zero continuity loss through full travel, and the line launched two hours ahead of midnight. The customer commended my calm methodical approach under pressure.",
    evaluationRubric: {
      technicalCriteria: "Demonstrated schematic reading and methodical variable isolation rather than frantic parts swapping.",
      safetyCriteria: "Maintained safety protocols despite high-stakes customer pressure.",
      communicationCriteria: "De-escalated the plant manager by setting a firm 30-minute diagnostic check-in.",
      verificationCriteria: "Tested continuity through full range of motion before greenlighting production.",
      clarityCriteria: "Structured cleanly using the STAR format (Situation, Task, Action, Result).",
    },
    transferableSkillsTips: "Use a genuine story from your background. Emphasize your internal thought process, staying calm, and using data rather than panic.",
    sortOrder: 3,
  },
  {
    id: "int_q_04",
    questionText: "A customer is furious because their brand-new Platinum flatbed printer has poor print adhesion and color mismatch on corrugated plastic. They are shouting at you as soon as you walk in. How do you handle this?",
    category: "customer",
    competencyDomain: "customer_docs",
    difficulty: "intermediate",
    modelAnswer: "First, I do not take the anger personally. The customer is experiencing immense financial stress from halted orders. I listen actively without defensive interruption until they have finished explaining their frustration. I validate their urgency: 'I completely understand how critical this retail shipment is, and my only goal today is getting this printer operating to factory specification safely and reliably.' I do not make false promises of a 15-minute fix; instead, I set a clear communication checkpoint: 'Give me 45 minutes to run our baseline diagnostic protocol, and at 9:30 sharp I will show you exactly what is causing the issue and our timeline.' I then measure the substrate surface energy with Dyne pens and measure UV lamp irradiance with a radiometer. Once I have the data, I walk them through the findings transparently, resolve the issue, and provide operator training.",
    evaluationRubric: {
      technicalCriteria: "Identifies Dyne levels and UV irradiance as the root cause of adhesion issues.",
      safetyCriteria: "Maintains composure and does not take shortcuts due to customer anger.",
      communicationCriteria: "Active listening, empathy, professional boundary setting, and clear check-in timelines.",
      verificationCriteria: "Uses quantitative measurement tools (Dyne pens, radiometer) to provide indisputable data.",
      clarityCriteria: "Empathetic, mature, and professional tone.",
    },
    transferableSkillsTips: "Draw on customer-facing moments from retail, automotive service writing, helpdesk, or field repair where de-escalation was required.",
    sortOrder: 4,
  },
  {
    id: "int_q_05",
    questionText: "What do you know about CGS ORIS Americas, our Plymouth MN operations hub, and how our product portfolios (ORIS, METIS, Platinum) fit together?",
    category: "field_ops",
    competencyDomain: "company_interview",
    difficulty: "intermediate",
    modelAnswer: "CGS ORIS Americas operates out of Plymouth, Minnesota, which serves as the North American headquarters, customer demonstration center, technical training hub, and pre-shipment staging facility where Platinum printers and METIS scanners are bench-tested and calibrated before customer delivery. The company provides a unique high-end integration of three distinct pillars: proprietary ORIS color management software—such as Color Tuner for contract proofing, Press Matcher for fleet normalization, and X Gamut for 7-color extended gamut printing; METIS precision surface scanners engineered in Rome, Italy, which use SynchroLight photometric stereo to capture 3D texture and relief; and Platinum Technologies industrial UV-LED and hybrid printing platforms. Rather than treating them as a single rigid machine, CGS ORIS integrates these technologies into tailored, high-value production workflows.",
    evaluationRubric: {
      technicalCriteria: "Accurately names and differentiates ORIS software, METIS scanners, and Platinum printers.",
      safetyCriteria: "N/A for company knowledge.",
      communicationCriteria: "Demonstrates enthusiasm and thorough research into the company's real operations.",
      verificationCriteria: "Highlights the Plymouth MN staging and bench testing facility.",
      clarityCriteria: "Crisp, well-structured, and knowledgeable overview.",
    },
    transferableSkillsTips: "Memorize the core product names (Color Tuner, Press Matcher, X Gamut, PM3D Hawk, Platinum flatbeds) and the Plymouth MN facility role.",
    sortOrder: 5,
  },
  {
    id: "int_q_06",
    questionText: "This role requires 50% to 75% travel, often with solo travel to unfamiliar client manufacturing plants. How do you manage your travel logistics, physical readiness, and autonomous decision-making?",
    category: "field_ops",
    competencyDomain: "company_interview",
    difficulty: "basic",
    modelAnswer: "I thrive in autonomous field environments and welcome extensive travel. My approach centers on rigorous personal organization and preparedness: I maintain a pre-flight checklist of calibrated test equipment—multimeter with fresh batteries, dial test indicator, feeler gauges, optical loupe, lint-free swabs, and USB diagnostic drives with current firmware and software builds. I plan travel proactively to ensure I arrive on site well-rested and on time. When working alone on a client floor after hours, I maintain disciplined communication with the Plymouth technical support team, document every test step meticulously, and never rush or bypass safety procedures under fatigue.",
    evaluationRubric: {
      technicalCriteria: "Lists essential field service tools and diagnostic media.",
      safetyCriteria: "Prioritizes physical readiness and refuses to bypass safety when fatigued.",
      communicationCriteria: "Maintains structured check-ins with home technical dispatch.",
      verificationCriteria: "Emphasizes meticulous documentation and disciplined testing.",
      clarityCriteria: "Confident, mature, and realistic acceptance of travel lifestyle.",
    },
    transferableSkillsTips: "Highlight past road travel, shift work, field calls, or military deployments showing self-reliance and stamina.",
    sortOrder: 6,
  },
];
