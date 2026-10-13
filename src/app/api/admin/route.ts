import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query, withTransaction } from "@/lib/db";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin" ? user : null;
}

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

    const [userCount, lessonCount, quizCount, scenarioCount, flashcardCount, ticketCount, users, revisions] = await Promise.all([
      query("SELECT count(*) FROM users"),
      query("SELECT count(*) FROM lessons"),
      query("SELECT count(*) FROM quiz_questions"),
      query("SELECT count(*) FROM troubleshooting_scenarios"),
      query("SELECT count(*) FROM flashcards"),
      query("SELECT count(*) FROM service_tickets"),
      query(
        `SELECT u.id, u.email, u.full_name, u.role, u.created_at, p.active_track, p.target_interview_date
           FROM users u LEFT JOIN profiles p ON p.user_id = u.id
          ORDER BY u.created_at DESC`,
      ),
      query(
        `SELECT r.id, r.entity_type, r.entity_id, r.diff_summary, r.created_at, u.full_name AS author_name
           FROM content_revisions r LEFT JOIN users u ON u.id = r.changed_by_user_id
          ORDER BY r.created_at DESC LIMIT 20`,
      ),
    ]);

    return NextResponse.json({
      stats: {
        users: Number(userCount.rows[0]?.count || 0),
        lessons: Number(lessonCount.rows[0]?.count || 0),
        quizQuestions: Number(quizCount.rows[0]?.count || 0),
        scenarios: Number(scenarioCount.rows[0]?.count || 0),
        flashcards: Number(flashcardCount.rows[0]?.count || 0),
        serviceTickets: Number(ticketCount.rows[0]?.count || 0),
      },
      users: users.rows,
      revisions: revisions.rows,
    });
  } catch (error) {
    console.error("Admin console read failed", error);
    return NextResponse.json({ error: "Unable to load administrative data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || typeof body.action !== "string" || typeof body.entityId !== "string") {
      return NextResponse.json({ error: "A supported action and entity ID are required." }, { status: 400 });
    }
    const payload = body.payload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ error: "An update payload is required." }, { status: 400 });
    }
    const entityId = body.entityId;
    if (entityId.length > 120) return NextResponse.json({ error: "Entity ID is invalid." }, { status: 400 });

    let entityType = "";
    let diffSummary = "";
    let updatedRows: { rows: Array<{ id: string }> };

    if (body.action === "update_lesson") {
      const { title, summary, estimatedMinutes } = payload as Record<string, unknown>;
      if (typeof title !== "string" || title.trim().length < 4 || title.length > 160
        || typeof summary !== "string" || summary.trim().length < 20 || summary.length > 5000
        || !Number.isInteger(estimatedMinutes) || Number(estimatedMinutes) < 10 || Number(estimatedMinutes) > 600) {
        return NextResponse.json({ error: "Enter a lesson title, substantial summary, and 10–600 minute duration." }, { status: 400 });
      }
      updatedRows = await query(
        `UPDATE lessons SET title = $1, summary = $2, estimated_minutes = $3
          WHERE id = $4 RETURNING id`,
        [title.trim(), summary.trim(), estimatedMinutes, entityId],
      );
      entityType = "lesson";
      diffSummary = `Updated lesson title, summary, and study duration (${entityId})`;
    } else if (body.action === "update_quiz_question") {
      const { questionText, explanation } = payload as Record<string, unknown>;
      if (typeof questionText !== "string" || questionText.trim().length < 10 || questionText.length > 1200
        || typeof explanation !== "string" || explanation.trim().length < 10 || explanation.length > 2500) {
        return NextResponse.json({ error: "Question and explanation text are required and must be within the length limits." }, { status: 400 });
      }
      updatedRows = await query(
        `UPDATE quiz_questions SET question_text = $1, explanation = $2
          WHERE id = $3 RETURNING id`,
        [questionText.trim(), explanation.trim(), entityId],
      );
      entityType = "quiz_question";
      diffSummary = `Updated quiz question and rationale (${entityId})`;
    } else if (body.action === "update_lesson_content_block") {
      const { sectionTitle, contentMarkdown, blockType } = payload as Record<string, unknown>;
      const allowedTypes = ["teaching", "visual_explanation", "field_example", "interactive_practice", "summary_review", "printable_reference"];
      if (typeof sectionTitle !== "string" || sectionTitle.trim().length < 3 || sectionTitle.length > 160
        || typeof contentMarkdown !== "string" || contentMarkdown.trim().length < 50 || contentMarkdown.length > 20000
        || typeof blockType !== "string" || !allowedTypes.includes(blockType)) {
        return NextResponse.json({ error: "Provide a section title, substantive content, and supported block type." }, { status: 400 });
      }
      updatedRows = await query(
        `UPDATE lesson_content_blocks SET section_title = $1, block_type = $2, content_markdown = $3
          WHERE id = $4 RETURNING id`,
        [sectionTitle.trim(), blockType, contentMarkdown.trim(), entityId],
      );
      entityType = "lesson_content_block";
      diffSummary = `Updated lesson content block (${entityId})`;
    } else if (body.action === "update_scenario_node") {
      const { title, description } = payload as Record<string, unknown>;
      if (typeof title !== "string" || title.trim().length < 3 || title.length > 160
        || typeof description !== "string" || description.trim().length < 10 || description.length > 5000) {
        return NextResponse.json({ error: "Provide a scenario node title and description." }, { status: 400 });
      }
      updatedRows = await query(
        `UPDATE scenario_nodes SET title = $1, description = $2 WHERE id = $3 RETURNING id`,
        [title.trim(), description.trim(), entityId],
      );
      entityType = "scenario_node";
      diffSummary = `Updated diagnostic scenario node (${entityId})`;
    } else if (body.action === "update_scenario_choice") {
      const { text, feedback, testRevealedEvidence, targetNodeKey } = payload as Record<string, unknown>;
      if (typeof text !== "string" || text.trim().length < 5 || text.length > 1200
        || typeof feedback !== "string" || feedback.trim().length < 5 || feedback.length > 2000
        || (testRevealedEvidence !== null && typeof testRevealedEvidence !== "string")
        || (typeof testRevealedEvidence === "string" && testRevealedEvidence.length > 2000)
        || typeof targetNodeKey !== "string" || targetNodeKey.length > 120) {
        return NextResponse.json({ error: "Provide a valid choice, feedback, evidence, and target node." }, { status: 400 });
      }
      updatedRows = await query(
        `UPDATE scenario_choices choice SET text = $1, feedback = $2,
                test_revealed_evidence = $3, target_node_key = $4
          WHERE choice.id = $5
            AND EXISTS (
              SELECT 1 FROM scenario_nodes source
              JOIN scenario_nodes target ON target.scenario_id = source.scenario_id
              WHERE source.id = choice.node_id AND target.node_key = $4
            )
          RETURNING choice.id AS id`,
        [text.trim(), feedback.trim(), testRevealedEvidence || null, targetNodeKey, entityId],
      );
      entityType = "scenario_choice";
      diffSummary = `Updated diagnostic scenario choice (${entityId})`;
    } else if (body.action === "update_flashcard") {
      const { term, category, definition, fieldContext, keyTakeaway, commonMisconception } = payload as Record<string, unknown>;
      const allowedCategories = ["printer_hardware", "inkjet_defects", "color_science", "scanning", "rip_networking", "safety", "oris_products", "customer_service"];
      const strings = [term, definition, fieldContext, keyTakeaway, commonMisconception];
      if (strings.some((value) => typeof value !== "string" || value.trim().length < 3 || value.length > 3000)
        || typeof category !== "string" || !allowedCategories.includes(category)) {
        return NextResponse.json({ error: "Provide complete flashcard content and a supported category." }, { status: 400 });
      }
      updatedRows = await query(
        `UPDATE flashcards SET term = $1, category = $2, definition = $3,
                field_context = $4, key_takeaway = $5, common_misconception = $6
          WHERE id = $7 RETURNING id`,
        [term, category, definition, fieldContext, keyTakeaway, commonMisconception, entityId],
      );
      entityType = "flashcard";
      diffSummary = `Updated glossary flashcard (${entityId})`;
    } else {
      return NextResponse.json({ error: "Unsupported content action." }, { status: 400 });
    }

    if (!updatedRows.rows[0]) return NextResponse.json({ error: "Content item not found." }, { status: 404 });

    const revisionId = crypto.randomUUID();
    await withTransaction(async (tx) => {
      await tx.query(
        `INSERT INTO content_revisions (id, entity_type, entity_id, changed_by_user_id, diff_summary)
         VALUES ($1, $2, $3, $4, $5)`,
        [revisionId, entityType, entityId, admin.id, diffSummary],
      );
    });
    return NextResponse.json({ success: true, revisionId });
  } catch (error) {
    console.error("Admin content update failed", error);
    return NextResponse.json({ error: "Unable to save this content change." }, { status: 500 });
  }
}
