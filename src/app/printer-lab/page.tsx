"use client";

import React, { useState } from "react";
import {
  Cpu,
  Wrench,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Eye,
  HelpCircle,
  RotateCcw,
  Printer,
  Sparkles,
} from "lucide-react";

interface Subsystem {
  id: string;
  name: string;
  category: "electronics" | "hydraulics" | "motion" | "curing" | "media";
  gridArea: string;
  functionalExplanation: string;
  commonFailureSymptoms: string[];
  observableEvidence: string[];
  safeDiagnosticConsiderations: string[];
  relationshipToOtherSubsystems: string;
  practiceQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  implicatedInFaults: string[];
}

const subsystems: Subsystem[] = [
  {
    id: "sub_controller",
    name: "1. Main Printer Controller (CPU & FPGA)",
    category: "electronics",
    gridArea: "controller",
    functionalExplanation: "The real-time electronic brain coordinating motor motion profiles, FPGA piezoelectric firing waveforms, interlock logic loops, and temperature control.",
    commonFailureSymptoms: ["System lockup / frozen carriage", "Communication loss to RIP", "Thermal run-away error"],
    observableEvidence: ["Status LED codes blinking on mainboard", "Terminal serial console logs reporting watchdog timeout", "DC bus voltage drop below 24V"],
    safeDiagnosticConsiderations: ["Always discharge DC capacitor banks before probing test points.", "Use ESD grounding strap when touching board components."],
    relationshipToOtherSubsystems: "Feeds synchronized pulse clocks to the carriage motion board and linear encoder reader.",
    practiceQuestion: {
      question: "What hardware component on the main controller generates the ultra-high frequency firing clock pulses for industrial printheads?",
      options: ["A standard mechanical relay", "Field Programmable Gate Array (FPGA)", "The 120V power transformer", "A thermal fuse"],
      correctIndex: 1,
      explanation: "FPGAs handle nanosecond-level parallel clocking required to fire thousands of nozzles simultaneously.",
    },
    implicatedInFaults: ["fault_crash", "fault_color"],
  },
  {
    id: "sub_rip_interface",
    name: "2. RIP & Print-Job Interface",
    category: "electronics",
    gridArea: "rip_interface",
    functionalExplanation: "High-speed Gigabit Ethernet or fiber link receiving screened raster swaths from the prepress workstation into the controller's FIFO buffer.",
    commonFailureSymptoms: ["Buffer underrun pauses mid-board", "Packet dropouts", "Stalled queue at 99%"],
    observableEvidence: ["RJ45 link LED shows 100Mbps amber instead of 1000Mbps green", "Ping packet loss on large payload test"],
    safeDiagnosticConsiderations: ["Ensure Cat6 shielded cabling is away from high-voltage UV lamp lines to prevent EMI interference."],
    relationshipToOtherSubsystems: "Streams raster buffers directly to the main controller memory.",
    practiceQuestion: {
      question: "What physical print defect is caused when data transmission stutters and carriage dwells over the board?",
      options: ["The board catches fire", "A glossy dwell band forms where UV lamp cooks stationary ink", "The printer changes ink to cyan", "Vacuum pressure drops to zero"],
      correctIndex: 1,
      explanation: "Carriage pausing while UV lamps remain on creates visible thermal/gloss dwell marks.",
    },
    implicatedInFaults: ["fault_banding"],
  },
  {
    id: "sub_interlocks",
    name: "3. Sensors, Interlocks & E-Stops",
    category: "electronics",
    gridArea: "interlocks",
    functionalExplanation: "Hardwired dual-channel fail-safe safety relays monitoring cover interlocks, crash bumper bars, and emergency stop buttons.",
    commonFailureSymptoms: ["Printer refuses to energize servo drives", "Intermittent emergency stop during vibration", "Bypassed taped interlock hazard"],
    observableEvidence: ["Safety relay LED indicators showing open channel loop", "Multimeter continuity test across interlock contacts"],
    safeDiagnosticConsiderations: ["NEVER bypass safety interlocks with jumpers or tape during operation under any circumstance."],
    relationshipToOtherSubsystems: "Directly cuts high-voltage AC/DC power to servo drives and UV lamps upon trip.",
    practiceQuestion: {
      question: "Why does an interlock open condition cut servo drive power but keep controller logic powered?",
      options: ["To save electricity", "To allow the controller to safely log the exact sensor trip state while neutralizing mechanical and radiation hazards", "Because the printer ran out of fuses", "It is an engineering mistake"],
      correctIndex: 1,
      explanation: "Maintaining logic power preserves diagnostic error codes while isolating hazardous kinetic and optical energy.",
    },
    implicatedInFaults: ["fault_crash"],
  },
  {
    id: "sub_reservoirs",
    name: "4. Bulk Ink Reservoirs & Level Sensors",
    category: "hydraulics",
    gridArea: "reservoirs",
    functionalExplanation: "Main 1-5 liter bulk ink tanks equipped with float switches or capacitive level sensors and motorized white ink stirrers.",
    commonFailureSymptoms: ["Ink low false alarms", "Titanium dioxide pigment settling in White tank", "Air sucked into ink feed lines"],
    observableEvidence: ["Visible sedimentation in white bottle", "Capacitive sensor covered in dried ink crust"],
    safeDiagnosticConsiderations: ["Wear nitrile gloves and eye goggles; UV ink acrylates cause permanent allergic contact dermatitis."],
    relationshipToOtherSubsystems: "Supplies liquid ink to the carriage sub-tanks via dynamic drag-chain lines.",
    practiceQuestion: {
      question: "What happens if the White ink agitation motor fails for 8 hours?",
      options: ["White ink becomes transparent water", "Heavy Titanium Dioxide pigments settle to the bottom, causing ink starvation and density loss", "White ink turns into yellow ink", "The printheads explode"],
      correctIndex: 1,
      explanation: "TiO2 is dense and rapidly precipitates without continuous mechanical agitation.",
    },
    implicatedInFaults: ["fault_banding", "fault_color"],
  },
  {
    id: "sub_ink_lines",
    name: "5. Ink Lines & Carriage Drag Chain",
    category: "hydraulics",
    gridArea: "ink_lines",
    functionalExplanation: "PTFE fluoropolymer chemical-resistant tubing routed through the flexible drag chain to deliver ink to carriage sub-tanks without kinking.",
    commonFailureSymptoms: ["Pinch leaks inside drag chain", "Air bubbles in lines", "Solvent tube degradation"],
    observableEvidence: ["Ink pooling in bottom of drag chain", "Visible air pockets traveling along tube during purge"],
    safeDiagnosticConsiderations: ["Check that high-voltage UV cables are physically separated from ink lines inside the drag chain divider."],
    relationshipToOtherSubsystems: "Hydraulic conduit connecting bulk tanks to carriage sub-tanks.",
    practiceQuestion: {
      question: "Why are PTFE or fluoropolymer tubes mandatory for UV ink delivery instead of clear silicone?",
      options: ["Silicone tubes are too expensive", "UV acrylate monomers chemically degrade silicone, causing swelling, leaks, and particulate contamination", "PTFE is magnetic", "Silicone only works in Germany"],
      correctIndex: 1,
      explanation: "Aggressive UV monomer chemistry degrades standard silicone and PVC plastics.",
    },
    implicatedInFaults: ["fault_banding"],
  },
  {
    id: "sub_negative_pressure",
    name: "6. Negative Pressure (Meniscus) System",
    category: "hydraulics",
    gridArea: "negative_pressure",
    functionalExplanation: "Maintains controlled partial vacuum (-2.0 to -4.5 kPa) inside carriage sub-tanks to create a concave ink meniscus at nozzle orifices.",
    commonFailureSymptoms: ["Ink dripping / drooling onto media (vacuum too weak)", "Air cavitation and de-priming (vacuum too strong)", "Pressure fluctuations during carriage acceleration"],
    observableEvidence: ["Digital manometer reading deviates from -3.2 kPa spec", "Puddles of ink forming on carriage floor"],
    safeDiagnosticConsiderations: ["Never adjust negative pressure regulator without a calibrated digital manometer connected."],
    relationshipToOtherSubsystems: "Directly determines droplet firing stability across all piezoelectric printheads.",
    practiceQuestion: {
      question: "If a printer's sub-tank manometer reads -0.5 kPa (insufficient vacuum), what visual symptom will occur?",
      options: ["The printer carriage speeds up", "Ink will drool and drip directly from the nozzle plates onto the media", "The linear encoder will skip counts", "The RIP will freeze"],
      correctIndex: 1,
      explanation: "Weak vacuum allows gravity to overpower surface tension, causing ink dripping.",
    },
    implicatedInFaults: ["fault_banding"],
  },
  {
    id: "sub_printheads",
    name: "7. Printheads & Nozzle Plates",
    category: "hydraulics",
    gridArea: "printheads",
    functionalExplanation: "Industrial piezoelectric drop-on-demand printheads (Ricoh Gen5/6, Kyocera) containing thousands of microscopic 20-30 micron nozzle orifices.",
    commonFailureSymptoms: ["Missing nozzles", "Angular deflection", "Electrical driver ASIC failure (geometric block dropout)"],
    observableEvidence: ["Standard nozzle test pattern shows gaps or crooked lines", "Microscopic scratch visible under 20x loupe"],
    safeDiagnosticConsiderations: ["Never touch nozzle plates with metal tools, paper towels, or dry swabs; anti-wetting coatings are easily scratched."],
    relationshipToOtherSubsystems: "Deposits ink droplets into the print zone under closed-loop encoder timing.",
    practiceQuestion: {
      question: "What tool should be used to inspect suspected nozzle plate scratches or fiber contamination?",
      options: ["A carpenter's tape measure", "A 10x to 20x optical inspection loupe with directional LED light", "A kitchen knife", "A smartphone flash at 2 feet"],
      correctIndex: 1,
      explanation: "Optical loupes provide the magnification required to observe microscopic 25-micron orifices.",
    },
    implicatedInFaults: ["fault_banding", "fault_color"],
  },
  {
    id: "sub_carriage_motion",
    name: "8. Carriage & Linear Guideway (X-Axis)",
    category: "motion",
    gridArea: "carriage",
    functionalExplanation: "Rigid carriage frame riding on precision THK/HIWIN ball-bearing guideways, driven by AC brushless servomotor and steel-reinforced timing belt.",
    commonFailureSymptoms: ["Carriage vibration / jitter", "Bearing rumble", "Belt slippage or tooth wear"],
    observableEvidence: ["Vertical banding at regular harmonic pitch", "Fretting corrosion dust under linear rail"],
    safeDiagnosticConsiderations: ["LOTO mandatory before checking belt tension or servicing guideway bearings."],
    relationshipToOtherSubsystems: "Transports printheads, sub-tanks, and UV lamps across the vacuum bed.",
    practiceQuestion: {
      question: "What maintenance action is required to prevent carriage bearing block seizure?",
      options: ["Pouring motor oil on the carriage cover", "Applying manufacturer-specified lithium-complex grease via grease nipples every 200 operating hours", "Washing rails with water", "Spraying rails with spray paint"],
      correctIndex: 1,
      explanation: "Precision linear bearings require regular grease lubrication to prevent ball-bearing spalling.",
    },
    implicatedInFaults: ["fault_banding", "fault_crash"],
  },
  {
    id: "sub_encoders",
    name: "9. Linear Encoder & Positioning",
    category: "motion",
    gridArea: "encoders",
    functionalExplanation: "Optical or magnetic linear scale etched with 150-360 LPI paired with an optical reader head on the carriage providing sub-micron position feedback.",
    commonFailureSymptoms: ["Carriage runaway / crash", "Vertical step jitter", "Registration drift across wide boards"],
    observableEvidence: ["Ink mist smudge on glass encoder strip", "Servo drive reporting 'Tracking Error > Limit'"],
    safeDiagnosticConsiderations: ["Clean only with optical lint-free swabs and anhydrous isopropyl alcohol; avoid aggressive acetone."],
    relationshipToOtherSubsystems: "Directly triggers the FPGA nozzle firing pulses for every column of pixels.",
    practiceQuestion: {
      question: "Why does an ink smudge on an optical encoder strip cause a carriage crash?",
      options: ["Because ink is slippery", "The reader head loses optical pulse counts, causing the servo controller to miscalculate position and drive into end-stops", "The ink dissolves the belt", "The motor runs out of electricity"],
      correctIndex: 1,
      explanation: "Losing encoder pulses breaks closed-loop feedback, causing servo position runaway.",
    },
    implicatedInFaults: ["fault_banding", "fault_crash"],
  },
  {
    id: "sub_vacuum_bed",
    name: "10. Vacuum Bed & Substrate Handling",
    category: "media",
    gridArea: "vacuum_bed",
    functionalExplanation: "Milled aluminum honeycomb table with selectable vacuum zones and high-flow regenerative blowers to flatten rigid substrates.",
    commonFailureSymptoms: ["Substrate edge curl", "Head strike scraping", "Loss of vacuum suction"],
    observableEvidence: ["Open unmasked holes whistling air", "Cardboard bowing upward 4mm at corners"],
    safeDiagnosticConsiderations: ["Always mask unused vacuum bed zones with scrap paper to concentrate suction."],
    relationshipToOtherSubsystems: "Maintains substrate flatness directly below the printheads.",
    practiceQuestion: {
      question: "How do you achieve maximum hold-down suction on a 2x3 ft sign on an 8x10 ft vacuum bed?",
      options: ["Turn off the vacuum pump", "Mask all uncovered vacuum zones with scrap paper or vinyl so air cannot bypass", "Stack bricks on the sign", "Wet the board with water"],
      correctIndex: 1,
      explanation: "Masking open vacuum orifices prevents atmospheric bypass, generating maximum static differential pressure.",
    },
    implicatedInFaults: ["fault_crash"],
  },
  {
    id: "sub_media_feed",
    name: "11. Media Advance (Step Feed / Y-Axis)",
    category: "media",
    gridArea: "media_feed",
    functionalExplanation: "Gantry stepping drive (on flatbed) or pinch-roller drive (on hybrid) advancing the substrate precisely along the Y-axis between carriage passes.",
    commonFailureSymptoms: ["Horizontal dark banding (overlap)", "Horizontal white banding (gap)", "Media skew / walk"],
    observableEvidence: ["Dark line under 10x loupe showing double ink density", "Step calibration target off by 0.2mm"],
    safeDiagnosticConsiderations: ["Keep fingers clear of high-pressure nip rollers; severe kinetic pinch hazard."],
    relationshipToOtherSubsystems: "Synchronizes pass-to-pass spacing with the X-axis carriage swaths.",
    practiceQuestion: {
      question: "If prints show periodic DARK horizontal lines with a 100% clean nozzle check, what does this indicate?",
      options: ["Media advanced too far", "Media under-advanced, causing successive passes to overlap and deposit double ink", "The yellow printhead is clogged", "Room humidity is too high"],
      correctIndex: 1,
      explanation: "Under-advancement causes swath overlap, creating a dark line.",
    },
    implicatedInFaults: ["fault_banding"],
  },
  {
    id: "sub_uv_curing",
    name: "12. UV-LED Curing Lamp Arrays",
    category: "curing",
    gridArea: "uv_curing",
    functionalExplanation: "High-power 385-395nm UV-LED arrays mounted on the carriage wings providing 8-16 W/cm² irradiance for instant photopolymerization.",
    commonFailureSymptoms: ["Tacky, uncured ink", "Poor adhesion / flaking", "Substrate heat distortion"],
    observableEvidence: ["Aerosol ink mist encrusted on quartz window", "Radiometer reads < 300 mW/cm²"],
    safeDiagnosticConsiderations: ["Wear OD 5+ rated UV eye protection; unshielded UV radiation causes photokeratitis and skin burns."],
    relationshipToOtherSubsystems: "Polymerizes ink droplets milliseconds after deposition onto the substrate.",
    practiceQuestion: {
      question: "What simple maintenance task restores UV lamp curing output when irradiance drops by 50%?",
      options: ["Replacing the printhead", "Cleaning the protective quartz glass window with optical solvent to remove baked-on ink mist", "Turning off the chiller", "Changing the network cable"],
      correctIndex: 1,
      explanation: "Aerosol ink mist coats the quartz window, blocking UV photons from reaching the ink.",
    },
    implicatedInFaults: ["fault_curing"],
  },
  {
    id: "sub_finished_output",
    name: "13. Finished Output & Inspection",
    category: "media",
    gridArea: "output",
    functionalExplanation: "The cured print ready for ASTM cross-hatch tape testing, spectrophotometer color verification, and client delivery.",
    commonFailureSymptoms: ["Color shift (high Delta E)", "Delamination / flaking", "Surface gloss variation"],
    observableEvidence: ["Delta E > 2.5 on brand red patch", "Tape test removes ink lattice squares"],
    safeDiagnosticConsiderations: ["Allow 10 minutes post-cure dark reaction before final spectrophotometric measurement."],
    relationshipToOtherSubsystems: "The final deliverable representing the cumulative health of all 12 prior subsystems.",
    practiceQuestion: {
      question: "Why should you wait 10 to 15 minutes post-cure before measuring Delta E on UV inkjet prints?",
      options: ["To let the printer cool down", "Because free-radical polymerization continues ('dark cure') for several minutes, subtly stabilizing final color and density", "Because spectrophotometers are slow", "To allow ink to evaporate"],
      correctIndex: 1,
      explanation: "Dark reaction completion stabilizes optical density and color coordinates.",
    },
    implicatedInFaults: ["fault_curing", "fault_color"],
  },
];

