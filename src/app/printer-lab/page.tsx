"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Eye,
  HelpCircle,
  ShieldCheck,
  Wrench,
} from "lucide-react";

interface PracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LearningArea {
  id: string;
  name: string;
  category: string;
  functionalExplanation: string;
  commonFailureSymptoms: string[];
  observableEvidence: string[];
  safeDiagnosticConsiderations: string[];
  relationshipToOtherSubsystems: string;
  practiceQuestion: PracticeQuestion;
  implicatedInFaults: string[];
}

function area(
  id: string,
  name: string,
  category: string,
  functionalExplanation: string,
  commonFailureSymptoms: string[],
  observableEvidence: string[],
  safeDiagnosticConsiderations: string[],
  relationshipToOtherSubsystems: string,
  question: PracticeQuestion,
  implicatedInFaults: string[],
): LearningArea {
  return {
    id,
    name,
    category,
    functionalExplanation,
    commonFailureSymptoms,
    observableEvidence,
    safeDiagnosticConsiderations,
    relationshipToOtherSubsystems,
    practiceQuestion: question,
    implicatedInFaults,
  };
}

const commonSafety = "This is a conceptual learning aid, not an equipment-specific procedure. Use the current manual and site safety program; stop if hazards, authorization, or instructions are unclear.";

