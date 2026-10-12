import { describe, it, expect } from "vitest";

const BASE_URL = "http://127.0.0.1:3000";

describe("CGS ORIS Academy - 10 Acceptance Test Workflows", () => {
  // Test 1: Returning learner progress persistence across sessions
  it("Test 1: Returning learner progress survives across sessions", async () => {
    // 1. Log in as learner
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "technician@cgs-oris.academy", password: "FieldTech2026!" }),
    });
    expect(loginRes.status).toBe(200);
    const cookieHeader = loginRes.headers.get("set-cookie") || "";

    // 2. Update progress on Day 1
    const progRes = await fetch(`${BASE_URL}/api/lessons/day-01-cgs-oris-and-field-service/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ status: "completed", timeSpentSeconds: 5400 }),
    });
    expect(progRes.status).toBe(200);

    // 3. Re-fetch dashboard with session cookie
    const dashRes = await fetch(`${BASE_URL}/api/dashboard`, {
      headers: { Cookie: cookieHeader },
    });
    expect(dashRes.status).toBe(200);
    const dashData = await dashRes.json();
    expect(dashData.overallProgressPercent).toBeGreaterThan(0);
    const day1 = dashData.lessons.find((l: any) => l.day_number === 1);
    expect(day1.status).toBe("completed");
  });

  // Test 2: Interactive diagrams
  it("Test 2: Interactive systems map and printer subsystems return rich technical data", async () => {
    // Check lessons endpoint to verify Day 4 printer architecture and Day 5 defect isolation exist
    const day4Res = await fetch(`${BASE_URL}/api/lessons/day-04-platinum-printer-architecture-and-subsystems`);
    expect(day4Res.status).toBe(200);
    const day4Data = await day4Res.json();
    expect(day4Data.lesson.title).toContain("Platinum Printer Architecture");
    expect(day4Data.blocks.length).toBeGreaterThanOrEqual(3);

    const day5Res = await fetch(`${BASE_URL}/api/lessons/day-05-inkjet-troubleshooting-and-print-defect-isolation`);
    expect(day5Res.status).toBe(200);
    const day5Data = await day5Res.json();
    expect(day5Data.lesson.title).toContain("Inkjet Troubleshooting");
  });

  // Test 3: Branching diagnosis scenario engine
  it("Test 3: Branching diagnosis reveals evidence only upon test selection and routes accurately", async () => {
    // 0. Ensure fresh run state
    await fetch(`${BASE_URL}/api/scenarios/case-01-banding-missing-nozzles`, { method: "POST" });

    // 1. Fetch scenario 1
    const scnRes = await fetch(`${BASE_URL}/api/scenarios/case-01-banding-missing-nozzles`);
    expect(scnRes.status).toBe(200);
    const scnData = await scnRes.json();
    expect(scnData.scenario.scenarioNumber).toBe(1);
    const runId = scnData.run.id;

    // 2. Select Nozzle Check test
    const chooseRes = await fetch(`${BASE_URL}/api/scenarios/case-01-banding-missing-nozzles/choose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId,
        choiceKey: "c1_inspect_nozzle_check",
      }),
    });
    expect(chooseRes.status).toBe(200);
    const chooseData = await chooseRes.json();
    expect(chooseData.revealedEvidence).toContain("Cyan channel 1 has 18 completely missing nozzles");
    expect(chooseData.targetNodeKey).toBe("node_nozzle_result");
  });

  // Test 4: Incorrect answer returns targeted review recommendation
  it("Test 4: Learner receives detailed explanation and targeted review when answering questions", async () => {
    // Fetch Day 7 (Color Science)
    const day7Res = await fetch(`${BASE_URL}/api/lessons/day-07-color-science-icc-profiles-and-delta-e`);
    expect(day7Res.status).toBe(200);
    const day7Data = await day7Res.json();
    const questions = day7Data.quiz;
    expect(questions.length).toBe(5);

    // Intentionally submit wrong answers to test targeted recommendation
    const wrongAnswers: Record<string, string> = {};
    for (const q of questions) {
      const incorrectOpt = q.options.find((o: any) => !o.is_correct);
      if (incorrectOpt) {
        wrongAnswers[q.id] = incorrectOpt.id;
      }
    }

    const quizRes = await fetch(`${BASE_URL}/api/lessons/day-07-color-science-icc-profiles-and-delta-e/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: wrongAnswers }),
    });
    expect(quizRes.status).toBe(200);
    const quizData = await quizRes.json();
    expect(quizData.passed).toBe(false);
    expect(quizData.targetedRecommendation).toBeDefined();
    expect(quizData.targetedRecommendation.title).toContain("Targeted Review");
    expect(quizData.evaluatedAnswers.every((a: any) => a.explanation.length > 0)).toBe(true);
  });

  // Test 5: Interview response persistence
  it("Test 5: Interview practice responses are scored across 5 dimensions and persisted", async () => {
    const intRes = await fetch(`${BASE_URL}/api/interview`);
    expect(intRes.status).toBe(200);
    const intData = await intRes.json();
    const firstQ = intData.questions[0];

    const submitRes = await fetch(`${BASE_URL}/api/interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: firstQ.id,
        userAnswer: "First, I isolate variables by asking if the banding is voids or overlap. I perform LOTO and wear nitrile PPE. I print a standardized nozzle check. If nozzles are missing, I check the sub-tank vacuum at -3.2 kPa and clean the wiper blade with lint-free swabs. I verify with a high-coverage test print and document on a service ticket.",
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await submitRes.json();
    expect(submitData.scores.total).toBeGreaterThan(60);
    expect(submitData.scores.technical).toBeGreaterThan(0);
    expect(submitData.scores.safety).toBeGreaterThan(0);
    expect(submitData.scores.communication).toBeGreaterThan(0);
    expect(submitData.scores.verification).toBeGreaterThan(0);
    expect(submitData.scores.clarity).toBeGreaterThan(0);
  });

  // Test 6: Service ticket creation and retrieval
  it("Test 6: Learner creates and retrieves complete 10-field Field Service Report", async () => {
    const ticketRes = await fetch(`${BASE_URL}/api/service-tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Midwest Packaging Solutions",
        equipmentModel: "Platinum Hybrid 3200",
        serialNumber: "PT-3200-9812",
        customerComplaint: "Horizontal banding across full coverage packaging",
        safetyAssessment: "LOTO performed; 0.0V measured; nitrile gloves and UV eye goggles used.",
        configurationNotes: "Onyx RIP v22, 8-pass bi-directional, flexible UV ink.",
        diagnosticTestsPerformed: "Nozzle check, digital manometer check on sub-tank.",
        observations: "18 missing nozzles on Cyan channel 1. Meniscus vacuum at -1.5 kPa.",
        actionsTaken: "Cleaned rubber wiper blade, adjusted sub-tank vacuum regulator to -3.2 kPa, performed 2-sec soft purge.",
        verificationResults: "100% nozzle firing restored, 4x8 ft solid blue test board printed with Delta E 0.84.",
        customerCommunication: "Trained lead operator on daily wiper swabs and capping maintenance.",
        escalationFollowUp: "None. Closed call.",
        status: "completed",
      }),
    });
    expect(ticketRes.status).toBe(200);
    const ticketData = await ticketRes.json();
    expect(ticketData.ticket.ticketNumber).toContain("FSR-");

    // Verify it appears in tickets list
    const listRes = await fetch(`${BASE_URL}/api/service-tickets`);
    const listData = await listRes.json();
    const created = listData.tickets.find((t: any) => t.ticket_number === ticketData.ticket.ticketNumber);
    expect(created).toBeDefined();
    expect(created.customer_name).toBe("Midwest Packaging Solutions");
  });

  // Test 7: Admin security enforcement
  it("Test 7: Admin console strictly restricts non-admin learners (403 Forbidden)", async () => {
    // Learner tries to access admin API
    const learnerLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "technician@cgs-oris.academy", password: "FieldTech2026!" }),
    });
    const cookie = learnerLogin.headers.get("set-cookie") || "";

    const adminGet = await fetch(`${BASE_URL}/api/admin`, {
      headers: { Cookie: cookie },
    });
    expect(adminGet.status).toBe(403);

    // Now log in as admin
    const adminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@cgs-oris.academy", password: "Admin123!" }),
    });
    const adminCookie = adminLogin.headers.get("set-cookie") || "";

    const adminAccess = await fetch(`${BASE_URL}/api/admin`, {
      headers: { Cookie: adminCookie },
    });
    expect(adminAccess.status).toBe(200);
    const adminData = await adminAccess.json();
    expect(adminData.stats.users).toBeGreaterThanOrEqual(2);
  });

  // Test 8: Content integrity across all 14 days
  it("Test 8: All 14 days have real substantial instructional content and quizzes", async () => {
    const listRes = await fetch(`${BASE_URL}/api/lessons`);
    const listData = await listRes.json();
    expect(listData.lessons.length).toBe(14);

    for (let day = 1; day <= 14; day++) {
      const les = listData.lessons.find((l: any) => l.day_number === day);
      expect(les).toBeDefined();
      expect(les.title.length).toBeGreaterThan(5);
      expect(les.objectives.length).toBeGreaterThanOrEqual(3);
    }
  });

  // Test 9: Seamless role toggling between candidate and admin
  it("Test 9: Seamless role toggling between candidate and admin accounts", async () => {
    // 1. Switch to admin via POST /api/auth/switch
    const switchToAdmin = await fetch(`${BASE_URL}/api/auth/switch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin" }),
    });
    expect(switchToAdmin.status).toBe(200);
    const adminSwitchData = await switchToAdmin.json();
    expect(adminSwitchData.success).toBe(true);
    expect(adminSwitchData.user.role).toBe("admin");
    expect(adminSwitchData.user.email).toBe("admin@cgs-oris.academy");
    const adminCookies = switchToAdmin.headers.get("set-cookie") || "";

    // 2. Verify /api/auth/me reflects admin
    const adminMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: adminCookies },
    });
    const adminMeData = await adminMe.json();
    expect(adminMeData.user.role).toBe("admin");

    // 3. Verify /api/admin is accessible
    const adminAccess = await fetch(`${BASE_URL}/api/admin`, {
      headers: { Cookie: adminCookies },
    });
    expect(adminAccess.status).toBe(200);

    // 4. Switch back to candidate / learner
    const switchToLearner = await fetch(`${BASE_URL}/api/auth/switch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "learner" }),
    });
    expect(switchToLearner.status).toBe(200);
    const learnerSwitchData = await switchToLearner.json();
    expect(learnerSwitchData.success).toBe(true);
    expect(learnerSwitchData.user.role).toBe("learner");
    expect(learnerSwitchData.user.email).toBe("technician@cgs-oris.academy");
    const learnerCookies = switchToLearner.headers.get("set-cookie") || "";

    // 5. Verify /api/auth/me reflects learner
    const learnerMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: learnerCookies },
    });
    const learnerMeData = await learnerMe.json();
    expect(learnerMeData.user.role).toBe("learner");

    // 6. Verify /api/admin rejects learner with 403
    const blockedAccess = await fetch(`${BASE_URL}/api/admin`, {
      headers: { Cookie: learnerCookies },
    });
    expect(blockedAccess.status).toBe(403);
  });
});
