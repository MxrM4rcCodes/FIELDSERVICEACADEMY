"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  BookOpen,
  GitBranch,
  Layers,
  Cpu,
  Palette,
  Camera,
  FileText,
  Printer,
  Sparkles,
  Shield,
  HelpCircle,
  Menu,
  X,
  User,
  ArrowRightLeft,
  ChevronDown,
  Activity,
  Zap,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    fullName: string;
    role: "admin" | "learner";
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleRoleSwitch = async (targetRole: "admin" | "learner") => {
    try {
      const res = await fetch("/api/auth/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      if (res.ok) {
        setUserDropdown(false);
        router.refresh();
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { href: "/", label: "Dashboard", icon: Activity },
    { href: "/course?track=bootcamp", label: "Bootcamp", icon: Zap },
    { href: "/course", label: "14-Day Course", icon: BookOpen },
    { href: "/systems-map", label: "Systems Map", icon: GitBranch },
    { href: "/printer-lab", label: "Printer Lab", icon: Cpu },
    { href: "/troubleshooting", label: "Decision Tree", icon: Layers },
    { href: "/scenarios", label: "Scenarios (10)", icon: Wrench },
    { href: "/color-lab", label: "Color Lab", icon: Palette },
    { href: "/oris", label: "ORIS Explorer", icon: Sparkles },
    { href: "/metis", label: "METIS Lab", icon: Camera },
    { href: "/flashcards", label: "Flashcards", icon: HelpCircle },
    { href: "/interview", label: "Interview Studio", icon: User },
    { href: "/service-tickets", label: "Service Tickets", icon: FileText },
    { href: "/print-center", label: "Print Center", icon: Printer },
  ];

  if (currentUser?.role === "admin") {
    navLinks.push({ href: "/admin", label: "Admin Console", icon: Shield });
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0B1320]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 no-print">
      {/* Top Banner */}
      <div className="bg-[#070C14] px-4 py-1 border-b border-slate-850 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="font-mono text-teal-400 font-semibold tracking-wider">CGS ORIS AMERICAS</span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">Operations Hub: Plymouth, Minnesota Depot</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 hidden md:inline">
            Field Service Readiness & Technical Certification
          </span>
          {currentUser && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider ${
                currentUser.role === "admin"
                  ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                  : "bg-teal-900/50 text-teal-300 border border-teal-700/50"
              }`}
            >
              {currentUser.role}
            </span>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <a href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-[#0B1320] rounded-[7px] flex items-center justify-center">
              <Wrench className="w-5 h-5 text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center space-x-1.5">
              <span>CGS ORIS</span>
              <span className="text-teal-400 font-light">FIELD SERVICE</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                ACADEMY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Learn the Systems. Diagnose the Faults. Master the Workflow.
            </p>
          </div>
        </a>

        {/* Desktop Quick Nav (Major categories) */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
          <a
            href="/"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Dashboard
          </a>
          <a
            href="/course"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname.startsWith("/course") || pathname.startsWith("/lessons")
                ? "bg-slate-800 text-teal-400"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Courses
          </a>
          <a
            href="/systems-map"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/systems-map" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Systems Map
          </a>
          <a
            href="/printer-lab"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/printer-lab" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Printer Lab
          </a>
          <a
            href="/troubleshooting"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/troubleshooting" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Decision Tree
          </a>
          <a
            href="/scenarios"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname.startsWith("/scenarios") ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Simulator (10)
          </a>
          <a
            href="/color-lab"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/color-lab" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Color Lab
          </a>
          <a
            href="/interview"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/interview" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Interview
          </a>
          <a
            href="/print-center"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/print-center" ? "bg-slate-800 text-teal-400" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Print Center
          </a>
        </nav>

        {/* User Switcher Dropdown */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex items-center space-x-2 bg-slate-850 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentUser?.role === "admin" ? "bg-purple-600 text-white" : "bg-teal-600 text-white"
                }`}
              >
                {currentUser?.fullName.charAt(0) || "U"}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-white text-[11px] font-medium leading-none">
                  {currentUser?.fullName.split(" ")[0]}
                </div>
                <div className="text-[10px] text-slate-400 font-mono leading-tight">
                  {currentUser?.role === "admin" ? "Admin" : "Candidate"}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0F1A2E] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="text-xs font-semibold text-white">{currentUser?.fullName}</div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">{currentUser?.email}</div>
                  <div className="mt-1 flex items-center space-x-1.5">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 font-bold">
                      {currentUser?.role}
                    </span>
                    <span className="text-[10px] text-slate-500">Plymouth, MN</span>
                  </div>
                </div>

                <div className="px-2 py-1 text-[10px] uppercase font-mono text-slate-400 font-bold">
                  Quick Role Switcher (Evaluation)
                </div>
                <button
                  onClick={() => handleRoleSwitch("learner")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    currentUser?.role === "learner"
                      ? "bg-teal-500/15 text-teal-300 font-semibold"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5" />
                    <span>Alex Morgan (Learner)</span>
                  </div>
                  {currentUser?.role === "learner" && <span className="text-teal-400 text-[10px]">● Active</span>}
                </button>

                <button
                  onClick={() => handleRoleSwitch("admin")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    currentUser?.role === "admin"
                      ? "bg-purple-500/15 text-purple-300 font-semibold"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Sarah Jenkins (Admin)</span>
                  </div>
                  {currentUser?.role === "admin" && <span className="text-purple-400 text-[10px]">● Active</span>}
                </button>

                {currentUser?.role === "admin" && (
                  <div className="mt-1 pt-1 border-t border-slate-800">
                    <a
                      href="/admin"
                      onClick={() => setUserDropdown(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs text-purple-300 hover:bg-purple-950/40 font-medium"
                    >
                      Open Content Admin Console →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0F1A2E] border-b border-slate-800 px-4 pt-2 pb-6 space-y-1">
          <div className="grid grid-cols-2 gap-1 py-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? "bg-teal-500/20 text-teal-300 font-semibold" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
