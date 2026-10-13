"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  RefreshCw,
  Search,
} from "lucide-react";

export default function ScenariosIndexPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/scenarios")
      .then((res) => res.json())
      .then((data) => {
        if (data.scenarios) {
          setScenarios(data.scenarios);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredScenarios = scenarios.filter((s) => {
    if (filter === "all") return true;
    return s.difficulty === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>Branching Diagnostic Simulator</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            10 Simulated Practice Cases
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Synthetic branching exercises for safe diagnostic reasoning. Cases are simplified learning models, not service procedures or records of real customer events.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-2 no-print text-xs">
          <span className="font-mono text-slate-400 text-[10px] uppercase font-bold">Difficulty:</span>
          {["all", "basic", "intermediate", "advanced"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors font-medium ${
                filter === lvl
                  ? "bg-teal-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 font-mono text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
          Loading simulation cases...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScenarios.map((scn) => {
            const hasRun = scn.run_status !== null;
            const isCompleted = scn.run_status === "completed_success";
            const isSafetyFail = scn.run_status === "failed_safety";

            return (
              <a
                key={scn.id}
                href={`/scenarios/${scn.slug}`}
                className="group bg-[#0F1A2E] hover:bg-[#13223D] border border-slate-800 hover:border-teal-500/50 rounded-xl p-5 transition-all shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded bg-slate-900 border border-slate-700 text-teal-400 font-mono text-xs font-bold flex items-center justify-center">
                        {scn.scenario_number}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {scn.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        scn.difficulty === "advanced"
                          ? "bg-purple-950/60 text-purple-300 border border-purple-800/40"
                          : scn.difficulty === "intermediate"
                          ? "bg-blue-950/60 text-blue-300 border border-blue-800/40"
                          : "bg-teal-950/60 text-teal-300 border border-teal-800/40"
                      }`}
                    >
                      {scn.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {scn.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    <strong>Complaint:</strong> {scn.customer_complaint}
                  </p>

                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    Hardware: {scn.equipment_context}
                  </div>
                </div>

                {/* Footer Status */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  {isCompleted ? (
                    <span className="inline-flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolved (Score: {scn.total_score} pts)</span>
                    </span>
                  ) : isSafetyFail ? (
                    <span className="inline-flex items-center space-x-1.5 text-rose-400 font-mono text-[11px] font-semibold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Safety Violation Trip</span>
                    </span>
                  ) : hasRun ? (
                    <span className="text-amber-400 font-mono text-[11px]">
                      In Progress ({scn.total_score} pts)
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono text-[11px]">Not Attempted</span>
                  )}

                  <div className="flex items-center space-x-1 text-teal-400 font-semibold group-hover:translate-x-1 transition-transform text-xs">
                    <span>Launch Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