const learningAreas: LearningArea[] = [
  area("source", "1. Source Job & Requirements", "data", "The requested image, output target, material, and customer acceptance criteria define what the configured workflow is expected to produce.", ["Wrong job revision", "Target or material not identified", "Mismatch between requested and processed output"], ["Job identifier and revision", "Approved target and material", "Customer's stated acceptance requirement"], ["Preserve the source file and job identity.", "Do not alter customer files or color settings without authorization."], "The source job enters the configured processing and output workflow.", { question: "What should be confirmed before diagnosing an output mismatch?", options: ["The job revision, material, target, and agreed criteria", "A replacement board for the printer", "A universal ΔE limit"], correctIndex: 0, explanation: "The requirements and comparison context must be known before interpreting a result." }, ["fault_image", "fault_job"]),
  area("processor", "2. RIP / Job Processing", "data", "A configured software or controller stage may interpret or transform job data for a specific output path. Product boundaries vary.", ["Processing or queue error", "Job differs from intended input", "Delay before transfer"], ["Exact application and version", "Job status and timestamp", "Documented error text"], ["Use approved status tools and preserve relevant logs.", "Do not delete queues, change settings, or expose credentials without owner approval."], "Processed data is passed through the installation's configured queue or interface.", { question: "A job is stalled. What is a useful first question?", options: ["At which configured stage was progress last confirmed?", "Which printer component should be replaced?", "Which security feature should be disabled?"], correctIndex: 0, explanation: "Locating the first observed failure is more informative than guessing a cause." }, ["fault_job"]),
  area("controller", "3. Device Control & Status", "electronics", "Model-specific controls coordinate device behavior and report status. The internal architecture is not assumed by this illustration.", ["Status or communication warning", "Unexpected pause", "Configuration-dependent behavior"], ["Exact model and software version", "Status display and approved logs", "Time and operating conditions"], ["Record the message before interpreting it.", "Do not open electronics or probe circuits from this lesson."], "Status and configuration affect how a processed job is handled by the device.", { question: "What is the best response to an unfamiliar status message?", options: ["Record it and check current documentation for the exact model/version", "Use a service menu from a similar printer", "Assume the nearest board has failed"], correctIndex: 0, explanation: "Status meanings and procedures are model- and version-specific." }, ["fault_job", "fault_image"]),
  area("safeguards", "4. Guards, Interlocks & Stop Controls", "safety", "Protective devices and stop controls are part of the machine's safety design; their exact behavior depends on the equipment.", ["Guard or interlock warning", "Protective device appears damaged or bypassed", "Unexpected stop"], ["Visible device condition", "Exact displayed warning", "Site response and equipment records"], ["Never bypass or defeat a protective device.", "A stop command does not itself prove energy isolation; follow the site procedure."], "Protective systems constrain operation and access across the device.", { question: "A protective device appears bypassed. What should a learner recommend?", options: ["Keep people clear, stop the affected work using site procedures, and escalate", "Run one short print to confirm the bypass", "Tape the device in place for observation"], correctIndex: 0, explanation: "A bypass is an uncontrolled hazard; contain it and involve the responsible site authority." }, ["fault_safety"]),
  area("supplies", "5. Material / Consumable Supply", "materials", "Equipment may use model-specific materials or consumables to form an output; this area is deliberately generic.", ["Supply status warning", "Output changes after a material change", "Unexpected material behavior"], ["Exact material identity and lot when relevant", "Compatibility records", "Device status and job configuration"], ["Check the exact product's approved material list and handling documentation.", "Do not substitute a chemical, ink, or consumable based on a generic example."], "Material identity and availability can affect the process and the resulting output.", { question: "A new material is associated with a changed result. What should be verified?", options: ["The material identity, supported configuration, job setup, and target", "That the same ink works for all materials", "That the operator should add an undocumented coating"], correctIndex: 0, explanation: "Material change is relevant evidence but does not establish a cause or remedy." }, ["fault_material", "fault_image"]),
  area("fluid", "6. Fluid / Ink Handling (Where Present)", "materials", "Some printing processes use fluids delivered through a product-specific supply path; not all devices use the same materials or architecture.", ["Supply or process warning", "Leak or visible material release", "Inconsistent output"], ["Displayed status", "Material label and current SDS where applicable", "Observed condition without entering a hazard area"], ["Follow the actual SDS, risk assessment, and manufacturer procedure.", "Stop and escalate an unknown leak or exposure; do not open or flush a system from this lesson."], "A material-delivery subsystem, when fitted, interacts with the imaging process.", { question: "What governs the choice of a handling or cleaning material?", options: ["The exact product documentation, SDS, task risk assessment, and authorization", "A solvent used on another printer", "The quickest material available"], correctIndex: 0, explanation: "Compatibility and protection requirements depend on the exact product and task." }, ["fault_material", "fault_image"]),
  area("imaging", "7. Image-Formation System", "imaging", "The device-specific technology that forms an image on the selected material. This model does not assert a printhead brand or architecture.", ["Missing, shifted, or uneven output", "Banding or other repeated pattern", "Intermittent quality change"], ["Approved diagnostic pattern and its conditions", "Affected job and material", "Repeatability and status messages"], ["A clean test is limited to the conditions it examines.", "Do not touch imaging surfaces or run unapproved maintenance."], "Image formation interacts with motion, material, software, and any process stage present.", { question: "What does a clean static pattern establish?", options: ["That the pattern looked clean under that test condition", "That every dynamic or intermittent fault is impossible", "That media advance is the confirmed cause"], correctIndex: 0, explanation: "A static result is useful but does not rule out every head or dynamic fault." }, ["fault_image"]),
  area("motion", "8. Motion / Transport", "motion", "Mechanisms may move an imaging assembly, material, or both. Motion architecture and limits vary by exact device.", ["Unexpected movement or pause", "Registration or transport symptom", "Motion-related warning"], ["Status messages and timestamps", "Whether the symptom occurs with a particular job or material", "Authorized observations from outside guarded areas"], ["Keep clear of moving equipment.", "Never enter or inspect a guarded area without the applicable procedure and authorization."], "Movement can affect image placement and can introduce physical hazards.", { question: "A motion-related warning has unknown safety significance. What is appropriate?", options: ["Follow the approved site response and consult the exact manual before further operation", "Run the equipment faster to reproduce it", "Enter the guarded area to look for a loose part"], correctIndex: 0, explanation: "Unknown motion hazards require the approved response, not a provocative or intrusive test." }, ["fault_image", "fault_safety"]),
  area("feedback", "9. Position / Registration Feedback", "electronics", "A system may use sensors or other feedback to coordinate position or state; this is a functional category, not a universal component list.", ["Position or registration warning", "Repeatability changes", "A result depends on operating conditions"], ["Exact error and time", "Approved output or status comparison", "Device identity and version"], ["Do not infer an encoder type, gap, calibration value, or adjustment procedure.", "Use the exact manual and authorized support."], "Position feedback can be related to motion and image placement.", { question: "A position warning proves which component failed?", options: ["No component is proven; the warning is evidence to interpret using the model-specific procedure", "A linear optical encoder in every case", "The network interface"], correctIndex: 0, explanation: "An error message alone does not identify a failed part." }, ["fault_image", "fault_safety"]),
  area("support", "10. Media Support / Holding", "materials", "A device may support or retain material during output using model-specific mechanical or other methods.", ["Material shifts or lifts", "Output varies with stock", "Clearance or handling concern"], ["Material identity and loading record", "Visible condition observed from a safe position", "Approved setup guidance"], ["If material is raised near moving parts, stop the affected work and keep clear.", "Never hold material down by hand near operating machinery."], "Material support affects transport and physical clearance.", { question: "Material is raised near moving parts. What should happen first?", options: ["Keep people clear and follow the site's approved stop-work response", "Hold it down while the machine runs", "Bypass the guard to finish the job"], correctIndex: 0, explanation: "A possible collision or entanglement is a stop-work condition." }, ["fault_image", "fault_material", "fault_safety"]),
  area("process", "11. Curing / Drying (If Fitted)", "process", "A configured output process may include curing or drying, depending on product family and options.", ["Tackiness or adhesion concern", "Material distortion", "Appearance changes after processing"], ["Exact process configuration and status", "Material and ink documentation", "Customer's approved test method"], ["Do not invent a lamp type, setting, wavelength, irradiance, cleaning routine, or cure time.", "Chemical safety requires the exact current SDS and qualified guidance."], "This process, when present, may affect output appearance or handling.", { question: "A customer asks to increase a cure setting on an unidentified system. What is the safe answer?", options: ["Confirm the device, material, approved procedure, and authorization first", "Increase it until the output feels dry", "Copy a value from a different printer"], correctIndex: 0, explanation: "Process limits are product- and material-specific." }, ["fault_material"]),
  area("environment", "12. Environment & Work Area", "operations", "Site and work-area conditions can influence equipment operation and the safety of a service task.", ["A change coincides with a new symptom", "Dust, moisture, temperature, or access concerns", "Unclear work-area hazards"], ["Customer-reported changes", "Site conditions recorded under approved procedures", "Manufacturer's specified conditions for the exact model"], ["Do not invent environmental limits.", "Stop if the work area or hazard controls are not safe."], "Environment can affect both the equipment and the task context.", { question: "Where should an operating limit come from?", options: ["The current documentation for the exact device and approved site requirements", "A generic training diagram", "A setting from a similar-looking model"], correctIndex: 0, explanation: "Limits vary and must be verified for the exact installation." }, ["fault_material", "fault_safety"]),
  area("maintenance", "13. Approved Maintenance & References", "operations", "Maintenance and calibration instructions are product-specific and may require training, authorization, and safety controls.", ["A scheduled maintenance reminder", "An unresolved warning", "A reference or calibration concern"], ["Exact model, version, and current manual", "Service history", "Authorized test result"], ["Do not improvise cleaning, calibration, adjustment, or replacement.", commonSafety], "Approved maintenance connects user care, product support, and verified output.", { question: "The exact maintenance procedure is unavailable. What should you do?", options: ["Pause and obtain the current model-specific procedure and qualified authorization", "Use a procedure from another brand", "Try an improvised adjustment"], correctIndex: 0, explanation: "Missing instructions are a reason to stop and obtain authoritative guidance." }, ["fault_safety", "fault_image"]),
  area("output", "14. Output Review & Measurement", "measurement", "Output can be reviewed against a defined customer target using the agreed visual, physical, or measurement method.", ["Color or quality disagreement", "Acceptance criterion unclear", "Measurements not comparable"], ["Reference target and revision", "Material and measurement conditions", "Result and agreed tolerance"], ["A ΔE value is not a universal pass/fail decision.", "A training screen swatch is not an instrument reading."], "Output review connects the production result back to job requirements.", { question: "What is needed to interpret a color-difference value?", options: ["The agreed target, formula, material, measurement condition, and acceptance limit", "A universal threshold applied to every job", "Only a visual preview on a browser"], correctIndex: 0, explanation: "A number must be interpreted under the applicable agreed method and requirement." }, ["fault_image", "fault_material"]),
];

