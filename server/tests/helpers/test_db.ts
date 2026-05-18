import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const TEST_DB_CONFIG = {
    host: "localhost",
    port: 5433,
    user: "test_user",
    password: "test_pass",
    database: "verbatim_test",
};

const INIT_SQL_PATH = join(__dirname, "../../../infra/init_db.sql");

let pool: Pool | null = null;

export function getTestPool(): Pool {
    if (!pool) {
        pool = new Pool(TEST_DB_CONFIG);
    }
    return pool;
}

/** Drop the public schema and re-apply init_db.sql. Use once per test run. */
export async function resetSchema(): Promise<void> {
    const p = getTestPool();
    await p.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
    const initSql = readFileSync(INIT_SQL_PATH, "utf-8");
    await p.query(initSql);
}

/** Truncate every table in the public schema. Use between tests to quickly reset DB. */
export async function truncateAll(): Promise<void> {
    const p = getTestPool();
    const { rows } = await p.query<{ ident: string }>(
        "SELECT quote_ident(tablename) AS ident FROM pg_tables WHERE schemaname = 'public'"
    );
    if (rows.length === 0) return;
    const tables = rows.map((r) => r.ident).join(", ");
    await p.query(`TRUNCATE ${tables} RESTART IDENTITY CASCADE;`);
}

export async function closeTestPool(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
