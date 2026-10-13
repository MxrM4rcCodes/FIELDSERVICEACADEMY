import { runSeed } from "@/lib/db/seed";

runSeed().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
