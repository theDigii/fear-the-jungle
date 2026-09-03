import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * WHO MAY USE THE BACKEND: ONE PERSON.
 *
 * Clerk proves who someone is; this decides whether they are allowed in.
 * The rule is the founder's, stated plainly: exactly one user, ever. So the
 * check is not "is this email on a list" but "does this Clerk project hold
 * exactly one account". While it does, that account is the admin. The
 * moment a second account exists, whether through open sign-up, an invite
 * or a dashboard slip, the backend refuses EVERYONE and says so, which is
 * loud, fails closed, and cannot be talked around by whoever the second
 * account belongs to.
 *
 * Middleware already sends the signed-out to the sign-in page, so a caller
 * here is at least authenticated. Called at the top of every backend page
 * AND every server action, so a direct POST to an action can never do what
 * the page would have refused.
 */
export type AdminCheck =
  | { ok: true }
  | { ok: false; reason: "signed-out" | "multiple-users" | "clerk-unavailable"; users?: number };

export async function checkAdmin(): Promise<AdminCheck> {
  const { userId } = await auth();
  if (!userId) return { ok: false, reason: "signed-out" };

  let users: number;
  try {
    const client = await clerkClient();
    users = await client.users.getCount();
  } catch (err) {
    console.error("Clerk user count failed; refusing the backend.", err);
    return { ok: false, reason: "clerk-unavailable" };
  }

  if (users !== 1) return { ok: false, reason: "multiple-users", users };
  return { ok: true };
}

/** For server actions: throw rather than render, so nothing is written. */
export async function requireAdmin(): Promise<void> {
  const check = await checkAdmin();
  if (!check.ok) throw new Error("Not allowed.");
}
