"use client";

import React, { useState } from "react";
import { AlertTriangle, Camera, ExternalLink, Lightbulb, ScanLine } from "lucide-react";

const scannerFamilies = [
  {
    name: "Decor-industry and PBR overview",
    products: "METIS DRS models, PM3D HAWK, and SURF 3D are listed in the decor-industry context on the public product overview.",
    note: "The overview is a family-level introduction. It does not establish features, specifications, or procedures for a particular installed unit.",
    source: "https://www.cgs-oris.com/en/metis-scanner",
  },
  {
    name: "Cultural-heritage products",
    products: "The public METIS pages list DRS 752 DCS and EDS GAMMA in the cultural-heritage context.",
    note: "Product family and capture details vary. Consult the exact current product documentation.",
    source: "https://www.metis-group.com/cultural-heritage",
  },
  {
    name: "EDS GAMMA",
    products: "METIS describes EDS GAMMA as an A1 desktop reproduction system and a member of the EDS (Easy Digital Scanner) family.",
    note: "This source-backed description applies to EDS GAMMA; it must not be generalized to DRS models or every METIS scanner.",
    source: "https://www.metis-group.com/product/eds-gamma",
  },
  {
    name: "SURF 3D",
    products: "The manufacturer product page describes SURF 3D as a scanner that captures color, 3D embossing, and gloss information for materials.",
    note: "This is a specific product-page description, not a claim about the output or capabilities of other models.",
    source: "https://www.metis-group.com/product/surf-3d",
  },
];

const artifactStages = {
  unknown: {
    label: "I have not yet located where the artifact appears",
    response: "Preserve the original, identify the exact scanner and software version, record the capture conditions, and compare workflow stages using approved tools. Do not clean or calibrate by guesswork.",
  },
  capture: {
    label: "The artifact is present in the original captured file",
    response: "This places the artifact at or before the saved-capture stage. It narrows the workflow question but does not prove a scanner component failed. Use the exact model's approved reference and calibration process.",
  },
  processing: {
    label: "The original looks clean; the artifact appears after processing",
    response: "This suggests a later transformation may be relevant, but does not prove a specific software fault. Preserve both files, identify versions/settings, and ask the workflow owner to review approved logs and comparisons.",
  },
  output: {
    label: "The source file appears clean; the physical output differs",
    response: "Review the configured downstream workflow, device, material, target, and measurement conditions. A clean source does not by itself identify the output device as the cause.",
  },
};

export default function MetisLabPage() {
  const [lightMode, setLightMode] = useState<"diffuse" | "left" | "right" | "top">("diffuse");
  const [artifactStage, setArtifactStage] = useState<keyof typeof artifactStages>("unknown");

  const surfaceStyle: React.CSSProperties = lightMode === "diffuse"
    ? { background: "linear-gradient(135deg, #64748b, #94a3b8 45%, #475569)" }
    : lightMode === "left"
      ? { background: "linear-gradient(110deg, #f8fafc 0%, #cbd5e1 20%, #334155 75%)" }
      : lightMode === "right"
        ? { background: "linear-gradient(250deg, #f8fafc 0%, #cbd5e1 20%, #334155 75%)" }
        : { background: "linear-gradient(180deg, #f8fafc 0%, #cbd5e1 22%, #334155 75%)" };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
          <Camera className="w-4 h-4" />
          <span>Scanner Families & Imaging Concepts</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">METIS Scanner Learning Lab</h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Explore publicly listed product families, a general light-and-surface illustration, and a workflow triage exercise. Product features and procedures vary by exact model.
        </p>
      </div>

      <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 p-3 text-xs leading-relaxed text-amber-200">
        <strong>Independent learning aid.</strong> This page is not a proprietary scanner schematic, capture simulation, service manual, or product endorsement. Verify specifications and procedures in current manufacturer documentation.
      </div>

      <section className="bg-[#0F1A2E] border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lightbulb className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="text-base font-bold text-white">General Directional-Light Illustration</h2>
            <p className="text-[11px] text-slate-400">Illustrates how lighting direction can change the visible shading of a textured surface.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {(["diffuse", "left", "right", "top"] as const).map((mode) => (
                <button key={mode} aria-pressed={lightMode === mode} onClick={() => setLightMode(mode)} className={`rounded-lg border px-3 py-2 font-mono capitalize ${lightMode === mode ? "bg-purple-600 border-purple-400 text-white" : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"}`}>
                  {mode} light
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A real scanner's illumination, capture sequence, outputs, and supported modes are model-specific. This screen graphic does not calculate surface depth or reproduce any METIS technology.
            </p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-6 flex items-center justify-center min-h-[190px]">
            <div aria-label={`Illustrative surface under ${lightMode} light`} className="h-32 w-56 rounded-xl border border-white/20 shadow-2xl transition-all duration-300" style={{ ...surfaceStyle, boxShadow: lightMode === "diffuse" ? "inset 0 0 35px rgba(255,255,255,.16), 0 20px 45px rgba(0,0,0,.35)" : "inset 0 0 20px rgba(255,255,255,.12), 10px 20px 30px rgba(0,0,0,.45)" }}>
              <div className="flex h-full items-center justify-center gap-2 opacity-60" aria-hidden="true">
                <span className="h-16 w-2 rounded-full bg-white/30" />
                <span className="h-20 w-2 rounded-full bg-black/20" />
                <span className="h-12 w-2 rounded-full bg-white/40" />
                <span className="h-24 w-2 rounded-full bg-black/25" />
                <span className="h-16 w-2 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-bold text-white">Public METIS Product Context</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {scannerFamilies.map((family) => (
            <article key={family.name} className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-base font-bold text-white">{family.name}</h3>
              <p className="text-xs leading-relaxed text-slate-200">{family.products}</p>
              <p className="text-[11px] leading-relaxed text-slate-400">{family.note}</p>
              <a href={family.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 underline">
                Official product information <ExternalLink className="h-3 w-3" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <ScanLine className="w-5 h-5 text-teal-400" />
          <div>
            <h2 className="text-base font-bold text-white">Interactive Artifact-Triage Practice</h2>
            <p className="text-[11px] text-slate-400">Where does the difference first appear in the workflow?</p>
          </div>
        </div>
        <label className="block text-xs font-mono text-slate-300" htmlFor="artifact-stage">Choose an observation</label>
        <select id="artifact-stage" value={artifactStage} onChange={(event) => setArtifactStage(event.target.value as keyof typeof artifactStages)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white">
          {Object.entries(artifactStages).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
        </select>
        <div className="rounded-lg border border-teal-700/40 bg-teal-950/20 p-4 text-xs leading-relaxed text-teal-100">{artifactStages[artifactStage].response}</div>
        <p className="text-[11px] leading-relaxed text-slate-400">A workflow-stage clue narrows questions; it does not establish a root cause. Keep the original file and consult the exact model's authorized capture and maintenance instructions.</p>
      </section>
    </div>
  );
}
