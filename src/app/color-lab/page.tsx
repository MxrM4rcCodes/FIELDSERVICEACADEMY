"use client";

import React, { useState } from "react";
import {
  Palette,
  Calculator,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Eye,
} from "lucide-react";

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

  // Calculate Delta E 76
  const deltaL = samL - refL;
  const deltaA = samA - refA;
  const deltaB = samB - refB;
  const deltaE76 = Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);

  // Simplified approximation of Delta E 2000 for interactive educational visualization
  const c1 = Math.sqrt(refA * refA + refB * refB);
  const c2 = Math.sqrt(samA * samA + samB * samB);
  const deltaC = c2 - c1;
  const deltaH2 = Math.max(0, deltaE76 * deltaE76 - deltaL * deltaL - deltaC * deltaC);
  const deltaH = Math.sqrt(deltaH2);
  const deltaE00 = Math.sqrt(
    Math.pow(deltaL / 1.0, 2) +
    Math.pow(deltaC / (1 + 0.045 * c1), 2) +
    Math.pow(deltaH / (1 + 0.015 * c1), 2)
  );

  const getDeltaECommercialStatus = (val: number) => {
    if (val <= 1.0) {
      return { rating: "Excellent Match", desc: "Imperceptible to normal human vision under standard D50 lighting.", color: "text-emerald-400 bg-emerald-950/40 border-emerald-800" };
    }
    if (val <= 2.0) {
      return { rating: "Commercial Pass", desc: "Accepted industry tolerance for contract proofing and strict brand colors.", color: "text-teal-400 bg-teal-950/40 border-teal-800" };
    }
    if (val <= 3.5) {
      return { rating: "Marginal / Noticeable Shift", desc: "Noticeable under side-by-side comparison. Unacceptable for luxury packaging; acceptable for distance signage.", color: "text-amber-400 bg-amber-950/40 border-amber-800" };
    }
    return { rating: "Severe Mismatch", desc: "Gross visual error. Customer will reject print.", color: "text-rose-400 bg-rose-950/40 border-rose-800" };
  };

  const deltaEStatus = getDeltaECommercialStatus(deltaE00);

  const substrates = {
    gloss_white: {
      name: "High-Gloss Bright White Vinyl (OBA Coated)",
      baseLab: "L* 95.2, a* -0.4, b* -2.1 (Slight blue fluorescence)",
      previewBg: "#F8FAFC",
      perceivedRed: "#DC2626",
      notes: "High reflectance base. Colors print with maximum saturation and accurate hue.",
    },
    uncoated_kraft: {
      name: "Unbleached Natural Kraft Corrugated Board",
      baseLab: "L* 64.8, a* +5.9, b* +24.1 (Heavy yellow-brown)",
      previewBg: "#A38054",
      perceivedRed: "#854D27",
      notes: "Severe white-point shift. Transparent CMYK inks turn Target Red into muddy brown without white underprint.",
    },
    coroplast: {
      name: "White Fluted Polypropylene (Coroplast)",
      baseLab: "L* 91.0, a* -0.2, b* +1.5 (Neutral white plastic)",
      previewBg: "#E2E8F0",
      perceivedRed: "#E11D48",
      notes: "Moderate reflectance. Requires surface dyne energy >= 44 dynes/cm for UV ink adhesion.",
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
          CIELAB color space, Delta E mathematical differences, ISO 13655 measurement standards, substrate white point influence, and DeviceLink color management.
        </p>

        {/* Browser Disclaimer Alert */}
        <div className="mt-3 p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 text-blue-300 text-xs flex items-center space-x-2.5">
          <Info className="w-4 h-4 shrink-0 text-blue-400" />
          <span>
            <strong>Educational Instrument Notice:</strong> Computer monitors display in sRGB color space and cannot reproduce physical spectrophotometry or UV ink spectral reflectance. Numerical Delta E coordinates represent actual physical measurement data.
          </span>
        </div>
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
              <span>Standard (Brand Reference)</span>
              <span className="text-teal-400">CIELAB Target</span>
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
                  min="-80"
                  max="100"
                  step="0.5"
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
                  min="-80"
                  max="100"
                  step="0.5"
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
              <span>Measured Production Sample</span>
              <span className="text-blue-400">Spectrophotometer Scan</span>
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
                  min="-80"
                  max="100"
                  step="0.5"
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
                  min="-80"
                  max="100"
                  step="0.5"
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
                  {deltaE00.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">ΔE00 (CIEDE2000)</span>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Legacy ΔE76: <strong>{deltaE76.toFixed(2)}</strong>
              </div>
            </div>

            {/* Commercial Evaluation Badge */}
            <div className={`p-3 rounded-lg border text-xs space-y-1 ${deltaEStatus.color}`}>
              <div className="font-bold flex items-center space-x-1.5 font-mono uppercase text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{deltaEStatus.rating}</span>
              </div>
              <p className="text-[11px] leading-tight opacity-90">{deltaEStatus.desc}</p>
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
            Inkjet inks are transparent dye or pigment suspensions. Light travels through the ink, reflects off the substrate, and passes back through the ink.
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
              Simulated Target Red Appearance on Selected Stock:
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
                {activeSubstrate === "uncoated_kraft" && (
                  <span className="text-amber-400 text-[11px] font-bold block">
                    ⚠️ Requires ORIS white ink underprint layer to avoid 5.0+ Delta E shift!
                  </span>
                )}
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
            Standardized illumination geometry ensures measurements remain repeatable across different spectrophotometers and paper types.
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
                <div className="font-bold text-teal-300 font-mono">Condition M0: Legacy Tungsten (Incandescent)</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Illuminant A with undefined UV content. Used in legacy printing standards. Phased out due to poor inter-instrument agreement on modern substrates with optical brighteners.
                </p>
              </>
            )}
            {activeMMode === "M1" && (
              <>
                <div className="font-bold text-teal-300 font-mono">Condition M1: D50 Daylight with Controlled UV</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong>The modern commercial benchmark.</strong> Incorporates exact CIE D50 daylight illumination matching the human eye under standard retail/pressroom lighting. Essential for measuring OBA-brightened packaging papers under GRACoL 2013 / Fogra 51.
                </p>
              </>
            )}
            {activeMMode === "M2" && (
              <>
                <div className="font-bold text-teal-300 font-mono">Condition M2: UV-Cut (No UV Light)</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Filters out all wavelengths below 400nm, completely eliminating optical brightener fluorescence. Used in corrugated packaging where OBA variation causes proofing mismatches.
                </p>
              </>
            )}
            {activeMMode === "M3" && (
              <>
                <div className="font-bold text-teal-300 font-mono">Condition M3: Polarized Filter</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Uses cross-polarization filters to eliminate surface specular glare. Essential for measuring wet ink, high-gloss UV coatings, and fine-art reflective textures on METIS scanners.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
