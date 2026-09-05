import { configured, ensureSchema, sql } from "./db";

/**
 * Everything the public page shows that the backend can change, with the
 * shipped copy as the default for each key. A key missing from the
 * database, or a database that is not configured at all, renders exactly
 * what the site rendered before the backend existed.
 */
export const TEXT_DEFAULTS = {
  site_title: "Fear the Jungle",
  site_description: "A PvP / PvE online game. In development at Primal Interactive.",
  hero_tagline: "In Development",
  about_heading: "About",
  about_kicker: "PvP / PvE online game",
  about_body: "Coming soon!",
  news_heading: "News",
  news_empty: "Coming soon!",
  media_heading: "Media",
  media_placeholder: "Coming soon!",
  signup_label: "Enter your email for news, updates, and closed testing announcements.",
  signup_note: "No spam. Unsubscribe anytime.",
  signup_button: "Sign up",
  community_head: "Join our Discord Community!",
  discord_label: "Join the Discord",
  discord_url: "https://discord.gg/Msv9nVaQuJ",
  footer_copy: "© 2026 Primal Interactive. All rights reserved.",
} as const;

export type TextKey = keyof typeof TEXT_DEFAULTS;
export type SiteText = Record<TextKey, string>;

/** What each key is, for the backend's Text screen. */
export const TEXT_LABELS: Record<TextKey, string> = {
  site_title: "Browser tab title and link previews",
  site_description: "Description for search and link previews",
  hero_tagline: "Hero tagline under the logo",
  about_heading: "About section heading",
  about_kicker: "About section kicker line",
  about_body: "About section body",
  news_heading: "News section heading",
  news_empty: "News section text when there are no posts",
  media_heading: "Media section heading",
  media_placeholder: "Text in an empty gallery tile",
  signup_label: "Newsletter form label",
  signup_note: "Small line under the newsletter form",
  signup_button: "Newsletter button",
  community_head: "Discord heading",
  discord_label: "Discord button text",
  discord_url: "Discord invite link",
  footer_copy: "Footer line",
};

export type Post = {
  id: number;
  title: string;
  body: string;
  published: boolean;
  published_at: string;
};

export type GalleryImage = {
  id: number;
  url: string;
  caption: string;
  sort: number;
};

export type SiteContent = {
  text: SiteText;
  posts: Post[];
  gallery: GalleryImage[];
};

/** Neon returns untyped rows; every read narrows them through here. */
async function rows<T>(query: Promise<Record<string, unknown>[]>): Promise<T[]> {
  return (await query) as unknown as T[];
}

function withDefaults(rows: { key: string; value: string }[]): SiteText {
  const text = { ...TEXT_DEFAULTS } as SiteText;
  for (const row of rows) {
    if (row.key in TEXT_DEFAULTS && row.value.trim() !== "") {
      text[row.key as TextKey] = row.value;
    }
  }
  return text;
}

/** The whole page's content in one read, never throwing on the public path. */
export async function getSiteContent(): Promise<SiteContent> {
  const fallback: SiteContent = { text: { ...TEXT_DEFAULTS }, posts: [], gallery: [] };
  if (!configured()) return fallback;
  try {
    await ensureSchema();
    const q = sql();
    const [textRows, postRows, galleryRows] = await Promise.all([
      rows<{ key: string; value: string }>(q`SELECT key, value FROM site_text`),
      rows<Post>(q`SELECT id, title, body, published, published_at::text
        FROM posts WHERE published ORDER BY published_at DESC, id DESC`),
      rows<GalleryImage>(q`SELECT id, url, caption, sort FROM gallery ORDER BY sort ASC, id ASC`),
    ]);
    return { text: withDefaults(textRows), posts: postRows, gallery: galleryRows };
  } catch (err) {
    console.error("Content read failed; rendering defaults.", err);
    return fallback;
  }
}

// ---- Reads the backend uses. These DO throw, so a broken setup is visible.

