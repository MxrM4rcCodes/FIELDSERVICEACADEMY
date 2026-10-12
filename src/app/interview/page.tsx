"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Send,
  HelpCircle,
  FileText,
  Award,
} from "lucide-react";

export default function InterviewStudioPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/interview");
      const json = await res.json();
      setQuestions(json.questions || []);
      setAttempts(json.attempts || []);
      if (json.questions && json.questions.length > 0 && !selectedQuestion) {
        setSelectedQuestion(json.questions[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitResponse = async () => {
    if (!selectedQuestion || !userAnswer.trim() || submitting) return;
    try {
      setSubmitting(true);
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          userAnswer: userAnswer.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEvaluationResult(data);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>Field Service Technical & STAR Interview Studio</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Interactive Interview Preparation & Simulator
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Structured 5-dimensional rubric scoring across Technical Reasoning (20%), Safety Mindset (20%), Customer Communication (20%), Verification/Documentation (20%), and Clarity (20%). Includes model answers and honest transferable skills framing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Question Selector & Transferable Skill Guide (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F1A2E] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              Select Question ({questions.length})
            </h2>

            <div className="space-y-2">
              {questions.map((q) => {
                const isSelected = selectedQuestion?.id === q.id;
                const hasAttempt = attempts.some((a) => a.question_id === q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestion(q);
                      setUserAnswer("");
                      setEvaluationResult(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? "bg-teal-500/15 border-teal-500 text-white font-semibold ring-1 ring-teal-500/30"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase mb-1">
                      <span>{q.category}</span>
                      {hasAttempt && <span className="text-emerald-400 font-bold">✓ Practiced</span>}
                    </div>
                    <div className="line-clamp-2 leading-snug">{q.question_text}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transferable Skills Tip Box */}
          {selectedQuestion && (
            <div className="bg-[#070C14] border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transferable Skills Coaching</span>
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedQuestion.transferable_skills_tips}
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Active Question & Interactive Response Station (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedQuestion ? (
            <div className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-bold">
                    {selectedQuestion.category.toUpperCase()} • {selectedQuestion.difficulty.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Domain: {selectedQuestion.competency_domain}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {selectedQuestion.question_text}
                </h2>
              </div>

              {/* Response Input Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">Type or dictate your verbal practice response:</span>
                  <span className="font-mono text-[11px]">{userAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Structure your answer using specific technical concepts, safe diagnostic isolation, customer communication, and quantitative verification..."
                  className="w-full bg-[#070C14] border border-slate-750 rounded-xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed font-sans"
                />
                <button
                  onClick={handleSubmitResponse}
                  disabled={submitting || userAnswer.trim().length < 10}
                  className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Evaluating Rubric..." : "Submit for Structured Evaluation"}</span>
                </button>
              </div>

              {/* Evaluation Rubric Results */}
              {evaluationResult && (
                <div className="bg-slate-900/90 border border-teal-500/40 rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2 text-white font-bold text-sm">
                      <Award className="w-4 h-4 text-teal-400" />
                      <span>Evaluation Rubric Results</span>
                    </div>
                    <span className="text-xl font-black font-mono text-teal-300">
                      {evaluationResult.scores.total} / 100 pts
                    </span>
                  </div>

                  {/* 5-Dimensional Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Technical</div>
                      <div className="text-white font-bold">{evaluationResult.scores.technical}/20</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Safety</div>
                      <div className="text-white font-bold">{evaluationResult.scores.safety}/20</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Customer</div>
                      <div className="text-white font-bold">{evaluationResult.scores.communication}/20</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Verification</div>
                      <div className="text-white font-bold">{evaluationResult.scores.verification}/20</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-slate-400">Clarity</div>
                      <div className="text-white font-bold">{evaluationResult.scores.clarity}/20</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#070C14] p-3 rounded-lg border border-slate-800">
                    {evaluationResult.feedback}
                  </p>

                  {/* Model Answer Toggle/Display */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-teal-400 font-bold block">
                      CGS ORIS Benchmark Model Answer:
                    </span>
                    <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-lg border border-slate-800 leading-relaxed font-sans">
                      {evaluationResult.modelAnswer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 italic text-xs">
              Select an interview question on the left to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
