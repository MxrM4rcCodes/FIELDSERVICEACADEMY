"use client";

import React, { useState } from "react";
import {
  Printer,
  Shield,
  FileText,
  CheckCircle2,
  Cpu,
  Layers,
  Palette,
  Camera,
  Download,
  BookOpen,
} from "lucide-react";

export default function PrintCenterPage() {
  const [selectedSheet, setSelectedSheet] = useState<string>("safety");

  const sheets = [
    { id: "safety", title: "1. OSHA LOTO & High-Voltage Safety Protocol", icon: Shield },
    { id: "installation", title: "2. Pre-Site & Commissioning Checklist", icon: CheckCircle2 },
    { id: "troubleshooting", title: "3. Inkjet Banding & Defect Quick-Reference", icon: Layers },
    { id: "color_science", title: "4. Color Metrology & Delta E Reference", icon: Palette },
    { id: "oris_matrix", title: "5. CGS ORIS Software Ecosystem Matrix", icon: BookOpen },
    { id: "metis_guide", title: "6. METIS Scanning & Surface Optics Guide", icon: Camera },
    { id: "interview_prep", title: "7. STAR Behavioral Interview Worksheet", icon: FileText },
    { id: "blank_ticket", title: "8. Blank Field Service Ticket Form", icon: Printer },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 no-print">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            <Printer className="w-4 h-4" />
            <span>Field Engineering Documentation</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Study & Print Center
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Clean printable field reference guides and checklists with print-optimized CSS. High-contrast typography and vector-scaled layouts.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <Printer className="w-4 h-4" />
          <span>Print Active Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Document Selector (4 cols) */}
        <div className="lg:col-span-4 bg-[#0F1A2E] border border-slate-800 rounded-xl p-5 space-y-2.5 no-print">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
            Select Printable Reference Document:
          </span>
          {sheets.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedSheet === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSheet(s.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-medium flex items-center space-x-2.5 transition-all ${
                  isSelected
                    ? "bg-teal-500/15 border-teal-500 text-white font-semibold ring-1 ring-teal-500/30"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850"
                }`}
              >
                <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="truncate">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Printable Document Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-[#0F1A2E] print:bg-white print:text-black border border-slate-800 print:border-none rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
          {/* SHEET 1: SAFETY & LOTO */}
          {selectedSheet === "safety" && (
            <div className="space-y-6 text-xs text-slate-200 print:text-black leading-relaxed">
              <div className="border-b-2 border-slate-700 print:border-black pb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black uppercase text-teal-400 print:text-black">
                    CGS ORIS Field Engineering: Safety & LOTO Protocol
                  </h2>
                  <p className="text-[11px] text-slate-400 print:text-gray-600 font-mono">
                    Compliance: OSHA 29 CFR 1910.147 & NFPA 70E Electrical Safety
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 print:text-black">REF-SAF-01</span>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/20 print:bg-gray-100 border border-rose-800/40 print:border-black font-semibold text-rose-300 print:text-black">
                CORE MANDATE: An Emergency Stop (E-Stop) is a control circuit interrupt, NOT zero-energy isolation. Physical disconnect lock and tag required before body entry into kinetic/electrical zones.
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-white print:text-black uppercase text-xs font-mono">
                  6-Step Zero-Energy Lockout/Tagout Sequence:
                </h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong>Preparation:</strong> Notify facility manager and operators of machinery shutdown.</li>
                  <li><strong>Shutdown:</strong> Park printhead carriage in capping station; cleanly shut down controller software.</li>
                  <li><strong>Isolation:</strong> Rotate main 208-480V 3-phase wall disconnect switch to OFF position.</li>
                  <li><strong>Lock & Tag:</strong> Apply personal red padlock, hasp, and signed danger tag to the disconnect lever.</li>
                  <li><strong>Energy Dissipation:</strong> Bleed pneumatic lines; wait 5-10 minutes for DC bus filter capacitor discharge.</li>
                  <li><strong>Zero-Energy Verification (MANDATORY):</strong> Test machine start switch to verify dead; meter voltage with calibrated DMM: Phase-to-Phase (0.0V), Phase-to-Neutral (0.0V), Phase-to-Ground (0.0V).</li>
                </ol>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 print:border-black">
                <h3 className="font-bold text-white print:text-black uppercase text-xs font-mono">
                  PPE Standards for Field Technicians:
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Chemical Barrier:</strong> Heavy nitrile gloves (minimum 5-8 mil) when handling UV inks or solvents. (Latex degrades rapidly).</li>
                  <li><strong>Optical Radiation:</strong> Certified UV eye protection (365–405nm, OD 5+) whenever testing UV lamps.</li>
                  <li><strong>Electrical:</strong> Arc-rated face shield and 1000V insulated tools when probing live 480V cabinets.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SHEET 2: INSTALLATION CHECKLIST */}
          {selectedSheet === "installation" && (
            <div className="space-y-6 text-xs text-slate-200 print:text-black leading-relaxed">
              <div className="border-b-2 border-slate-700 print:border-black pb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black uppercase text-teal-400 print:text-black">
                    Pre-Site Inspection & Commissioning Protocol
                  </h2>
                  <p className="text-[11px] text-slate-400 print:text-gray-600 font-mono">
                    Facility Environmental Audit & Gantry Mechanical Tolerances
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 print:text-black">REF-INST-02</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-white print:text-black uppercase text-xs font-mono">
                  1. Environmental & Facilities Pre-Check:
                </h3>
                <table className="w-full text-left border-collapse border border-slate-700 print:border-black">
                  <thead>
                    <tr className="bg-slate-900 print:bg-gray-100 border-b border-slate-700 print:border-black font-mono">
                      <th className="p-2">Parameter</th>
                      <th className="p-2">Required Factory Tolerance</th>
                      <th className="p-2">Measured Site Value</th>
                      <th className="p-2">Signoff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-black">
                    <tr>
                      <td className="p-2 font-semibold">Ambient Temp</td>
                      <td className="p-2">68°F to 75°F (20°C to 24°C)</td>
                      <td className="p-2 font-mono">_____ °F</td>
                      <td className="p-2">[ ] Pass</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Relative Humidity</td>
                      <td className="p-2">40% to 60% RH (Non-condensing)</td>
                      <td className="p-2 font-mono">_____ %</td>
                      <td className="p-2">[ ] Pass</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">3-Phase Balance</td>
                      <td className="p-2">208V / 230V / 480V (±2% balance)</td>
                      <td className="p-2 font-mono">L1:___ L2:___ L3:___</td>
                      <td className="p-2">[ ] Pass</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Neutral-to-Ground</td>
                      <td className="p-2">&lt; 2.0 Volts AC (Isolated ground)</td>
                      <td className="p-2 font-mono">_____ V AC</td>
                      <td className="p-2">[ ] Pass</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-white print:text-black uppercase text-xs font-mono">
                  2. Mechanical Leveling & Tramming Tolerances:
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Chassis Level:</strong> Precision Starrett 98 machinist level reading &lt; 0.05 mm across bed length.</li>
                  <li><strong>Dial Test Indicator Sweep:</strong> Carriage sweep deviation across vacuum bed within ±0.10 mm.</li>
                  <li><strong>Negative Pressure:</strong> Manometer reading verified between -3.0 and -3.5 kPa.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SHEET 3: TROUBLESHOOTING DEFECT GUIDE */}
          {selectedSheet === "troubleshooting" && (
            <div className="space-y-6 text-xs text-slate-200 print:text-black leading-relaxed">
              <div className="border-b-2 border-slate-700 print:border-black pb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black uppercase text-teal-400 print:text-black">
                    Industrial Inkjet Defect Isolation Matrix
                  </h2>
                  <p className="text-[11px] text-slate-400 print:text-gray-600 font-mono">
                    Systematic Root Cause Isolation for Field Service Engineers
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 print:text-black">REF-TRB-03</span>
              </div>

              <div className="space-y-3">
                <table className="w-full text-left border-collapse border border-slate-700 print:border-black">
                  <thead>
                    <tr className="bg-slate-900 print:bg-gray-100 border-b border-slate-700 print:border-black font-mono">
                      <th className="p-2">Defect Symptom</th>
                      <th className="p-2">Primary Root Cause</th>
                      <th className="p-2">Corrective Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-black">
                    <tr>
                      <td className="p-2 font-semibold">Horizontal White Line</td>
                      <td className="p-2">Missing/clogged nozzles or sub-tank vacuum too strong (cavitation).</td>
                      <td className="p-2">Print nozzle check. Swab wiper blade; clean capping seal; soft 2-sec purge.</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Horizontal Dark Line</td>
                      <td className="p-2">Media step feed under-stepping (pass overlap). Nozzle check is 100% clean.</td>
                      <td className="p-2">Recalibrate feed step advance factor (+ compensation).</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Ink Drooling / Dripping</td>
                      <td className="p-2">Sub-tank negative pressure too weak (&gt; -1.5 kPa).</td>
                      <td className="p-2">Connect manometer; adjust sub-tank vacuum regulator to -3.2 kPa.</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Aerosol Mist / Halos</td>
                      <td className="p-2">Substrate static charge &gt; 20kV or head gap too high (&gt; 2.0mm).</td>
                      <td className="p-2">Clean ionizing static bar pins; lower carriage gap to 1.2–1.5mm.</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Sticky / Uncured Ink</td>
                      <td className="p-2">UV quartz window encrusted in ink mist; low lamp irradiance.</td>
                      <td className="p-2">Clean quartz with IPA; verify radiometer irradiance &gt; 800 mW/cm².</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DEFAULT FALLBACK FOR OTHER SHEETS */}
          {!["safety", "installation", "troubleshooting"].includes(selectedSheet) && (
            <div className="space-y-4 text-xs text-slate-200 print:text-black leading-relaxed">
              <div className="border-b-2 border-slate-700 print:border-black pb-3">
                <h2 className="text-lg font-black uppercase text-teal-400 print:text-black">
                  {sheets.find((s) => s.id === selectedSheet)?.title}
                </h2>
                <p className="text-[11px] text-slate-400 print:text-gray-600 font-mono">
                  CGS ORIS Americas Technical Field Documentation Series
                </p>
              </div>
              <p className="text-slate-300 print:text-black leading-relaxed">
                This document is formatted for standard Letter/A4 printing. Includes high-contrast text, clear margins, and complete technical specifications matching Plymouth MN field service guidelines.
              </p>
              <div className="p-4 rounded-xl bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-black">
                <div className="font-mono text-xs uppercase font-bold text-teal-300 print:text-black mb-2">
                  Reference Summary Notes:
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
                  <li>Color Tolerance: Contract proofing standard requires ΔE00 &lt; 1.5 against ISO 12647-7.</li>
                  <li>METIS 3D Texture: Directional SynchroLight captures micro-shadow vectors for 3D normal mapping.</li>
                  <li>ORIS Suite: Color Tuner (Proofing), Press Matcher (Fleet Matching), X Gamut (7-Color ECG).</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
