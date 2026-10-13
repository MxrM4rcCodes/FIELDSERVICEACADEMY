import bcrypt from "bcryptjs";
import { seedCompetencyRows } from "@/lib/competency";
import { withTransaction } from "@/lib/db";

export type AccountRole = "learner" | "admin";

export interface CreateAccountInput {
  email: string;
  password: string;
  fullName: string;
  role?: AccountRole;
}

export async function createAccount(input: CreateAccountInput) {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim().replace(/\s+/g, " ");
  const role = input.role ?? "learner";
  const id = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(input.password, 12);

  await withTransaction(async (tx) => {
    await tx.query(
      `INSERT INTO users (id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, email, passwordHash, fullName, role],
    );
    await tx.query(
      `INSERT INTO profiles (id, user_id, active_track, experience_level)
       VALUES ($1, $2, 'course_14', 'entry_field_service')`,
      [profileId, id],
    );
    await seedCompetencyRows(tx, id);
  });

  return {
    id,
    email,
    fullName,
    role,
  };
}
