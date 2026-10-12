"use client";

import React, { useState, useEffect } from "react";
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

  // Install transparent client-side fetch interceptor so all requests
  // carry x-user-role and authorization Bearer even if third-party cookies are blocked by iframes
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).__cgs_fetch_patched) {
      (window as any).__cgs_fetch_patched = true;
      const originalFetch = window.fetch;
      window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
        try {
          const role = localStorage.getItem("cgs_active_role");
          const token = localStorage.getItem("cgs_session_token");
          if (role || token) {
            init = init || {};
            const headers = new Headers(init.headers || {});
            if (role && !headers.has("x-user-role")) headers.set("x-user-role", role);
            if (token && !headers.has("authorization")) headers.set("authorization", `Bearer ${token}`);
            init.headers = headers;
          }
        } catch (e) {}
        return originalFetch(input, init);
      };
    }
  }, []);

  // Sync user state on mount and path change
  useEffect(() => {
    const storedRole = typeof window !== "undefined" ? localStorage.getItem("cgs_active_role") : null;
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("cgs_session_token") : null;

    const reqHeaders: Record<string, string> = {};
    if (storedRole) reqHeaders["x-user-role"] = storedRole;
    if (storedToken) reqHeaders["authorization"] = `Bearer ${storedToken}`;

    fetch("/api/auth/me", { headers: reqHeaders })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          if (typeof window !== "undefined") {
            localStorage.setItem("cgs_active_role", data.user.role);
          }
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleRoleSwitch = async (targetRole: "admin" | "learner") => {
    try {
      // 1. Immediately store in localStorage so all client calls know the new role
      if (typeof window !== "undefined") {
        localStorage.setItem("cgs_active_role", targetRole);
      }

      // Optimistically update React UI state immediately
      setCurrentUser((prev) => {
        if (!prev) {
          return {
            id: targetRole === "admin" ? "usr_admin_01" : "usr_learner_01",
            email: targetRole === "admin" ? "admin@cgs-oris.academy" : "technician@cgs-oris.academy",
            fullName: targetRole === "admin" ? "Sarah Jenkins (Technical Director)" : "Alex Morgan (Field Service Candidate)",
            role: targetRole,
          };
        }
        return {
          ...prev,
          id: targetRole === "admin" ? "usr_admin_01" : "usr_learner_01",
          email: targetRole === "admin" ? "admin@cgs-oris.academy" : "technician@cgs-oris.academy",
          fullName: targetRole === "admin" ? "Sarah Jenkins (Technical Director)" : "Alex Morgan (Field Service Candidate)",
          role: targetRole,
        };
      });

      // 2. Call switch API endpoint to persist in database & set cookies
      const res = await fetch("/api/auth/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });

      const data = await res.json().catch(() => ({}));
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("cgs_session_token", data.token);
      }
      if (data.user) {
        setCurrentUser(data.user);
      }

      // 3. Set client-side cookies as well for browsers that permit document.cookie in iframes
      try {
        document.cookie = `cgs_user_role=${targetRole}; path=/; max-age=2592000; SameSite=None; Secure`;
        if (data.token) {
          document.cookie = `cgs_session_token=${data.token}; path=/; max-age=2592000; SameSite=None; Secure`;
        }
      } catch (e) {}

      setUserDropdown(false);

      // 4. Force full page refresh / navigation so all server components and routes re-render
      if (targetRole === "admin" && pathname === "/admin") {
        window.location.reload();
      } else {
        router.refresh();
        window.location.reload();
      }
    } catch (e) {
      console.error("Role switch error:", e);
      // Hard fallback via direct GET navigation
      window.location.href = `/api/auth/switch?role=${targetRole}&redirect=${encodeURIComponent(pathname)}`;
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
      {/* Top Banner with Direct 1-Click Role Switcher */}
      <div className="bg-[#070C14] px-4 py-1.5 border-b border-slate-850 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="font-mono text-teal-400 font-semibold tracking-wider">CGS ORIS AMERICAS</span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">Operations Hub: Plymouth, Minnesota Depot</span>
        </div>

        {/* 1-Click Segmented Role Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">Account Role:</span>
          <div className="inline-flex items-center bg-slate-900 border border-slate-700/80 rounded-md p-0.5 text-xs">
            <button
              type="button"
              onClick={() => handleRoleSwitch("learner")}
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                currentUser?.role === "learner"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Switch to Candidate / Learner (Alex Morgan)"
            >
              <User className="w-3 h-3" />
              <span>Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("admin")}
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                currentUser?.role === "admin"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Switch to Administrator (Sarah Jenkins)"
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
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
          {currentUser?.role === "admin" && (
            <a
              href="/admin"
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center space-x-1 ${
                pathname === "/admin"
                  ? "bg-purple-900/60 text-purple-300 border border-purple-700/50"
                  : "text-purple-300 hover:text-white hover:bg-purple-900/40"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </a>
          )}
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
                {currentUser?.fullName?.charAt(0) || "U"}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-white text-[11px] font-medium leading-none">
                  {currentUser?.fullName?.split(" ")[0] || "User"}
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
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                        currentUser?.role === "admin"
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-teal-900/50 text-teal-300"
                      }`}
                    >
                      {currentUser?.role}
                    </span>
                    <span className="text-[10px] text-slate-500">Plymouth, MN</span>
                  </div>
                </div>

                <div className="px-2 py-1 text-[10px] uppercase font-mono text-slate-400 font-bold">
                  Quick Role Switcher (Evaluation)
                </div>
                <button
                  type="button"
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
                  type="button"
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
        <div className="lg:hidden bg-[#0F1A2E] border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {/* Mobile role switcher */}
          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono uppercase mb-1.5">Switch Active Profile:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleRoleSwitch("learner");
                  setMobileOpen(false);
                }}
                className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center space-x-1 ${
                  currentUser?.role === "learner"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                <User className="w-3 h-3" />
                <span>Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRoleSwitch("admin");
                  setMobileOpen(false);
                }}
                className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center space-x-1 ${
                  currentUser?.role === "admin"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                <Shield className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </div>
          </div>

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
