import { PGlite } from "@electric-sql/pglite";
import fs from "fs";
import path from "path";

// Global singleton for Next.js hot module replacement
declare global {
  // eslint-disable-next-line no-var
  var __cgs_db: PGlite | undefined;
  // eslint-disable-next-line no-var
  var __cgs_db_init_promise: Promise<PGlite> | undefined;
}

const DB_DATA_DIR =
  process.env.PG_DATA_DIR ||
  (process.env.VITEST ? path.join(process.cwd(), "data", "pgdata_test") : path.join(process.cwd(), "data", "pgdata"));

export async function getDb(): Promise<PGlite> {
  if (global.__cgs_db) {
    return global.__cgs_db;
  }

  if (global.__cgs_db_init_promise) {
    return global.__cgs_db_init_promise;
  }

  global.__cgs_db_init_promise = (async () => {
    if (!fs.existsSync(DB_DATA_DIR)) {
      fs.mkdirSync(DB_DATA_DIR, { recursive: true });
    }

    const db = new PGlite(DB_DATA_DIR);
    await db.waitReady;

    // Apply schema if not already initialized
    const checkTable = await db.query(
      "SELECT to_regclass('public.users') as exists;"
    );
    const tableExists = (checkTable.rows[0] as any)?.exists;

    if (!tableExists) {
      const schemaPath = path.join(process.cwd(), "src", "lib", "db", "schema.sql");
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, "utf-8");
        await db.exec(schemaSql);
        console.log("[DB] Schema initialized successfully.");
      }
    }

    global.__cgs_db = db;
    return db;
  })();

  return global.__cgs_db_init_promise;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<{ rows: T[] }> {
  const db = await getDb();
  const res = await db.query(sql, params);
  return { rows: (res.rows || []) as T[] };
}

export async function exec(sql: string): Promise<void> {
  const db = await getDb();
  await db.exec(sql);
}
