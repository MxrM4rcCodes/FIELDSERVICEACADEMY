export interface SeedInterviewQuestion {
  id: string;
  questionText: string;
  category: string;
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

const rubric = (
  technicalCriteria: string,
  safetyCriteria: string,
  communicationCriteria: string,
  verificationCriteria: string,
  clarityCriteria: string,
): SeedInterviewQuestion["evaluationRubric"] => ({
  technicalCriteria,
  safetyCriteria,
  communicationCriteria,
  verificationCriteria,
  clarityCriteria,
});

export const seedInterviewQuestions: SeedInterviewQuestion[] = [
  {
    id: "int_q_01",
    questionText: "A customer reports horizontal banding, but a static diagnostic pattern appears clean. How would you approach the problem?",
    category: "technical",
    competencyDomain: "hardware_safety",
    difficulty: "intermediate",
    modelAnswer: "Practice structure—not a claim of personal experience: I would clarify which jobs, materials, colors, and conditions are affected; record the exact device and job configuration; and review what the approved static test does and does not show. A clean pattern is limited evidence and does not rule out every printhead or dynamic fault. I would compare competing hypotheses using only the model-approved tests I am trained and authorized to perform, change one variable at a time where practicable, then document the result and any remaining uncertainty. I would not name a failed part until evidence supported it.",
    evaluationRubric: rubric(
      "Separates symptom from cause and recognizes multiple possible sources of banding.",
      "Checks task scope and authorization; does not recommend unsafe access or unapproved maintenance.",
      "Uses neutral questions about impact, scope, timing, and recent changes.",
      "Explains test limits and defines a customer-agreed comparison or escalation.",
      "Presents an organized sequence and labels uncertainty honestly.",
    ),
    transferableSkillsTips: "Use a real diagnostic example from your background if you have one. If not, present this as your proposed method rather than claiming a repair you have not performed.",
    sortOrder: 1,
  },
  {
    id: "int_q_02",
    questionText: "Why is an emergency stop not a substitute for the applicable hazardous-energy control procedure before servicing equipment?",
    category: "technical",
    competencyDomain: "hardware_safety",
    difficulty: "basic",
    modelAnswer: "An emergency stop is a control function and does not by itself establish isolation from hazardous energy or control of stored energy. For work covered by the employer's energy-control program, I would follow the exact site and equipment-specific procedure and work only within my training and authorization. If the procedure, hazard controls, or required qualified support were unavailable, I would stop and escalate. This is a response framework, not a generic LOTO sequence.",
    evaluationRubric: rubric(
      "Distinguishes a stop command from energy isolation and stored-energy control.",
      "Defers to applicable employer procedures, training, authorization, and competent support.",
      "Mentions coordination with affected site personnel where required by the procedure.",
      "Does not invent isolation devices, electrical tests, wait times, or PPE ratings.",
      "Clearly identifies stop-work and escalation conditions.",
    ),
    transferableSkillsTips: "Describe training or experience you actually hold. Do not imply that this interview exercise or an online course qualifies you for hazardous work.",
    sortOrder: 2,
  },
  {
    id: "int_q_03",
    questionText: "A print job is stalled, but the device appears available. How would you prepare a useful technical handoff?",
    category: "technical",
    competencyDomain: "hardware_safety",
    difficulty: "intermediate",
    modelAnswer: "I would record the job identifier and time, identify the last confirmed stage in the actual configured workflow, capture the exact status or error, and note whether other jobs or users are affected. I would use only approved status tools, protect customer data and credentials, and ask the responsible queue or network owner to choose the next documented test. A basic connectivity check would be treated as limited evidence, not proof that the full job path is healthy.",
    evaluationRubric: rubric(
      "Separates file, processor, queue, transfer, and device stages.",
      "Avoids unauthorized network, security, or shared-system changes.",
      "Provides concise, relevant evidence and identifies an owner.",
      "Includes timestamps, status, scope, and authorized checks already completed.",
      "Uses a clear handoff rather than an unsupported root-cause claim.",
    ),
    transferableSkillsTips: "Help-desk, systems support, manufacturing, and customer service examples can transfer. Use real examples and avoid including confidential customer details.",
    sortOrder: 3,
  },
  {
    id: "int_q_04",
    questionText: "A customer says a brand color changed after they switched material. How would you investigate and communicate the next step?",
    category: "customer",
    competencyDomain: "color_oris",
    difficulty: "intermediate",
    modelAnswer: "I would first clarify the target and revision, the material, the job and output configuration, and the customer's agreed measurement formula, condition, and tolerance. I would preserve the baseline and compare like with like using an approved method. A ΔE number alone is not a universal pass/fail rule, and I would not change profiles or add an ink layer without confirming the documented workflow and authorization. I would explain what the evidence shows, what remains uncertain, and who owns the next step.",
    evaluationRubric: rubric(
      "Recognizes material, workflow, target, and measurement condition as relevant factors.",
      "Avoids unapproved settings or unsupported material tests.",
      "Acknowledges customer impact and communicates a realistic next step.",
      "Uses the agreed target, formula, conditions, and tolerance.",
      "Separates measured result from acceptance decision and cause.",
    ),
    transferableSkillsTips: "You do not need to claim ORIS or spectrophotometer experience. Relate a real quality or data-comparison example and explain how you would learn the installed workflow.",
    sortOrder: 4,
  },
  {
    id: "int_q_05",
    questionText: "Tell me about a real time you had to solve an unfamiliar problem under pressure. What did you do, and what did you learn?",
    category: "behavioral",
    competencyDomain: "company_interview",
    difficulty: "intermediate",
    modelAnswer: "Use your own truthful example. Structure it with Situation (brief context and impact), Task (your responsibility and boundaries), Action (the evidence you gathered, options you considered, safety or quality controls, and communication), and Result (what changed, how you verified it, and what you learned). If the result was incomplete, explain that honestly. Do not borrow or embellish a fictional story from this academy.",
    evaluationRubric: rubric(
      "Explains reasoning and evidence without inventing technical specifics.",
      "Identifies relevant safety, quality, or role boundaries where applicable.",
      "Shows how the candidate communicated with affected people.",
      "States an actual result or honestly describes what remained unresolved.",
      "Uses a concise Situation, Task, Action, Result structure.",
    ),
    transferableSkillsTips: "Choose an authentic example from work, study, volunteering, or another relevant setting. Be clear about which actions were yours and where you asked for help.",
    sortOrder: 5,
  },
  {
    id: "int_q_06",
    questionText: "What would you say about the ORIS, METIS, and Platinum product names when you have not verified a specific customer's configuration?",
    category: "field_ops",
    competencyDomain: "company_interview",
    difficulty: "basic",
    modelAnswer: "I would distinguish the publicly listed ORIS software portfolio, METIS scanner families, and the Platinum printer context identified in the course scope. A public overview is useful for product-name orientation, but it does not prove a customer's installed products, versions, licenses, integration, or service procedure. I would check current primary documentation and the actual configuration before making a capability claim. I would not invent employer operations or job requirements.",
    evaluationRubric: rubric(
      "Distinguishes portfolio names without asserting unverified feature details.",
      "Does not imply service authorization or expertise that is not held.",
      "Explains how to confirm information with a current source.",
      "Identifies the installed configuration, version, and license as relevant evidence.",
      "Avoids unsupported company locations, hiring, or operational claims.",
    ),
    transferableSkillsTips: "Research the live employer posting and official product pages before an interview. Mention the source and date for role-specific facts.",
    sortOrder: 6,
  },
  {
    id: "int_q_07",
    questionText: "A repeated artifact appears in a captured scan file. What would you verify before suggesting scanner maintenance?",
    category: "technical",
    competencyDomain: "metis_scanning",
    difficulty: "intermediate",
    modelAnswer: "I would preserve the original file, identify the exact scanner and software version, record the sample and capture conditions, and establish where in the workflow the artifact first appears. I would compare only through the approved capture and reference procedures for that model. I would not clean an optical reference or run a calibration based on a generic example. If the correct procedure were unavailable, I would escalate to authorized product support.",
    evaluationRubric: rubric(
      "Uses file-stage comparison to narrow where the artifact appears.",
      "Does not recommend generic cleaning or calibration steps.",
      "Creates a useful support handoff with device identity and conditions.",
      "Preserves the original and states what has or has not been verified.",
      "Avoids generalizing a feature from one scanner family to another.",
    ),
    transferableSkillsTips: "Image production, photography, scanning, or data-quality work may provide transferable examples. Distinguish general knowledge from experience with a specific METIS model.",
    sortOrder: 7,
  },
  {
    id: "int_q_08",
    questionText: "How would you prepare for a role whose travel, location, or training requirements are not clear from the public information you have?",
    category: "field_ops",
    competencyDomain: "company_interview",
    difficulty: "basic",
    modelAnswer: "I would review the current employer posting, note the information it actually states, and ask the recruiter or hiring contact about any remaining travel, location, schedule, training, or qualification questions. I would answer honestly about my availability and experience rather than assuming a percentage or an operating location from an old source or a similar job.",
    evaluationRubric: rubric(
      "Uses current and appropriate sources for role details.",
      "Does not promise tasks or availability inaccurately.",
      "Asks clear, professional questions about expectations.",
      "Separates published facts from information that still needs confirmation.",
      "Gives a concise, honest response.",
    ),
    transferableSkillsTips: "Prepare genuine questions about support, travel, safety training, and role scope. Do not treat the academy as an employer-issued hiring guide.",
    sortOrder: 8,
  },
];
