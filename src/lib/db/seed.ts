import { getDb, query } from "./index";
import { getSeedUsers, initialCompetencies } from "./seed-data/users";
import { seedTracks, seedModules, seedLessons } from "./seed-data/lessons";
import { seedScenarios } from "./seed-data/scenarios";
import { seedFlashcards } from "./seed-data/flashcards";
import { seedInterviewQuestions } from "./seed-data/interview";
import { seedReferences } from "./seed-data/references";

export async function runSeed() {
  console.log("[SEED] Initializing CGS ORIS Academy seed data...");
  const db = await getDb();

  // 1. Tracks
  for (const track of seedTracks) {
    await db.query(
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
      description: "Accelerated 8-hour sprint for CGS ORIS Americas Field Service Technician candidates.",
      sort_order: 1,
    },
    {
      id: "crs_14_day",
      track_id: "trk_course_14",
      title: "Comprehensive 14-Day Field Service Course",
      description: "Full-depth industrial printing, scanning, color management, and field operations academy.",
      sort_order: 2,
    },
  ];

  for (const crs of courses) {
    await db.query(
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
    await db.query(
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

    await db.query(
      `INSERT INTO lessons (id, module_id, day_number, bootcamp_day_number, title, slug, summary, estimated_minutes, competency_domain, objectives, prerequisites, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         summary = EXCLUDED.summary,
         estimated_minutes = EXCLUDED.estimated_minutes,
         competency_domain = EXCLUDED.competency_domain,
         objectives = EXCLUDED.objectives,
         prerequisites = EXCLUDED.prerequisites,
         bootcamp_day_number = EXCLUDED.bootcamp_day_number;`,
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
      await db.query(
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
      await db.query(
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
        await db.query(
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
    await db.query(
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

  // 5. Users & Profiles
  const seedUsers = await getSeedUsers();
  for (const u of seedUsers) {
    await db.query(
      `INSERT INTO users (id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         full_name = EXCLUDED.full_name,
         role = EXCLUDED.role;`,
      [u.id, u.email, u.password_hash, u.full_name, u.role]
    );

    await db.query(
      `INSERT INTO profiles (id, user_id, target_interview_date, active_track, experience_level, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         target_interview_date = EXCLUDED.target_interview_date,
         active_track = EXCLUDED.active_track,
         notes = EXCLUDED.notes;`,
      [u.profile.id, u.id, u.profile.target_interview_date, u.profile.active_track, u.profile.experience_level, u.profile.notes]
    );
  }

  // 6. Initial Competency Scores for Learner
  const learnerId = "usr_learner_01";
  for (const c of initialCompetencies) {
    await db.query(
      `INSERT INTO competency_scores (id, user_id, domain, observed_score, weight_percentage, total_evaluations)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, domain) DO UPDATE SET
         observed_score = EXCLUDED.observed_score,
         weight_percentage = EXCLUDED.weight_percentage,
         total_evaluations = EXCLUDED.total_evaluations;`,
      [`comp_${learnerId}_${c.domain}`, learnerId, c.domain, c.score, c.weight, c.evals]
    );
  }

  // 7. Seed Learner Initial Lesson Progress
  await db.query(
    `INSERT INTO lesson_progress (id, user_id, lesson_id, status, time_spent_seconds, completed_at)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, lesson_id) DO UPDATE SET
       status = EXCLUDED.status;`,
    [`prog_${learnerId}_01`, learnerId, "les_day_01", "completed", 5400]
  );
  await db.query(
    `INSERT INTO lesson_progress (id, user_id, lesson_id, status, time_spent_seconds, completed_at)
     VALUES ($1, $2, $3, $4, $5, NULL)
     ON CONFLICT (user_id, lesson_id) DO UPDATE SET
       status = EXCLUDED.status;`,
    [`prog_${learnerId}_02`, learnerId, "les_day_02", "in_progress", 2100]
  );

  // 8. Troubleshooting Scenarios & Nodes & Choices
  for (const scn of seedScenarios) {
    const scnId = `scn_${String(scn.scenarioNumber).padStart(2, "0")}`;
    await db.query(
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

    for (const node of scn.nodes) {
      const nodeId = `${scnId}_${node.nodeKey}`;
      await db.query(
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
        await db.query(
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
    await db.query(
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

    // Initial mastery for learner on first 5 cards
    if (fc.sortOrder <= 5) {
      await db.query(
        `INSERT INTO flashcard_mastery (id, user_id, flashcard_id, mastery_level, review_count, correct_count)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, flashcard_id) DO NOTHING;`,
        [`fcm_${learnerId}_${fc.id}`, learnerId, fc.id, 3, 4, 3]
      );
    }
  }

  // 10. Interview Questions
  for (const iq of seedInterviewQuestions) {
    await db.query(
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

  // 11. Initial Sample Service Ticket
  await db.query(
    `INSERT INTO service_tickets (
      id, user_id, ticket_number, customer_name, equipment_model, serial_number,
      customer_complaint, safety_assessment, configuration_notes,
      diagnostic_tests_performed, observations, actions_taken, verification_results,
      customer_communication, escalation_follow_up, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
    ) ON CONFLICT (ticket_number) DO NOTHING;`,
    [
      "tkt_sample_01",
      learnerId,
      "FSR-2026-1001",
      "Apex Visual Packaging (Minneapolis, MN)",
      "Platinum Flatbed 2513 UV",
      "PT-2513-8942",
      "Fine horizontal white lines appearing across Cyan solid background on 4mm corrugated plastic.",
      "Lockout/Tagout performed at primary 208V disconnect; 0.0V measured L1-L2, L2-L3, L-G; nitrile gloves and UV eye protection worn.",
      "Onyx RIP v22 with CGS ORIS DeviceLink profile; 8-pass bi-directional mode; 395nm UV LED lamps at 80% power.",
      "Standard nozzle check pattern; 10x optical loupe inspection of nozzle plate; sub-tank meniscus vacuum measured with digital manometer.",
      "Nozzle check confirmed 16 missing nozzles on Cyan channel 2. Rubber wiper blade edge had baked-on ink crust. Sub-tank vacuum measured -1.8 kPa (nominal spec: -3.0 to -3.5 kPa).",
      "Cleaned wiper blade and capping seal with polyester lint-free swabs and approved solvent flush. Adjusted vacuum regulator to -3.2 kPa. Executed controlled 2-second positive pressure purge.",
      "Fresh nozzle check showed 100% nozzle firing across all channels. Printed 4x8 ft solid blue test target: zero banding, crisp edges, Delta E < 1.0.",
      "Demonstrated daily capping and wiper swab procedure to lead operator Dave M.; provided 1 box of lint-free swabs.",
      "No escalation required. Call closed in 1.5 hours.",
      "completed",
    ]
  );

  // 12. General References
  for (const ref of seedReferences) {
    await db.query(
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

  // 13. Sample User Notes
  await db.query(
    `INSERT INTO user_notes (id, user_id, reference_type, reference_id, title, note_text)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO NOTHING;`,
    [
      "note_01",
      learnerId,
      "lesson",
      "les_day_03",
      "LOTO vs E-Stop Key Rule",
      "Remember: E-Stop cuts control relay power, but does NOT isolate incoming primary AC power or discharge capacitor banks. Always padlock the main wall disconnect and meter line-to-line before touching wires!",
    ]
  );

  console.log("[SEED] All seed data populated successfully!");
}
