"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  BookOpen,
  Award,
  Wrench,
  HelpCircle,
  FileText,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lesson Edit State
  const [selectedLessonId, setSelectedLessonId] = useState("les_day_01");
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editMinutes, setEditMinutes] = useState(90);
  const [savingLesson, setSavingLesson] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin");
      if (!res.ok) {
        if (res.status === 403) {
          setError("Access Denied: You must be logged in as an Administrator (e.g. admin@cgs-oris.academy). Use the top-right Quick Role Switcher to switch to Admin mode.");
        } else {
          setError("Failed to load admin data.");
        }
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Admin failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingLesson) return;
    try {
      setSavingLesson(true);
      setSaveSuccess(false);
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_lesson",
          entityType: "lesson",
          entityId: selectedLessonId,
          payload: {
            title: editTitle,
            summary: editSummary,
            estimatedMinutes: editMinutes,
          },
          diffSummary: `Updated lesson ${selectedLessonId} title and summary`,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingLesson(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 font-mono text-sm">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-2" />
        Verifying Administrative Credentials & Access Control...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-600/40 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white">403 Unauthorized: Admin Access Restricted</h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
          {error}
        </p>
        <div className="pt-2">
          <a
            href="/"
            className="inline-block px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Return to Candidate Dashboard
          </a>
        </div>
      </div>
    );
  }

  const { stats, users, revisions } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Master Content Administration & Security</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Curriculum Administration Console
          </h1>
          <p className="text-xs text-slate-400">
            Server-enforced administrative oversight. Revise lessons, edit quiz questions, manage scenarios, audit user accounts, and track content revisions.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-700/60 text-purple-300 font-mono text-xs font-bold uppercase">
          Administrator Active
        </span>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px]">Users</div>
          <div className="text-lg font-bold text-white mt-0.5">{stats?.users}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px]">Lessons</div>
          <div className="text-lg font-bold text-teal-400 mt-0.5">{stats?.lessons}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px]">Questions</div>
          <div className="text-lg font-bold text-blue-400 mt-0.5">{stats?.quizQuestions}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px]">Scenarios</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">{stats?.scenarios}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px]">Flashcards</div>
          <div className="text-lg font-bold text-purple-400 mt-0.5">{stats?.flashcards}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px]">Tickets</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">{stats?.serviceTickets}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Quick Lesson Editor (6 cols) */}
        <div className="lg:col-span-6 bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base border-b border-slate-850 pb-3">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span>Curriculum Lesson Editor</span>
          </div>

          <form onSubmit={handleUpdateLesson} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Select Lesson to Edit:</label>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              >
                {Array.from({ length: 14 }).map((_, i) => (
                  <option key={i} value={`les_day_${String(i + 1).padStart(2, "0")}`}>
                    Day {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Revised Title:</label>
              <input
                type="text"
                required
                placeholder="Lesson Title..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Revised Summary:</label>
              <textarea
                rows={3}
                required
                placeholder="Executive summary of lesson..."
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Estimated Minutes:</label>
              <input
                type="number"
                value={editMinutes}
                onChange={(e) => setEditMinutes(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Lesson updated and revision logged in audit trail!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={savingLesson}
              className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
            >
              {savingLesson ? "Saving..." : "Commit Lesson Revision"}
            </button>
          </form>
        </div>

        {/* Right: Content Revision Log & User Accounts (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Revisions Audit Log */}
          <div className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              Content Revision Audit Trail
            </h2>

            {revisions && revisions.length > 0 ? (
              <div className="space-y-2 text-xs">
                {revisions.map((rev: any) => (
                  <div key={rev.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{rev.entity_type.toUpperCase()} • {rev.entity_id}</span>
                      <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] font-medium">{rev.diff_summary}</p>
                    <div className="text-[10px] text-teal-400 font-mono">By: {rev.author_name || "Admin"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No revisions logged yet.</p>
            )}
          </div>

          {/* User Account Registry */}
          <div className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              Registered Candidate Accounts ({users?.length || 0})
            </h2>

            <div className="space-y-2 text-xs">
              {users?.map((u: any) => (
                <div key={u.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{u.full_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      u.role === "admin"
                        ? "bg-purple-950/80 text-purple-300 border border-purple-800"
                        : "bg-teal-950/80 text-teal-300 border border-teal-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