const faultScenarios = [
  { id: "all", label: "Show All Subsystems" },
  { id: "fault_banding", label: "Trace: Horizontal Banding" },
  { id: "fault_curing", label: "Trace: Uncured / Tacky Ink" },
  { id: "fault_crash", label: "Trace: Head-Strike / Collision Risk" },
  { id: "fault_color", label: "Trace: Severe Color Shift / Delta E" },
];

export default function PrinterLabPage() {
  const [selectedSubsystem, setSelectedSubsystem] = useState<Subsystem>(subsystems[6]); // Printheads default
  const [activeFault, setActiveFault] = useState<string>("all");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectSubsystem = (sub: Subsystem) => {
    setSelectedSubsystem(sub);
    setQuizAnswer(null);
    setShowExplanation(false);
  };

  const isSubsystemImplicated = (sub: Subsystem) => {
    if (activeFault === "all") return true;
    return sub.implicatedInFaults.includes(activeFault);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Industrial Hardware Subsystems</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Platinum Printer Architecture Lab
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Conceptual educational model of an industrial UV-LED flatbed/hybrid printer. Click any subsystem to examine electromechanics, failure modes, diagnostic considerations, and practice questions.
          </p>
        </div>

        <div className="flex items-center space-x-2 no-print">
          <span className="text-[11px] font-mono text-slate-400">Trace the Fault Mode:</span>
          <select
            value={activeFault}
            onChange={(e) => setActiveFault(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-500"
          >
            {faultScenarios.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Architecture Visualization + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Printer Architecture Model (7 cols) */}
        <div className="lg:col-span-7 bg-[#070C14] border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-850 pb-2">
            <span>PLATINUM UV-LED FLATBED ARCHITECTURE</span>
            <span className="text-amber-400">13 INTERCONNECTED SUBSYSTEMS</span>
          </div>

          {/* Conceptual Chassis Layout */}
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            {subsystems.map((sub) => {
              const isSelected = selectedSubsystem.id === sub.id;
              const isImplicated = isSubsystemImplicated(sub);

              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubsystem(sub)}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500"
                      : isImplicated
                      ? "bg-slate-900/90 border-slate-700 hover:border-slate-600 text-slate-200"
                      : "bg-slate-950/40 border-slate-850 text-slate-600 opacity-40 hover:opacity-75"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {sub.category}
                      </span>
                      {activeFault !== "all" && isImplicated && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                      )}
                    </div>
                    <div className="font-semibold text-xs leading-snug line-clamp-2">
                      {sub.name}
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="truncate">{sub.commonFailureSymptoms[0]}</span>
                    <ArrowRight className="w-3 h-3 shrink-0 ml-1 opacity-60" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Fault Legend Callout */}
          {activeFault !== "all" && (
            <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-3 text-xs flex items-center justify-between text-amber-300">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>Trace Mode Active:</strong> Subsystems highlighted with pulsating dots are potential root causes for this symptom.
                </span>
              </div>
              <button
                onClick={() => setActiveFault("all")}
                className="text-[11px] underline text-amber-400 hover:text-white"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Right: Subsystem Deep Dive (5 cols) */}
        <div className="lg:col-span-5 bg-[#0F1A2E] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-5">
          {/* Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                {selectedSubsystem.category.toUpperCase()} DOMAIN
              </span>
              <span className="text-[10px] font-mono text-slate-500">Conceptual Educational Model</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5">{selectedSubsystem.name}</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {selectedSubsystem.functionalExplanation}
            </p>
          </div>

          {/* Observable Evidence & Symptoms */}
          <div className="space-y-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Failure Symptoms</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] pt-1">
                {selectedSubsystem.commonFailureSymptoms.map((s, idx) => (
                  <li key={idx} className="leading-snug">• {s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-teal-400 font-bold uppercase flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Observable Field Evidence</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] pt-1">
                {selectedSubsystem.observableEvidence.map((e, idx) => (
                  <li key={idx} className="leading-snug">• {e}</li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 space-y-1">
              <div className="text-[10px] font-mono text-rose-400 font-bold uppercase flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Safe Diagnostic Considerations</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] pt-1">
                {selectedSubsystem.safeDiagnosticConsiderations.map((c, idx) => (
                  <li key={idx} className="leading-snug">⚠️ {c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Subsystem Practice Question */}
          <div className="bg-[#070C14] border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Subsystem Diagnostic Check</span>
            </div>
            <p className="font-semibold text-slate-200">
              {selectedSubsystem.practiceQuestion.question}
            </p>

            <div className="space-y-1.5">
              {selectedSubsystem.practiceQuestion.options.map((opt, idx) => {
                const isSelected = quizAnswer === idx;
                const isCorrect = idx === selectedSubsystem.practiceQuestion.correctIndex;

                let btnStyle = "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850";
                if (showExplanation) {
                  if (isCorrect) btnStyle = "bg-emerald-950/60 border-emerald-600 text-emerald-200";
                  else if (isSelected) btnStyle = "bg-rose-950/60 border-rose-600 text-rose-200";
                } else if (isSelected) {
                  btnStyle = "bg-amber-500/20 border-amber-500 text-white";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuizAnswer(idx);
                      setShowExplanation(true);
                    }}
                    className={`w-full text-left p-2 rounded border text-[11px] transition-colors ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-teal-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Technical Rationale:</span>
                </div>
                <p className="leading-relaxed">
                  {selectedSubsystem.practiceQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
