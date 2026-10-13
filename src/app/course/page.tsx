"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Zap,
} from "lucide-react";

function CourseContent() {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track") || "course_14";

  const [activeTrack, setActiveTrack] = useState<string>(trackParam);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/lessons?track=${activeTrack}`)
      .then((res) => res.json())
      .then((data) => {
        setLessons(data.lessons || []);
      })
      .finally(() => setLoading(false));
  }, [activeTrack]);

  const completedCount = lessons.filter((l) => l.status === "completed").length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Title & Track Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Structured Technical Curriculum</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            {activeTrack === "bootcamp"
              ? "Track A: 3-Day Interview Bootcamp"
              : "Track B: Full 14-Day Technical Course"}
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            {activeTrack === "bootcamp"
              ? "A short, independent interview-preparation path covering product-family research, safe fault reasoning, and truthful response practice."
              : "Self-paced lessons on industrial imaging workflows, equipment concepts, safety reasoning, measurement, documentation, and interview practice. Product-specific work requires current authorized documentation."}
          </p>
        </div>

        {/* Track Switcher */}
        <div className="inline-flex rounded-lg p-1 bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTrack("course_14")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTrack === "course_14" ? "bg-teal-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Full 14-Day Course
          </button>
          <button
            onClick={() => setActiveTrack("bootcamp")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTrack === "bootcamp" ? "bg-teal-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            3-Day Bootcamp
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-medium">Track Completion Status</div>
          <div className="text-sm font-bold text-white flex items-center space-x-2">
            <span>{completedCount} of {lessons.length} Modules Completed</span>
            <span className="text-slate-500">•</span>
            <span className="text-teal-400 font-mono font-bold">{progressPercent}%</span>
          </div>
        </div>

        <div className="w-full sm:w-64 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          ></div>
        </div>
      </div>

      {/* Lesson List */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 font-mono text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
          Loading Curriculum Syllabus...
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((les) => {
            const isCompleted = les.status === "completed";
            const isInProgress = les.status === "in_progress";

            return (
              <a
                key={les.id}
                href={`/lessons/${les.slug}`}
                className="group bg-[#0F1A2E] hover:bg-[#13223D] border border-slate-800 hover:border-teal-500/50 rounded-xl p-4 sm:p-5 transition-all shadow-md flex items-center justify-between"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  {/* Day Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono font-bold shrink-0 text-xs ${
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : isInProgress
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    <span className="text-[9px] uppercase leading-none opacity-80">
                      {activeTrack === "bootcamp" ? "Boot" : "Day"}
                    </span>
                    <span className="text-sm leading-tight">
                      {activeTrack === "bootcamp" ? les.bootcamp_day_number : les.day_number}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                        {les.title}
                      </h3>
                      {activeTrack === "bootcamp" && (
                        <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                          (Course Day {les.day_number})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                      {les.summary}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{les.estimated_minutes} min</span>
                      </span>
                      <span>•</span>
                      <span className="capitalize text-slate-400">
                        {les.competency_domain.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Pill & Arrow */}
                <div className="flex items-center space-x-3 shrink-0 ml-4">
                  {isCompleted && (
                    <span className="inline-flex items-center space-x-1 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Completed</span>
                    </span>
                  )}
                  {isInProgress && (
                    <span className="text-xs font-mono text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/40 font-semibold">
                      In Progress
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CoursePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<div className="text-slate-400 py-12 text-center font-mono text-xs">Loading course syllabus...</div>}>
        <CourseContent />
      </Suspense>
    </div>
  );
}
