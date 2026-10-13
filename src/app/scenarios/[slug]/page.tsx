"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  FileText,
  Eye,
  ShieldCheck,
  ChevronRight,
  Award,
} from "lucide-react";

export default function ScenarioRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [choiceFeedback, setChoiceFeedback] = useState<string | null>(null);

  const loadScenario = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/scenarios/${slug}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadScenario();
    }
  }, [slug]);

  const handleChoose = async (choiceKey: string) => {
    if (!data?.run?.id || submitting) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/scenarios/${slug}/choose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: data.run.id,
          choiceKey,
        }),
      });
      const result = await res.json();
      setChoiceFeedback(result.feedback);
      await loadScenario();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = async () => {
    try {
      await fetch(`/api/scenarios/${slug}`, { method: "POST" });
      setChoiceFeedback(null);
      await loadScenario();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !data) {
    return (
      <div className="py-24 text-center text-slate-400 font-mono text-sm">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-400 mb-2" />
        Loading simulated practice case...
      </div>
    );
  }

  const { scenario, run, currentNode, choices, events } = data || {};

  const isTerminal = currentNode?.is_terminal || false;
  const isSuccess = currentNode?.node_type === "terminal_success";
  const isSafetyTrip = Boolean(currentNode?.is_hazardous);
  const isFailure = isTerminal && !isSuccess && !isSafetyTrip;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            <a href="/scenarios" className="hover:underline">Scenarios</a>
            <span>/</span>
            <span>Case #{scenario?.scenarioNumber}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            {scenario?.title}
          </h1>
        </div>

        {/* Score Ticker */}
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono">
          <div>
            <div className="text-[10px] text-slate-400">Practice Points</div>
            <div className="text-sm font-bold text-teal-300">{run?.totalScore || 0} pts</div>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <div className="text-[10px] text-slate-400">Safety</div>
            <div className="text-sm font-bold text-emerald-400">+{run?.safetyScore || 0}</div>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <div className="text-[10px] text-slate-400">Diagnostic</div>
            <div className="text-sm font-bold text-blue-400">+{run?.diagnosticScore || 0}</div>
          </div>
          <button
            onClick={handleRestart}
            className="border-l border-slate-800 pl-3 text-slate-400 hover:text-white"
            title="Restart scenario"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 p-3 text-xs leading-relaxed text-amber-200">
        <strong>Simulated practice only.</strong> These cases are simplified educational models, not real customer events, equipment-specific procedures, or authorization to service a device. Follow current manufacturer documentation and site safety procedures.
      </div>

      {/* Case Context Panel */}
      <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Customer Complaint
            </span>
            <p className="text-slate-200 leading-relaxed font-medium">
              \"{scenario?.customerComplaint}\"
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Scenario Scope
            </span>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
              {scenario?.equipmentContext}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Recent Changes
            </span>
            <p className="text-slate-300 leading-relaxed">
              {scenario?.recentChanges}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Alert from previous choice */}
      {choiceFeedback && (
        <div className="bg-slate-900 border border-teal-500/30 rounded-xl p-4 text-xs text-teal-300 flex items-start space-x-3 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-white text-[11px] uppercase font-mono tracking-wider">
              Evaluator Feedback:
            </div>
            <p className="leading-relaxed">{choiceFeedback}</p>
          </div>
        </div>
      )}

      {/* Active Node Decision Box */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 space-y-6 shadow-2xl transition-all ${
          isSuccess
            ? "bg-emerald-950/20 border-emerald-500/50"
            : isSafetyTrip
            ? "bg-rose-950/20 border-rose-500/50"
            : "bg-[#0B1320] border-slate-800"
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : isSafetyTrip ? (
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            ) : isFailure ? (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            ) : (
              <Wrench className="w-5 h-5 text-teal-400" />
            )}
            <h2 className="text-lg sm:text-xl font-bold text-white">{currentNode?.title}</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {currentNode?.description}
          </p>
        </div>

        {/* Choices if not terminal */}
        {!isTerminal && choices && choices.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Choose a response for this simulated case:
            </div>
            {choices.map((choice: any) => (
              <button
                key={choice.id}
                onClick={() => handleChoose(choice.choice_key)}
                disabled={submitting}
                className="w-full text-left p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 text-slate-200 hover:text-white transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <div className="pr-4 text-xs sm:text-sm font-semibold group-hover:text-teal-300 transition-colors">
                  {choice.text}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Terminal Success Actions */}
        {isSuccess && (
          <div className="pt-4 border-t border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-emerald-300 font-mono">
              ★ Practice case completed. Review the learning feedback; no real service outcome is implied.
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs"
              >
                Replay Scenario
              </button>
              <a
                href="/service-tickets"
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#070C14] font-bold text-xs flex items-center space-x-1.5 shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Open Training Service Record</span>
              </a>
            </div>
          </div>
        )}

        {/* Terminal Failure Actions */}
        {isTerminal && !isSuccess && (
          <div className={`pt-4 border-t flex items-center justify-between ${isSafetyTrip ? "border-rose-800/40" : "border-amber-800/40"}`}>
            <div className={`text-xs font-mono ${isSafetyTrip ? "text-rose-300" : "text-amber-300"}`}>
              {isSafetyTrip
                ? "⚠️ Safety path stopped. Keep the boundary in place and follow site escalation."
                : "Review the reasoning feedback and restart the simulated case if you want another attempt."}
            </div>
            <button
              onClick={handleRestart}
              className={`px-4 py-2 rounded-lg text-white font-bold text-xs ${isSafetyTrip ? "bg-rose-600 hover:bg-rose-500" : "bg-amber-600 hover:bg-amber-500"}`}
            >
              Restart Simulation
            </button>
          </div>
        )}
      </div>

      {/* Revealed Evidence Log */}
      {events && events.length > 0 && (
        <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
            <span className="font-mono text-teal-400 font-bold uppercase flex items-center space-x-1.5">
              <Eye className="w-4 h-4" />
              <span>Evidence Collected in this Diagnostic Run ({events.length} Steps)</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">Audit Trail Log</span>
          </div>

          <div className="space-y-2.5">
            {events.map((ev: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Step {idx + 1}: {ev.choice_text}</span>
                  <span
                    className={`font-bold ${
                      ev.points_delta >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {ev.points_delta >= 0 ? `+${ev.points_delta}` : ev.points_delta} pts
                  </span>
                </div>

                {ev.revealed_evidence && (
                  <div className="p-2 rounded bg-[#070C14] border border-slate-800 text-[11px] text-teal-300 font-mono">
                    <strong>[TEST RESULT]:</strong> {ev.revealed_evidence}
                  </div>
                )}
                <p className="text-[11px] text-slate-400">{ev.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
