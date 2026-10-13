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
    subtitle: "Artwork, color targets, or a physical sample",
    category: "input",
    x: 40,
    y: 160,
    width: 220,
    height: 90,
    description: "An example starting point for an imaging or print job. The deliverables, file formats, color references, and physical samples depend on the customer's workflow and job specification.",
    inputs: ["Customer requirements", "Artwork files, if applicable", "Physical sample, if scanning is in scope", "Approved color reference and measurement terms"],
    outputs: ["Recorded job requirements", "Usable input files or sample", "Agreed acceptance criteria"],
    mainComponents: ["Confirm intended use", "Check supplied-file integrity", "Record target and substrate"],
    cgsProducts: [],
    commonFailures: ["Unclear acceptance criteria", "Unexpected file or embedded-profile issues", "Sample or substrate differs from the approved reference"],
    diagnosticQuestions: ["What result did the customer request?", "Which reference, substrate, and acceptance method are agreed?"],
    upstreamNodes: [],
    downstreamNodes: ["node_metis", "node_color_prep"],
    relatedLessonSlug: "day-02-complete-digital-imaging-workflow",
    relatedLessonTitle: "Day 2: Complete Digital Imaging Workflow",
    sourceConfidence: "General workflow model; check the job specification",
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
    description: "METIS is a family of scanner systems. The products and supported capture functions differ by family and model; this node represents only the optional capture of a physical sample, not a shared scanner architecture.",
    inputs: ["Physical sample and agreed capture goal"],
    outputs: ["Files produced by the selected scanner and configured workflow"],
    mainComponents: ["Model-specific scanner and illumination", "Approved reference and calibration process", "Documented sample setup"],
    cgsProducts: ["METIS DRS family", "METIS EDS family", "METIS SURF / PM3D family"],
    commonFailures: ["Sample setup or focus differs from instructions", "Reference or calibration target is damaged or contaminated", "Unexpected capture or calibration result"],
    diagnosticQuestions: ["Which exact METIS model and software version are installed?", "What result does its documented calibration and capture workflow report?"],
    upstreamNodes: ["node_input"],
    downstreamNodes: ["node_color_prep"],
    relatedLessonSlug: "day-09-metis-scanning-and-material-surface-imaging",
    relatedLessonTitle: "Day 9: METIS Scanning & Surface Imaging",
    sourceConfidence: "Official METIS family overview; features vary by model",
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
    description: "Color-management software may be part of a workflow when configured for the job. Product roles, supported inputs, output, and integrations must be checked against current documentation and the customer's licensed setup.",
    inputs: ["Approved artwork or image data", "Applicable profiles, device data, and color references"],
    outputs: ["Color-managed files or proofs according to configured workflow"],
    mainComponents: ["Defined source and destination conditions", "Current device characterization", "Documented output and comparison method"],
    cgsProducts: ["ORIS COLOR TUNER", "ORIS PRESS MATCHER", "ORIS X GAMUT", "ORIS FLEX PACK"],
    commonFailures: ["Profile, substrate, or process does not match the job", "Stale or mismatched characterization data", "Unclear spot-color or proof acceptance criteria"],
    diagnosticQuestions: ["Which ORIS product/version and licensed workflow are in use?", "Do the source, substrate, output profile, and agreed verification method match?"],
    upstreamNodes: ["node_input", "node_metis", "node_feedback"],
    downstreamNodes: ["node_rip"],
    relatedLessonSlug: "day-08-oris-software-ecosystem",
    relatedLessonTitle: "Day 8: ORIS Software Ecosystem in Depth",
    sourceConfidence: "Official product overview; confirm feature and version in current documentation",
  },
  {
    id: "node_rip",
    stageNumber: 4,
    title: "4. RIP & Job Preparation",
    subtitle: "Raster Image Processing (where used)",
    category: "rip",
    x: 910,
    y: 160,
    width: 220,
    height: 90,
    description: "A configured RIP or controller workflow interprets job data for a particular output device. This general stage is not an assertion that a specific RIP, network topology, format, or integration ships with every product.",
    inputs: ["Job file and output-device configuration", "Media and print settings from the approved workflow"],
    outputs: ["Device-specific print data and job status"],
    mainComponents: ["Customer-selected RIP or controller", "Configured media and output settings", "Supported communications path"],
    cgsProducts: [],
    commonFailures: ["Job remains queued or errors before output", "Unexpected output settings or media selection", "Communication interruption between configured systems"],
    diagnosticQuestions: ["Which application and version generated the job?", "Where does the job stop, and what logs or status messages are available?"],
    upstreamNodes: ["node_color_prep"],
    downstreamNodes: ["node_printer"],
    relatedLessonSlug: "day-06-networking-rips-and-print-jobs",
    relatedLessonTitle: "Day 6: Networking, RIPs, and Print Jobs",
    sourceConfidence: "General print-workflow concept; RIP and controller depend on configuration",
  },
  {
    id: "node_printer",
    stageNumber: 5,
    title: "5. Industrial Printer (Platinum)",
    subtitle: "Model-specific printer architecture",
    category: "printer",
    x: 610,
    y: 330,
    width: 240,
    height: 100,
    description: "This conceptual node represents an industrial output device. Platinum printer families and individual configurations can differ in print technology, ink, motion, curing, media handling, utilities, and service procedures.",
    inputs: ["Supported job data", "Approved media and materials", "Model-specific facility utilities"],
    outputs: ["Printed output and device status"],
    mainComponents: ["Model-specific print and motion systems", "Installed ink and curing technology (if applicable)", "Media handling and safety systems"],
    cgsProducts: ["Platinum Technologies printer families"],
    commonFailures: ["Output defects with different possible causes", "Media handling or motion symptoms", "Job, configuration, or environmental problems"],
    diagnosticQuestions: ["What exact model, serial, options, and software version are installed?", "What does the approved model-specific test and service guidance show?"],
    upstreamNodes: ["node_rip"],
    downstreamNodes: ["node_measurement"],
    relatedLessonSlug: "day-04-platinum-printer-architecture-and-subsystems",
    relatedLessonTitle: "Day 4: Platinum Printer Architecture",
    sourceConfidence: "Conceptual model only; no model-specific configuration is asserted",
  },
  {
    id: "node_measurement",
    stageNumber: 6,
    title: "6. Inspection & Measurement",
    subtitle: "Inspection against agreed criteria",
    category: "measurement",
    x: 320,
    y: 330,
    width: 230,
    height: 95,
    description: "Compare output with the customer's documented acceptance criteria using the specified instrument, target, method, substrate, and measurement condition. No universal color or adhesion threshold is implied.",
    inputs: ["Output and agreed reference", "Specified measurement condition and procedure", "Customer acceptance criteria"],
    outputs: ["Recorded observations and measurements", "Acceptance, rework, or escalation decision"],
    mainComponents: ["Suitable calibrated instrument", "Applicable test target and procedure", "Documented acceptance limits"],
    cgsProducts: ["ORIS CERTIFIED", "ORIS EVALUATE"],
    commonFailures: ["Comparing measurements taken under different conditions", "Using an invalid or out-of-date target", "Applying an assumed tolerance not agreed with the customer"],
    diagnosticQuestions: ["Which instrument condition and target are specified?", "What exact acceptance limit and sampling plan were agreed?"],
    upstreamNodes: ["node_printer"],
    downstreamNodes: ["node_feedback", "node_output"],
    relatedLessonSlug: "day-07-color-science-icc-profiles-and-delta-e",
    relatedLessonTitle: "Day 7: Color Science & Delta E",
    sourceConfidence: "General measurement concept; no universal acceptance criteria",
  },
  {
    id: "node_feedback",
    stageNumber: 7,
    title: "7. Closed-Loop Feedback",
    subtitle: "Evidence-based review and next steps",
    category: "feedback",
    x: 40,
    y: 330,
    width: 220,
    height: 90,
    description: "A conceptual service loop: compare evidence with the original complaint, review configuration and prior changes, then choose a documented next test or safe escalation. This does not imply an automated or direct product integration.",
    inputs: ["Recorded test results", "Customer acceptance criteria", "System configuration and work history"],
    outputs: ["Revised diagnostic hypothesis", "Authorized follow-up test or escalation"],
    mainComponents: ["Review and evidence correlation", "Documented change control", "Safe escalation path"],
    cgsProducts: [],
    commonFailures: ["Changing multiple variables at once", "Treating correlation as proof of cause", "Restarting without verifying acceptance and safety"],
    diagnosticQuestions: ["What evidence changed after the last controlled test?", "Is the proposed next step authorized and documented?"],
    upstreamNodes: ["node_measurement"],
    downstreamNodes: ["node_color_prep"],
    relatedLessonSlug: "day-02-complete-digital-imaging-workflow",
    relatedLessonTitle: "Day 2: Digital Imaging Workflow",
    sourceConfidence: "Conceptual service-feedback loop; automation is not implied",
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
            Interactive Imaging & Service Workflow Map
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Explore example workflow stages, questions, and evidence. This is an independent educational concept—not a proprietary schematic, a complete system architecture, or a claim that products are integrated in this sequence. Product functions and configurations vary; use current model-specific documentation.
          </p>
          <a href="/lessons/day-01-cgs-oris-and-field-service" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-white">
            <ArrowRight className="h-3.5 w-3.5 rotate-180" aria-hidden="true" /> Return to Day 1
          </a>
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
            <span>INTERACTIVE CONCEPTUAL MAP • SELECT ANY NODE</span>
            <span>NOT A PRODUCT INTEGRATION SCHEMATIC</span>
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
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedNode(node);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${node.title}`}
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
                        {node.cgsProducts[0] || "Conceptual stage"}
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
                  Conceptual Components & Related Product Names
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
