"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BookOpen,
  Camera,
  ChevronDown,
  FileText,
  GitBranch,
  HelpCircle,
  Layers,
  LogOut,
  Menu,
  Palette,
  Printer,
  Shield,
  Sparkles,
  UserRound,
  Wrench,
  X,
  Zap,
} from "lucide-react";

type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "learner";
};

const learnerLinks = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/course?track=bootcamp", label: "Bootcamp", icon: Zap },
  { href: "/course", label: "14-Day Course", icon: BookOpen },
  { href: "/systems-map", label: "Systems Map", icon: GitBranch },
  { href: "/printer-lab", label: "Printer Lab", icon: Wrench },
  { href: "/color-lab", label: "Color Lab", icon: Palette },
  { href: "/troubleshooting", label: "Troubleshooting", icon: Layers },
  { href: "/metis", label: "METIS", icon: Camera },
  { href: "/oris", label: "ORIS", icon: Sparkles },
  { href: "/flashcards", label: "Flashcards", icon: HelpCircle },
  { href: "/interview", label: "Interview Studio", icon: UserRound },
  { href: "/service-tickets", label: "Service Tickets", icon: FileText },
  { href: "/print-center", label: "Print Center", icon: Printer },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : { user: null })
      .then((data) => setCurrentUser(data.user ?? null))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoadingUser(false));
  }, [pathname]);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    setAccountOpen(false);
    router.replace("/login");
    router.refresh();
  }

  const links = currentUser?.role === "admin"
    ? [...learnerLinks, { href: "/admin", label: "Admin", icon: Shield }]
    : learnerLinks;

  function isActive(href: string) {
    const baseHref = href.split("?")[0];
    return baseHref === "/" ? pathname === "/" : pathname === baseHref || pathname.startsWith(`${baseHref}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B1320]/95 text-slate-100 backdrop-blur-md no-print">
      <div className="bg-[#070C14] px-4 py-1.5 text-xs text-slate-400 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-teal-400" />
            <span className="shrink-0 font-mono font-semibold tracking-wider text-teal-400">INDEPENDENT FIELD SERVICE ACADEMY</span>
            <span className="hidden text-slate-600 sm:inline">|</span>
            <span className="hidden truncate sm:inline">Independent technical learning platform</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {loadingUser ? null : currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  onClick={() => setAccountOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 font-bold text-white">
                    {currentUser.fullName.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden max-w-40 truncate md:inline">{currentUser.fullName}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {accountOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-[#0F1A2E] p-2 shadow-2xl">
                    <div className="border-b border-slate-800 px-3 py-2">
                      <p className="truncate text-xs font-semibold text-white">{currentUser.fullName}</p>
                      <p className="truncate text-[11px] text-slate-400">{currentUser.email}</p>
                      <span className="mt-2 inline-flex rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono uppercase text-teal-300">
                        {currentUser.role}
                      </span>
                    </div>
                    {currentUser.role === "admin" && (
                      <a role="menuitem" href="/admin" className="mt-1 block rounded-lg px-3 py-2 text-xs text-purple-300 hover:bg-slate-800">
                        Content administration
                      </a>
                    )}
                    <button role="menuitem" type="button" onClick={signOut} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
                      <LogOut className="h-3.5 w-3.5" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/login" className="rounded-md px-2.5 py-1 text-slate-300 hover:bg-slate-800 hover:text-white">Sign in</a>
                <a href="/register" className="rounded-md bg-teal-600 px-2.5 py-1 font-semibold text-white hover:bg-teal-500">Create account</a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/" className="group flex min-w-0 items-center gap-3" aria-label="Academy dashboard">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/20">
            <Wrench className="h-5 w-5 transition-transform group-hover:rotate-12" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold tracking-tight text-white sm:text-base">FIELD SERVICE <span className="font-light text-teal-400">ACADEMY</span></span>
            <span className="hidden text-[11px] text-slate-400 sm:block">Learn the Systems. Diagnose the Faults. Master the Workflow.</span>
          </span>
        </a>

        {currentUser && (
          <nav aria-label="Main navigation" className="hidden max-w-[68%] flex-1 flex-wrap justify-end gap-x-1 gap-y-1 lg:flex">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                    isActive(link.href) ? "bg-slate-800 text-teal-300" : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </a>
              );
            })}
          </nav>
        )}

        {currentUser && (
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg bg-slate-800 p-2 text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      {currentUser && mobileOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-slate-800 bg-[#0F1A2E] px-4 py-3 lg:hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 sm:grid-cols-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                    isActive(link.href) ? "bg-teal-500/15 text-teal-200" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
