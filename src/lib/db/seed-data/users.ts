import bcrypt from "bcryptjs";

export async function getSeedUsers() {
  const adminHash = await bcrypt.hash("Admin123!", 10);
  const learnerHash = await bcrypt.hash("FieldTech2026!", 10);

  return [
    {
      id: "usr_admin_01",
      email: "admin@cgs-oris.academy",
      password_hash: adminHash,
      full_name: "Sarah Jenkins (Technical Director)",
      role: "admin",
      profile: {
        id: "prof_admin_01",
        target_interview_date: "2026-11-01",
        active_track: "course_14",
        experience_level: "expert",
        notes: "Administrator account for curriculum updates, scenario authoring, and candidate oversight.",
      },
    },
    {
      id: "usr_learner_01",
      email: "technician@cgs-oris.academy",
      password_hash: learnerHash,
      full_name: "Alex Morgan (Field Service Candidate)",
      role: "learner",
      profile: {
        id: "prof_learner_01",
        target_interview_date: "2026-10-26",
        active_track: "course_14",
        experience_level: "field_technician",
        notes: "Targeting CGS ORIS Americas Field Service Technician role in Plymouth, MN. Background in electromechanical troubleshooting.",
      },
    },
  ];
}

export const initialCompetencies = [
  { domain: "hardware_safety", score: 45.0, weight: 35.0, evals: 3 },
  { domain: "color_oris", score: 32.0, weight: 25.0, evals: 2 },
  { domain: "metis_scanning", score: 25.0, weight: 15.0, evals: 1 },
  { domain: "customer_docs", score: 50.0, weight: 15.0, evals: 2 },
  { domain: "company_interview", score: 40.0, weight: 10.0, evals: 2 },
];
