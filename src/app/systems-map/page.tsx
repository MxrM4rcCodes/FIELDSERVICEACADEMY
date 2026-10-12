"use client";

import React, { useState } from "react";
import {
  GitBranch,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  X,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";

interface WorkflowNode {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  category: "input" | "scanning" | "color" | "rip" | "printer" | "measurement" | "feedback";
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
  inputs: string[];
  outputs: string[];
  mainComponents: string[];
  cgsProducts: string[];
  commonFailures: string[];
  diagnosticQuestions: string[];
  upstreamNodes: string[];
  downstreamNodes: string[];
  relatedLessonSlug: string;
  relatedLessonTitle: string;
  sourceConfidence: string;
}

const workflowNodes: WorkflowNode[] = [
  {
    id: "node_input",
    stageNumber: 1,
    title: "1. Artwork & Requirements",
    subtitle: "Customer Digital Assets or Physical Decor",
    category: "input",
    x: 40,
    y: 160,
    width: 220,
    height: 90,
    description: "The originating source material: digital vector/raster artwork (PDF/X, TIFF, AI) or raw physical decorative surfaces (hardwood, leather, ceramic tile, marble).",
    inputs: ["Brand guidelines", "Customer design files (PDF/X-4)", "Physical material prototypes", "Target color swatches (Pantone/CxF)"],
    outputs: ["Verified prepress PDF", "Raw physical specimen ready for scanning", "Production specification sheets"],
    mainComponents: ["Preflight verification", "Color intent definition", "Resolution check (300+ DPI at 100% scale)"],
    cgsProducts: ["CGS CxF TOOLBOX (Digital Spectral Swatches)"],
    commonFailures: ["Low-resolution bitmaps (72 DPI)", "Un-embedded fonts or un-flattened live transparencies", "Missing bleed margins or improper cut contours"],
    diagnosticQuestions: ["Is the customer file submitted as certified PDF/X?", "Were RGB images converted using the proper working space?"],
    upstreamNodes: [],
    downstreamNodes: ["node_metis", "node_color_prep"],
    relatedLessonSlug: "day-02-complete-digital-imaging-workflow",
    relatedLessonTitle: "Day 2: Complete Digital Imaging Workflow",
    sourceConfidence: "Industry Standard (ISO 15930 PDF/X)",
  },
  {
    id: "node_metis",
    stageNumber: 2,
    title: "2. METIS Optical Capture",
    subtitle: "Surface 3D Relief & Color Digitizing",
    category: "scanning",
    x: 320,
    y: 60,
    width: 230,
    height: 95,
    description: "High-precision non-contact digitizing of physical textures using METIS SynchroLight directional LED illumination and photometric stereo computer vision.",
    inputs: ["Physical substrate sample (wood, ceramic, textile, stone)"],
    outputs: ["16-bit color-calibrated TIFF", "3D height/depth relief maps", "Gloss & normal surface reflection maps"],
    mainComponents: ["PM3D Hawk or DRS scanner", "Motorized optical traverse", "Directional DC LED arrays", "White reference calibration tile"],
    cgsProducts: ["METIS Light Inspector", "METIS Scan Director"],
    commonFailures: ["Silicone or dust on white reference tile", "Focal plane distortion on thick samples", "Directional shadow imbalance"],
    diagnosticQuestions: ["Has shading calibration been run today?", "Is the sample vacuum held flat without edge curling?"],
    upstreamNodes: ["node_input"],
    downstreamNodes: ["node_color_prep"],
    relatedLessonSlug: "day-09-metis-scanning-and-material-surface-imaging",
    relatedLessonTitle: "Day 9: METIS Scanning & Surface Imaging",
    sourceConfidence: "Confirmed METIS Manufacturer Specification",
  },
  {
    id: "node_color_prep",
    stageNumber: 3,
    title: "3. ORIS Color Management",
    subtitle: "Proofing, Fleet Matching & ECG Separation",
    category: "color",
    x: 610,
    y: 160,
    width: 240,
    height: 95,
    description: "Algorithmic color transformations ensuring contract proof fidelity, production press normalization, or 7-color extended gamut spot-color conversion.",
    inputs: ["Input PDF or METIS 16-bit scan", "Target press characterization (GRACoL/Fogra)", "Substrate white-point measurement"],
    outputs: ["DeviceLink-profiled raster PDF", "7-Color ECG separations (CMYK+OGV)", "Certified contract color proof"],
    mainComponents: ["ORIS DeviceLink Calculation Engine", "Spectral Color Database", "OBA Fluor compensation"],
    cgsProducts: ["ORIS COLOR TUNER", "ORIS PRESS MATCHER", "ORIS X GAMUT", "ORIS FLEX PACK"],
    commonFailures: ["Using coated paper ICC profiles on raw brown kraft corrugated board", "Outdated linearization curves", "Unmanaged spot colors falling outside gamut"],
    diagnosticQuestions: ["What Delta E threshold was contractually agreed upon?", "Is the proofing device properly linearized with fresh ink limits?"],
    upstreamNodes: ["node_input", "node_metis", "node_feedback"],
    downstreamNodes: ["node_rip"],
    relatedLessonSlug: "day-08-oris-software-ecosystem",
    relatedLessonTitle: "Day 8: ORIS Software Ecosystem in Depth",
    sourceConfidence: "Confirmed CGS ORIS Specification",
  },
  {
    id: "node_rip",
    stageNumber: 4,
    title: "4. RIP & Job Preparation",
    subtitle: "PostScript Rasterization & Screening",
    category: "rip",
    x: 910,
    y: 160,
    width: 220,
    height: 90,
    description: "Raster Image Processor translates vector objects and continuous-tone pixels into screened 1-bit or multi-drop (picoliter) dot matrices matching nozzle geometry.",
    inputs: ["DeviceLink-profiled print PDF", "Media screening resolution (e.g. 720x1200 DPI)", "Drop-size firing tables"],
    outputs: ["Screened raster swaths", "Carriage firing order buffers", "Encrypted machine code"],
    mainComponents: ["PostScript/PDF Interpreter", "Halftone Screening Engine", "Gigabit Network Spooler", "Temp Scratch SSD"],
    cgsProducts: ["CGS ORIS RIP Driver", "Dedicated Dual-NIC Subnet"],
    commonFailures: ["Scratch disk running out of free space (100% full)", "Buffer underruns causing carriage pauses mid-print", "Jumbo frames MTU mismatch"],
    diagnosticQuestions: ["Is the printer connected to a dedicated secondary NIC?", "Is USB Selective Suspend disabled on the RIP workstation?"],
    upstreamNodes: ["node_color_prep"],
    downstreamNodes: ["node_printer"],
    relatedLessonSlug: "day-06-networking-rips-and-print-jobs",
    relatedLessonTitle: "Day 6: Networking, RIPs, and Print Jobs",
    sourceConfidence: "Industry Standard & CGS Architecture",
  },
  {
    id: "node_printer",
    stageNumber: 5,
    title: "5. Industrial Printer (Platinum)",
    subtitle: "Motion, Negative Pressure & UV Curing",
    category: "printer",
    x: 610,
    y: 330,
    width: 240,
    height: 100,
    description: "High-precision physical deposition: piezoelectric actuators eject micro-drops under controlled meniscus negative pressure, followed by instant UV-LED cure.",
    inputs: ["Screened raster swath data", "UV ink (CMYK+W+V)", "Substrate (rigid or roll)", "3-phase 208-480V power"],
    outputs: ["Physically cured, printed substrate", "Carriage position logs"],
    mainComponents: ["Piezo printheads (Ricoh/Kyocera)", "Negative pressure sub-tank (-3.2 kPa)", "UV-LED lamp arrays", "Vacuum table", "Linear optical encoder"],
    cgsProducts: ["Platinum Technologies UV-LED Flatbed & Hybrid Platforms"],
    commonFailures: ["Horizontal banding from missing nozzles or step-feed miscalibration", "Weak negative pressure causing nozzle drool", "Dirty UV quartz windows causing uncured ink"],
    diagnosticQuestions: ["What does the nozzle test pattern show right now?", "What is the manometer vacuum reading on the sub-tank?"],
    upstreamNodes: ["node_rip"],
    downstreamNodes: ["node_measurement"],
    relatedLessonSlug: "day-04-platinum-printer-architecture-and-subsystems",
    relatedLessonTitle: "Day 4: Platinum Printer Architecture",
    sourceConfidence: "Confirmed Industrial Printhead & Chassis Spec",
  },
  {
    id: "node_measurement",
    stageNumber: 6,
    title: "6. Inspection & Measurement",
    subtitle: "Spectrophotometry & Cross-Hatch Adhesion",
    category: "measurement",
    x: 320,
    y: 330,
    width: 230,
    height: 95,
    description: "Quantitative verification of cured output: measuring color control strips with spectrophotometers (M1 condition) and testing ink adhesion with cross-hatch tape.",
    inputs: ["Cured printed board", "Color control wedge (e.g. Fogra MediaWedge)", "Calibrated spectrophotometer (i1Pro3)"],
    outputs: ["Delta E 2000 verification report", "ASTM D3359 adhesion rating", "Pass/Fail certification label"],
    mainComponents: ["Handheld or automated spectrophotometer", "ORIS Certified software", "Cross-hatch cutter & 3M 610 tape"],
    cgsProducts: ["ORIS CERTIFIED & EVALUATE"],
    commonFailures: ["Measuring before ink completes dark reaction (wait 10 mins)", "Using M0 instead of M1 on OBA-brightened paper", "Fingerprint smudges on test wedge"],
    diagnosticQuestions: ["Does ΔE00 meet the required customer tolerance (< 1.5)?", "Did the cross-hatch tape test pull off any ink?"],
    upstreamNodes: ["node_printer"],
    downstreamNodes: ["node_feedback", "node_output"],
    relatedLessonSlug: "day-07-color-science-icc-profiles-and-delta-e",
    relatedLessonTitle: "Day 7: Color Science & Delta E",
    sourceConfidence: "ISO 13655 / ISO 12647-7 Verified",
  },
  {
    id: "node_feedback",
    stageNumber: 7,
    title: "7. Closed-Loop Feedback",
    subtitle: "Dynamic Recalibration & Curve Updates",
    category: "feedback",
    x: 40,
    y: 330,
    width: 220,
    height: 90,
    description: "Automated corrective loop: when Delta E exceeds tolerance, measurement data feeds back to update device linearization curves without manual trial-and-error.",
    inputs: ["Measured spectral L*a*b* patch data", "Tolerance deviation reports"],
    outputs: ["Updated linearization curves", "Iterative DeviceLink compensation"],
    mainComponents: ["ORIS Automated Iteration Loop", "RIP Profile Manager"],
    cgsProducts: ["ORIS PRESS MATCHER (Closed Loop)", "ORIS COLOR TUNER"],
    commonFailures: ["Re-profiling when simple linearization was required", "Feeding bad measurement scans into the calibration engine"],
    diagnosticQuestions: ["Was the printer thoroughly warmed up before scanning curves?", "Are all nozzles firing prior to calibration?"],
    upstreamNodes: ["node_measurement"],
    downstreamNodes: ["node_color_prep"],
    relatedLessonSlug: "day-02-complete-digital-imaging-workflow",
    relatedLessonTitle: "Day 2: Digital Imaging Workflow",
    sourceConfidence: "Confirmed CGS Closed-Loop Methodology",
  },
];

export default function SystemsMapPage() {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(workflowNodes[0]);
  const [activePathway, setActivePathway] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const pathways = [
    { id: "all", label: "Show All Interconnections" },
    { id: "digital_to_print", label: "1. Digital Artwork → Industrial Print" },
    { id: "physical_to_metis", label: "2. Physical Specimen → METIS Scan" },
    { id: "contract_proofing", label: "3. Contract Proofing & Approval" },
    { id: "production_verify", label: "4. Production Printing & Verification" },
    { id: "feedback_loop", label: "5. Troubleshooting & Closed-Loop Feedback" },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const isNodeHighlighted = (node: WorkflowNode) => {
    if (activePathway === "all") return true;
    if (activePathway === "digital_to_print") {
      return ["node_input", "node_color_prep", "node_rip", "node_printer", "node_measurement"].includes(node.id);
    }
    if (activePathway === "physical_to_metis") {
      return ["node_input", "node_metis", "node_color_prep"].includes(node.id);
    }
    if (activePathway === "contract_proofing") {
      return ["node_input", "node_color_prep", "node_measurement"].includes(node.id);
    }
    if (activePathway === "production_verify") {
      return ["node_rip", "node_printer", "node_measurement"].includes(node.id);
    }
    if (activePathway === "feedback_loop") {
      return ["node_measurement", "node_feedback", "node_color_prep", "node_rip", "node_printer"].includes(node.id);
    }
    return true;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            <GitBranch className="w-4 h-4" />
            <span>Interactive Systems Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Complete CGS ORIS Imaging & Printing Workflow
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Vector-rendered interactive systems map. Select nodes to inspect functional operations, inputs/outputs, failure modes, diagnostic questions, and CGS ORIS / METIS / Platinum integration.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 no-print">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-slate-300">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-2">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded border-l border-slate-800 ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Pathway Selection Toolbar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-print text-xs">
        <span className="font-mono text-slate-400 uppercase font-bold text-[10px] shrink-0">
          Trace Pathway:
        </span>
        {pathways.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePathway(p.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
              activePathway === p.id
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Canvas + Detail Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vector SVG Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#070C14] border border-slate-800 rounded-xl p-4 overflow-hidden relative shadow-2xl">
          <div className="text-[10px] font-mono text-slate-500 mb-2 flex items-center justify-between">
            <span>INTERACTIVE WORKFLOW DIAGRAM • CLICK ANY NODE</span>
            <span>EDUCATIONAL CONCEPTUAL MODEL</span>
          </div>

          <div className="overflow-x-auto">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top left",
                transition: "transform 0.2s ease-out",
              }}
              className="w-[1180px] h-[480px] relative select-none"
            >
              <svg className="w-full h-full" viewBox="0 0 1180 480">
                <defs>
                  <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#B45309" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.4" />
                  </linearGradient>

                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#4B689A" />
                  </marker>
                  <marker
                    id="arrowhead-feedback"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#14B8A6" />
                  </marker>
                </defs>

                {/* Connecting Arrows */}
                {/* 1 -> 2 (Physical to METIS) */}
                <path
                  d="M 150 160 L 150 107 L 320 107"
                  fill="none"
                  stroke="#344C75"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead)"
                />
                {/* 1 -> 3 (Digital PDF direct to ORIS) */}
                <path
                  d="M 260 205 L 610 205"
                  fill="none"
                  stroke="#4B689A"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowhead)"
                />
                {/* 2 -> 3 (METIS Scan to ORIS) */}
                <path
                  d="M 550 107 L 730 107 L 730 160"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                {/* 3 -> 4 (ORIS to RIP) */}
                <path
                  d="M 850 205 L 910 205"
                  fill="none"
                  stroke="#4B689A"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowhead)"
                />
                {/* 4 -> 5 (RIP down to Platinum Printer) */}
                <path
                  d="M 1020 250 L 1020 380 L 850 380"
                  fill="none"
                  stroke="#4B689A"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowhead)"
                />
                {/* 5 -> 6 (Printer to Measurement/Certified) */}
                <path
                  d="M 610 380 L 550 380"
                  fill="none"
                  stroke="#4B689A"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowhead)"
                />
                {/* 6 -> 7 (Measurement to Feedback Loop) */}
                <path
                  d="M 320 380 L 260 380"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowhead-feedback)"
                />
                {/* 7 -> 3 (Feedback back up to ORIS Color Tuning) */}
                <path
                  d="M 150 330 L 150 280 L 680 280 L 680 255"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  markerEnd="url(#arrowhead-feedback)"
                />

                {/* Render Nodes */}
                {workflowNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isHighlighted = isNodeHighlighted(node);

                  let strokeColor = "#334155";
                  let bgFill = "#0F1A2E";

                  if (node.category === "color" || node.category === "feedback") {
                    strokeColor = isSelected ? "#2DD4BF" : "#0F766E";
                    bgFill = isSelected ? "#0F2936" : "#0D202B";
                  } else if (node.category === "scanning") {
                    strokeColor = isSelected ? "#C084FC" : "#7E22CE";
                    bgFill = isSelected ? "#24163B" : "#170F28";
                  } else if (node.category === "printer") {
                    strokeColor = isSelected ? "#FBBF24" : "#B45309";
                    bgFill = isSelected ? "#2C1E0A" : "#1C1407";
                  } else if (node.category === "rip") {
                    strokeColor = isSelected ? "#60A5FA" : "#1D4ED8";
                    bgFill = isSelected ? "#101D38" : "#0C1429";
                  }

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer transition-all duration-200"
                      opacity={isHighlighted ? 1 : 0.25}
                    >
                      {/* Node Box */}
                      <rect
                        x={node.x}
                        y={node.y}
                        width={node.width}
                        height={node.height}
                        rx="10"
                        fill={bgFill}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? "2.5" : "1.5"}
                        className="transition-colors hover:brightness-125"
                      />

                      {/* Header Badge */}
                      <rect
                        x={node.x + 10}
                        y={node.y + 10}
                        width={24}
                        height={20}
                        rx="4"
                        fill="#1E293B"
                      />
                      <text
                        x={node.x + 22}
                        y={node.y + 24}
                        fill="#94A3B8"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {node.stageNumber}
                      </text>

                      {/* Title */}
                      <text
                        x={node.x + 42}
                        y={node.y + 25}
                        fill="#FFFFFF"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                      >
                        {node.title.substring(3)}
                      </text>

                      {/* Subtitle */}
                      <text
                        x={node.x + 12}
                        y={node.y + 46}
                        fill="#94A3B8"
                        fontSize="10"
                        fontFamily="sans-serif"
                      >
                        {node.subtitle}
                      </text>

                      {/* CGS Product Tag */}
                      <rect
                        x={node.x + 12}
                        y={node.y + 60}
                        width={node.width - 24}
                        height={20}
                        rx="4"
                        fill="#070C14"
                        stroke="#1E293B"
                      />
                      <text
                        x={node.x + 18}
                        y={node.y + 74}
                        fill="#2DD4BF"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="semibold"
                      >
                        {node.cgsProducts[0] || "CGS / OEM Engine"}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Node Detail Panel (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[#0F1A2E] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-5">
          {selectedNode ? (
            <>
              {/* Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-bold">
                    Stage {selectedNode.stageNumber} • {selectedNode.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Confidence: {selectedNode.sourceConfidence}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">{selectedNode.title}</h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Inputs & Outputs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>Inputs</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {selectedNode.inputs.map((inp, idx) => (
                      <li key={idx} className="leading-tight">• {inp}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Outputs</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {selectedNode.outputs.map((out, idx) => (
                      <li key={idx} className="leading-tight">• {out}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Main Subsystems & CGS Products */}
              <div className="space-y-2 text-xs">
                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                  Core Technologies & Products
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.cgsProducts.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 font-mono text-[11px]"
                    >
                      {p}
                    </span>
                  ))}
                  {selectedNode.mainComponents.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Common Failure Modes */}
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 space-y-1 text-xs">
                <div className="text-[10px] font-mono text-rose-400 font-bold uppercase flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Common Failure Modes at this Stage</span>
                </div>
                <ul className="space-y-1 text-slate-300 text-[11px] pt-1">
                  {selectedNode.commonFailures.map((fail, idx) => (
                    <li key={idx} className="leading-snug">⚠️ {fail}</li>
                  ))}
                </ul>
              </div>

              {/* Diagnostic Inquiries */}
              <div className="bg-blue-950/20 border border-blue-900/40 rounded-lg p-3 space-y-1 text-xs">
                <div className="text-[10px] font-mono text-blue-400 font-bold uppercase flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>FST Field Diagnostic Inquiry</span>
                </div>
                <ul className="space-y-1 text-slate-300 text-[11px] pt-1">
                  {selectedNode.diagnosticQuestions.map((q, idx) => (
                    <li key={idx} className="italic leading-snug">\"{q}\"</li>
                  ))}
                </ul>
              </div>

              {/* Jump to Related Lesson */}
              <div className="pt-2">
                <a
                  href={`/lessons/${selectedNode.relatedLessonSlug}`}
                  className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-between transition-colors shadow-md"
                >
                  <span>Study {selectedNode.relatedLessonTitle}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 italic text-xs">
              Select any workflow node to view deep architectural details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
