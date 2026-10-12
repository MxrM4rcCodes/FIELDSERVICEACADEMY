"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  ArrowRight,
} from "lucide-react";

export default function ServiceTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    equipmentModel: "Platinum Flatbed 2513 UV",
    serialNumber: "PT-2026-",
    customerComplaint: "",
    safetyAssessment: "Lockout/Tagout performed at primary 208V disconnect; 0.0V measured L1-L2, L2-L3, L-G; nitrile gloves and UV eye protection worn.",
    configurationNotes: "Onyx RIP v22 with CGS ORIS DeviceLink profile; 8-pass bi-directional mode; 395nm UV LED lamps at 80% power.",
    diagnosticTestsPerformed: "",
    observations: "",
    actionsTaken: "",
    verificationResults: "",
    customerCommunication: "",
    escalationFollowUp: "None required. Call closed.",
    status: "completed",
  });

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/service-tickets");
      const json = await res.json();
      setTickets(json.tickets || []);
      if (json.tickets && json.tickets.length > 0 && !selectedTicket) {
        setSelectedTicket(json.tickets[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/service-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreating(false);
        await loadTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 no-print">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Field Service Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Service Documentation Lab
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            10-field audit-compliant field service reports. Document equipment configuration, safety energy isolation, tests, observations, actions, customer signoff, and print reports.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? "View Tickets" : "Draft New Ticket"}</span>
          </button>
          {selectedTicket && (
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>Print Service Report</span>
            </button>
          )}
        </div>
      </div>

      {isCreating ? (
        /* Create Ticket Form */
        <form
          onSubmit={handleCreateTicket}
          className="bg-[#0F1A2E] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-4xl mx-auto no-print"
        >
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Create Official Field Service Ticket</h2>
            <span className="text-[10px] font-mono text-teal-400 uppercase">CGS ORIS Field Standard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Customer Name & Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Printing, Minneapolis MN"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Equipment Model *</label>
              <input
                type="text"
                required
                value={formData.equipmentModel}
                onChange={(e) => setFormData({ ...formData, equipmentModel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Serial Number</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Customer-Reported Symptom *</label>
              <textarea
                rows={2}
                required
                placeholder="Verbatim customer complaint and observed failure mode..."
                value={formData.customerComplaint}
                onChange={(e) => setFormData({ ...formData, customerComplaint: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Safety Assessment & LOTO Verification *</label>
              <input
                type="text"
                required
                value={formData.safetyAssessment}
                onChange={(e) => setFormData({ ...formData, safetyAssessment: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Diagnostic Tests Performed</label>
                <textarea
                  rows={2}
                  placeholder="Nozzle checks, multimeters, manometer, ping tests..."
                  value={formData.diagnosticTestsPerformed}
                  onChange={(e) => setFormData({ ...formData, diagnosticTestsPerformed: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Observations & Evidence</label>
                <textarea
                  rows={2}
                  placeholder="Measured parameters, line voltages, vacuum kPa..."
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Actions Taken & Parts Replaced *</label>
              <textarea
                rows={2}
                required
                placeholder="Precise technical steps, part numbers, mechanical calibrations performed..."
                value={formData.actionsTaken}
                onChange={(e) => setFormData({ ...formData, actionsTaken: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Verification Results</label>
                <input
                  type="text"
                  placeholder="Test print passed, Delta E verified, FAT signoff..."
                  value={formData.verificationResults}
                  onChange={(e) => setFormData({ ...formData, verificationResults: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Customer Communication / Training</label>
                <input
                  type="text"
                  placeholder="Daily maintenance training provided to lead operator..."
                  value={formData.customerCommunication}
                  onChange={(e) => setFormData({ ...formData, customerCommunication: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
            >
              Save Service Ticket
            </button>
          </div>
        </form>
      ) : (
        /* View Tickets Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Ticket List (4 cols) */}
          <div className="lg:col-span-4 bg-[#0F1A2E] border border-slate-800 rounded-xl p-5 space-y-3 no-print">
            <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              Service Ticket History ({tickets.length})
            </h2>

            <div className="space-y-2">
              {tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? "bg-teal-500/15 border-teal-500 text-white font-semibold ring-1 ring-teal-500/30"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>{t.ticket_number}</span>
                      <span className="text-emerald-400 uppercase font-bold">{t.status}</span>
                    </div>
                    <div className="font-bold text-white truncate">{t.customer_name}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{t.customer_complaint}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Ticket Detail / Printable View (8 cols) */}
          <div className="lg:col-span-8">
            {selectedTicket ? (
              <div className="bg-[#0F1A2E] print:bg-white print:text-black border border-slate-800 print:border-none rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                {/* Formal Printable Report Header */}
                <div className="border-b-2 border-slate-700 print:border-black pb-4 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-teal-400 print:text-black uppercase tracking-wider">
                      CGS ORIS AMERICAS • FIELD SERVICE REPORT
                    </div>
                    <h2 className="text-xl font-black text-white print:text-black tracking-tight mt-1">
                      {selectedTicket.customer_name}
                    </h2>
                    <div className="text-xs text-slate-400 print:text-gray-600 font-mono mt-0.5">
                      Model: {selectedTicket.equipment_model} • S/N: {selectedTicket.serial_number}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black font-mono text-white print:text-black">
                      {selectedTicket.ticket_number}
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 print:text-gray-600">
                      Date: {new Date(selectedTicket.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* 10 Audit Fields */}
                <div className="grid grid-cols-1 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-200">
                    <span className="text-[10px] font-mono uppercase text-slate-400 print:text-gray-500 font-bold block mb-0.5">
                      Customer Complaint
                    </span>
                    <p className="text-slate-200 print:text-black font-medium">{selectedTicket.customer_complaint}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-200">
                    <span className="text-[10px] font-mono uppercase text-slate-400 print:text-gray-500 font-bold block mb-0.5">
                      Safety & Zero-Energy Isolation (LOTO)
                    </span>
                    <p className="text-slate-200 print:text-black">{selectedTicket.safety_assessment}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-200">
                      <span className="text-[10px] font-mono uppercase text-slate-400 print:text-gray-500 font-bold block mb-0.5">
                        Diagnostic Tests Performed
                      </span>
                      <p className="text-slate-200 print:text-black">{selectedTicket.diagnostic_tests_performed}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-200">
                      <span className="text-[10px] font-mono uppercase text-slate-400 print:text-gray-500 font-bold block mb-0.5">
                        Observations & Measured Evidence
                      </span>
                      <p className="text-slate-200 print:text-black">{selectedTicket.observations}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-200">
                    <span className="text-[10px] font-mono uppercase text-teal-400 print:text-black font-bold block mb-0.5">
                      Corrective Actions Taken & Calibrations
                    </span>
                    <p className="text-slate-200 print:text-black font-medium">{selectedTicket.actions_taken}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-200">
                      <span className="text-[10px] font-mono uppercase text-slate-400 print:text-gray-500 font-bold block mb-0.5">
                        Verification Results
                      </span>
                      <p className="text-slate-200 print:text-black">{selectedTicket.verification_results}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-200">
                      <span className="text-[10px] font-mono uppercase text-slate-400 print:text-gray-500 font-bold block mb-0.5">
                        Customer Communication & Training
                      </span>
                      <p className="text-slate-200 print:text-black">{selectedTicket.customer_communication}</p>
                    </div>
                  </div>
                </div>

                {/* Signature Block for Print */}
                <div className="pt-8 border-t border-slate-850 print:border-black grid grid-cols-2 gap-8 text-xs">
                  <div>
                    <div className="border-b border-slate-700 print:border-black pb-8"></div>
                    <div className="text-[10px] font-mono text-slate-400 print:text-black uppercase mt-1">
                      Customer Authorized Signature & Acceptance
                    </div>
                  </div>
                  <div>
                    <div className="border-b border-slate-700 print:border-black pb-8"></div>
                    <div className="text-[10px] font-mono text-slate-400 print:text-black uppercase mt-1">
                      CGS ORIS Field Service Engineer Signature
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-500 italic text-xs">
                Select a ticket to review or click 'Draft New Ticket'.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
