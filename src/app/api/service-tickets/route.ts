import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || "usr_learner_01";

    const res = await query(
      `SELECT id, ticket_number, customer_name, equipment_model, serial_number,
              customer_complaint, safety_assessment, configuration_notes,
              diagnostic_tests_performed, observations, actions_taken,
              verification_results, customer_communication, escalation_follow_up,
              status, created_at, updated_at
       FROM service_tickets
       WHERE user_id = $1
       ORDER BY created_at DESC;`,
      [userId]
    );

    return NextResponse.json({ tickets: res.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      customerName,
      equipmentModel,
      serialNumber,
      customerComplaint,
      safetyAssessment,
      configurationNotes,
      diagnosticTestsPerformed,
      observations,
      actionsTaken,
      verificationResults,
      customerCommunication,
      escalationFollowUp,
      status,
    } = body;

    if (!customerName || !equipmentModel || !customerComplaint || !actionsTaken) {
      return NextResponse.json({ error: "Customer name, equipment model, complaint, and actions taken are required." }, { status: 400 });
    }

    const ticketNumber = `FSR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    await query(
      `INSERT INTO service_tickets (
        id, user_id, ticket_number, customer_name, equipment_model, serial_number,
        customer_complaint, safety_assessment, configuration_notes,
        diagnostic_tests_performed, observations, actions_taken,
        verification_results, customer_communication, escalation_follow_up, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      );`,
      [
        ticketId,
        user.id,
        ticketNumber,
        customerName,
        equipmentModel,
        serialNumber || "N/A",
        customerComplaint,
        safetyAssessment || "LOTO verified; PPE utilized.",
        configurationNotes || "",
        diagnosticTestsPerformed || "Standard nozzle check, electrical ground test.",
        observations || "Symptoms observed and measured.",
        actionsTaken,
        verificationResults || "Test print executed and customer signoff obtained.",
        customerCommunication || "Operator trained on preventive maintenance.",
        escalationFollowUp || "None required.",
        status || "completed",
      ]
    );

    // Boost customer_docs competency score
    await query(
      `UPDATE competency_scores 
       SET observed_score = LEAST(100.0, observed_score + 6.0),
           total_evaluations = total_evaluations + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND domain = 'customer_docs';`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticketId,
        ticketNumber,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create service ticket" }, { status: 500 });
  }
}
