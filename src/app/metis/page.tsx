"use client";

import React, { useState } from "react";
import {
  Camera,
  Sun,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function MetisLabPage() {
  const [activeLightAngle, setActiveLightAngle] = useState<"diffuse" | "left" | "right" | "top" | "synchro">("synchro");

  const scannerFamilies = [
    {
      name: "METIS PM3D HAWK",
      category: "3D Texture & Decor Surface Digitizer",
      market: "Ceramics, flooring, wallpaper, fine leather, natural stone.",
      features: [
        "Full Photometric Stereo calculation for 3D surface relief",
        "Generates 3D Normal maps, Height/Depth maps, and Gloss maps",
        "SynchroLight DC LED array with microsecond pulsing",
        "True optical resolution up to 1200+ DPI",
      ],
      confidence: "Confirmed Manufacturer Specification",
    },
    {
      name: "METIS DRS Family (e.g. DRS 2000)",
      category: "Large-Format Fine Art & Cartography Flatbed",
      market: "Museum archives, rare maps, high-value canvas artwork.",
      features: [
        "Extra-large scan area up to 200 x 100 cm (2x1 meters)",
        "Motorized camera column with precision optical zoom",
        "Gentle vacuum hold-down table for fragile parchment",
        "Zero-contact optical digitization",
      ],
      confidence: "Confirmed Manufacturer Specification",
    },
    {
      name: "METIS EDS Series",
      category: "Easy Digital Book & Archival Scanner",
      market: "Libraries, rare book collections, bound historical manuscripts.",
      features: [
        "Innovative V-shaped cradle preserving book spines",
        "Pressure-free glass plate hold-down option",
        "Automated curvature flattening algorithms",
        "Dual high-resolution CCD/CMOS sensors",
      ],
      confidence: "Confirmed Manufacturer Specification",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
          <Camera className="w-4 h-4" />
          <span>High-Precision Material Surface Digitizing</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          METIS Surface Imaging & Optics Lab
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Rome, Italy optical engineering: SynchroLight directional illumination, photometric stereo texture mapping, optical calibration, and distinguishing capture artifacts from downstream printer defects.
        </p>
      </div>

      {/* SECTION 1: Interactive SynchroLight Simulator */}
      <div className="bg-[#0F1A2E] border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
          <div className="flex items-center space-x-2">
            <Sun className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Interactive SynchroLight Directional Lighting Simulator</h2>
          </div>
          <span className="text-xs font-mono text-purple-300">
            Photometric Stereo 3D Depth Deduction
          </span>
        </div>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Unlike ordinary flatbed scanners with flat diffuse light, METIS pulses directional DC LEDs from different angles. By analyzing micro-shadow vectors cast into surface crevices, the software computes 3D depth and surface normals.
        </p>

        {/* Light Angle Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          {[
            { id: "synchro", label: "SynchroLight (All Pulses)" },
            { id: "diffuse", label: "Diffuse (Flat Color)" },
            { id: "left", label: "Directional: Left (90°)" },
            { id: "right", label: "Directional: Right (270°)" },
            { id: "top", label: "Directional: Top (0°)" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveLightAngle(mode.id as any)}
              className={`p-2.5 rounded-lg border text-center font-bold transition-all ${
                activeLightAngle === mode.id
                  ? "bg-purple-600 text-white border-purple-400 shadow-md ring-1 ring-purple-400/50"
                  : "bg-slate-900 text-slate-400 hover:text-white border-slate-800"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Dynamic Visual Simulation Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Optical Lighting State
            </div>
            <div className="font-semibold text-white">
              {activeLightAngle === "synchro" && "Full SynchroLight Multi-Angle Pulse Mode"}
              {activeLightAngle === "diffuse" && "Non-Directional Diffuse Illumination"}
              {activeLightAngle === "left" && "Raking Light from Left (-X Axis)"}
              {activeLightAngle === "right" && "Raking Light from Right (+X Axis)"}
              {activeLightAngle === "top" && "Raking Light from Top (+Y Axis)"}
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {activeLightAngle === "synchro" && "Captures 4 independent illumination angles in milliseconds. Math algorithms compute 3D relief, normal, and gloss maps."}
              {activeLightAngle === "diffuse" && "Eliminates all shadows. Ideal for capturing true flat 2D color without texture."}
              {activeLightAngle === "left" && "Casts deep micro-shadows to the right of wood pores and grout lines, accentuating vertical texture relief."}
              {activeLightAngle === "right" && "Casts shadows to the left, revealing inverse elevation vectors."}
              {activeLightAngle === "top" && "Highlights horizontal grain and perpendicular grooves."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Computed Map Output
            </div>
            <div className="font-semibold text-teal-300 font-mono">
              {activeLightAngle === "synchro" ? "3D Height Map + Normal Map (RGB) + Gloss Map" : "Standard 2D RGB Flat Scan"}
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {activeLightAngle === "synchro"
                ? "Ready for export to Platinum printer for physical tactile varnish relief printing."
                : "2D image only; cannot reproduce physical 3D relief on printer."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Calibration Requirement
            </div>
            <div className="font-semibold text-purple-300">
              White & Dark Shading Matrix
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Requires certified optical white tile scan to normalize sensor pixel sensitivity before 3D calculation.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: METIS Scanner Families Comparison */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">METIS Product Families Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scannerFamilies.map((fam, idx) => (
            <div
              key={idx}
              className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 font-bold">
                    {fam.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{fam.name}</h3>
                <div className="text-xs text-slate-400 leading-snug">
                  <strong>Target Market:</strong> {fam.market}
                </div>
                <ul className="space-y-1 text-slate-300 text-xs pt-2">
                  {fam.features.map((f, fIdx) => (
                    <li key={fIdx} className="leading-snug">• {f}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                Source: {fam.confidence}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Scanner Defect vs Printer Defect Table */}
      <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4 text-xs">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Field Triage: Scanner Artifacts vs Downstream Printer Defects</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Visual Symptom</th>
                <th className="py-2.5 px-3">METIS Scanner Root Cause</th>
                <th className="py-2.5 px-3">Platinum Printer Root Cause</th>
                <th className="py-2.5 px-3">FST Isolation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-[11px]">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">White Longitudinal Streak</td>
                <td className="py-2.5 px-3">Dirt or oil on white calibration reference tile causing over-compensation.</td>
                <td className="py-2.5 px-3">Missing printhead nozzle or clogged jet on Cyan/Magenta.</td>
                <td className="py-2.5 px-3 text-teal-300">Inspect raw digital TIFF on screen at 400%. If streak is in TIFF, clean scanner tile. If TIFF is clean, run printer nozzle check.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Repeating Periodic Bands</td>
                <td className="py-2.5 px-3">Motorized traverse screw vibration or optical encoder dust on scan rail.</td>
                <td className="py-2.5 px-3">Media advance step-feed underlap/overlap or carriage encoder scratch.</td>
                <td className="py-2.5 px-3 text-teal-300">Measure millimeter pitch of bands. Compare against scanner lead screw pitch vs printer feed roller diameter.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Severe Color Cast (Yellow/Brown)</td>
                <td className="py-2.5 px-3">Expired scanner shading calibration or wrong illuminant setting.</td>
                <td className="py-2.5 px-3">Substrate white point shift (kraft board) or missing color profile.</td>
                <td className="py-2.5 px-3 text-teal-300">Measure unprinted board with spectrophotometer. Apply white ink underprint if printing on brown stock.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
