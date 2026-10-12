"use client";

import React, { useState } from "react";
import {
  Layers,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Printer,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface DecisionNode {
  id: string;
  stepNumber: number;
  stageName: string;
  title: string;
  description: string;
  isSafetyStop?: boolean;
  options: {
    label: string;
    description: string;
    nextNodeId: string;
    isHazardous?: boolean;
    feedback: string;
  }[];
}

const decisionTree: Record<string, DecisionNode> = {
  root: {
    id: "root",
    stepNumber: 1,
    stageName: "Step 1: Customer Report",
    title: "Customer Initial Service Intake",
    description: "Customer contacts service operations stating their production line is impacted. Which primary symptom domain is reported?",
    options: [
      {
        label: "Horizontal white lines or voids across prints (Banding)",
        description: "Prints have periodic streaks running in the direction of carriage travel.",
        nextNodeId: "safety_banding",
        feedback: "Proceeding to Safety Assessment for Inkjet Carriage.",
      },
      {
        label: "Color mismatch / Brand color shifting (Delta E > 3.0)",
        description: "Output color doesn't match proof or brand swatch.",
        nextNodeId: "safety_color",
        feedback: "Color variance reported. Proceeding to Safety & Baseline evaluation.",
      },
      {
        label: "Job will not print / Queue stalls at 'Spooling 99%'",
        description: "Printer is idle while RIP workstation holds jobs.",
        nextNodeId: "safety_rip",
        feedback: "Network and spooler deadlock investigation initiated.",
      },
      {
        label: "Ink flaking off / Sticky surface after UV cure (Adhesion)",
        description: "Ink scratches off polypropylene with fingernail test.",
        nextNodeId: "safety_curing",
        feedback: "Photopolymerization curing fault investigation.",
      },
      {
        label: "Carriage scraping media / Head-strike hazard audible",
        description: "Operator reports thumping or scraping sounds as carriage passes.",
        nextNodeId: "safety_hazard_crash",
        feedback: "IMMEDIATE HEAD-STRIKE RISK DETECTED.",
      },
    ],
  },

  safety_hazard_crash: {
    id: "safety_hazard_crash",
    stepNumber: 2,
    stageName: "Step 2: Emergency Safety Assessment",
    title: "Critical Kinetic Crash Risk Assessment",
    description: "A moving carriage scraping warped cardboard will rip printheads off the gantry within seconds. What is your required action?",
    isSafetyStop: true,
    options: [
      {
        label: "IMMEDIATE EMERGENCY STOP: Hit E-Stop, halt job, inspect clearance",
        description: "Stop motion immediately to prevent destructive head collision.",
        nextNodeId: "gather_evidence_crash",
        feedback: "CORRECT! Preserves $10,000+ printhead array. Safety protocol satisfied.",
      },
      {
        label: "Wait for the current 4x8 ft board to finish printing",
        description: "Letting the job finish to avoid wasting a $10 sheet of cardboard.",
        nextNodeId: "fatal_crash_stop",
        isHazardous: true,
        feedback: "CATASTROPHIC! Head struck warped board, destroying 3 printheads.",
      },
    ],
  },

  fatal_crash_stop: {
    id: "fatal_crash_stop",
    stepNumber: 2,
    stageName: "Safety Violation: Terminal Failure",
    title: "Printheads Sheared Off Gantry",
    description: "Failing to stop the machine allowed the warped substrate corner to catch the carriage nozzle plate, permanently ruining three printheads ($9,000 damage). You must restart the decision tree.",
    isSafetyStop: true,
    options: [
      {
        label: "Restart Decision Tree from Beginning",
        description: "Return to initial intake.",
        nextNodeId: "root",
        feedback: "Resetting workflow.",
      },
    ],
  },

  safety_banding: {
    id: "safety_banding",
    stepNumber: 2,
    stageName: "Step 2: Safety Assessment",
    title: "Safety Pre-Check for Inkjet Carriage",
    description: "Before inspecting carriage or maintenance components, perform initial safety verification. Carriage moves at up to 2.2 m/s.",
    options: [
      {
        label: "Wear chemical-resistant nitrile gloves and UV eye protection",
        description: "Protect skin from acrylate monomers and eyes from UV reflections.",
        nextNodeId: "gather_evidence_banding",
        feedback: "Safety PPE verified. Ready to gather observable evidence.",
      },
      {
        label: "Reach hands inside the moving gantry to feel the carriage rail",
        description: "Touching moving components during live printing.",
        nextNodeId: "fatal_pinch_stop",
        isHazardous: true,
        feedback: "SEVERE PINCH HAZARD! Reaching into a moving gantry violates OSHA rules.",
      },
    ],
  },

  fatal_pinch_stop: {
    id: "fatal_pinch_stop",
    stepNumber: 2,
    stageName: "Safety Violation: Kinetic Injury",
    title: "Severe Pinch Hazard Violation",
    description: "Industrial gantries exert hundreds of pounds of kinetic force. Reaching inside moving mechanisms caused hand injury. Restart the decision tree.",
    isSafetyStop: true,
    options: [
      {
        label: "Restart Decision Tree",
        description: "Return to start.",
        nextNodeId: "root",
        feedback: "Resetting.",
      },
    ],
  },

  gather_evidence_banding: {
    id: "gather_evidence_banding",
    stepNumber: 3,
    stageName: "Step 3: Gather Evidence",
    title: "Observable Evidence Collection: Banding",
    description: "What diagnostic test do you execute first to gather baseline evidence on horizontal banding?",
    options: [
      {
        label: "Print standard Nozzle Test Pattern and examine under 10x loupe",
        description: "Directly verifies whether printhead orifices are physically firing.",
        nextNodeId: "isolate_subsystem_banding",
        feedback: "Textbook diagnostic method: separates nozzle health from feed mechanics.",
      },
      {
        label: "Immediately order a replacement Magenta printhead",
        description: "Guessing the head is broken without testing.",
        nextNodeId: "unnecessary_replacement_stop",
        feedback: "Violates least-invasive testing. Replacing parts without evidence is rejected.",
      },
    ],
  },

  unnecessary_replacement_stop: {
    id: "unnecessary_replacement_stop",
    stepNumber: 3,
    stageName: "Diagnostic Error: Unjustified Replacement",
    title: "Wasted Part Replacement",
    description: "You replaced a $2,800 printhead without running a nozzle check. The banding persisted because the feed calibration was wrong.",
    isSafetyStop: true,
    options: [
      {
        label: "Return to Evidence Gathering",
        description: "Run nozzle check.",
        nextNodeId: "gather_evidence_banding",
        feedback: "Returning to proper test sequence.",
      },
    ],
  },

  isolate_subsystem_banding: {
    id: "isolate_subsystem_banding",
    stepNumber: 4,
    stageName: "Step 4: Isolate Subsystem",
    title: "Interpreting Nozzle Check Results",
    description: "The nozzle pattern prints. You inspect the test pattern with a loupe. What does the evidence show?",
    options: [
      {
        label: "16 missing nozzles and 4 deflected nozzles on Cyan Channel",
        description: "Clear evidence of hydraulic/capping maintenance failure.",
        nextNodeId: "action_nozzle_recovery",
        feedback: "Subsystem isolated: Ink Delivery / Maintenance Station (Capping & Wiper).",
      },
      {
        label: "100% of nozzles in all channels are firing cleanly without a single gap",
        description: "Nozzles are healthy; fault MUST be media advance or bidirectional.",
        nextNodeId: "action_step_calibration",
        feedback: "Subsystem isolated: Media Advance / Step Calibration (Y-Axis).",
      },
    ],
  },

  action_nozzle_recovery: {
    id: "action_nozzle_recovery",
    stepNumber: 5,
    stageName: "Step 5: Select & Execute Test / Action",
    title: "Nozzle Recovery Procedure",
    description: "Cyan has 16 missing nozzles. How do you recover the orifices safely?",
    options: [
      {
        label: "Clean wiper blade with lint-free swabs, moisten capping seal, run 2-sec purge",
        description: "Gentle maintenance station recovery without abrasive contact.",
        nextNodeId: "verify_and_document_banding",
        feedback: "Correct! Soft purge and clean wiper cleared the dried crust.",
      },
      {
        label: "Scrape the nozzle plate with a metal putty knife",
        description: "Metal against polyimide coating.",
        nextNodeId: "fatal_scratch_stop",
        isHazardous: true,
        feedback: "SCRATCHED NOZZLE COATING! Head permanently destroyed.",
      },
    ],
  },

  fatal_scratch_stop: {
    id: "fatal_scratch_stop",
    stepNumber: 5,
    stageName: "Fatal Tool Error",
    title: "Scratched Printhead Nozzle Plate",
    description: "Metal tools ruin the microscopic anti-wetting coating on printheads. The head must be scrapped. Restart exercise.",
    isSafetyStop: true,
    options: [
      {
        label: "Restart Decision Tree",
        description: "Reset.",
        nextNodeId: "root",
        feedback: "Resetting.",
      },
    ],
  },

  action_step_calibration: {
    id: "action_step_calibration",
    stepNumber: 5,
    stageName: "Step 5: Media Step Calibration",
    title: "Step Feed Factor Adjustment",
    description: "All nozzles are 100% firing. Dark lines indicate swath overlap. How do you calibrate?",
    options: [
      {
        label: "Print Vernier step target, measure overlap, and update feed factor by +0.35%",
        description: "Dialing in media advance compensation for current substrate weight.",
        nextNodeId: "verify_and_document_banding",
        feedback: "Calibrated feed factor to match substrate drag coefficient.",
      },
    ],
  },

  verify_and_document_banding: {
    id: "verify_and_document_banding",
    stepNumber: 6,
    stageName: "Step 6: Verify & Document",
    title: "Verification Target & Field Service Ticket",
    description: "Corrective actions completed. How do you verify before customer signoff?",
    options: [
      {
        label: "Print high-coverage full-bed test, verify 100% nozzle health, complete 10-field FST ticket",
        description: "Rigorous verification and formal documentation.",
        nextNodeId: "success_terminal",
        feedback: "EXEMPLARY SERVICE EXECUTION! Call verified and documented.",
      },
    ],
  },

  // Color Pathway
  safety_color: {
    id: "safety_color",
    stepNumber: 2,
    stageName: "Step 2: Color Baseline Assessment",
    title: "Substrate & Spectrophotometric Baseline",
    description: "Customer reports target red is printing as dull brownish orange on corrugated stock. How do you begin evidence collection?",
    options: [
      {
        label: "Measure unprinted substrate L*a*b* with spectrophotometer (M1 condition)",
        description: "Quantify the raw substrate white point.",
        nextNodeId: "isolate_color_substrate",
        feedback: "Raw stock measured: L*a*b* (65, +6, +24) confirms heavy yellow-brown shift.",
      },
    ],
  },

  isolate_color_substrate: {
    id: "isolate_color_substrate",
    stepNumber: 3,
    stageName: "Step 3: Isolate Color Subsystem",
    title: "Substrate White Point Compensation",
    description: "The raw brown kraft board shifts transparent inks. How do you correct this in the CGS ORIS workflow?",
    options: [
      {
        label: "Apply 100% opaque White ink underprint and re-linearize in ORIS Press Matcher",
        description: "Creates artificial D50 neutral base for transparent CMYK inks.",
        nextNodeId: "verify_and_document_color",
        feedback: "Correct! White underprint neutralizes substrate absorption and hue.",
      },
    ],
  },

  verify_and_document_color: {
    id: "verify_and_document_color",
    stepNumber: 4,
    stageName: "Step 4: Delta E Verification",
    title: "ORIS Certified & Evaluate Report",
    description: "Custom profile applied. How do you objectively verify color compliance?",
    options: [
      {
        label: "Measure brand patch with spectrophotometer; verify ΔE00 < 1.5; print certification label",
        description: "Mathematical proof of compliance.",
        nextNodeId: "success_terminal",
        feedback: "SUCCESS! ΔE00 measured at 0.72. Customer signed off.",
      },
    ],
  },

  // Crash Pathway Continuation
  gather_evidence_crash: {
    id: "gather_evidence_crash",
    stepNumber: 3,
    stageName: "Step 3: Crash Evidence Collection",
    title: "Substrate Flatness & Vacuum Inspection",
    description: "Under E-Stop, you inspect the print zone. The cardboard is curled 4.5 mm upward at the corners. How do you resolve hold-down?",
    options: [
      {
        label: "Mask all open vacuum bed holes with kraft paper to concentrate suction",
        description: "Eliminates atmospheric vacuum bypass and pulls warped board flat.",
        nextNodeId: "success_terminal",
        feedback: "Vacuum pressure jumped from -10 kPa to -38 kPa, pulling board flat.",
      },
    ],
  },

  // Curing Pathway
  safety_curing: {
    id: "safety_curing",
    stepNumber: 2,
    stageName: "Step 2: Optical Curing Safety",
    title: "UV Lamp Inspection Safety",
    description: "Ink is flaking off polypropylene. What safety precautions are mandatory before inspecting UV lamps?",
    options: [
      {
        label: "Wear OD 5+ rated UV eye protection; perform LOTO before touching lamp quartz windows",
        description: "Safeguards against acute photokeratitis and lethal capacitor DC voltage.",
        nextNodeId: "gather_evidence_curing",
        feedback: "Safety satisfied. Ready to meter irradiance.",
      },
    ],
  },

  gather_evidence_curing: {
    id: "gather_evidence_curing",
    stepNumber: 3,
    stageName: "Step 3: Measure UV Irradiance & Dyne Level",
    title: "Radiometer & Dyne Pen Inspection",
    description: "Measure UV irradiance with radiometer and surface energy with Dyne pens. What do the measurements reveal?",
    options: [
      {
        label: "Lamp output is 220 mW/cm² (dirty quartz window); substrate is 32 dynes (untreated)",
        description: "Double root cause identified: optical and chemical.",
        nextNodeId: "action_curing_clean",
        feedback: "Both root causes captured.",
      },
    ],
  },

  action_curing_clean: {
    id: "action_curing_clean",
    stepNumber: 4,
    stageName: "Step 4: Clean Quartz & Apply Primer",
    title: "Restore Lamp Output and Surface Energy",
    description: "Clean the quartz window with optical solvent and apply adhesion promoter primer. What is the verified result?",
    options: [
      {
        label: "UV jumps to 860 mW/cm²; surface energy reaches 48 dynes; cross-hatch test passes 5B",
        description: "Complete resolution verified via ASTM D3359.",
        nextNodeId: "success_terminal",
        feedback: "Curing output restored; 100% tape adhesion verified.",
      },
    ],
  },

  // Terminal Success
  success_terminal: {
    id: "success_terminal",
    stepNumber: 7,
    stageName: "Resolved: Systematic Diagnosis Completed",
    title: "Service Issue Successfully Closed",
    description: "You followed the complete decision tree: Customer Report → Safety Assessment → Evidence Gathering → Subsystem Isolation → Action → Verification → Documentation. No unnecessary parts were replaced, safety was maintained, and client production was restored.",
    options: [
      {
        label: "Restart Decision Tree to Explore Another Fault Domain",
        description: "Test other fault domains.",
        nextNodeId: "root",
        feedback: "Resetting.",
      },
    ],
  },
};

export default function TroubleshootingPage() {
  const [currentNodeId, setCurrentNodeId] = useState<string>("root");
  const [history, setHistory] = useState<string[]>([]);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const currentNode = decisionTree[currentNodeId] || decisionTree["root"];

  const handleSelectOption = (option: any) => {
    setLastFeedback(option.feedback);
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(option.nextNodeId);
  };

  const handleReset = () => {
    setCurrentNodeId("root");
    setHistory([]);
    setLastFeedback(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Interactive Diagnostic Flowchart</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Troubleshooting Decision Tree
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Customer Report → Safety Assessment → Gather Evidence → Identify Symptom → Isolate Subsystem → Select Test → Interpret Result → Correct or Escalate → Verify → Document.
          </p>
        </div>

        <div className="flex items-center space-x-2 no-print">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Flowchart</span>
          </button>
          <a
            href="/scenarios"
            className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <span>Jump to Simulator (10 Cases)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Decision Tree Interactive Player */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Step Indicator */}
        <div className="bg-[#070C14] border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="font-mono text-slate-400 uppercase font-bold">Current Phase:</span>
            <span className="text-teal-300 font-semibold">{currentNode.stageName}</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">
            Step {currentNode.stepNumber} of 6
          </span>
        </div>

        {/* Feedback Alert if recent transition */}
        {lastFeedback && (
          <div className="bg-slate-900 border border-teal-500/30 rounded-xl p-3.5 text-xs text-teal-300 flex items-center space-x-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{lastFeedback}</span>
          </div>
        )}

        {/* Current Node Box */}
        <div
          className={`rounded-2xl border p-6 sm:p-8 space-y-6 shadow-2xl transition-all ${
            currentNode.isSafetyStop
              ? "bg-rose-950/20 border-rose-600/50"
              : currentNode.id === "success_terminal"
              ? "bg-emerald-950/20 border-emerald-600/50"
              : "bg-[#0F1A2E] border-slate-800"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {currentNode.isSafetyStop ? (
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              ) : currentNode.id === "success_terminal" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Layers className="w-5 h-5 text-teal-400" />
              )}
              <h2 className="text-xl font-bold text-white">{currentNode.title}</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentNode.description}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Select Your Diagnostic Branch:
            </div>
            {currentNode.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  opt.isHazardous
                    ? "bg-rose-950/30 border-rose-900 hover:border-rose-600 text-rose-200 hover:bg-rose-950/50"
                    : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-teal-500/50 text-slate-200 hover:text-white"
                }`}
              >
                <div className="space-y-1 pr-4">
                  <div className="font-semibold text-xs sm:text-sm group-hover:text-teal-300 transition-colors">
                    {opt.label}
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {opt.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Seven Core Fault Domains Summary Grid */}
        <div className="bg-[#070C14] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
            Covered Core Fault Domains in this Academy
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-teal-400 font-bold">1.</span> Horizontal Banding
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-teal-400 font-bold">2.</span> Color Mismatch & ΔE
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-teal-400 font-bold">3.</span> Stalled Print Queue
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-teal-400 font-bold">4.</span> Curing / Adhesion
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-teal-400 font-bold">5.</span> Head-Strike Risk
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-teal-400 font-bold">6.</span> METIS Optical Streaks
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-teal-400 font-bold">7.</span> Intermittent Cable Faults
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-teal-400 font-bold">8.</span> Unsafe Bypasses
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
