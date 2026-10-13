import { beforeAll, describe, expect, it } from "vitest";
import { query } from "../src/lib/db";
import { runSeed } from "../src/lib/db/seed";
import { seedFlashcards } from "../src/lib/db/seed-data/flashcards";
import { seedLessons } from "../src/lib/db/seed-data/lessons";

describe("Database, migrations, and curriculum integrity", () => {
  beforeAll(async () => {
    await runSeed();
  });

  it("seeds the 14-day course and preserves the Day 3 safety lesson slug", async () => {
    const result = await query<{ day_number: number; slug: string; bootcamp_day_number: number | null }>(
      "SELECT day_number, slug, bootcamp_day_number FROM lessons ORDER BY day_number",
    );
    expect(result.rows).toHaveLength(14);
    expect(result.rows.map((row) => row.day_number)).toEqual(Array.from({ length: 14 }, (_, index) => index + 1));
    expect(result.rows.find((row) => row.day_number === 3)?.slug).toBe("day-03-equipment-safety");
    expect(result.rows.find((row) => row.day_number === 1)).toMatchObject({
      slug: "day-01-cgs-oris-and-field-service",
      bootcamp_day_number: 1,
    });
    expect(seedLessons.find((lesson) => lesson.dayNumber === 1)?.slug).toBe("day-01-cgs-oris-and-field-service");
    expect(result.rows.filter((row) => row.bootcamp_day_number !== null)).toHaveLength(6);
    expect([1, 2, 3].every((day) => result.rows.filter((row) => row.bootcamp_day_number === day).length === 2)).toBe(true);
  });

  it("reconciles a legacy Day 3 slug to the stable lesson identity when reseeding", async () => {
    await query(
      "UPDATE lessons SET slug = 'day-03-equipment-safety-and-loto-principles' WHERE id = 'les_day_03'",
    );
    await runSeed();
    const result = await query<{ slug: string }>("SELECT slug FROM lessons WHERE id = 'les_day_03'");
    expect(result.rows).toEqual([{ slug: "day-03-equipment-safety" }]);
    const staleRows = await query<{ count: string }>(
      "SELECT count(*) AS count FROM lessons WHERE slug = 'day-03-equipment-safety-and-loto-principles'",
    );
    expect(Number(staleRows.rows[0].count)).toBe(0);
  });

  it("gives every lesson substantive instruction and a five-question assessment with rationales", async () => {
    const lessonRows = await query<{ id: string; slug: string; day_number: number }>(
      "SELECT id, slug, day_number FROM lessons ORDER BY day_number",
    );
    expect(lessonRows.rows).toHaveLength(14);
    expect(seedLessons).toHaveLength(14);

    for (const lesson of lessonRows.rows) {
      const questions = await query<{ question_text: string; explanation: string; option_count: string; correct_count: string; rationale_count: string }>(
        `SELECT q.question_text, q.explanation,
                count(o.id) AS option_count,
                count(o.id) FILTER (WHERE o.is_correct = TRUE) AS correct_count,
                count(o.id) FILTER (WHERE length(o.explanation) >= 12) AS rationale_count
           FROM quiz_questions q
           LEFT JOIN quiz_options o ON o.question_id = q.id
          WHERE q.lesson_id = $1
          GROUP BY q.id ORDER BY q.sort_order`,
        [lesson.id],
      );
      expect(questions.rows, `Day ${lesson.day_number} question count`).toHaveLength(5);
      expect(questions.rows.every((question) => question.question_text.length >= 20 && question.explanation.length >= 20)).toBe(true);
      expect(questions.rows.every((question) => Number(question.option_count) === 4 && Number(question.correct_count) === 1 && Number(question.rationale_count) === 4)).toBe(true);

      const blocks = await query<{ block_type: string; content_markdown: string }>(
        `SELECT block_type, content_markdown FROM lesson_content_blocks
          WHERE lesson_id = $1 ORDER BY sort_order`,
        [lesson.id],
      );
      expect(blocks.rows.length, `Day ${lesson.day_number} content blocks`).toBeGreaterThanOrEqual(4);
      expect(blocks.rows.filter((block) => block.block_type === "teaching").length, `Day ${lesson.day_number} teaching sections`).toBeGreaterThanOrEqual(2);
      expect(blocks.rows.reduce((length, block) => length + block.content_markdown.length, 0), `Day ${lesson.day_number} instruction length`).toBeGreaterThan(1200);
    }
  });

  it("seeds ten valid branching cases and exactly 66 flashcards across eight categories", async () => {
    const scenarios = await query<{ count: string }>("SELECT count(*) AS count FROM troubleshooting_scenarios");
    expect(Number(scenarios.rows[0].count)).toBe(10);

    const cards = await query<{ count: string; categories: string }>(
      "SELECT count(*) AS count, count(DISTINCT category) AS categories FROM flashcards",
    );
    expect(Number(cards.rows[0].count)).toBe(66);
    expect(Number(cards.rows[0].categories)).toBe(8);
    expect(seedFlashcards).toHaveLength(66);
  });

  it("does not install public demo credentials or sample learner history", async () => {
    const result = await query<{ count: string }>(
      `SELECT count(*) AS count FROM users
        WHERE LOWER(email) IN ('admin@cgs-oris.academy', 'technician@cgs-oris.academy')`,
    );
    expect(Number(result.rows[0].count)).toBe(0);
    const exampleRecords = await query<{ count: string }>(
      `SELECT
         (SELECT count(*) FROM lesson_progress) +
         (SELECT count(*) FROM quiz_attempts) +
         (SELECT count(*) FROM scenario_runs) +
         (SELECT count(*) FROM user_notes) +
         (SELECT count(*) FROM practice_attempts) AS count`,
    );
    expect(Number(exampleRecords.rows[0].count)).toBe(0);
  });
});
