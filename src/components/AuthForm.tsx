"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, LoaderCircle, Wrench } from "lucide-react";

type AuthFormProps = { mode: "login" | "register" };

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "The request could not be completed.");
        return;
      }

      const requested = new URLSearchParams(window.location.search).get("next") || "/";
      const safePath = requested.startsWith("/") && !requested.startsWith("//") && !requested.startsWith("/login") && !requested.startsWith("/register")
        ? requested
        : "/";
      router.replace(safePath);
      router.refresh();
    } catch {
      setError("Unable to reach the academy. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-20">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0F1A2E] shadow-2xl">
        <div className="border-b border-slate-800 bg-[#0B1320] p-6 sm:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300">
            <Wrench aria-hidden="true" className="h-6 w-6" />
          </div>
          <p className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-teal-400">
            CGS ORIS Field Service Academy
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {isRegister ? "Create your learner account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {isRegister
              ? "Your lesson progress, notes, practice scores, and service tickets are saved to your private account."
              : "Sign in to continue your course and pick up where you left off."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8">
          {isRegister && (
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold text-slate-300">Name</label>
              <input
                id="fullName"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-300">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-300">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              minLength={isRegister ? 12 : 1}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
            {isRegister && <p className="mt-1.5 text-[11px] text-slate-500">Use at least 12 characters. Keep this password private.</p>}
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-rose-700/50 bg-rose-950/30 px-3 py-2.5 text-sm text-rose-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 py-3 text-sm font-bold text-[#07121e] transition-colors hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-[#0F1A2E] disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            <span>{submitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}</span>
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="text-center text-xs text-slate-400">
            {isRegister ? "Already registered?" : "New to the academy?"}{" "}
            <a className="font-semibold text-teal-300 underline-offset-4 hover:underline" href={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Create an account"}
            </a>
          </p>
        </form>
      </div>
      <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-500">
        Independent educational application. Not affiliated with or endorsed by CGS ORIS, METIS, or Platinum Technologies.
      </p>
    </div>
  );
}
