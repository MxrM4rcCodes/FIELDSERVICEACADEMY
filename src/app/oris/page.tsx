"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Layers,
  RotateCcw,
  Zap,
} from "lucide-react";

interface OrisProduct {
  id: string;
  name: string;
  tagline: string;
  category: "Proofing" | "Production" | "Extended Gamut" | "Packaging" | "Quality Control" | "Spectral";
  description: string;
  keyFeatures: string[];
  idealCustomer: string;
  commonProblemsSolved: string[];
}

const orisProducts: OrisProduct[] = [
  {
    id: "color_tuner",
    name: "ORIS COLOR TUNER",
    tagline: "Worldwide Benchmark for Contract Color Proofing",
    category: "Proofing",
    description: "The industry standard for generating legally binding contract proofs on inkjet engines (e.g. Epson SC-P series) emulating commercial offset, flexo, and gravure press standards.",
    keyFeatures: [
      "Proprietary DeviceLink profiling technology",
      "Pure Black (100% K) text preservation without 4-color contamination",
      "Exact spot-color simulation with spectral CxF database",
      "Automated iterative linearization loops",
    ],
    idealCustomer: "Prepress trade shops, ad agencies, commercial print houses needing contract proof signoffs.",
    commonProblemsSolved: [
      "Customer rejecting proofs because brand colors look different on press.",
      "Black text printing blurry or with CMY colored halos on contract proofs.",
    ],
  },
  {
    id: "press_matcher",
    name: "ORIS PRESS MATCHER",
    tagline: "Production Fleet Normalization Across Disparate Digital Presses",
    category: "Production",
    description: "Harmonizes disparate digital printing presses (e.g. Platinum UV flatbed, HP Indigo, Canon toner, EFI wide format) to produce visually identical color output from a single PDF master file.",
    keyFeatures: [
      "Device-independent production normalization",
      "Automated closed-loop curve updating via spectrophotometer",
      "G7 and Fogra compliance calibration",
      "Ink savings calculation and Gray Component Replacement (GCR)",
    ],
    idealCustomer: "Commercial digital print facilities running multiple press brands and technologies.",
    commonProblemsSolved: [
      "The same job looks different when printed on the Platinum flatbed vs the toner press.",
      "Customer wasting hours manually hand-tweaking curves for every substrate change.",
    ],
  },
  {
    id: "x_gamut",
    name: "ORIS X GAMUT",
    tagline: "7-Color Extended Color Gamut (ECG) Separation Software",
    category: "Extended Gamut",
    description: "Converts spot colors into a standardized fixed 7-color ink set (CMYK + Orange + Green + Violet), reproducing over 95% of Pantone colors without spot ink mixing or press wash-ups.",
    keyFeatures: [
      "Reproduces 95%+ of Pantone Solid library using 7 fixed inks",
      "Ganging multiple customer jobs with different brand spot colors on one press run",
      "Eliminates 85% of press wash-up downtime",
      "Precise spectral ink recipe calculation",
    ],
    idealCustomer: "Folding carton, flexible packaging, and industrial label converters running high job frequency.",
    commonProblemsSolved: [
      "Plant losing 15 hours a week washing out ink fountains between spot color jobs.",
      "High inventory costs storing hundreds of custom-mixed spot ink buckets.",
    ],
  },
  {
    id: "flex_pack",
    name: "ORIS FLEX PACK",
    tagline: "High-End Flexible Packaging Prototyping & Mockups",
    category: "Packaging",
    description: "Specialized packaging prototyping software paired with custom transfer films to produce realistic 3D mockups directly on production substrates (shrink sleeves, foils, carton board).",
    keyFeatures: [
      "Direct printing on production substrate films with custom transfer coating",
      "White ink opacity and underprint/overprint management",
      "Cold foil, embossing, and matte/gloss varnish simulation",
      "Complete 3D visual fold and deformation modeling",
    ],
    idealCustomer: "Brand packaging designers, beverage label converters, flexible pouch manufacturers.",
    commonProblemsSolved: [
      "Spending $5,000 to make prototypes on the actual production converting line.",
      "Inability to simulate white ink opacity on metallic beverage cans.",
    ],
  },
  {
    id: "certified",
    name: "ORIS CERTIFIED & EVALUATE",
    tagline: "Automated Color Quality Control & Certification Labels",
    category: "Quality Control",
    description: "Cloud-enabled or on-premise quality assurance software that measures color control wedges, calculates Delta E compliance against ISO 12647-7 / G7 standards, and prints adhesive verification labels.",
    keyFeatures: [
      "Automated pass/fail evaluation against international ISO standards",
      "Tamper-proof digital certificate generation",
      "Direct label printer integration for certified proof stickers",
      "Trend analysis and press drift tracking over time",
    ],
    idealCustomer: "All packaging and commercial printers requiring audited color compliance.",
    commonProblemsSolved: [
      "Brand owners disputing proof accuracy without objective measurement proof.",
      "Press drift going unnoticed until entire production rolls are ruined.",
    ],
  },
  {
    id: "cxf_toolbox",
    name: "ORIS CxF TOOLBOX & CLOUD",
    tagline: "Exact Spectral Color Communication via ISO 17972",
    category: "Spectral",
    description: "Creates, extracts, and manages spectral color data using the ISO 17972 CxF format, communicating full 380-730nm spectral curves rather than ambiguous RGB or L*a*b* numbers.",
    keyFeatures: [
      "Full spectral curve storage across 380–730nm wavelengths",
      "Eliminates metamerism across different retail light sources",
      "Halftone tint behavior and opacity curves for ink formulation",
      "Direct cloud synchronization between brand owners and global print suppliers",
    ],
    idealCustomer: "Global consumer brands (e.g. food/beverage, cosmetics) and multinational packaging printers.",
    commonProblemsSolved: [
      "A brand red matching in the pressroom but looking brown under retail supermarket lighting.",
      "Ambiguity in Pantone book revisions between different print vendors worldwide.",
    ],
  },
];

