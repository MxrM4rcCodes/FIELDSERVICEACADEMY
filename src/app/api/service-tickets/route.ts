import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { parseServiceTicket } from "@/lib/service-ticket";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const tickets = await query(
      `SELECT id, ticket_number, customer_name, equipment_model, serial_number,
              customer_complaint, safety_assessment, configuration_notes,
              diagnostic_tests_performed, observations, actions_taken,
              verification_results, customer_communication, escalation_follow_up,
              status, created_at, updated_at
         FROM service_tickets
        WHERE user_id = $1
        ORDER BY created_at DESC`,
      [user.id],
    );
    return NextResponse.json({ tickets: tickets.rows });
  } catch (error) {
    console.error("Service ticket list failed", error);
    return NextResponse.json({ error: "Unable to load your service tickets." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = parseServiceTicket(body);
    if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const ticket = parsed.data;
    const id = crypto.randomUUID();
    const ticketNumber = `TRAINING-${new Date().getUTCFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const saved = await query(
      `INSERT INTO service_tickets (
         id, user_id, ticket_number, customer_name, equipment_model, serial_number,
         customer_complaint, safety_assessment, configuration_notes,
         diagnostic_tests_performed, observations, actions_taken,
         verification_results, customer_communication, escalation_follow_up, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id, ticket_number, customer_name, equipment_model, status, created_at`,
      [
        id,
        user.id,
        ticketNumber,
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
      ],
    );

    return NextResponse.json({ success: true, ticket: saved.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Service ticket creation failed", error);
    return NextResponse.json({ error: "Unable to save this service ticket." }, { status: 500 });
  }
}
