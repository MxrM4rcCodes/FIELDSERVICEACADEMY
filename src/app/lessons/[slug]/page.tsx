"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  FileText,
  Send,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/lessons/${slug}`);
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
      loadLesson();
      setQuizAnswers({});
      setQuizResult(null);
    }
  }, [slug]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (quizResult) return; // Prevent changing after submit
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submittingQuiz) return;
    try {
      setSubmittingQuiz(true);
      const res = await fetch(`/api/lessons/${slug}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: quizAnswers }),
      });
      const result = await res.json();
      setQuizResult(result);
      await loadLesson();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteText || savingNote) return;
    try {
      setSavingNote(true);
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceType: "lesson",
          referenceId: data.lesson.id,
          title: newNoteTitle,
          noteText: newNoteText,
        }),
      });
      setNewNoteTitle("");
      setNewNoteText("");
      await loadLesson();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="py-24 text-center text-slate-400 font-mono text-sm">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-400 mb-2" />
        Loading Lesson Module...
      </div>
    );
  }

  const { lesson, blocks, sourceReference, quiz, progress, attempts, userNotes, navigation } = data || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
        <a href="/course" className="hover:text-teal-400 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Syllabus</span>
        </a>

        <div className="flex items-center space-x-4">
          {navigation?.prev && (
            <a
              href={`/lessons/${navigation.prev.slug}`}
              className="hover:text-teal-400 flex items-center space-x-1"
            >
              <span>← Day {navigation.prev.day_number}</span>
            </a>
          )}
          {navigation?.next && (
            <a
              href={`/lessons/${navigation.next.slug}`}
              className="hover:text-teal-400 flex items-center space-x-1"
            >
              <span>Day {navigation.next.day_number} →</span>
            </a>
          )}
        </div>
      </div>

      {/* Lesson Hero Header */}
      <div className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
            Day {lesson.day_number}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
            {lesson.estimated_minutes} Minutes
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono capitalize">
            Domain: {lesson.competency_domain.replace("_", " ")}
          </span>
          {progress?.status === "completed" && (
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Passed</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {lesson.title}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lesson.summary}
        </p>

        {/* Objectives & Prerequisites Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-850 text-xs">
          <div className="space-y-1.5">
            <span className="font-mono text-teal-400 font-bold uppercase text-[10px] block">
              Core Learning Objectives:
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {lesson.objectives?.map((obj: string, idx: number) => (
                <li key={idx} className="leading-snug">• {obj}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-slate-400 font-bold uppercase text-[10px] block">
              Prerequisites & Foundation:
            </span>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              {lesson.prerequisites?.map((prereq: string, idx: number) => (
                <li key={idx} className="leading-snug">• {prereq}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Teaching Sections Content Blocks */}
      <div className="space-y-6">
        {blocks?.map((block: any, idx: number) => {
          const isVisual = block.block_type === "visual_explanation";
          const isField = block.block_type === "field_example";
          const isPractice = block.block_type === "interactive_practice";
          const isSummary = block.block_type === "summary_review";

          let cardStyle = "bg-[#0F1A2E] border-slate-800";
          if (isField) cardStyle = "bg-[#111E33] border-blue-500/30";
          if (isPractice) cardStyle = "bg-[#132438] border-teal-500/40";
          if (isSummary) cardStyle = "bg-[#0D182B] border-slate-700";

          return (
            <div
              key={block.id}
              className={`rounded-2xl border p-6 sm:p-8 space-y-4 shadow-xl ${cardStyle}`}
            >
              <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
                {isField && <Sparkles className="w-4 h-4 text-blue-400" />}
                {isPractice && <HelpCircle className="w-4 h-4 text-teal-400" />}
                {isSummary && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {!isField && !isPractice && !isSummary && (
                  <BookOpen className="w-4 h-4 text-slate-400" />
                )}
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {block.section_title}
                </h2>
              </div>

              {/* Formatted Markdown Content */}
              <div className="prose prose-invert prose-slate max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                {block.content_markdown.split("\n\n").map((para: string, pIdx: number) => {
                  if (para.startsWith("```")) {
                    return (
                      <pre
                        key={pIdx}
                        className="bg-[#070C14] border border-slate-800 p-4 rounded-xl font-mono text-[11px] overflow-x-auto text-teal-300"
                      >
                        {para.replace(/```[a-z]*\n?/g, "")}
                      </pre>
                    );
                  }
                  if (para.startsWith("### ")) {
                    return (
                      <h3 key={pIdx} className="text-base font-bold text-white pt-2">
                        {para.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (para.startsWith("- ") || para.startsWith("* ")) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1">
                        {para.split("\n").map((line: string, lIdx: number) => (
                          <li key={lIdx}>{line.replace(/^[-*]\s*/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={pIdx} className="leading-relaxed">
                      {para}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Source / Confidence Reference Box */}
      {sourceReference && (
        <div className="bg-[#070C14] border border-slate-800 rounded-xl p-4 text-xs space-y-1.5 font-mono">
          <div className="text-[10px] uppercase text-slate-400 font-bold flex items-center justify-between">
            <span>Authoritative Source & Reference Spec</span>
            <span className="text-teal-400">Status: {sourceReference.confidence_level}</span>
          </div>
          <div className="font-semibold text-slate-200">{sourceReference.title}</div>
          <div className="text-[11px] text-slate-400">{sourceReference.citation}</div>
          <p className="text-[11px] text-slate-500 font-sans italic">{sourceReference.notes}</p>
        </div>
      )}

      {/* Knowledge Check Quiz Section */}
      {quiz && quiz.length > 0 && (
        <div className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase">
                <Award className="w-4 h-4" />
                <span>Section Knowledge Check</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Diagnostic Assessment (5 Questions)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Passing standard: 80% (4 of 5 correct)
            </span>
          </div>

          {/* Targeted Recommendation Banner if missed */}
          {quizResult?.targetedRecommendation && (
            <div className="bg-amber-950/20 border border-amber-600/40 rounded-xl p-4 text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center space-x-1.5 font-mono uppercase text-[11px]">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{quizResult.targetedRecommendation.title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {quizResult.targetedRecommendation.guidance}
              </p>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {quiz.map((q: any, qIdx: number) => {
              const selectedOptId = quizAnswers[q.id];
              const evalInfo = quizResult?.evaluatedAnswers?.find((ea: any) => ea.questionId === q.id);

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-850 space-y-3 text-xs"
                >
                  <div className="font-bold text-sm text-white flex items-start space-x-2">
                    <span className="text-teal-400 font-mono">Q{qIdx + 1}.</span>
                    <span>{q.question_text}</span>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {q.options?.map((opt: any) => {
                      const isSelected = selectedOptId === opt.id;
                      let optionStyle = "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850";

                      if (quizResult) {
                        if (opt.is_correct) {
                          optionStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold";
                        } else if (isSelected && !opt.is_correct) {
                          optionStyle = "bg-rose-950/60 border-rose-500 text-rose-200";
                        }
                      } else if (isSelected) {
                        optionStyle = "bg-teal-500/20 border-teal-500 text-white font-medium";
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={Boolean(quizResult)}
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <span className="pr-3 leading-snug">{opt.option_text}</span>
                          {quizResult && opt.is_correct && (
                            <span className="text-emerald-400 font-bold shrink-0 text-[10px] font-mono">
                              ✓ Correct
                            </span>
                          )}
                          {quizResult && isSelected && !opt.is_correct && (
                            <span className="text-rose-400 font-bold shrink-0 text-[10px] font-mono">
                              ✗ Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {evalInfo && (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <span className="font-mono text-teal-400 font-bold block uppercase text-[10px]">
                        Diagnostic Rationale:
                      </span>
                      <p className="leading-relaxed">{evalInfo.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Results Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {quizResult ? (
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between">
                <span
                  className={`text-sm font-bold font-mono ${
                    quizResult.passed ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  Score: {quizResult.score} / {quizResult.totalQuestions} ({quizResult.percentage}%) •{" "}
                  {quizResult.passed ? "PASSED" : "REVIEW NEEDED"}
                </span>
                <button
                  onClick={() => {
                    setQuizResult(null);
                    setQuizAnswers({});
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Retry Knowledge Check
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submittingQuiz || Object.keys(quizAnswers).length < quiz.length}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {submittingQuiz
                    ? "Evaluating..."
                    : `Submit Knowledge Check (${Object.keys(quizAnswers).length}/${quiz.length} Answered)`}
                </span>
              </button>
            )}

            {/* Next Lesson Button */}
            {navigation?.next && (
              <a
                href={`/lessons/${navigation.next.slug}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <span>Continue to Day {navigation.next.day_number}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* User Notes Section */}
      <div className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-slate-850 pb-3">
          <FileText className="w-4 h-4 text-teal-400" />
          <span>Personal Field Notes for Day {lesson.day_number}</span>
        </div>

        {/* Existing Notes */}
        {userNotes && userNotes.length > 0 && (
          <div className="space-y-2">
            {userNotes.map((n: any) => (
              <div key={n.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-slate-200">{n.title}</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{n.note_text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Note Form */}
        <form onSubmit={handleSaveNote} className="space-y-3 pt-2 text-xs">
          <input
            type="text"
            required
            placeholder="Note title (e.g. Sub-tank vacuum spec)..."
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-750 rounded-lg p-2.5 text-white placeholder-slate-500"
          />
          <textarea
            rows={2}
            required
            placeholder="Write key takeaways, field tips, or interview points..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="w-full bg-slate-900 border border-slate-750 rounded-lg p-2.5 text-white placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={savingNote}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            {savingNote ? "Saving..." : "Save Note to Database"}
          </button>
        </form>
      </div>
    </div>
  );
}
