"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, FileSearch, Layers3, RotateCcw } from "lucide-react";

const officialOverview = "https://www.cgs-oris.com/en/software/";
const productNames = ["COLOR TUNER", "FLEX PACK", "X GAMUT", "PRESS MATCHER", "CERTIFIED", "EVALUATE"];

const practicePrompts = [
  "A customer asks whether a named ORIS product supports a particular file format in their installation.",
  "A customer wants a color workflow recommendation but has not identified the output device, target, or material.",
  "An operator says a feature is missing from the interface and asks you to change production settings.",
  "A candidate is asked to explain a product capability that is not stated on the public overview.",
  "A customer asks whether two products are bundled together and licensed for their site.",
];

const responseOptions = [
  { id: "verify", text: "Clarify the requirement, identify product/version/license, and verify it in current product documentation before recommending a change." },
  { id: "guess", text: "Infer the feature from the product name and promise that it will work." },
  { id: "assume", text: "Assume every installation has the same license and integration." },
];

interface SavedPracticeStats {
  attempts: number;
  correct: number;
}

export default function OrisExplorerPage() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<SavedPracticeStats>({ attempts: 0, correct: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/practice/oris", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load your saved practice score.");
        setStats(data.stats);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load your saved practice score."))
      .finally(() => setLoadingStats(false));
  }, []);

  const selectAnswer = async (choiceKey: string) => {
    if (selected || saving) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/practice/oris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptIndex, choiceKey }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to save your practice response.");
      setStats(data.stats);
      setSelected(choiceKey);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save your practice response.");
    } finally {
      setSaving(false);
    }
  };

  const nextPrompt = () => {
    setPromptIndex((index) => (index + 1) % practicePrompts.length);
    setSelected(null);
    setError(null);
  };

  const restartPrompts = () => {
    setPromptIndex(0);
    setSelected(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-teal-400">
          <Layers3 className="h-4 w-4" />
          <span>Public product-name orientation</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">ORIS Software Portfolio Lab</h1>
        <p className="max-w-3xl text-xs leading-relaxed text-slate-400">
          The official overview lists the names below. This independent learning page does not assign a detailed feature matrix, license, integration, or service procedure; confirm those in current product documentation.
        </p>
        <a href={officialOverview} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-teal-300 underline hover:text-teal-200">
          Open official ORIS software overview <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 p-3 text-xs leading-relaxed text-amber-200">
        <strong>Source boundary:</strong> Product names are public portfolio information. A name alone does not confirm the customer's version, license, capability, input/output, standard, or connection to a printer.
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="ORIS product names listed in the public overview">
        {productNames.map((name) => (
          <article key={name} className="space-y-3 rounded-xl border border-slate-800 bg-[#0F1A2E] p-5">
            <span className="rounded border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[10px] font-mono uppercase text-teal-300">Public product name</span>
            <h2 className="text-base font-bold text-white">ORIS {name}</h2>
            <p className="text-xs leading-relaxed text-slate-300">Use the current official product page and installation-specific documentation to confirm detailed functionality and workflow fit.</p>
            <a href={officialOverview} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-teal-300 underline">Verify source <ExternalLink className="h-3 w-3" /></a>
          </article>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-[#0F1A2E] p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-800 pb-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2"><FileSearch className="h-5 w-5 text-teal-400" /><h2 className="text-base font-bold text-white">Interactive requirement-check exercise</h2></div>
          <span className="text-xs font-mono text-teal-300">Prompt {promptIndex + 1} of {practicePrompts.length} · {loadingStats ? "Loading saved score…" : `Saved account score ${stats.correct}/${stats.attempts}`}</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm font-medium leading-relaxed text-white">{practicePrompts[promptIndex]}</div>
        <p className="text-xs text-slate-400">Choose the response that avoids an unsupported feature claim. Your response and score are saved to your signed-in account.</p>
        <div className="space-y-2">
          {responseOptions.map((option) => {
            const isCorrect = option.id === "verify";
            const isSelected = selected === option.id;
            const style = !selected ? "bg-slate-900 border-slate-700 text-slate-200 hover:border-teal-500" : isCorrect ? "bg-emerald-950/50 border-emerald-600 text-emerald-200" : isSelected ? "bg-rose-950/40 border-rose-700 text-rose-200" : "bg-slate-900 border-slate-800 text-slate-500";
            return <button key={option.id} disabled={Boolean(selected) || saving} onClick={() => selectAnswer(option.id)} className={`w-full rounded-lg border px-4 py-3 text-left text-xs leading-relaxed transition-colors disabled:cursor-not-allowed ${style}`}>{option.text}</button>;
          })}
        </div>
        {error && <p role="alert" className="rounded-lg border border-rose-700/50 bg-rose-950/30 p-3 text-xs text-rose-200">{error}</p>}
        {selected && <div className="flex flex-col gap-2 sm:flex-row">
          <p className="flex-1 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">A product overview is an orientation source. Verify current documentation, version, license, and installation before describing capabilities.</p>
          <button onClick={nextPrompt} className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500">Next prompt</button>
          <button onClick={restartPrompts} aria-label="Restart prompt sequence" title="Restart prompt sequence; saved account responses remain" className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:text-white"><RotateCcw className="h-4 w-4" /></button>
        </div>}
      </section>
    </div>
  );
}
