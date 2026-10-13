"use client";

import React, { useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, ShieldAlert, Workflow } from "lucide-react";

interface FlowChoice {
  label: string;
  description: string;
  nextNodeId: string;
  feedback: string;
}
interface FlowNode {
  id: string;
  step: number;
  stage: string;
  title: string;
  description: string;
  status?: "success" | "warning";
  options: FlowChoice[];
}

const nodes: Record<string, FlowNode> = {
  root: {
    id: "root", step: 1, stage: "Intake", title: "Start with the reported impact",
    description: "Clarify what changed, which jobs or materials are affected, when it began, and what outcome the customer needs. Select a symptom category to practice a safe first response.",
    options: [
      { label: "A repeated print-quality defect", description: "Banding, gaps, or another visible output change.", nextNodeId: "defect_scope", feedback: "Start with scope and safe, approved evidence; a visual defect is not yet a cause." },
      { label: "A color difference", description: "The output appears different from a target or reference.", nextNodeId: "color_method", feedback: "Confirm the comparison conditions before interpreting a measurement." },
      { label: "A job is stalled", description: "Progress is not confirmed through the configured workflow.", nextNodeId: "job_stage", feedback: "Locate the last confirmed stage; do not assume a network or device fault." },
      { label: "An immediate hazard or unsafe condition", description: "Examples: unexpected motion, odor, smoke, a damaged guard, or an unknown chemical exposure.", nextNodeId: "hazard_stop", feedback: "Safety takes priority over diagnosis or production." },
    ],
  },
  defect_scope: {
    id: "defect_scope", step: 2, stage: "Scope & evidence", title: "Describe the print symptom",
    description: "Record the device identity, affected job/material, when it occurs, recent changes, and the customer's reference. Use only tests approved for the exact model and your role.",
    options: [
      { label: "Use the exact manual's approved comparison and record its conditions", description: "Keep the original job and material details; change one variable at a time where practicable.", nextNodeId: "defect_interpret", feedback: "Good. The test is selected for the installation and has a defined question." },
      { label: "The required procedure is missing or outside my authorization", description: "Do not improvise a maintenance, adjustment, or service-menu step.", nextNodeId: "safe_escalation", feedback: "Correct. Missing instructions or authorization are reasons to pause and obtain qualified guidance." },
      { label: "Open a guarded area or bypass a protective device to inspect during operation", description: "This exposes people to uncontrolled hazards.", nextNodeId: "unsafe_terminal", feedback: "Stop. Do not enter a guarded area or defeat a protective device." },
    ],
  },
  defect_interpret: {
    id: "defect_interpret", step: 3, stage: "Interpretation", title: "Keep the test result within its limits",
    description: "Suppose an approved static pattern looks clean, but the production symptom remains. What conclusion is supported?",
    options: [
      { label: "The static test is limited evidence; compare the production symptom with another approved test", description: "Keep competing causes open until evidence distinguishes them.", nextNodeId: "safe_escalation", feedback: "Correct. A clean static pattern does not rule out every printhead or dynamic fault." },
      { label: "Every printhead fault is ruled out; media advance is confirmed", description: "This goes beyond what a static test can establish.", nextNodeId: "overclaim_terminal", feedback: "A clean pattern is not proof of a particular alternative cause." },
      { label: "A test indicates an anomaly; check its meaning in the exact product documentation", description: "An observation may guide the next approved step without identifying a complete root cause.", nextNodeId: "safe_escalation", feedback: "Good. An observed anomaly is evidence; the authorized manual determines the next step." },
    ],
  },
  color_method: {
    id: "color_method", step: 2, stage: "Color comparison", title: "Make the measurement comparable",
    description: "Confirm the target and revision, sample and substrate, formula, instrument/measurement condition, and the customer-agreed acceptance limit.",
    options: [
      { label: "Obtain the agreed target and method before interpreting the result", description: "Preserve the existing workflow as a baseline.", nextNodeId: "color_result", feedback: "Good. A measurement without its reference and method cannot decide acceptance." },
      { label: "Apply a universal ΔE cutoff and change profiles until it passes", description: "No single threshold applies to every job and measurement condition.", nextNodeId: "overclaim_terminal", feedback: "A ΔE value is not a universal pass/fail rule." },
      { label: "Add an ink layer because the material changed", description: "That may not be supported by the specific device or specification.", nextNodeId: "overclaim_terminal", feedback: "A material change alone does not authorize an undocumented color-workflow change." },
    ],
  },
  color_result: {
    id: "color_result", step: 3, stage: "Color review", title: "Document result and uncertainty",
    description: "The comparison now uses an agreed target and method, but the approved correction route is not known.",
    options: [
      { label: "Record formula, condition, material, result, and tolerance; consult the workflow owner for a correction", description: "Do not guess at a profile, setting, or product feature.", nextNodeId: "safe_escalation", feedback: "Correct. The result is evidence; a correction still needs an approved workflow." },
      { label: "Claim every standard passed because one reading is acceptable", description: "Acceptance is limited to the agreed target, conditions, method, and tolerance.", nextNodeId: "overclaim_terminal", feedback: "One measurement does not prove compliance with every standard or requirement." },
    ],
  },
  job_stage: {
    id: "job_stage", step: 2, stage: "Workflow status", title: "Find the last confirmed stage",
    description: "Record job ID, time, exact message, affected users/jobs, and the last confirmed stage in the actual configured pipeline.",
    options: [
      { label: "Ask the system owner to compare processor, queue, transfer, and device status with approved tools", description: "Share only relevant, sanitized evidence.", nextNodeId: "job_result", feedback: "Good. This follows the installed workflow and the authorized system owner." },
      { label: "Delete shared queue files or change network/security settings without approval", description: "This can disrupt other users and destroy evidence.", nextNodeId: "unauthorized_terminal", feedback: "Pause and involve the owner before any shared-system change." },
      { label: "A basic connectivity check passes, so the entire print workflow is healthy", description: "A limited check does not test every processing and transfer stage.", nextNodeId: "overclaim_terminal", feedback: "Treat a basic connectivity result as limited evidence only." },
    ],
  },
  job_result: {
    id: "job_result", step: 3, stage: "Handoff", title: "Prepare a useful support request",
    description: "You have the timestamp, job ID, status message, affected scope, and the system owner's contact.",
    options: [
      { label: "Send a minimal, sanitized handoff and agree on the owner's next documented test", description: "Keep credentials and unnecessary customer data out of the ticket.", nextNodeId: "safe_escalation", feedback: "Good. The handoff preserves evidence and assigns a clear next step." },
      { label: "Email saved passwords and full customer files to a personal account", description: "This exposes secrets and unnecessary customer content.", nextNodeId: "unauthorized_terminal", feedback: "Do not share credentials or unapproved customer data." },
    ],
  },
  hazard_stop: {
    id: "hazard_stop", step: 2, stage: "Stop work & escalate", title: "Protect people before diagnosing",
    description: "The source and risk are unknown. Keep people clear, follow the site's emergency/stop-work response, and notify the responsible site contact. Do not investigate inside the equipment.",
    options: [
      { label: "Contain the situation under site procedure and hand off to qualified personnel", description: "No diagnosis, restart, or repair is part of this step.", nextNodeId: "safe_terminal", feedback: "Correct. Safe containment and escalation are the appropriate outcome." },
      { label: "Continue production or open the equipment to locate the source", description: "Do not enter an uncontrolled hazard area or expose others.", nextNodeId: "unsafe_terminal", feedback: "Stop. Keep people clear and use the site's emergency response." },
      { label: "Assume an emergency stop proves energy is isolated and enter", description: "A stop command is not by itself an energy-isolation procedure.", nextNodeId: "unsafe_terminal", feedback: "An emergency stop is not a substitute for the applicable energy-control procedure." },
    ],
  },
  safe_escalation: {
    id: "safe_escalation", step: 4, stage: "Document & follow up", title: "Record the evidence and the next owner",
    description: "A safe outcome can be a documented, unresolved issue. Record observations, tests actually performed, test limits, what remains unknown, and who owns the next authorized action.",
    options: [],
    status: "success",
  },
  safe_terminal: {
    id: "safe_terminal", step: 3, stage: "Safe disposition", title: "Hazard contained and escalated",
    description: "You prioritized people, used the site response, and left inspection or restart to responsible qualified personnel. No physical repair is implied.",
    options: [],
    status: "success",
  },
  unsafe_terminal: {
    id: "unsafe_terminal", step: 3, stage: "Stop-work boundary", title: "Unsafe action rejected",
    description: "Restart the exercise and choose the safe site response. This training page is not an equipment-specific emergency or LOTO procedure.",
    options: [],
    status: "warning",
  },
  overclaim_terminal: {
    id: "overclaim_terminal", step: 4, stage: "Evidence boundary", title: "Conclusion exceeds the evidence",
    description: "Restart the exercise and separate observations, hypotheses, and customer acceptance criteria.",
    options: [],
    status: "warning",
  },
  unauthorized_terminal: {
    id: "unauthorized_terminal", step: 3, stage: "Authorization boundary", title: "Change requires an authorized owner",
    description: "Restart the exercise and route network, security, or shared-system changes through the approved owner and change process.",
    options: [],
    status: "warning",
  },
};

