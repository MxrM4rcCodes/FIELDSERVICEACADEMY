"use client";

import React, { useState } from "react";
import { Palette, Calculator, Layers, Info, Eye } from "lucide-react";
import { deltaE00, deltaE76 } from "@/lib/color";

export default function ColorLabPage() {
  // Delta E Calculator State
  const [refL, setRefL] = useState<number>(50.0);
  const [refA, setRefA] = useState<number>(65.0);
  const [refB, setRefB] = useState<number>(40.0);

  const [samL, setSamL] = useState<number>(51.2);
  const [samA, setSamA] = useState<number>(63.8);
  const [samB, setSamB] = useState<number>(41.5);

  // Substrate Simulator State
  const [activeSubstrate, setActiveSubstrate] = useState<"gloss_white" | "uncoated_kraft" | "coroplast">("gloss_white");

  // Measurement Condition Tab
  const [activeMMode, setActiveMMode] = useState<"M0" | "M1" | "M2" | "M3">("M1");

  const referenceLab = { L: refL, a: refA, b: refB };
  const sampleLab = { L: samL, a: samA, b: samB };
  const difference76 = deltaE76(referenceLab, sampleLab);
  const difference00 = deltaE00(referenceLab, sampleLab);

  const substrates = {
    gloss_white: {
      name: "Illustrative light coated stock",
      baseLab: "Illustrative neutral/bright base; actual values depend on stock and measurement conditions.",
      previewBg: "#F8FAFC",
      perceivedRed: "#DC2626",
      notes: "A light base often offers more available chroma than a dark substrate; verify the actual stock and target with an agreed measurement method.",
    },
    uncoated_kraft: {
      name: "Unbleached Natural Kraft Corrugated Board",
      baseLab: "Illustrative warm, lower-lightness base; no measured coordinates are asserted.",
      previewBg: "#A38054",
      perceivedRed: "#854D27",
      notes: "A warm substrate can shift the appearance of translucent inks. A white underlayer is only an option when the specific printer, ink, workflow, and customer specification support it.",
    },
    coroplast: {
      name: "Illustrative light plastic substrate",
      baseLab: "Illustrative light plastic base; actual substrate properties vary by product and lot.",
      previewBg: "#E2E8F0",
      perceivedRed: "#E11D48",
      notes: "Surface energy and adhesion depend on the specific substrate, ink, pretreatment, and approved test method. Do not assume a universal dyne threshold.",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
          <Palette className="w-4 h-4" />
          <span>Interactive Metrology & Color Science</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Color Science & Spectrophotometry Lab
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          CIELAB coordinates, Delta E calculations, ISO 13655 measurement-condition concepts, and the influence of the sample substrate.
        </p>

        {/* Browser Disclaimer Alert */}
        <div className="mt-3 p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 text-blue-300 text-xs flex items-center space-x-2.5">
          <Info className="w-4 h-4 shrink-0 text-blue-400" />
          <span>
            <strong>Educational model:</strong> The adjustable CIELAB coordinates and swatches are illustrative values, not instrument readings. A numerical ΔE alone is not a pass/fail decision; use the agreed reference, substrate, instrument condition, measurement procedure, and customer tolerance.
          </span>
        </div>
        <p className="mt-2 text-[10px] text-slate-500">Formula background: <a className="text-teal-300 underline" href="https://doi.org/10.1002/col.20070" target="_blank" rel="noreferrer">Sharma, Wu &amp; Dalal, CIEDE2000</a>. The formula describes a calculated difference; it does not define a contract tolerance.</p>
      </div>

      {/* SECTION 1: Interactive Delta E Calculator */}
      <div className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white">Interactive Delta E (ΔE00) Calculator</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            CIE DE2000 vs CIE 1976 Formula Comparison
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Reference Color Controls */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
              <span>Reference CIELAB values (illustrative)</span>
              <span className="text-teal-400">Reference Lab</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>L* (Lightness: 0 to 100):</span>
                  <span className="font-mono text-white font-bold">{refL.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  aria-label="Reference L-star coordinate"
                  value={refL}
                  onChange={(e) => setRefL(parseFloat(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>a* (Red-Green: -100 to +100):</span>
                  <span className="font-mono text-white font-bold">{refA.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="0.5"
                  aria-label="Reference a-star coordinate"
                  value={refA}
                  onChange={(e) => setRefA(parseFloat(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>b* (Yellow-Blue: -100 to +100):</span>
                  <span className="font-mono text-white font-bold">{refB.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="0.5"
                  aria-label="Reference b-star coordinate"
                  value={refB}
                  onChange={(e) => setRefB(parseFloat(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Sample Measured Color Controls */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
              <span>Sample CIELAB values (illustrative)</span>
              <span className="text-blue-400">Sample Lab</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>L* (Lightness):</span>
                  <span className="font-mono text-white font-bold">{samL.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  aria-label="Sample L-star coordinate"
                  value={samL}
                  onChange={(e) => setSamL(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>a* (Red-Green):</span>
                  <span className="font-mono text-white font-bold">{samA.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="0.5"
                  aria-label="Sample a-star coordinate"
                  value={samA}
                  onChange={(e) => setSamA(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>b* (Yellow-Blue):</span>
                  <span className="font-mono text-white font-bold">{samB.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="0.5"
                  aria-label="Sample b-star coordinate"
                  value={samB}
                  onChange={(e) => setSamB(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Delta E Result Box */}
          <div className="lg:col-span-4 bg-[#070C14] border border-slate-800 p-5 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                Computed Perceptual Difference
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black font-mono text-teal-300">
                  {difference00.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">ΔE00 (CIEDE2000)</span>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                CIE 1976 ΔE*ab: <strong>{difference76.toFixed(2)}</strong>
              </div>
            </div>

            <div className="rounded-lg border border-amber-800 bg-amber-950/30 p-3 text-[11px] leading-relaxed text-amber-200">
              This value describes a calculated color difference only. Whether it is acceptable depends on the agreed measurement and production specification.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Substrate White Point & Adhesion Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base border-b border-slate-850 pb-3">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Substrate Influence on Perceived Color</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The appearance of printed color depends on the ink's pigment, opacity and laydown as well as the substrate's surface and color. Some workflows use a white layer for contrast only when the specific device, materials, and customer specification support it.
          </p>

          {/* Substrate Selector */}
          <div className="space-y-2">
            {(Object.keys(substrates) as Array<keyof typeof substrates>).map((k) => (
              <button
                key={k}
                onClick={() => setActiveSubstrate(k)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                  activeSubstrate === k
                    ? "bg-slate-850 border-amber-500/50 text-white ring-1 ring-amber-500/30"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="font-semibold text-slate-200">{substrates[k].name}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Base: {substrates[k].baseLab}
                </div>
              </button>
            ))}
          </div>

          {/* Substrate Preview Swatch */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Illustrative screen-color swatch (not a physical print simulation):
            </div>
            <div className="flex items-center space-x-4">
              <div
                style={{ backgroundColor: substrates[activeSubstrate].previewBg }}
                className="w-16 h-16 rounded-lg border border-slate-700 flex items-center justify-center p-2 shadow-inner"
              >
                <div
                  style={{ backgroundColor: substrates[activeSubstrate].perceivedRed }}
                  className="w-8 h-8 rounded-full shadow-md"
                ></div>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-medium text-white">{substrates[activeSubstrate].notes}</p>

              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: ISO 13655 Measurement Modes (M0, M1, M2, M3) */}
        <div className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base border-b border-slate-850 pb-3">
            <Eye className="w-5 h-5 text-teal-400" />
            <span>ISO 13655 Spectrophotometer Conditions</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            ISO 13655 defines measurement conditions; instrument geometry, calibration, substrate, and the customer's reference procedure still matter. Match the specified condition when comparing readings.
          </p>

          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            {(["M0", "M1", "M2", "M3"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMMode(m)}
                className={`py-1.5 font-mono font-bold rounded transition-colors ${
                  activeMMode === m ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            {activeMMode === "M0" && (
              <>
                <div className="font-bold text-teal-300 font-mono">Condition M0: illuminant-A-like measurement</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  ISO 13655 M0 approximates CIE standard illuminant A. Ultraviolet content can differ between instruments, so do not substitute conditions when optical brighteners or a contract target matter.
                </p>
              </>
            )}
            {activeMMode === "M1" && (
              <>
                <div className="font-bold text-teal-300 font-mono">Condition M1: D50-related measurement</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  M1 is designed to provide a measurement condition consistent with CIE D50, including its ultraviolet component. It can matter when optical brighteners affect the result. Follow the applicable proofing or customer specification; no one condition is universal.
                </p>
              </>
            )}
            {activeMMode === "M2" && (
              <>
                <div className="font-bold text-teal-300 font-mono">Condition M2: UV-cut</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  M2 excludes ultraviolet energy from the measurement condition, reducing the contribution from fluorescent optical brighteners. Select it only when required by the relevant specification or comparison method.
                </p>
              </>
            )}
            {activeMMode === "M3" && (
              <>
                <div className="font-bold text-teal-300 font-mono">Condition M3: UV-cut with polarization</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  M3 combines a UV-cut condition with polarization to reduce some surface-reflection effects. It is not a universal substitute for M0, M1, or M2; use the condition specified for the job and instrument.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
