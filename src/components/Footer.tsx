export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#070C14] px-4 py-10 text-xs text-slate-400 sm:px-6 lg:px-8 no-print">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          <div className="text-sm font-bold tracking-tight text-white">FIELD SERVICE ACADEMY</div>
          <p className="max-w-2xl leading-relaxed">
            Independent technical learning and interview practice for industrial printing, imaging, color workflows, safe diagnostic reasoning, and customer service. Lesson estimates and assessment feedback are educational practice aids, not proof of field competence.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">Curriculum focus weights</h2>
          <ul className="space-y-1.5">
            <li>Hardware, diagnosis &amp; safety — 35%</li>
            <li>Color workflows — 25%</li>
            <li>Scanner families — 15%</li>
            <li>Customer support &amp; records — 15%</li>
            <li>Interview practice — 10%</li>
          </ul>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-500">These percentages describe course emphasis, not learner scores.</p>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-slate-900 pt-6 text-[11px] text-slate-500 sm:flex-row">
        <span>Independent educational project. Not affiliated with or endorsed by CGS ORIS, METIS, or Platinum Technologies.</span>
        <span>Diagrams are conceptual; follow current manufacturer and site procedures.</span>
      </div>
    </footer>
  );
}
