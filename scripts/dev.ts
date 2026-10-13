import { spawn } from "node:child_process";
import { runSeed } from "@/lib/db/seed";

async function main() {
  await runSeed();
  const nextBin = require.resolve("next/dist/bin/next");
  const child = spawn(process.execPath, [nextBin, "dev", "-H", "0.0.0.0", ...process.argv.slice(2)], {
    stdio: "inherit",
    env: process.env,
  });

  const stop = (signal: NodeJS.Signals) => child.kill(signal);
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  child.on("exit", (code, signal) => {
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
    if (signal) process.kill(process.pid, signal);
    else process.exitCode = code ?? 1;
  });
}

main().catch((error) => {
  console.error("Could not start the development app:", error);
  process.exitCode = 1;
});
