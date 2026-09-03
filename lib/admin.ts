import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * WHO MAY USE THE BACKEND.
 *
 * Clerk proves who someone is; this decides whether that person is allowed
 * in. Middleware already sends anyone signed out to the sign-in page, so a
 * caller here is at least authenticated. Authentication is not authorisation:
 * anyone can create a Clerk account, so the backend also demands that the
 * account's email be on BACKEND_ADMIN_EMAILS. No list means nobody, which is
 * the safe way for a missing env var to fail.
 *
 * Called at the top of every backend page AND every server action, so a
 * direct POST to an action can never do what the page would have refused.
 */
export type AdminCheck =
  | { ok: true; email: string }
  | { ok: false; reason: "signed-out" | "not-allowed" | "no-list"; email?: string };

export async function checkAdmin(): Promise<AdminCheck> {
  const { userId } = await auth();
  if (!userId) return { ok: false, reason: "signed-out" };

  const user = await currentUser();
  const emails = (user?.emailAddresses ?? []).map((e) => e.emailAddress.trim().toLowerCase());
  const allowed = (process.env.BACKEND_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length === 0) return { ok: false, reason: "no-list", email: emails[0] };
  const match = emails.find((e) => allowed.includes(e));
  if (!match) return { ok: false, reason: "not-allowed", email: emails[0] };
  return { ok: true, email: match };
}

/** For server actions: throw rather than render, so nothing is written. */
export async function requireAdmin(): Promise<string> {
  const check = await checkAdmin();
  if (!check.ok) throw new Error("Not allowed.");
  return check.email;
}
