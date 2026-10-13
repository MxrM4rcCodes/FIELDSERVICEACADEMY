import { getDb } from "@/lib/db";

async function main() {
  const db = await getDb();
  console.log("Database migrations are up to date.");
  if ("end" in db && typeof db.end === "function") await db.end();
  if ("close" in db && typeof db.close === "function") await db.close();
}

main().catch((error) => {
  console.error("Database migration failed:", error);
  process.exitCode = 1;
});