export async function getAllText(): Promise<SiteText> {
  await ensureSchema();
  const rows = (await sql()`SELECT key, value FROM site_text`) as { key: string; value: string }[];
  return withDefaults(rows);
}

export async function getAllPosts(): Promise<Post[]> {
  await ensureSchema();
  return (await sql()`SELECT id, title, body, published, published_at::text
    FROM posts ORDER BY published_at DESC, id DESC`) as Post[];
}

export async function getPost(id: number): Promise<Post | null> {
  await ensureSchema();
  const rows = (await sql()`SELECT id, title, body, published, published_at::text
    FROM posts WHERE id = ${id}`) as Post[];
  return rows[0] ?? null;
}

export async function getGallery(): Promise<GalleryImage[]> {
  await ensureSchema();
  return (await sql()`SELECT id, url, caption, sort FROM gallery ORDER BY sort ASC, id ASC`) as GalleryImage[];
}

// ---- Writes. Each is one statement; the caller revalidates the page.

export async function saveText(values: Partial<Record<TextKey, string>>): Promise<void> {
  await ensureSchema();
  const q = sql();
  for (const key of Object.keys(TEXT_DEFAULTS) as TextKey[]) {
    const value = values[key];
    if (value === undefined) continue;
    const trimmed = value.trim();
    if (trimmed === "" || trimmed === TEXT_DEFAULTS[key]) {
      // Blank, or back to the shipped copy: drop the row so the default rules.
      await q`DELETE FROM site_text WHERE key = ${key}`;
    } else {
      await q`INSERT INTO site_text (key, value, updated_at) VALUES (${key}, ${trimmed}, now())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
    }
  }
}

export async function createPost(title: string, body: string, published: boolean): Promise<number> {
  await ensureSchema();
  const rows = (await sql()`INSERT INTO posts (title, body, published)
    VALUES (${title}, ${body}, ${published}) RETURNING id`) as { id: number }[];
  return rows[0].id;
}

export async function updatePost(id: number, title: string, body: string, published: boolean): Promise<void> {
  await ensureSchema();
  await sql()`UPDATE posts SET title = ${title}, body = ${body}, published = ${published}, updated_at = now()
    WHERE id = ${id}`;
}

export async function deletePost(id: number): Promise<void> {
  await ensureSchema();
  await sql()`DELETE FROM posts WHERE id = ${id}`;
}

export async function addGalleryImage(url: string, caption: string): Promise<void> {
  await ensureSchema();
  await sql()`INSERT INTO gallery (url, caption, sort)
    VALUES (${url}, ${caption}, COALESCE((SELECT MAX(sort) + 1 FROM gallery), 0))`;
}

export async function updateGalleryCaption(id: number, caption: string): Promise<void> {
  await ensureSchema();
  await sql()`UPDATE gallery SET caption = ${caption} WHERE id = ${id}`;
}

export async function removeGalleryImage(id: number): Promise<string | null> {
  await ensureSchema();
  const rows = (await sql()`DELETE FROM gallery WHERE id = ${id} RETURNING url`) as { url: string }[];
  return rows[0]?.url ?? null;
}

/** Swap an image with its neighbour in the given direction. */
export async function moveGalleryImage(id: number, direction: "up" | "down"): Promise<void> {
  await ensureSchema();
  const q = sql();
  const rows = (await q`SELECT id, sort FROM gallery ORDER BY sort ASC, id ASC`) as { id: number; sort: number }[];
  const index = rows.findIndex((r) => r.id === id);
  const other = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || other < 0 || other >= rows.length) return;
  // Renumber densely first so two rows can never share a sort value.
  for (let i = 0; i < rows.length; i++) rows[i].sort = i;
  [rows[index].sort, rows[other].sort] = [rows[other].sort, rows[index].sort];
  for (const row of rows) await q`UPDATE gallery SET sort = ${row.sort} WHERE id = ${row.id}`;
}
