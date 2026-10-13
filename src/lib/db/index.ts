import { PGlite } from "@electric-sql/pglite";
import { Pool, type PoolClient } from "pg";
import fs from "node:fs";
import path from "node:path";

type DbClient = PGlite | Pool;
type QueryResultShape<T = unknown> = { rows: T[] };
type Queryable = {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResultShape<T>>;
};

// Keep one database handle per Node process in Next dev/HMR and serverless workers.
declare global {
  // eslint-disable-next-line no-var
  var __cgs_db: DbClient | undefined;
  // eslint-disable-next-line no-var
  var __cgs_db_init_promise: Promise<DbClient> | undefined;
}

const migrationDirectory = path.join(process.cwd(), "src", "lib", "db", "migrations");
const localDataDirectory = process.env.PG_DATA_DIR ||
  (process.env.VITEST
    ? path.join(process.cwd(), "data", "pgdata_test")
    : path.join(process.cwd(), "data", "pgdata"));

function isPostgres(db: DbClient): db is Pool {
  return db instanceof Pool;
}

async function applyMigrations(db: DbClient): Promise<void> {
  const files = fs.existsSync(migrationDirectory)
    ? fs.readdirSync(migrationDirectory).filter((file) => file.endsWith(".sql")).sort()
    : [];

  if (files.length === 0) {
    throw new Error(`No SQL migrations found in ${migrationDirectory}`);
  }

  if (isPostgres(db)) {
    const client: PoolClient = await db.connect();
    try {
      // Prevent two serverless cold starts from applying the same migration concurrently.
      await client.query("SELECT pg_advisory_lock(42003177)");
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version TEXT PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      for (const file of files) {
        const found = await client.query("SELECT 1 FROM schema_migrations WHERE version = $1", [file]);
        if (found.rowCount) continue;

        const sql = fs.readFileSync(path.join(migrationDirectory, file), "utf8");
        await client.query("BEGIN");
        try {
          await client.query(sql);
          await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [file]);
          await client.query("COMMIT");
        } catch (error) {
          await client.query("ROLLBACK");
          throw error;
        }
      }
    } finally {
      try {
        await client.query("SELECT pg_advisory_unlock(42003177)");
      } finally {
        client.release();
      }
    }
    return;
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  for (const file of files) {
    const found = await db.query("SELECT 1 FROM schema_migrations WHERE version = $1", [file]);
    if (found.rows.length) continue;
    const sql = fs.readFileSync(path.join(migrationDirectory, file), "utf8");
    await db.exec(sql);
    await db.query("INSERT INTO schema_migrations (version) VALUES ($1)", [file]);
  }
}

export async function getDb(): Promise<DbClient> {
  if (global.__cgs_db) return global.__cgs_db;
  if (global.__cgs_db_init_promise) return global.__cgs_db_init_promise;

  global.__cgs_db_init_promise = (async () => {
    if (process.env.DATABASE_URL) {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: Number(process.env.DATABASE_POOL_SIZE || 10),
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 10_000,
        ssl: process.env.DATABASE_SSL === "true"
          ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" }
          : undefined,
      });
      await pool.query("SELECT 1");
      await applyMigrations(pool);
      global.__cgs_db = pool;
      return pool;
    }

    if (process.env.NODE_ENV === "production" && !process.env.VITEST) {
      throw new Error("DATABASE_URL is required in production. Configure a managed PostgreSQL database.");
    }

    fs.mkdirSync(localDataDirectory, { recursive: true });
    const pglite = new PGlite(localDataDirectory);
    await pglite.waitReady;
    await applyMigrations(pglite);
    global.__cgs_db = pglite;
    return pglite;
  })();

  try {
    return await global.__cgs_db_init_promise;
  } catch (error) {
    global.__cgs_db_init_promise = undefined;
    throw error;
  }
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<QueryResultShape<T>> {
  const db = await getDb();
  if (isPostgres(db)) {
    const result = await db.query(sql, params as never[]);
    return { rows: result.rows as T[] };
  }
  const result = await db.query<T>(sql, params);
  return { rows: result.rows as T[] };
}

export async function exec(sql: string): Promise<void> {
  const db = await getDb();
  if (isPostgres(db)) await db.query(sql);
  else await db.exec(sql);
}

export async function withTransaction<T>(work: (tx: Queryable) => Promise<T>): Promise<T> {
  const db = await getDb();

  if (isPostgres(db)) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const result = await work({
        query: async <R = unknown>(sql: string, params: unknown[] = []) => {
          const response = await client.query(sql, params as never[]);
          return { rows: response.rows as R[] };
        },
      });
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  const result = await db.transaction(async (transaction) =>
    work({
      query: async <R = unknown>(sql: string, params: unknown[] = []) => {
        const response = await transaction.query<R>(sql, params);
        return { rows: response.rows as R[] };
      },
    }),
  );
  return result as T;
}

export type { Queryable };
