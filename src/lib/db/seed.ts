import { query } from "./index";
import { seedTracks, seedModules, seedLessons } from "./seed-data/lessons";
import { seedScenarios } from "./seed-data/scenarios";
import { seedFlashcards } from "./seed-data/flashcards";
import { seedInterviewQuestions } from "./seed-data/interview";
import { seedReferences } from "./seed-data/references";

export async function runSeed() {
  console.log("[SEED] Initializing CGS ORIS Academy seed data...");

  // 1. Tracks
  for (const track of seedTracks) {
    await query(
      `INSERT INTO learning_tracks (id, slug, title, subtitle, description, total_days, estimated_hours, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         subtitle = EXCLUDED.subtitle,
         description = EXCLUDED.description,
         total_days = EXCLUDED.total_days,
         estimated_hours = EXCLUDED.estimated_hours;`,
      [track.id, track.slug, track.title, track.subtitle, track.description, track.total_days, track.estimated_hours, track.sort_order]
    );
  }

  // 2. Courses (Bootcamp Course & 14-Day Full Course)
  const courses = [
    {
      id: "crs_bootcamp",
      track_id: "trk_bootcamp",
      title: "3-Day Interview Bootcamp",
      description: "Independent three-day interview-preparation study path. Six lessons are grouped across three bootcamp days; it is not an employer training or certification program.",
      sort_order: 1,
    },
    {
      id: "crs_14_day",
      track_id: "trk_course_14",
      title: "Comprehensive 14-Day Field Service Course",
      description: "Independent fourteen-day curriculum for industrial imaging, safety concepts, evidence-led diagnosis, documentation, and interview practice. Model-specific work requires current authorized documentation.",
      sort_order: 2,
    },
  ];

  for (const crs of courses) {
    await query(
      `INSERT INTO courses (id, track_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description;`,
      [crs.id, crs.track_id, crs.title, crs.description, crs.sort_order]
    );
  }

  // 3. Modules
  for (const mod of seedModules) {
    await query(
      `INSERT INTO modules (id, course_id, title, slug, category, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         category = EXCLUDED.category;`,
      [mod.id, "crs_14_day", mod.title, mod.slug, mod.category, mod.sortOrder]
    );
  }

  // 4. Lessons & Content Blocks & Quizzes
  // Map days to modules
  const dayToModuleMap: Record<number, string> = {
    1: "mod_foundation",
    2: "mod_foundation",
    3: "mod_hardware_safety",
    4: "mod_hardware_safety",
    5: "mod_hardware_safety",
    6: "mod_hardware_safety",
    7: "mod_imaging_color",
    8: "mod_imaging_color",
    9: "mod_scanning",
    10: "mod_field_ops",
    11: "mod_field_ops",
    12: "mod_field_ops",
    13: "mod_interview",
    14: "mod_interview",
  };

  for (const les of seedLessons) {
    const moduleId = dayToModuleMap[les.dayNumber] || "mod_foundation";
    const lessonId = `les_day_${String(les.dayNumber).padStart(2, "0")}`;

    await query(
      `INSERT INTO lessons (id, module_id, day_number, bootcamp_day_number, title, slug, summary, estimated_minutes, competency_domain, objectives, prerequisites, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE SET
         module_id = EXCLUDED.module_id,
         day_number = EXCLUDED.day_number,
         bootcamp_day_number = EXCLUDED.bootcamp_day_number,
         title = EXCLUDED.title,
         slug = EXCLUDED.slug,
         summary = EXCLUDED.summary,
         estimated_minutes = EXCLUDED.estimated_minutes,
         competency_domain = EXCLUDED.competency_domain,
         objectives = EXCLUDED.objectives,
         prerequisites = EXCLUDED.prerequisites,
         sort_order = EXCLUDED.sort_order;`,
      [
        lessonId,
        moduleId,
        les.dayNumber,
        les.bootcampDayNumber || null,
        les.title,
        les.slug,
        les.summary,
        les.estimatedMinutes,
        les.competencyDomain,
        les.objectives,
        les.prerequisites,
        les.dayNumber,
      ]
    );

    // Insert Content Blocks
    let blockOrder = 1;
    for (const block of les.contentBlocks) {
      const blockId = `${lessonId}_blk_${blockOrder}`;
      await query(
        `INSERT INTO lesson_content_blocks (id, lesson_id, section_title, block_type, content_markdown, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           section_title = EXCLUDED.section_title,
           content_markdown = EXCLUDED.content_markdown;`,
        [blockId, lessonId, block.sectionTitle, block.blockType, block.contentMarkdown, blockOrder]
      );
      blockOrder++;
    }

    // Insert Quiz Questions & Options
    let qOrder = 1;
    for (const q of les.questions) {
      const qId = `${lessonId}_q_${qOrder}`;
      await query(
        `INSERT INTO quiz_questions (id, lesson_id, question_text, competency_domain, explanation, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           question_text = EXCLUDED.question_text,
           explanation = EXCLUDED.explanation;`,
        [qId, lessonId, q.text, q.domain, q.explanation, qOrder]
      );

      let optOrder = 1;
      for (const opt of q.options) {
        const optId = `${qId}_opt_${optOrder}`;
        await query(
          `INSERT INTO quiz_options (id, question_id, option_text, is_correct, explanation, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             option_text = EXCLUDED.option_text,
             is_correct = EXCLUDED.is_correct,
             explanation = EXCLUDED.explanation;`,
          [optId, qId, opt.text, opt.isCorrect, opt.explanation, optOrder]
        );
        optOrder++;
      }
      qOrder++;
    }

    // Insert Source Reference
    const refId = `ref_les_${String(les.dayNumber).padStart(2, "0")}`;
    await query(
      `INSERT INTO source_references (id, lesson_id, title, citation, confidence_level, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         citation = EXCLUDED.citation,
         confidence_level = EXCLUDED.confidence_level,
         notes = EXCLUDED.notes;`,
      [refId, lessonId, les.sourceRef.title, les.sourceRef.citation, les.sourceRef.confidenceLevel, les.sourceRef.notes]
    );
  }

  // 8. Troubleshooting Scenarios & Nodes & Choices
  for (const scn of seedScenarios) {
    const scnId = `scn_${String(scn.scenarioNumber).padStart(2, "0")}`;
    await query(
      `INSERT INTO troubleshooting_scenarios (id, scenario_number, title, slug, category, difficulty, customer_complaint, equipment_context, recent_changes, hidden_root_cause, initial_node_key, verification_criteria)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         customer_complaint = EXCLUDED.customer_complaint,
         equipment_context = EXCLUDED.equipment_context,
         recent_changes = EXCLUDED.recent_changes,
         hidden_root_cause = EXCLUDED.hidden_root_cause,
         verification_criteria = EXCLUDED.verification_criteria;`,
      [
        scnId,
        scn.scenarioNumber,
        scn.title,
        scn.slug,
        scn.category,
        scn.difficulty,
        scn.customerComplaint,
        scn.equipmentContext,
        scn.recentChanges,
        scn.hiddenRootCause,
        scn.initialNodeKey,
        scn.verificationCriteria,
      ]
    );

    const nodeKeys = scn.nodes.map((node) => node.nodeKey);
    if (new Set(nodeKeys).size !== nodeKeys.length || !nodeKeys.includes(scn.initialNodeKey)) {
      throw new Error(`Scenario ${scn.slug} has duplicate node keys or a missing initial node.`);
    }
    const validNodeKeys = new Set(nodeKeys);
    for (const scenarioNode of scn.nodes) {
      for (const scenarioChoice of scenarioNode.choices) {
        if (!validNodeKeys.has(scenarioChoice.targetNodeKey)) {
          throw new Error(`Scenario ${scn.slug} choice ${scenarioChoice.choiceKey} points to a missing node.`);
        }
      }
    }

    // Retire in-progress runs that point to nodes removed from this content revision.
    // Their choice events remain as history; learners can start a fresh run.
    await query(
      `UPDATE scenario_runs
          SET status = 'abandoned', completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP)
        WHERE scenario_id = $1 AND status = 'in_progress'
          AND NOT (current_node_key = ANY($2::text[]))`,
      [scnId, nodeKeys],
    );

    // Reconcile the graph instead of merely upserting: stale choices can contain old,
    // unsafe instructions, and stale nodes must not remain addressable after reseeding.
    await query(
      `DELETE FROM scenario_choices
        WHERE node_id IN (SELECT id FROM scenario_nodes WHERE scenario_id = $1)`,
      [scnId],
    );
    await query(
      `DELETE FROM scenario_nodes
        WHERE scenario_id = $1 AND NOT (node_key = ANY($2::text[]))`,
      [scnId, nodeKeys],
    );

    for (const node of scn.nodes) {
      const nodeId = `${scnId}_${node.nodeKey}`;
      await query(
        `INSERT INTO scenario_nodes (id, scenario_id, node_key, title, description, node_type, is_terminal, is_hazardous)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (scenario_id, node_key) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           node_type = EXCLUDED.node_type,
           is_terminal = EXCLUDED.is_terminal,
           is_hazardous = EXCLUDED.is_hazardous;`,
        [nodeId, scnId, node.nodeKey, node.title, node.description, node.nodeType, node.isTerminal, node.isHazardous]
      );

      for (const choice of node.choices) {
        const choiceId = `${nodeId}_${choice.choiceKey}`;
        await query(
          `INSERT INTO scenario_choices (id, node_id, choice_key, text, target_node_key, test_revealed_evidence, points_safety, points_diagnostic, points_cost, feedback, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO UPDATE SET
             text = EXCLUDED.text,
             target_node_key = EXCLUDED.target_node_key,
             test_revealed_evidence = EXCLUDED.test_revealed_evidence,
             points_safety = EXCLUDED.points_safety,
             points_diagnostic = EXCLUDED.points_diagnostic,
             points_cost = EXCLUDED.points_cost,
             feedback = EXCLUDED.feedback;`,
          [
            choiceId,
            nodeId,
            choice.choiceKey,
            choice.text,
            choice.targetNodeKey,
            choice.testRevealedEvidence || null,
            choice.pointsSafety,
            choice.pointsDiagnostic,
            choice.pointsCost,
            choice.feedback,
            choice.sortOrder,
          ]
        );
      }
    }
  }

  // 9. Flashcards
  for (const fc of seedFlashcards) {
    await query(
      `INSERT INTO flashcards (id, term, category, pronunciation, definition, field_context, key_takeaway, common_misconception, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         term = EXCLUDED.term,
         category = EXCLUDED.category,
         definition = EXCLUDED.definition,
         field_context = EXCLUDED.field_context,
         key_takeaway = EXCLUDED.key_takeaway,
         common_misconception = EXCLUDED.common_misconception;`,
      [fc.id, fc.term, fc.category, fc.pronunciation || null, fc.definition, fc.fieldContext, fc.keyTakeaway, fc.commonMisconception, fc.sortOrder]
    );


  }

  // 10. Interview Questions
  for (const iq of seedInterviewQuestions) {
    await query(
      `INSERT INTO interview_questions (id, question_text, category, competency_domain, difficulty, model_answer, evaluation_rubric, transferable_skills_tips, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         question_text = EXCLUDED.question_text,
         model_answer = EXCLUDED.model_answer,
         evaluation_rubric = EXCLUDED.evaluation_rubric,
         transferable_skills_tips = EXCLUDED.transferable_skills_tips;`,
      [
        iq.id,
        iq.questionText,
        iq.category,
        iq.competencyDomain,
        iq.difficulty,
        iq.modelAnswer,
        JSON.stringify(iq.evaluationRubric),
        iq.transferableSkillsTips,
        iq.sortOrder,
      ]
    );
  }

  // 12. General References
  for (const ref of seedReferences) {
    await query(
      `INSERT INTO source_references (id, lesson_id, title, citation, confidence_level, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         citation = EXCLUDED.citation,
         confidence_level = EXCLUDED.confidence_level,
         notes = EXCLUDED.notes;`,
      [ref.id, ref.lessonId || null, ref.title, ref.citation, ref.confidenceLevel, ref.notes]
    );
  }

  console.log("[SEED] All seed data populated successfully!");
}
