export interface ServiceTicketInput {
  customerName: string;
  equipmentModel: string;
  serialNumber: string;
  customerComplaint: string;
  safetyAssessment: string;
  configurationNotes: string;
  diagnosticTestsPerformed: string;
  observations: string;
  actionsTaken: string;
  verificationResults: string;
  customerCommunication: string;
  escalationFollowUp: string;
  status: "open" | "pending_parts" | "escalated" | "completed";
}

const requiredFields: Array<keyof ServiceTicketInput> = [
  "customerName",
  "equipmentModel",
  "customerComplaint",
  "safetyAssessment",
  "diagnosticTestsPerformed",
  "observations",
  "actionsTaken",
  "verificationResults",
  "customerCommunication",
  "escalationFollowUp",
];

export function parseServiceTicket(body: unknown): { data?: ServiceTicketInput; error?: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "Ticket details are required." };
  const source = body as Record<string, unknown>;
  const keys: Array<keyof ServiceTicketInput> = [
    ...requiredFields,
    "serialNumber",
    "configurationNotes",
  ];
  const values = {} as Record<keyof ServiceTicketInput, string>;
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && typeof value !== "string") return { error: `${key} must be text.` };
    values[key] = typeof value === "string" ? value.trim() : "";
    if (values[key].length > 5000) return { error: `${key} must be 5,000 characters or fewer.` };
  }
  for (const key of requiredFields) {
    if (values[key].length === 0) return { error: `${key} is required. Enter what was actually observed or performed.` };
  }
  const status = source.status === undefined ? "open" : source.status;
  if (typeof status !== "string" || !["open", "pending_parts", "escalated", "completed"].includes(status)) {
    return { error: "Choose a valid ticket status." };
  }

  return { data: { ...values, status: status as ServiceTicketInput["status"] } };
}
