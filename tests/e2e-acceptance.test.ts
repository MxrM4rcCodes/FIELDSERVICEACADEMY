import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { seedLessons } from "../src/lib/db/seed-data/lessons";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3198";
const testRun = crypto.randomUUID();
const learnerA = {
  fullName: "Journey Learner One",
  email: `journey-one-${testRun}@example.test`,
  password: "Journey!Passphrase2026One",
};
const learnerB = {
  fullName: "Journey Learner Two",
  email: `journey-two-${testRun}@example.test`,
  password: "Journey!Passphrase2026Two",
};
let cookieA = "";
let cookieB = "";

async function registerAccount(account: typeof learnerA): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account),
  });
  expect(response.status).toBe(201);
  const cookie = response.headers.get("set-cookie")?.split(";")[0] ?? "";
  expect(cookie).toMatch(/^cgs_session_token=/);
  return cookie;
}

function withCookie(cookie: string, headers: HeadersInit = {}): HeadersInit {
  return { ...headers, Cookie: cookie };
}

async function submitCorrectAnswers(slug: string, cookie: string) {
  const lessonResponse = await fetch(`${BASE_URL}/api/lessons/${slug}`, { headers: withCookie(cookie) });
  expect(lessonResponse.status).toBe(200);
  const lessonData = await lessonResponse.json();
  const seedLesson = seedLessons.find((lesson) => lesson.slug === slug);
  expect(seedLesson).toBeDefined();
  const answers: Record<string, string> = {};
  for (const question of lessonData.quiz) {
    const seedQuestion = seedLesson!.questions[question.sort_order - 1];
    const correctOptionIndex = seedQuestion.options.findIndex((option) => option.isCorrect);
    expect(correctOptionIndex).toBeGreaterThanOrEqual(0);
    answers[question.id] = question.options[correctOptionIndex].id;
  }
  return fetch(`${BASE_URL}/api/lessons/${slug}/quiz`, {
    method: "POST",
    headers: withCookie(cookie, { "Content-Type": "application/json" }),
    body: JSON.stringify({ answers }),
  });
}

