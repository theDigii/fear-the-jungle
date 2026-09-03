import { neon } from "@neondatabase/serverless";

/**
 * One Neon connection factory and the schema it expects.
 *
 * The schema is applied on first use with IF NOT EXISTS, memoised per
 * function instance, so a fresh database becomes usable the moment
 * DATABASE_URL is set: no migration step, no seed. Every table starts
 * empty and the public page falls back to its built-in text until the
 * backend writes something.
 */
export function configured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  return neon(url);
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const q = sql();
      await q`CREATE TABLE IF NOT EXISTS site_text (
        key text PRIMARY KEY,
        value text NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
      await q`CREATE TABLE IF NOT EXISTS posts (
        id serial PRIMARY KEY,
        title text NOT NULL,
        body text NOT NULL DEFAULT '',
        published boolean NOT NULL DEFAULT true,
        published_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
      await q`CREATE TABLE IF NOT EXISTS gallery (
        id serial PRIMARY KEY,
        url text NOT NULL,
        caption text NOT NULL DEFAULT '',
        sort integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
    })().catch((err) => {
      schemaReady = null; // let the next call retry rather than caching a failure
      throw err;
    });
  }
  return schemaReady;
}