const filters = [
  { id: "all", label: "Show All Learning Areas" },
  { id: "fault_image", label: "Explore: Image-Quality Symptoms" },
  { id: "fault_job", label: "Explore: Job / Data Symptoms" },
  { id: "fault_material", label: "Explore: Material / Process Questions" },
  { id: "fault_safety", label: "Explore: Safety Boundaries" },
];

export default function PrinterLabPage() {
  const [selectedArea, setSelectedArea] = useState<LearningArea>(learningAreas[6]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [answer, setAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const selectArea = (item: LearningArea) => {
    setSelectedArea(item);
    setAnswer(null);
    setShowExplanation(false);
  };

  const visibleAreas = learningAreas.filter((item) => activeFilter === "all" || item.implicatedInFaults.includes(activeFilter));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Interactive Printer-Systems Learning Lab</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Industrial Printer Systems Lab</h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Select a conceptual functional area to review possible symptoms, safe evidence questions, and a practice prompt. This independent model is not a Platinum schematic, universal parts list, or service procedure; configurations vary by exact device.
          </p>
        </div>
        <div className="flex items-center space-x-2 no-print">
          <span className="text-[11px] font-mono text-slate-400">Explore areas:</span>
          <select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-500">
            {filters.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 p-3 text-xs text-amber-200">
        <strong>Scope:</strong> The 14 tiles below are learning categories only—not a claim that every printer has these parts or uses one architecture. Highlighted areas are questions to consider, not predicted root causes.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-[#070C14] border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-850 pb-2">
            <span>CONCEPTUAL FUNCTIONAL AREAS</span>
            <span className="text-amber-400">NOT A MODEL SCHEMATIC</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {visibleAreas.map((item) => {
              const selected = selectedArea.id === item.id;
              return (
                <button key={item.id} onClick={() => selectArea(item)} className={`p-3 rounded-lg border text-left transition-all min-h-[92px] ${selected ? "bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500" : "bg-slate-900/90 border-slate-700 hover:border-slate-500 text-slate-200"}`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">{item.category}</span>
                  <span className="font-semibold leading-snug">{item.name}</span>
                  <span className="mt-2 flex items-center justify-between border-t border-slate-800/60 pt-1 text-[10px] text-slate-400">
                    <span className="truncate">{item.commonFailureSymptoms[0]}</span><ArrowRight className="ml-1 h-3 w-3 shrink-0 opacity-60" />
                  </span>
                </button>
              );
            })}
          </div>
          {activeFilter !== "all" && (
            <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-3 text-xs text-amber-300 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /><strong>Exploration filter:</strong> selected areas are possible lines of inquiry, not a diagnosis.</span>
              <button onClick={() => setActiveFilter("all")} className="text-[11px] underline shrink-0">Reset</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-[#0F1A2E] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">{selectedArea.category}</span>
              <span className="text-[10px] font-mono text-slate-500">Conceptual educational model</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5">{selectedArea.name}</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedArea.functionalExplanation}</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />Possible symptoms</div>
              <ul className="space-y-1 text-slate-300 text-[11px] pt-1">{selectedArea.commonFailureSymptoms.map((item, index) => <li key={index}>• {item}</li>)}</ul>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-teal-400 font-bold uppercase flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Evidence to record</div>
              <ul className="space-y-1 text-slate-300 text-[11px] pt-1">{selectedArea.observableEvidence.map((item, index) => <li key={index}>• {item}</li>)}</ul>
            </div>
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 space-y-1">
              <div className="text-[10px] font-mono text-rose-400 font-bold uppercase flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" />Safety boundary</div>
              <ul className="space-y-1 text-slate-300 text-[11px] pt-1">{selectedArea.safeDiagnosticConsiderations.map((item, index) => <li key={index}>⚠️ {item}</li>)}</ul>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed"><strong>Relationship:</strong> {selectedArea.relationshipToOtherSubsystems}</p>
          </div>

          <div className="bg-[#070C14] border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold"><HelpCircle className="w-3.5 h-3.5 text-amber-400" />Practice question</div>
            <p className="font-semibold text-slate-200">{selectedArea.practiceQuestion.question}</p>
            <div className="space-y-1.5">
              {selectedArea.practiceQuestion.options.map((option, index) => {
                const selected = answer === index;
                const correct = index === selectedArea.practiceQuestion.correctIndex;
                const style = showExplanation ? correct ? "bg-emerald-950/60 border-emerald-600 text-emerald-200" : selected ? "bg-rose-950/60 border-rose-600 text-rose-200" : "bg-slate-900 text-slate-400 border-slate-800" : selected ? "bg-amber-500/20 border-amber-500 text-white" : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850";
                return <button key={index} onClick={() => { setAnswer(index); setShowExplanation(true); }} className={`w-full text-left p-2 rounded border text-[11px] transition-colors ${style}`}>{option}</button>;
              })}
            </div>
            {showExplanation && <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1"><div className="font-bold text-teal-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Rationale</div><p>{selectedArea.practiceQuestion.explanation}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
