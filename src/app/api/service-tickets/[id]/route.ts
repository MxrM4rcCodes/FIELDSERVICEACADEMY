import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { parseServiceTicket } from "@/lib/service-ticket";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = parseServiceTicket(body);
    if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const ticket = parsed.data;

    const updated = await query(
      `UPDATE service_tickets
          SET customer_name = $1,
              equipment_model = $2,
              serial_number = $3,
              customer_complaint = $4,
              safety_assessment = $5,
              configuration_notes = $6,
              diagnostic_tests_performed = $7,
              observations = $8,
              actions_taken = $9,
              verification_results = $10,
              customer_communication = $11,
              escalation_follow_up = $12,
              status = $13,
              updated_at = CURRENT_TIMESTAMP
        WHERE id = $14 AND user_id = $15
        RETURNING id, ticket_number, customer_name, equipment_model, serial_number,
                  customer_complaint, safety_assessment, configuration_notes,
                  diagnostic_tests_performed, observations, actions_taken,
                  verification_results, customer_communication, escalation_follow_up,
                  status, created_at, updated_at`,
      [
        ticket.customerName,
        ticket.equipmentModel,
        ticket.serialNumber || "Not provided",
        ticket.customerComplaint,
        ticket.safetyAssessment,
        ticket.configurationNotes,
        ticket.diagnosticTestsPerformed,
        ticket.observations,
        ticket.actionsTaken,
        ticket.verificationResults,
        ticket.customerCommunication,
        ticket.escalationFollowUp,
        ticket.status,
        id,
        user.id,
      ],
    );
    if (!updated.rows[0]) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    return NextResponse.json({ success: true, ticket: updated.rows[0] });
  } catch (error) {
    console.error("Service ticket update failed", error);
    return NextResponse.json({ error: "Unable to update this service ticket." }, { status: 500 });
  }
}
