"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Award,
  Layers,
  Volume2,
} from "lucide-react";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Terms" },
    { id: "printer_hardware", label: "Printer Hardware (10)" },
    { id: "inkjet_defects", label: "Inkjet Defects (8)" },
    { id: "color_science", label: "Color Science (10)" },
    { id: "scanning", label: "METIS Scanning (8)" },
    { id: "rip_networking", label: "RIP & Networking (8)" },
    { id: "safety", label: "Safety & LOTO (8)" },
    { id: "oris_products", label: "ORIS Products (8)" },
    { id: "customer_service", label: "Customer Service (6)" },
  ];

  const loadCards = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/flashcards", window.location.origin);
      if (category !== "all") url.searchParams.set("category", category);
      if (searchQuery.trim()) url.searchParams.set("q", searchQuery.trim());

      const res = await fetch(url.toString());
      const data = await res.json();
      setCards(data.flashcards || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, [category, searchQuery]);

  const handleReview = async (cardId: string, isCorrect: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setUpdatingId(cardId);
      await fetch("/api/flashcards/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcardId: cardId, isCorrect }),
      });
      await loadCards();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleFlip = (id: string) => {
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Mastery Flashcards & Technical Glossary</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            66 Core Industrial Printing Concepts
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Hardware, defect isolation, CIELAB colorimetry, METIS optics, OSHA safety, and ORIS applications. Click any card to flip. Database-backed Leitner spaced repetition.
          </p>
        </div>

        {/* Stats Pill */}
        {stats && (
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono">
            <div>
              <span className="text-slate-400">Total: </span>
              <strong className="text-white">{stats.total}</strong>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-emerald-400">Mastered: </span>
              <strong className="text-emerald-300">{stats.mastered}</strong>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-amber-400">Learning: </span>
              <strong className="text-amber-300">{stats.learning}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                category === c.id
                  ? "bg-teal-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search 66 terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Flashcards Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 font-mono text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
          Loading Flashcards...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const isFlipped = flippedCardId === card.id;
            const isMastered = card.mastery_level >= 3;

            return (
              <div
                key={card.id}
                onClick={() => toggleFlip(card.id)}
                className="cursor-pointer group relative min-h-[290px] rounded-2xl transition-all duration-300 transform perspective-1000"
              >
                {/* Front of Card */}
                {!isFlipped ? (
                  <div className="w-full h-full bg-[#0F1A2E] hover:bg-[#13223D] border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {card.category.replace("_", " ")}
                        </span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <span
                              key={lvl}
                              className={`w-1.5 h-1.5 rounded-full ${
                                lvl <= card.mastery_level ? "bg-teal-400" : "bg-slate-800"
                              }`}
                            ></span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                          {card.term}
                        </h3>
                        {card.pronunciation && (
                          <div className="text-[11px] font-mono text-slate-400 italic">
                            /{card.pronunciation}/
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {card.definition}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Click to flip card ➔</span>
                      {isMastered && (
                        <span className="text-emerald-400 flex items-center space-x-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mastered (Lvl {card.mastery_level})</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Back of Card */
                  <div className="w-full h-full bg-[#0B1320] border border-teal-500/60 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-teal-300 font-mono text-[11px] uppercase">
                          Field Context & Takeaway
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Back</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                          Operational Field Context:
                        </span>
                        <p className="text-slate-200 text-[11px] leading-relaxed">
                          {card.field_context}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-teal-400 font-bold block">
                          Key Technical Takeaway:
                        </span>
                        <p className="text-teal-200 text-[11px] leading-relaxed">
                          {card.key_takeaway}
                        </p>
                      </div>

                      <div className="space-y-1 bg-rose-950/20 border border-rose-900/40 p-2.5 rounded-lg">
                        <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                          Common Misconception:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {card.common_misconception}
                        </p>
                      </div>
                    </div>

                    {/* Review Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => handleReview(card.id, false, e)}
                        disabled={updatingId === card.id}
                        className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium"
                      >
                        Needs Review
                      </button>
                      <button
                        onClick={(e) => handleReview(card.id, true, e)}
                        disabled={updatingId === card.id}
                        className="flex-1 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
                      >
                        ✓ Mark Known
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