describe("Authenticated learning journey and multi-user boundaries", () => {
  beforeAll(async () => {
    cookieA = await registerAccount(learnerA);
    cookieB = await registerAccount(learnerB);
  });

  afterAll(async () => {
    if (cookieA) await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST", headers: withCookie(cookieA) });
    if (cookieB) await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST", headers: withCookie(cookieB) });
  });

  it("redirects unauthenticated page requests and provides a database-backed session", async () => {
    const publicPage = await fetch(`${BASE_URL}/login`, { redirect: "manual" });
    expect(publicPage.status).toBe(200);

    const protectedPage = await fetch(`${BASE_URL}/`, { redirect: "manual" });
    expect(protectedPage.status).toBe(307);
    expect(protectedPage.headers.get("location")).toContain("/login?next=%2F");

    const currentUser = await fetch(`${BASE_URL}/api/auth/me`, { headers: withCookie(cookieA) });
    expect(currentUser.status).toBe(200);
    const userData = await currentUser.json();
    expect(userData.user.email).toBe(learnerA.email);
    expect(userData.user.role).toBe("learner");
  });

  it("completes login → dashboard → Day 1 → systems map → passing knowledge check", async () => {
    const login = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: learnerA.email, password: learnerA.password }),
    });
    expect(login.status).toBe(200);
    const returningCookie = login.headers.get("set-cookie")?.split(";")[0] ?? "";

    const dashboardResponse = await fetch(`${BASE_URL}/api/dashboard`, { headers: withCookie(returningCookie) });
    expect(dashboardResponse.status).toBe(200);
    const dashboard = await dashboardResponse.json();
    expect(dashboard.totalLessons).toBe(14);
    expect(dashboard.nextLesson.slug).toBe("day-01-cgs-oris-and-field-service");
    expect(dashboard.competencies.every((item: any) => Number(item.total_evaluations) === 0)).toBe(true);

    const lessonResponse = await fetch(`${BASE_URL}/api/lessons/${dashboard.nextLesson.slug}`, {
      headers: withCookie(returningCookie),
    });
    expect(lessonResponse.status).toBe(200);
    const lesson = await lessonResponse.json();
    expect(lesson.lesson.day_number).toBe(1);
    expect(lesson.blocks.length).toBeGreaterThanOrEqual(4);
    expect(lesson.sourceReference?.confidence_level).toBeTruthy();
    expect(lesson.quiz.length).toBeGreaterThanOrEqual(5);
    expect(lesson.quiz.every((question: any) => question.options.every((option: any) => !("is_correct" in option)))).toBe(true);

    const systemsMap = await fetch(`${BASE_URL}/systems-map`, { headers: withCookie(returningCookie) });
    expect(systemsMap.status).toBe(200);
    const mapMarkup = await systemsMap.text();
    expect(mapMarkup).toContain("Interactive Imaging &amp; Service Workflow Map");
    expect(mapMarkup).toContain("Return to Day 1");
    expect(mapMarkup).toContain("NOT A PRODUCT INTEGRATION SCHEMATIC");

    const quizResponse = await submitCorrectAnswers(lesson.lesson.slug, returningCookie);
    expect(quizResponse.status).toBe(200);
    const result = await quizResponse.json();
    expect(result.passed).toBe(true);
    expect(result.score).toBe(result.totalQuestions);
    expect(result.evaluatedAnswers.every((answer: any) => answer.questionRationale.length > 0)).toBe(true);

    const persisted = await fetch(`${BASE_URL}/api/dashboard`, { headers: withCookie(returningCookie) });
    const afterQuiz = await persisted.json();
    expect(afterQuiz.overallProgressPercent).toBeGreaterThan(0);
    expect(afterQuiz.lessons.find((item: any) => item.day_number === 1).status).toBe("completed");
    expect(Number(afterQuiz.studyHistory.quiz_attempts)).toBe(1);
  });

  it("requires a passing assessment for completion and keeps learner data isolated", async () => {
    const invalidCompletion = await fetch(`${BASE_URL}/api/lessons/day-02-complete-digital-imaging-workflow/progress`, {
      method: "POST",
      headers: withCookie(cookieA, { "Content-Type": "application/json" }),
      body: JSON.stringify({ status: "completed", timeSpentSeconds: 300 }),
    });
    expect(invalidCompletion.status).toBe(400);

    const learnerBDashboard = await fetch(`${BASE_URL}/api/dashboard`, { headers: withCookie(cookieB) });
    expect(learnerBDashboard.status).toBe(200);
    const dashboardB = await learnerBDashboard.json();
    expect(dashboardB.lessons.find((item: any) => item.day_number === 1).status).toBe("not_started");
    expect(Number(dashboardB.studyHistory.quiz_attempts)).toBe(0);

    const createTicket = await fetch(`${BASE_URL}/api/service-tickets`, {
      method: "POST",
      headers: withCookie(cookieA, { "Content-Type": "application/json" }),
      body: JSON.stringify({
        customerName: "Synthetic Training Customer",
        equipmentModel: "Model as recorded in exercise",
        serialNumber: "Not provided",
        customerComplaint: "A print-quality symptom reported for this training exercise.",
        safetyAssessment: "No site inspection occurred; stop and follow the actual site and manufacturer safety procedures before service.",
        configurationNotes: "Unknown; verify before drawing conclusions.",
        diagnosticTestsPerformed: "No physical diagnostic test performed in this educational record.",
        observations: "Synthetic training example only.",
        actionsTaken: "No physical repair or adjustment was performed.",
        verificationResults: "No equipment was tested; this record is an educational simulation.",
        customerCommunication: "Discussed the hypothetical scenario and safe next steps.",
        escalationFollowUp: "Use current manufacturer documentation for the actual model.",
        status: "open",
      }),
    });
    expect(createTicket.status).toBe(201);
    const ticket = (await createTicket.json()).ticket;

    const learnerBTickets = await fetch(`${BASE_URL}/api/service-tickets`, { headers: withCookie(cookieB) });
    expect((await learnerBTickets.json()).tickets).toHaveLength(0);
    const crossUserPatch = await fetch(`${BASE_URL}/api/service-tickets/${ticket.id}`, {
      method: "PATCH",
      headers: withCookie(cookieB, { "Content-Type": "application/json" }),
      body: JSON.stringify({
        customerName: "Other User", equipmentModel: "Unknown", serialNumber: "",
        customerComplaint: "test", safetyAssessment: "test", configurationNotes: "",
        diagnosticTestsPerformed: "test", observations: "test", actionsTaken: "test",
        verificationResults: "test", customerCommunication: "test", escalationFollowUp: "test", status: "completed",
      }),
    });
    expect(crossUserPatch.status).toBe(404);

    const savedOrisResponse = await fetch(`${BASE_URL}/api/practice/oris`, {
      method: "POST",
      headers: withCookie(cookieA, { "Content-Type": "application/json" }),
      body: JSON.stringify({ promptIndex: 0, choiceKey: "verify" }),
    });
    expect(savedOrisResponse.status).toBe(200);
    const savedOris = await savedOrisResponse.json();
    expect(savedOris.isCorrect).toBe(true);
    expect(savedOris.stats).toEqual({ attempts: 1, correct: 1 });
    const forgedOrisResponse = await fetch(`${BASE_URL}/api/practice/oris`, {
      method: "POST",
      headers: withCookie(cookieA, { "Content-Type": "application/json" }),
      body: JSON.stringify({ promptIndex: 1, choiceKey: "guess", isCorrect: true }),
    });
    expect(forgedOrisResponse.status).toBe(200);
    const forgedOris = await forgedOrisResponse.json();
    expect(forgedOris.isCorrect).toBe(false);
    expect(forgedOris.stats).toEqual({ attempts: 2, correct: 1 });
    const learnerAOrisResponse = await fetch(`${BASE_URL}/api/practice/oris`, { headers: withCookie(cookieA) });
    expect((await learnerAOrisResponse.json()).stats).toEqual({ attempts: 2, correct: 1 });
    const learnerBOrisResponse = await fetch(`${BASE_URL}/api/practice/oris`, { headers: withCookie(cookieB) });
    expect((await learnerBOrisResponse.json()).stats).toEqual({ attempts: 0, correct: 0 });
  });

  it("serializes concurrent scenario choices and restarts without duplicate events or stale advancement", async () => {
    const slug = "case-01-banding-missing-nozzles";
    const restart = await fetch(`${BASE_URL}/api/scenarios/${slug}`, {
      method: "POST",
      headers: withCookie(cookieA),
    });
    expect(restart.status).toBe(200);
    const response = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieA) });
    expect(response.status).toBe(200);
    const firstScenario = await response.json();
    const runId = firstScenario.run.id;

    const chooseHeaders = withCookie(cookieA, { "Content-Type": "application/json" });
    const concurrent = await Promise.all([
      fetch(`${BASE_URL}/api/scenarios/${slug}/choose`, {
        method: "POST", headers: chooseHeaders, body: JSON.stringify({ runId, choiceKey: "c1_gather_context" }),
      }),
      fetch(`${BASE_URL}/api/scenarios/${slug}/choose`, {
        method: "POST", headers: chooseHeaders, body: JSON.stringify({ runId, choiceKey: "c1_gather_context" }),
      }),
    ]);
    expect(concurrent.map((item) => item.status).sort()).toEqual([200, 409]);

    let stateResponse = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieA) });
    let scenarioState = await stateResponse.json();
    expect(scenarioState.run.id).toBe(runId);
    expect(scenarioState.currentNode.node_key).toBe("compare_scope");
    expect(scenarioState.events).toHaveLength(1);
    expect(scenarioState.events[0].choice_key).toBe("c1_gather_context");
    expect(Number(scenarioState.run.totalScore)).toBe(15);
    expect(Number(scenarioState.run.safetyScore)).toBe(5);
    expect(Number(scenarioState.run.diagnosticScore)).toBe(10);

    const nextChoice = await fetch(`${BASE_URL}/api/scenarios/${slug}/choose`, {
      method: "POST", headers: chooseHeaders, body: JSON.stringify({ runId, choiceKey: "c1_review_records" }),
    });
    expect(nextChoice.status).toBe(200);
    const nextResult = await nextChoice.json();
    expect(nextResult.revealedEvidence).toBeTruthy();

    const staleChoice = await fetch(`${BASE_URL}/api/scenarios/${slug}/choose`, {
      method: "POST", headers: chooseHeaders, body: JSON.stringify({ runId, choiceKey: "c1_gather_context" }),
    });
    expect(staleChoice.status).toBe(409);
    stateResponse = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieA) });
    scenarioState = await stateResponse.json();
    expect(scenarioState.currentNode.node_key).toBe("review_pattern");
    expect(scenarioState.events).toHaveLength(2);
    expect(scenarioState.events[1].revealed_evidence).toBeTruthy();
    expect(Number(scenarioState.run.totalScore)).toBe(30);
    expect(Number(scenarioState.run.safetyScore)).toBe(10);
    expect(Number(scenarioState.run.diagnosticScore)).toBe(20);

    const concurrentRestarts = await Promise.all(Array.from({ length: 3 }, () => fetch(`${BASE_URL}/api/scenarios/${slug}`, {
      method: "POST", headers: withCookie(cookieA),
    })));
    expect(concurrentRestarts.map((item) => item.status)).toEqual([200, 200, 200]);
    const restartBodies = await Promise.all(concurrentRestarts.map((item) => item.json()));
    const activeResponse = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieA) });
    const activeState = await activeResponse.json();
    expect(restartBodies.some((body) => body.runId === activeState.run.id)).toBe(true);
    expect(activeState.events).toHaveLength(0);

    const learnerBScenario = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieB) });
    const scenarioB = await learnerBScenario.json();
    expect(scenarioB.run.id).not.toBe(runId);
    expect(scenarioB.events).toHaveLength(0);

    const spoofedAdmin = await fetch(`${BASE_URL}/api/admin`, {
      headers: withCookie(cookieA, { "x-user-role": "admin" }),
    });
    expect(spoofedAdmin.status).toBe(403);
    const removedRoleSwitch = await fetch(`${BASE_URL}/api/auth/switch`, {
      method: "POST", headers: withCookie(cookieA, { "Content-Type": "application/json" }), body: JSON.stringify({ role: "admin" }),
    });
    expect(removedRoleSwitch.status).toBe(404);
  });

  it("records hazardous scenario endings separately from ordinary failure and safe escalation", async () => {
    const slug = "case-10-unsafe-condition-shutdown";
    const startResponse = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieA) });
    expect(startResponse.status).toBe(200);
    let state = await startResponse.json();

    const unsafe = await fetch(`${BASE_URL}/api/scenarios/${slug}/choose`, {
      method: "POST",
      headers: withCookie(cookieA, { "Content-Type": "application/json" }),
      body: JSON.stringify({ runId: state.run.id, choiceKey: "c10_open_cabinet" }),
    });
    expect(unsafe.status).toBe(200);
    let result = await unsafe.json();
    expect(result.terminalType).toBe("terminal_fail");
    let terminalState = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieA) });
    state = await terminalState.json();
    expect(state.run.status).toBe("failed_safety");

    const restart = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { method: "POST", headers: withCookie(cookieA) });
    expect(restart.status).toBe(200);
    const safeStart = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieA) });
    state = await safeStart.json();
    const contain = await fetch(`${BASE_URL}/api/scenarios/${slug}/choose`, {
      method: "POST",
      headers: withCookie(cookieA, { "Content-Type": "application/json" }),
      body: JSON.stringify({ runId: state.run.id, choiceKey: "c10_stop_clear" }),
    });
    expect(contain.status).toBe(200);
    const escalationState = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieA) });
    state = await escalationState.json();
    expect(state.currentNode.node_key).toBe("safe_escalation");
    const finishSafe = await fetch(`${BASE_URL}/api/scenarios/${slug}/choose`, {
      method: "POST",
      headers: withCookie(cookieA, { "Content-Type": "application/json" }),
      body: JSON.stringify({ runId: state.run.id, choiceKey: "c10_isolation_boundary" }),
    });
    expect(finishSafe.status).toBe(200);
    result = await finishSafe.json();
    expect(result.terminalType).toBe("terminal_success");
    terminalState = await fetch(`${BASE_URL}/api/scenarios/${slug}`, { headers: withCookie(cookieA) });
    state = await terminalState.json();
    expect(state.run.status).toBe("completed_success");
  });
});
