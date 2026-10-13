"use client";

import React, { useState } from "react";
import { ArrowRight, BookOpen, ClipboardList, FileText, Palette, Printer, ShieldAlert, Workflow } from "lucide-react";

const sheets = [
  { id: "safety", title: "Safety & stop-work boundaries", icon: ShieldAlert },
  { id: "evidence", title: "Evidence capture worksheet", icon: ClipboardList },
  { id: "print-quality", title: "Print-quality triage worksheet", icon: FileText },
  { id: "color", title: "Color comparison worksheet", icon: Palette },
  { id: "workflow", title: "Workflow handoff worksheet", icon: Workflow },
  { id: "sources", title: "Source & confidence notes", icon: BookOpen },
] as const;

type SheetId = (typeof sheets)[number]["id"];

function WriteIn({ label, lines = 2 }: { label: string; lines?: number }) {
  return <div className="space-y-1.5"><div className="font-semibold text-slate-700 print:text-black">{label}</div><div aria-hidden="true" className="space-y-5">{Array.from({ length: lines }, (_, index) => <div key={index} className="h-4 border-b border-slate-500 print:border-gray-500" />)}</div></div>;
}

export default function PrintCenterPage() {
  const [selectedSheet, setSelectedSheet] = useState<SheetId>("safety");
  const selected = sheets.find((sheet) => sheet.id === selectedSheet)!;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="no-print flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-teal-400"><Printer className="h-4 w-4" />Independent learning resources</div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Study & Print Center</h1>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400">Print the selected educational worksheet for study or simulation. These are not manufacturer procedures, official field forms, safety plans, or evidence of compliance.</p>
        </div>
        <button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-teal-500"><Printer className="h-4 w-4" />Print selected sheet</button>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <aside aria-label="Printable sheets" className="no-print space-y-2 rounded-xl border border-slate-800 bg-[#0F1A2E] p-4 lg:col-span-4">
          <h2 className="mb-3 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Choose a learning worksheet</h2>
          {sheets.map((sheet) => {
            const Icon = sheet.icon;
            const active = sheet.id === selectedSheet;
            return <button key={sheet.id} onClick={() => setSelectedSheet(sheet.id)} aria-pressed={active} className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-xs transition ${active ? "border-teal-500 bg-teal-500/10 text-white" : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white"}`}><Icon className="h-4 w-4 shrink-0 text-teal-400" /><span className="flex-1">{sheet.title}</span>{active && <ArrowRight className="h-3.5 w-3.5 text-teal-400" />}</button>;
          })}
        </aside>

        <article className="print-center-document min-h-[650px] space-y-6 rounded-2xl border border-slate-800 bg-[#0F1A2E] p-6 text-xs leading-relaxed text-slate-200 shadow-2xl print:min-h-0 print:rounded-none print:border-0 print:bg-white print:p-0 print:text-black print:shadow-none lg:col-span-8">
          <header className="border-b-2 border-slate-600 pb-4 print:border-black">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 print:text-black">Field Service Academy · Independent learning worksheet</div>
                <h2 className="mt-1 text-xl font-black text-white print:text-black">{selected.title}</h2>
                <p className="mt-1 text-[10px] text-slate-400 print:text-gray-700">For study and simulated practice only · Not an OEM form or procedure</p>
              </div>
              <div className="shrink-0 text-right text-[10px] font-mono text-slate-400 print:text-gray-700">ACADEMY<br />LEARNING COPY</div>
            </div>
          </header>

          {selectedSheet === "safety" && <div className="space-y-5">
            <div className="rounded-lg border border-rose-700/50 bg-rose-950/20 p-3 font-semibold text-rose-200 print:border-black print:bg-white print:text-black"><strong>Stop-work boundary:</strong> A stop command or emergency stop is not, by itself, proof of energy isolation. This sheet gives no lockout/tagout sequence and does not authorize equipment access.</div>
            <section className="space-y-2"><h3 className="font-bold text-white print:text-black">When a condition may be unsafe</h3><ul className="list-disc space-y-1.5 pl-5"><li>Do not continue the task or enter an uncontrolled hazard area to diagnose it.</li><li>Keep people clear as appropriate and use the site's emergency, stop-work, and reporting process.</li><li>Notify the responsible site safety contact or qualified equipment owner; follow their instructions.</li><li>Use only the current site energy-control procedure, applicable training, and role authorization for covered work.</li><li>Do not bypass guards, interlocks, or other protective devices; do not restart until the responsible authority has cleared the condition.</li></ul></section>
            <section className="space-y-2"><h3 className="font-bold text-white print:text-black">Before any real service task, the responsible organization must determine</h3><p>Whether the task is covered by an energy-control or other safety procedure; the machine-specific hazards and approved controls; the trained and authorized roles; and how a safe state is established and verified. Applicability and requirements depend on the site, equipment, task, and governing rules.</p><p className="text-[10px] text-slate-400 print:text-gray-700">Primary reference: OSHA 29 CFR 1910.147, Control of hazardous energy. Consult the standard and the employer's written program; this educational summary is not a substitute.</p></section>
            <WriteIn label="Site contact / approved procedure location (for a classroom exercise only)" lines={2} />
          </div>}

          {selectedSheet === "evidence" && <div className="space-y-5">
            <p>Separate customer-reported symptoms, direct observations, measured results, hypotheses, and actions. Record only what was actually observed or performed. Leave credentials and unnecessary personal/customer data out of the worksheet.</p>
            <div className="grid grid-cols-2 gap-5"><WriteIn label="Case / job reference (use a training ID)" /><WriteIn label="Date and time / time zone" /><WriteIn label="Equipment identity and configuration (verified)" /><WriteIn label="Person reporting / affected scope" /></div>
            <WriteIn label="Customer-reported symptom and impact" />
            <WriteIn label="Direct observation or measurement, including conditions" />
            <WriteIn label="Approved test actually performed and what it can / cannot show" />
            <WriteIn label="Hypotheses still open; avoid presenting them as facts" />
            <div className="grid grid-cols-2 gap-5"><WriteIn label="Authorized action (or ‘none’; do not infer)" /><WriteIn label="Result / acceptance criteria / verification status" /></div>
            <WriteIn label="Next owner, approved next step, and follow-up" />
          </div>}

          {selectedSheet === "print-quality" && <div className="space-y-5">
            <div className="rounded-lg border border-amber-700/50 bg-amber-950/20 p-3 text-amber-100 print:border-gray-500 print:bg-white print:text-black"><strong>Reasoning reminder:</strong> A visible band is a symptom, not a diagnosis. A clean static pattern does not rule out every printhead or dynamic fault; an observed pattern alone does not establish media advance or another specific cause.</div>
            <div className="grid grid-cols-2 gap-5"><WriteIn label="Affected job, revision, material, and device (verified)" /><WriteIn label="When it began / frequency / scope" /></div>
            <WriteIn label="Describe the defect without naming a cause" />
            <WriteIn label="Compare affected and unaffected examples; note what changed" />
            <WriteIn label="Exact model-specific approved test, if known and authorized" />
            <WriteIn label="Test conditions, result, and limitation" />
            <WriteIn label="Competing explanations and evidence needed to distinguish them" />
            <WriteIn label="Current documentation / qualified owner / agreed next step" />
            <p className="text-[10px] text-slate-400 print:text-gray-700">This worksheet intentionally provides no cleaning, adjustment, purge, calibration, part-replacement, service-menu, electrical, or guarded-access instructions.</p>
          </div>}

          {selectedSheet === "color" && <div className="space-y-5">
            <p>A calculated color difference describes a comparison under specified conditions; by itself it is not a universal pass/fail decision. Establish the customer's target, method, material, and acceptance terms before interpreting a value.</p>
            <div className="grid grid-cols-2 gap-5"><WriteIn label="Target / source / revision" /><WriteIn label="Customer-agreed tolerance or acceptance rule" /><WriteIn label="Sample, substrate, side, and condition" /><WriteIn label="Instrument identity / calibration status per procedure" /></div>
            <WriteIn label="Measurement condition, geometry, backing, aperture, and method (as specified)" />
            <div className="grid grid-cols-3 gap-4"><WriteIn label="Color-difference formula" lines={1} /><WriteIn label="Result and units" lines={1} /><WriteIn label="Replicates / location" lines={1} /></div>
            <WriteIn label="Comparison result and what remains uncertain" />
            <WriteIn label="Approved workflow owner / next step" />
            <p className="text-[10px] text-slate-400 print:text-gray-700">Reference: ISO 13655 describes graphic-arts spectral measurement and colorimetric computation. Use the applicable full standard, instrument guidance, and job specification; do not substitute one measurement condition or tolerance universally.</p>
          </div>}

          {selectedSheet === "workflow" && <div className="space-y-5">
            <p>Map the actual installed workflow from records and the responsible system owner. A conceptual sequence is not evidence that a particular product, integration, format, or network path is present.</p>
            <div className="grid grid-cols-2 gap-5"><WriteIn label="Job / sanitized reference and timestamp" /><WriteIn label="Customer impact and affected users/jobs" /></div>
            <WriteIn label="Last confirmed stage and evidence source" />
            <WriteIn label="Configured stages and their verified owners (e.g. preparation, queue, transfer, output, inspection)" lines={3} />
            <WriteIn label="Exact error/status text; redact secrets and unnecessary personal data" />
            <WriteIn label="Checks actually performed, authorization, and limitations" />
            <WriteIn label="Owner-approved next check / change process, if applicable" />
            <WriteIn label="Outcome, customer update, escalation owner, and follow-up" />
            <p className="text-[10px] text-slate-400 print:text-gray-700">Do not email passwords, access tokens, or unapproved customer files. Network/security configuration changes belong to the authorized owner and change process.</p>
          </div>}

          {selectedSheet === "sources" && <div className="space-y-5">
            <p>Use source quality and scope to decide what a reference actually supports. Public overviews are useful for orientation, not a replacement for model/version-specific documentation.</p>
            <div className="overflow-hidden rounded-lg border border-slate-700 print:border-gray-500"><table className="w-full border-collapse text-left text-[10px]"><thead className="bg-slate-900 text-white print:bg-gray-100 print:text-black"><tr><th className="border-b border-slate-700 p-2 print:border-gray-500">Reference</th><th className="border-b border-slate-700 p-2 print:border-gray-500">Useful for</th><th className="border-b border-slate-700 p-2 print:border-gray-500">Not enough to establish</th></tr></thead><tbody className="divide-y divide-slate-800 print:divide-gray-300"><tr><td className="p-2">OSHA 29 CFR 1910.147</td><td className="p-2">Regulatory text and employer energy-control program context</td><td className="p-2">A site's applicability decision, written procedure, training, or device-specific steps</td></tr><tr><td className="p-2">ISO 13655:2017</td><td className="p-2">Graphic-arts measurement and colorimetric computation context</td><td className="p-2">A customer's target, tolerance, or universal measurement condition</td></tr><tr><td className="p-2">Public CGS ORIS / METIS pages</td><td className="p-2">Published portfolio names and broad family context</td><td className="p-2">Installed options, version, license, integration, or service procedure</td></tr><tr><td className="p-2">Conceptual diagrams in this academy</td><td className="p-2">General system reasoning and vocabulary</td><td className="p-2">Proprietary schematics, exact equipment layout, settings, or instructions</td></tr></tbody></table></div>
            <div className="space-y-2 text-[10px]"><p><strong>Primary references:</strong> <span className="break-all">osha.gov/laws-regs/regulations/standardnumber/1910/1910.147 · iso.org/standard/65430.html · cgs-oris.com/en/software/ · cgs-oris.com/en/metis-scanner</span></p><p className="text-slate-400 print:text-gray-700">Check source date and applicable edition; use authorized, current manufacturer and site documents for real work. The academy is independent and is not endorsed by the named organizations.</p></div>
            <WriteIn label="Source checked, date, exact applicability, and remaining question" />
          </div>}

          <footer className="border-t border-slate-700 pt-3 text-[9px] text-slate-400 print:border-gray-500 print:text-gray-700">Educational worksheet only. This independent platform is not affiliated with or endorsed by CGS ORIS, METIS, or Platinum Technologies. Use current, authorized documentation, site procedures, and qualified guidance for real equipment.</footer>
        </article>
      </div>
    </div>
  );
}
