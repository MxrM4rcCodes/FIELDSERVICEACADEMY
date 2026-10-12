import React from "react";
import { ShieldCheck, MapPin, ExternalLink, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#070C14] border-t border-slate-850 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-20 no-print text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-2 text-white font-bold text-sm tracking-tight">
            <span>CGS ORIS FIELD SERVICE ACADEMY</span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-lg">
            An independent full-stack technical training and interview preparation platform for prospective CGS ORIS Americas Field Service Technicians.
            Master industrial printing architectures, METIS material scanning optics, ORIS color workflows, OSHA safety, and systematic diagnostic isolation.
          </p>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono">
            <MapPin className="w-3.5 h-3.5" />
            <span>Associated Hub: Plymouth, Minnesota Depot & Demonstration Center</span>
          </div>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase font-mono tracking-wider">
            Curriculum Domains
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>• Hardware & Safety (35% Priority)</li>
            <li>• Color Science & ORIS Workflows (25%)</li>
            <li>• METIS Material Scanning (15%)</li>
            <li>• Customer Support & Documentation (15%)</li>
            <li>• Company Knowledge & STAR Interview (10%)</li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase font-mono tracking-wider">
            Notice & Disclaimer
          </h4>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            This educational platform is an independent study tool. Not affiliated with or endorsed by CGS Publishing Technologies, METIS Systems s.r.l., or Platinum Technologies. All schematics are conceptual educational models.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
        <div>© 2026 CGS ORIS Field Service Academy. All rights reserved.</div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0 font-mono">
          <span>PostgreSQL Active</span>
          <span>•</span>
          <span>Role Isolation Enforced</span>
          <span>•</span>
          <span>ISO 12647 / G7 Aligned</span>
        </div>
      </div>
    </footer>
  );
}