const matchChallenges = [
  {
    id: 1,
    clientQuote: "\"We spend 3 hours washing flexo press ink fountains every day to mix custom spot inks. We need to eliminate wash-ups.\"",
    correctProductId: "x_gamut",
    feedback: "Exact match! ORIS X GAMUT's 7-color ECG workflow reproduces spot colors using fixed CMYK+OGV inks, eliminating wash-ups completely.",
  },
  {
    id: 2,
    clientQuote: "\"Our brand owner requires legally certified contract proofs with an audited pass/fail label measuring Delta E against ISO standards.\"",
    correctProductId: "certified",
    feedback: "Correct! ORIS CERTIFIED & EVALUATE reads color control wedges and prints certified audit labels.",
  },
  {
    id: 3,
    clientQuote: "\"We have an HP Indigo, a Platinum UV flatbed, and a Canon toner press. The same company brochure looks completely different on all three machines.\"",
    correctProductId: "press_matcher",
    feedback: "Spot on! ORIS PRESS MATCHER normalizes disparate press fleets to a unified common reference standard.",
  },
  {
    id: 4,
    clientQuote: "\"Our global client in Europe wants to send us their exact brand color without metameric color shifts under different retail store lighting.\"",
    correctProductId: "cxf_toolbox",
    feedback: "Masterful! ORIS CxF TOOLBOX communicates complete spectral reflectance data (380-730nm), eliminating metamerism.",
  },
  {
    id: 5,
    clientQuote: "\"We need to produce realistic 3D mockup shrink-sleeve prototypes directly on metallized foil for a new energy drink launch.\"",
    correctProductId: "flex_pack",
    feedback: "Perfect! ORIS FLEX PACK specializes in packaging transfer films and foil mockups.",
  },
];

export default function OrisExplorerPage() {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentChallenge = matchChallenges[activeChallengeIdx];

  const handleSelectAnswer = (productId: string) => {
    setSelectedMatch(productId);
    setShowMatchResult(true);
    if (productId === currentChallenge.correctProductId) {
      setScore((s) => s + 1);
    }
  };

  const handleNextChallenge = () => {
    setSelectedMatch(null);
    setShowMatchResult(false);
    setActiveChallengeIdx((prev) => (prev + 1) % matchChallenges.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Proprietary Prepress & Color Ecosystem</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          CGS ORIS Software Product Explorer
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Master the specific intended function, market positioning, and workflow role of every CGS ORIS software package.
        </p>
      </div>

      {/* Customer Needs Matching Game Banner */}
      <div className="bg-[#0F1A2E] border border-teal-500/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">Interactive Customer-Needs Matching Exercise</h2>
          </div>
          <span className="text-xs font-mono text-teal-300">
            Challenge {activeChallengeIdx + 1} of {matchChallenges.length} • Score: {score}
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
              Customer Production Problem:
            </span>
            <p className="text-sm font-semibold italic text-teal-300">
              {currentChallenge.clientQuote}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {orisProducts.map((p) => {
              const isSelected = selectedMatch === p.id;
              const isCorrect = p.id === currentChallenge.correctProductId;

              let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850";
              if (showMatchResult) {
                if (isCorrect) btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200";
                else if (isSelected) btnStyle = "bg-rose-950/60 border-rose-500 text-rose-200";
              }

              return (
                <button
                  key={p.id}
                  disabled={showMatchResult}
                  onClick={() => handleSelectAnswer(p.id)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition-all ${btnStyle}`}
                >
                  <div className="text-[10px] text-slate-400 font-mono uppercase">{p.category}</div>
                  <div className="truncate">{p.name}</div>
                </button>
              );
            })}
          </div>

          {showMatchResult && (
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="space-y-0.5">
                <div
                  className={`font-bold font-mono text-[11px] uppercase ${
                    selectedMatch === currentChallenge.correctProductId
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {selectedMatch === currentChallenge.correctProductId ? "✓ Correct Solution!" : "✗ Incorrect Solution"}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {currentChallenge.feedback}
                </p>
              </div>

              <button
                onClick={handleNextChallenge}
                className="shrink-0 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                Next Challenge →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Learning Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orisProducts.map((p) => (
          <div
            key={p.id}
            className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                  {p.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">CGS Certified</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{p.name}</h3>
                <p className="text-[11px] text-teal-300 font-medium leading-tight mt-0.5">
                  {p.tagline}
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {p.description}
              </p>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Key Capabilities:
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {p.keyFeatures.map((f, idx) => (
                    <li key={idx} className="leading-snug">• {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">Target Client:</span>
              <p className="text-slate-400">{p.idealCustomer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
