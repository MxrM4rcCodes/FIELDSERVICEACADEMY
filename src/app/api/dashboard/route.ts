import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Profile and Interview Countdown
    const profileRes = await query(
      `SELECT target_interview_date, active_track, notes, experience_level 
       FROM profiles WHERE user_id = $1;`,
      [user.id]
    );
    const profile = profileRes.rows[0] || {
      target_interview_date: "2026-10-26",
      active_track: "course_14",
    };

    // Calculate days remaining
    const targetDate = new Date(profile.target_interview_date);
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // 2. Course Progress
    const totalLessonsRes = await query("SELECT count(*) FROM lessons;");
    const totalLessons = parseInt(totalLessonsRes.rows[0]?.count || "14", 10);

    const progressRes = await query(
      `SELECT l.id, l.day_number, l.title, l.slug, l.competency_domain, l.estimated_minutes,
              lp.status, lp.time_spent_seconds, lp.completed_at
       FROM lessons l
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
       ORDER BY l.day_number ASC;`,
      [user.id]
    );

    const lessons = progressRes.rows;
    const completedCount = lessons.filter((l) => l.status === "completed").length;
    const inProgressCount = lessons.filter((l) => l.status === "in_progress").length;
    const overallProgressPercent = Math.round((completedCount / totalLessons) * 100);

    // Find next resume lesson
    const nextLesson =
      lessons.find((l) => l.status === "in_progress") ||
      lessons.find((l) => l.status !== "completed") ||
      lessons[0];

    // 3. Competency Scores
    const compRes = await query(
      `SELECT domain, observed_score, weight_percentage, total_evaluations, updated_at
       FROM competency_scores WHERE user_id = $1
       ORDER BY weight_percentage DESC;`,
      [user.id]
    );

    let competencies = compRes.rows;
    if (competencies.length === 0) {
      // Default domain weights
      competencies = [
        { domain: "hardware_safety", observed_score: "45.00", weight_percentage: "35.00", total_evaluations: 3 },
        { domain: "color_oris", observed_score: "32.00", weight_percentage: "25.00", total_evaluations: 2 },
        { domain: "metis_scanning", observed_score: "25.00", weight_percentage: "15.00", total_evaluations: 1 },
        { domain: "customer_docs", observed_score: "50.00", weight_percentage: "15.00", total_evaluations: 2 },
        { domain: "company_interview", observed_score: "40.00", weight_percentage: "10.00", total_evaluations: 2 },
      ];
    }

    // Find weakest domain
    const sortedByScore = [...competencies].sort(
      (a, b) => parseFloat(a.observed_score) - parseFloat(b.observed_score)
    );
    const weakestDomain = sortedByScore[0]?.domain || "metis_scanning";

    // 4. Adaptive Recommendation Engine
    let recommendedAction = {
      type: "lesson",
      title: "METIS Scanning and Material Surface Imaging",
      slug: "day-09-metis-scanning-and-material-surface-imaging",
      domain: "metis_scanning",
      reason: `Your lowest competency score is in METIS Scanning (${sortedByScore[0]?.observed_score}%). Reviewing Day 9 will strengthen your surface capture and optical calibration foundation.`,
    };

    if (weakestDomain === "color_oris") {
      recommendedAction = {
        type: "lesson",
        title: "Color Science, ICC Profiles, and Delta E",
        slug: "day-07-color-science-icc-profiles-and-delta-e",
        domain: "color_oris",
        reason: `Your Color Science & ORIS mastery is currently at ${sortedByScore[0]?.observed_score}%. Revisit Day 7 to master CIELAB, Delta E 2000, and DeviceLink profiling.`,
      };
    } else if (weakestDomain === "hardware_safety") {
      recommendedAction = {
        type: "scenario",
        title: "Case #10: Unsafe Condition & Shutdown",
        slug: "case-10-unsafe-condition-shutdown",
        domain: "hardware_safety",
        reason: `Hardware & Safety carries the highest priority weight (35%). Run Scenario 10 to practice OSHA LOTO and drag-chain electrical inspection.`,
      };
    } else if (weakestDomain === "customer_docs") {
      recommendedAction = {
        type: "lesson",
        title: "Customer Support & Service Tickets",
        slug: "day-12-customer-support-and-documentation",
        domain: "customer_docs",
        reason: `Customer Documentation is at ${sortedByScore[0]?.observed_score}%. Practice drafting formal Field Service Reports in Day 12.`,
      };
    }

    // 5. Recent User Notes
    const notesRes = await query(
      `SELECT id, reference_type, reference_id, title, note_text, updated_at
       FROM user_notes WHERE user_id = $1
       ORDER BY updated_at DESC LIMIT 5;`,
      [user.id]
    );

    // 6. Recent Quiz Attempts
    const attemptsRes = await query(
      `SELECT qa.id, qa.score, qa.total_questions, qa.passed, qa.created_at, l.title as lesson_title, l.day_number
       FROM quiz_attempts qa
       JOIN lessons l ON l.id = qa.lesson_id
       WHERE qa.user_id = $1
       ORDER BY qa.created_at DESC LIMIT 5;`,
      [user.id]
    );

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
      competencies,
      weakestDomain,
      recommendedAction,
      recentNotes: notesRes.rows,
      recentQuizAttempts: attemptsRes.rows,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load dashboard" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Update target interview date or active track
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetInterviewDate, activeTrack } = await req.json();

    if (targetInterviewDate) {
      await query(
        `UPDATE profiles SET target_interview_date = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2;`,
        [targetInterviewDate, user.id]
      );
    }

    if (activeTrack) {
      await query(
        `UPDATE profiles SET active_track = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2;`,
        [activeTrack, user.id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