export default function TroubleshootingPage() {
  const [nodeId, setNodeId] = useState("root");
  const [feedback, setFeedback] = useState<string | null>(null);
  const current = nodes[nodeId];
  const isTerminal = current.options.length === 0;

  const reset = () => {
    setNodeId("root");
    setFeedback(null);
  };

  const select = (choice: FlowChoice) => {
    setFeedback(choice.feedback);
    setNodeId(choice.nextNodeId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-semibold uppercase"><Workflow className="h-4 w-4" />General troubleshooting practice</div>
          <h1 className="mt-1 text-2xl font-bold text-white">Interactive Safe-Triage Flow</h1>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400">Practice organizing evidence and stop-work decisions. This conceptual flow is not a manufacturer procedure, repair guide, LOTO sequence, or authorization to service equipment.</p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 hover:text-white"><RotateCcw className="h-3.5 w-3.5" />Restart</button>
          <a href="/scenarios" className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-500">Simulated cases<ArrowRight className="h-3.5 w-3.5" /></a>
        </div>
      </div>

      <div className="rounded-lg border border-rose-700/40 bg-rose-950/20 p-3 text-xs leading-relaxed text-rose-200">
        <strong>Safety boundary:</strong> If a hazard is uncontrolled or the applicable procedure is unknown, stop the affected work, keep people clear as appropriate, and follow the site's emergency and safety program. An emergency stop is not energy isolation.
      </div>

      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#070C14] p-4 text-xs">
          <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${current.status === "warning" ? "bg-rose-400" : current.status === "success" ? "bg-emerald-400" : "bg-teal-400"}`} /><span className="font-mono uppercase text-slate-400">Practice stage:</span><span className="font-semibold text-teal-200">{current.stage}</span></div>
          <span className="font-mono text-slate-500">Step {current.step}</span>
        </div>

        {feedback && <div className="flex items-start gap-2 rounded-xl border border-teal-500/30 bg-slate-900 p-3.5 text-xs text-teal-200"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />{feedback}</div>}

        <section className={`space-y-5 rounded-2xl border p-6 shadow-2xl sm:p-8 ${current.status === "warning" ? "border-rose-600/50 bg-rose-950/20" : current.status === "success" ? "border-emerald-600/50 bg-emerald-950/20" : "border-slate-800 bg-[#0F1A2E]"}`} aria-live="polite">
          <div>
            <div className="flex items-center gap-2">{current.status === "warning" ? <ShieldAlert className="h-5 w-5 text-rose-400" /> : current.status === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertTriangle className="h-5 w-5 text-amber-400" />}<h2 className="text-xl font-bold text-white">{current.title}</h2></div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{current.description}</p>
          </div>
          {current.options.length > 0 ? <div className="space-y-3">{current.options.map((option) => <button key={option.label} onClick={() => select(option)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-xs text-slate-200 transition hover:border-teal-500/50 hover:bg-slate-800"><span><strong className="block text-sm text-white">{option.label}</strong><span className="mt-1 block leading-relaxed text-slate-400">{option.description}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-teal-400" /></button>)}</div> : <div className="flex flex-wrap gap-2 border-t border-slate-700/60 pt-4"><button onClick={reset} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"><RotateCcw className="h-3.5 w-3.5" />Start again</button><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:text-white">Print this learning flow</button></div>}
        </section>
      </div>
    </div>
  );
}
