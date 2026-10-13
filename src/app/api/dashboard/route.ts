import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { COMPETENCY_WEIGHTS, type CompetencyDomain } from "@/lib/competency";

export const dynamic = "force-dynamic";

const reviewTargets: Record<CompetencyDomain, { lesson: string; title: string }> = {
  hardware_safety: { lesson: "day-03-equipment-safety", title: "Hazardous Energy & LOTO Principles" },
  color_oris: { lesson: "day-07-color-science-icc-profiles-and-delta-e", title: "Color Science and Measurement" },
  metis_scanning: { lesson: "day-09-metis-scanning-and-material-surface-imaging", title: "METIS Scanning & Imaging" },
  customer_docs: { lesson: "day-12-customer-support-and-documentation", title: "Customer Support & Documentation" },
  company_interview: { lesson: "day-01-cgs-oris-and-field-service", title: "Company & Field Service Foundations" },
};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const profileResult = await query<{
      target_interview_date: string | null;
      active_track: "course_14" | "bootcamp";
      experience_level: string;
    }>(
      `SELECT target_interview_date, active_track, experience_level
         FROM profiles WHERE user_id = $1`,
      [user.id],
    );
    const profile = profileResult.rows[0];
    if (!profile) return NextResponse.json({ error: "Learner profile not found" }, { status: 404 });

    const lessonResult = await query(
      `SELECT l.id, l.day_number, l.bootcamp_day_number, l.title, l.slug,
              l.competency_domain, l.estimated_minutes,
              COALESCE(lp.status, 'not_started') AS status,
              COALESCE(lp.time_spent_seconds, 0) AS time_spent_seconds,
              lp.completed_at
         FROM lessons l
         LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
        ORDER BY l.day_number`,
      [user.id],
    );
    const lessons = lessonResult.rows;
    const trackLessons = profile.active_track === "bootcamp"
      ? lessons.filter((lesson: any) => lesson.bootcamp_day_number !== null)
      : lessons;
    const completedCount = trackLessons.filter((lesson: any) => lesson.status === "completed").length;
    const inProgressCount = trackLessons.filter((lesson: any) => lesson.status === "in_progress").length;
    const totalLessons = trackLessons.length;
    const overallProgressPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
    const nextLesson = trackLessons.find((lesson: any) => lesson.status === "in_progress")
      || trackLessons.find((lesson: any) => lesson.status !== "completed")
      || null;

    const competencyResult = await query(
      `SELECT domain, observed_score, weight_percentage, total_evaluations, updated_at
         FROM competency_scores
        WHERE user_id = $1
        ORDER BY weight_percentage DESC`,
      [user.id],
    );
    const competencyRows = competencyResult.rows.length
      ? competencyResult.rows
      : Object.entries(COMPETENCY_WEIGHTS).map(([domain, weight]) => ({
          domain, observed_score: 0, weight_percentage: weight, total_evaluations: 0, updated_at: null,
        }));
    const assessed = competencyRows.filter((row: any) => Number(row.total_evaluations) > 0);
    const weakest = assessed.sort((a: any, b: any) => Number(a.observed_score) - Number(b.observed_score))[0] || null;

    let recommendedAction;
    if (weakest) {
      const target = reviewTargets[weakest.domain as CompetencyDomain];
      recommendedAction = {
        type: "lesson",
        title: target.title,
        slug: target.lesson,
        domain: weakest.domain,
        reason: `Your saved practice assessments average ${Number(weakest.observed_score).toFixed(0)}% in this domain across ${weakest.total_evaluations} recorded attempt(s). This is a coaching signal, not a field-competence rating. Review the lesson and retry a related knowledge check.`,
      };
    } else if (nextLesson) {
      recommendedAction = {
        type: "lesson",
        title: `Start Day ${profile.active_track === "bootcamp" ? nextLesson.bootcamp_day_number : nextLesson.day_number}: ${nextLesson.title}`,
        slug: nextLesson.slug,
        domain: nextLesson.competency_domain,
        reason: "No scored practice assessment is recorded yet. Begin with a lesson; this practice summary updates after you submit a knowledge check or interview exercise.",
      };
    } else {
      recommendedAction = null;
    }

    const [notes, quizAttempts, scenarioRuns, studyStats] = await Promise.all([
      query(
        `SELECT id, reference_type, reference_id, title, note_text, updated_at
           FROM user_notes WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 5`,
        [user.id],
      ),
      query(
        `SELECT qa.id, qa.score, qa.total_questions, qa.passed, qa.created_at,
                l.title AS lesson_title, l.day_number
           FROM quiz_attempts qa
           JOIN lessons l ON l.id = qa.lesson_id
          WHERE qa.user_id = $1
          ORDER BY qa.created_at DESC LIMIT 5`,
        [user.id],
      ),
      query(
        `SELECT sr.id, sr.status, sr.total_score, sr.safety_score, sr.diagnostic_score,
                sr.completed_at, s.title, s.scenario_number
           FROM scenario_runs sr
           JOIN troubleshooting_scenarios s ON s.id = sr.scenario_id
          WHERE sr.user_id = $1
          ORDER BY sr.created_at DESC LIMIT 5`,
        [user.id],
      ),
      query(
        `SELECT COALESCE(SUM(time_spent_seconds), 0) AS study_seconds,
                COUNT(*) FILTER (WHERE status = 'completed') AS completed_lessons,
                (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1) AS quiz_attempts
           FROM lesson_progress WHERE user_id = $1`,
        [user.id],
      ),
    ]);

    const interviewDate = profile.target_interview_date
      ? new Date(`${String(profile.target_interview_date).slice(0, 10)}T00:00:00.000Z`)
      : null;
    const today = new Date();
    const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const daysRemaining = interviewDate
      ? Math.ceil((interviewDate.getTime() - todayUtc) / 86_400_000)
      : null;

    return NextResponse.json({
      profile,
      daysRemaining,
      targetInterviewDate: profile.target_interview_date,
      activeTrack: profile.active_track,
      overallProgressPercent,
      completedCount,
      totalLessons,
      inProgressCount,
      nextLesson,
      lessons,
      competencies: competencyRows,
      weakestDomain: weakest?.domain ?? null,
      recommendedAction,
      recentNotes: notes.rows,
      recentQuizAttempts: quizAttempts.rows,
      recentScenarioRuns: scenarioRuns.rows,
      studyHistory: studyStats.rows[0] ?? { study_seconds: 0, completed_lessons: 0, quiz_attempts: 0 },
    });
  } catch (error) {
    console.error("Dashboard query failed", error);
    return NextResponse.json({ error: "Unable to load dashboard data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Update details are required." }, { status: 400 });
    const updates: string[] = [];
    const values: unknown[] = [];

    if (Object.hasOwn(body, "targetInterviewDate")) {
      const raw = body.targetInterviewDate;
      if (raw !== null && (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw) || Number.isNaN(Date.parse(`${raw}T00:00:00Z`)))) {
        return NextResponse.json({ error: "Interview date must be a valid date or empty." }, { status: 400 });
      }
      values.push(raw || null);
      updates.push(`target_interview_date = $${values.length}`);
    }

    if (Object.hasOwn(body, "activeTrack")) {
      if (body.activeTrack !== "course_14" && body.activeTrack !== "bootcamp") {
        return NextResponse.json({ error: "Choose either the 14-day course or 3-day bootcamp." }, { status: 400 });
      }
      values.push(body.activeTrack);
      updates.push(`active_track = $${values.length}`);
    }

    if (updates.length === 0) return NextResponse.json({ error: "No supported profile changes supplied." }, { status: 400 });
    values.push(user.id);
    await query(
      `UPDATE profiles SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${values.length}`,
      values,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dashboard profile update failed", error);
    return NextResponse.json({ error: "Unable to save your profile preference." }, { status: 500 });
  }
}
