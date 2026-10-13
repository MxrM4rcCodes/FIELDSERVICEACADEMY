"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Award,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Flame,
  Activity,
  Zap,
  Target,
  Edit2,
  RefreshCw,
  Cpu,
  Palette,
  Camera,
  Layers,
  Wrench,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [targetDateInput, setTargetDateInput] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
      if (json.targetInterviewDate) {
        setTargetDateInput(json.targetInterviewDate.split("T")[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleUpdateDate = async () => {
    try {
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetInterviewDate: targetDateInput }),
      });
      setIsEditingDate(false);
      loadDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrackSwitch = async (newTrack: string) => {
    try {
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeTrack: newTrack }),
      });
      loadDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm font-mono">Loading Candidate Operations Center...</p>
        </div>
      </div>
    );
  }

  const {
    daysRemaining,
    targetInterviewDate,
    activeTrack,
    overallProgressPercent,
    completedCount,
    totalLessons,
    nextLesson,
    lessons,
    competencies,
    weakestDomain,
    recommendedAction,
    recentNotes,
    recentQuizAttempts,
    recentScenarioRuns,
    studyHistory,
  } = data || {};

  const domainLabels: Record<string, { label: string; icon: any; color: string }> = {
    hardware_safety: { label: "Hardware, Motion & Safety", icon: Cpu, color: "teal" },
    color_oris: { label: "Color Science & ORIS Suite", icon: Palette, color: "blue" },
    metis_scanning: { label: "METIS Material Scanning", icon: Camera, color: "purple" },
    customer_docs: { label: "Customer Service & Ticketing", icon: FileText, color: "emerald" },
    company_interview: { label: "Company & STAR Interview", icon: Target, color: "amber" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero / Candidate Status Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F1A2E] via-[#13223D] to-[#0F1A2E] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>Independent technical learning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Field Service Academy
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Independent study of industrial imaging workflows, color measurement, safe diagnostic reasoning, technical documentation, and customer communication.
            </p>
          </div>

          {/* Countdown Card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0B1320]/80 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl">
            <div className="text-center sm:text-right">
              <div className="flex items-center justify-center sm:justify-end space-x-1.5 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Target Interview Date</span>
                <button
                  onClick={() => setIsEditingDate(!isEditingDate)}
                  className="text-slate-400 hover:text-white p-0.5"
                  title="Edit date"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>

              {isEditingDate ? (
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="date"
                    value={targetDateInput}
                    onChange={(e) => setTargetDateInput(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                  <button
                    onClick={handleUpdateDate}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-300 font-medium">
                  {targetInterviewDate ? new Date(`${String(targetInterviewDate).slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }) : "Not set"}
                </div>
              )}
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="text-2xl font-black font-mono text-teal-300 leading-none">
                  {daysRemaining === null ? "—" : daysRemaining}
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Days Remaining
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Selection Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold">Active Track:</span>
            <div className="inline-flex rounded-lg p-1 bg-slate-900 border border-slate-800">
              <button
                onClick={() => handleTrackSwitch("course_14")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTrack === "course_14"
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Track B: Full 14-Day Technical Course
              </button>
              <button
                onClick={() => handleTrackSwitch("bootcamp")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTrack === "bootcamp"
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Track A: 3-Day Interview Bootcamp
              </button>
            </div>
          </div>

          {/* Quick Resume Button */}
          {nextLesson && (
            <a
              href={`/lessons/${nextLesson.slug}`}
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold text-xs tracking-wide shadow-lg shadow-teal-500/25 hover:from-teal-400 hover:to-blue-500 transition-all group"
            >
              <span>Resume Learning: {activeTrack === "bootcamp" ? `Bootcamp Day ${nextLesson.bootcamp_day_number}` : `Day ${nextLesson.day_number}`}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </div>

      {/* Adaptive Recommendation Engine Banner */}
      {recommendedAction && (
        <div className="bg-gradient-to-r from-teal-950/40 via-[#0F1E33] to-blue-950/40 border border-teal-500/30 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5 text-teal-300" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                  Adaptive Recommendation
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-medium">Targeted Practice Review</span>
              </div>
              <h3 className="text-sm font-bold text-white">{recommendedAction.title}</h3>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                {recommendedAction.reason}
              </p>
            </div>
          </div>
          <a
            href={
              recommendedAction.type === "scenario"
                ? `/scenarios/${recommendedAction.slug}`
                : `/lessons/${recommendedAction.slug}`
            }
            className="shrink-0 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#070C14] font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-md"
          >
            <span>Start Activity</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Grid: Course Progress & Competency Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Overall Progress & Recent Lessons */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview Card */}
          <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Course Progression</h2>
                <p className="text-xs text-slate-400">
                  {completedCount} of {totalLessons} lessons passed in this track
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-teal-400">
                  {overallProgressPercent}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${overallProgressPercent}%` }}
              ></div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t border-slate-850 pt-4 text-xs">
              <div>
                <div className="text-slate-400 text-[11px]">Completed</div>
                <div className="text-white font-bold font-mono text-sm">{completedCount} Lessons</div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">In Progress</div>
                <div className="text-amber-400 font-bold font-mono text-sm">
                  {lessons?.filter((l: any) => l.status === "in_progress").length || 0}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Remaining</div>
                <div className="text-slate-300 font-bold font-mono text-sm">
                  {totalLessons - completedCount} Lessons
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Lesson Timeline */}
          <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>
                  {activeTrack === "bootcamp" ? "Bootcamp 3-Day Syllabus" : "Full 14-Day Syllabus"}
                </span>
              </h2>
              <a href="/course" className="text-xs text-teal-400 hover:text-teal-300 font-medium">
                View Full Syllabus →
              </a>
            </div>

            <div className="space-y-2.5">
              {lessons
                ?.filter((l: any) => activeTrack !== "bootcamp" || l.bootcamp_day_number !== null)
                .slice(0, 7)
                .map((lesson: any) => {
                  const isCompleted = lesson.status === "completed";
                  const isInProgress = lesson.status === "in_progress";

                  return (
                    <a
                      key={lesson.id}
                      href={`/lessons/${lesson.slug}`}
                      className="group flex items-center justify-between p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                            isCompleted
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : isInProgress
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {lesson.day_number}
                        </div>
                        <div>
                          <div className="text-slate-200 group-hover:text-teal-300 font-medium transition-colors">
                            {lesson.title}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                            <span>{lesson.estimated_minutes} mins</span>
                            <span>•</span>
                            <span className="capitalize text-slate-400">
                              {lesson.competency_domain.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Passed</span>
                          </span>
                        )}
                        {isInProgress && (
                          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                            In Progress
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Persisted Study History */}
          <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2"><Clock className="h-4 w-4 text-teal-400" /> Study History</h2>
                <p className="text-[11px] text-slate-400">Saved activity from this account</p>
              </div>
              <div className="text-right font-mono">
                <div className="text-lg font-bold text-teal-300">
                  {Math.floor((Number(studyHistory?.study_seconds) || 0) / 3600)}h {Math.floor(((Number(studyHistory?.study_seconds) || 0) % 3600) / 60)}m
                </div>
                <div className="text-[10px] text-slate-500">tracked reading time</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 border-y border-slate-800 py-3 text-center">
              <div><div className="text-lg font-bold text-white">{studyHistory?.completed_lessons || 0}</div><div className="text-[10px] text-slate-500">Passed lessons</div></div>
              <div><div className="text-lg font-bold text-white">{studyHistory?.quiz_attempts || 0}</div><div className="text-[10px] text-slate-500">Quiz attempts</div></div>
              <div><div className="text-lg font-bold text-white">{recentScenarioRuns?.length || 0}</div><div className="text-[10px] text-slate-500">Recent scenario runs</div></div>
            </div>
            {recentQuizAttempts?.length ? (
              <div className="space-y-2">
                <h3 className="text-[10px] font-mono uppercase font-bold text-slate-400">Recent knowledge checks</h3>
                {recentQuizAttempts.slice(0, 3).map((attempt: any) => (
                  <a key={attempt.id} href={`/lessons/${lessons?.find((item: any) => item.day_number === attempt.day_number)?.slug || "course"}`} className="flex items-center justify-between gap-3 rounded-lg bg-slate-900/60 px-3 py-2 text-xs hover:bg-slate-800">
                    <span className="truncate text-slate-300">Day {attempt.day_number}: {attempt.lesson_title}</span>
                    <span className={`shrink-0 font-mono font-bold ${attempt.passed ? "text-emerald-400" : "text-amber-300"}`}>{attempt.score}/{attempt.total_questions}</span>
                  </a>
                ))}
              </div>
            ) : <p className="text-xs text-slate-500">No submitted knowledge checks yet. Reading progress is recorded as you study.</p>}
          </div>
        </div>

        {/* Right Col: Competency Breakdown & Saved Notes */}
        <div className="space-y-6">
          {/* Competency Breakdown Card */}
          <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Award className="w-4 h-4 text-teal-400" />
                  <span>Practice Scores by Domain</span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Saved assessment averages; not a field qualification
                </p>
                <p className="text-[10px] text-slate-500">Course focus weights describe curriculum emphasis, not learner ratings.</p>
              </div>
            </div>

            <div className="space-y-4">
              {competencies?.map((comp: any) => {
                const info = domainLabels[comp.domain] || {
                  label: comp.domain,
                  icon: Activity,
                  color: "teal",
                };
                const Icon = info.icon;
                const hasEvidence = Number(comp.total_evaluations) > 0;
                const score = hasEvidence ? parseFloat(comp.observed_score) : 0;
                const weight = parseFloat(comp.weight_percentage);

                return (
                  <div key={comp.domain} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[170px]">{info.label}</span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono">
                        <span className="text-[10px] text-slate-500 font-normal">
                          course focus: {weight}%
                        </span>
                        <span className="text-white font-bold">{hasEvidence ? `${score}%` : "Not assessed"}</span>
                      </div>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          score >= 70
                            ? "bg-emerald-500"
                            : score >= 40
                            ? "bg-teal-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${hasEvidence ? score : 0}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Lowest recorded practice score:</span>
              <span className="font-mono text-amber-400 uppercase font-semibold">
                {weakestDomain ? weakestDomain.replaceAll("_", " ") : "Awaiting assessment"}
              </span>
            </div>
          </div>

          {/* Recent Study Notes Widget */}
          <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Saved Field Notes</span>
              </h2>
            </div>

            {recentNotes && recentNotes.length > 0 ? (
              <div className="space-y-2.5">
                {recentNotes.slice(0, 3).map((note: any) => (
                  <div
                    key={note.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="font-semibold text-slate-200">{note.title}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {note.note_text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No saved notes yet. You can save notes inside any lesson, scenario, or diagram.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
