import { spawn, type ChildProcess } from "node:child_process";
import { createServer } from "node:net";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const testDbDirectory = path.join(root, "data", `pgdata_e2e_${crypto.randomUUID()}`);

async function getFreePort(): Promise<number> {
  const probe = createServer();
  await new Promise<void>((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });
  const address = probe.address();
  if (!address || typeof address === "string") throw new Error("Could not reserve a test port.");
  const port = address.port;
  await new Promise<void>((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function waitUntilReady(url: string, child: ChildProcess): Promise<void> {
  const deadline = Date.now() + 180_000;
  let lastError = "server has not responded";
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Development server exited early with code ${child.exitCode}.`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return;
      lastError = `health endpoint returned ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Development server did not become ready: ${lastError}`);
}

async function stopChild(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise<void>((resolve) => child.once("exit", () => resolve()));
  child.kill("SIGTERM");
  await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 10_000))]);
  if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
}

async function main() {
  const port = await getFreePort();
  fs.mkdirSync(path.dirname(testDbDirectory), { recursive: true });
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: "development",
    PORT: String(port),
    PG_DATA_DIR: testDbDirectory,
    E2E_BASE_URL: `http://127.0.0.1:${port}`,
    JWT_SECRET: `e2e-only-${crypto.randomUUID()}-${crypto.randomUUID()}`,
  };
  const tsx = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");
  const server = spawn(process.execPath, [tsx, "scripts/dev.ts", "-p", String(port)], {
    cwd: root,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout?.pipe(process.stdout);
  server.stderr?.pipe(process.stderr);

  try {
    console.log(`[E2E] Starting isolated app and database on port ${port}…`);
    await waitUntilReady(`${env.E2E_BASE_URL}/api/health`, server);
    console.log("[E2E] App and database are ready; running authenticated acceptance tests.");
    const vitest = spawn(process.execPath, [path.join(root, "node_modules", "vitest", "vitest.mjs"), "run", "tests/e2e-acceptance.test.ts"], {
      cwd: root,
      env,
      stdio: "inherit",
    });
    const exitCode = await new Promise<number>((resolve, reject) => {
      vitest.once("error", reject);
      vitest.once("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
    });
    process.exitCode = exitCode;
  } finally {
    await stopChild(server);
    fs.rmSync(testDbDirectory, { recursive: true, force: true });
  }
}

main().catch((error: unknown) => {
  console.error("End-to-end test runner failed:", error);
  process.exitCode = 1;
});
