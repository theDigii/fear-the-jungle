import { checkAdmin } from "@/lib/admin";
import { configured } from "@/lib/db";

/**
 * Every backend page starts by rendering this. It either returns null (carry
 * on) or a message explaining exactly why the page is not being shown, so a
 * misconfigured deploy tells you what to fix instead of erroring.
 */
export async function Gate(): Promise<React.ReactElement | null> {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "multiple-users") {
      return (
        <div className="be-msg" data-kind="error">
          This Clerk project holds {check.users} user accounts and the backend only works with exactly one.
          Delete every account that is not yours in the Clerk dashboard, and set sign-up to Restricted so it
          cannot happen again.
        </div>
      );
    }
    if (check.reason === "clerk-unavailable") {
      return (
        <div className="be-msg" data-kind="error">
          Could not reach Clerk to confirm the user count, so the backend is refusing to open. Check
          CLERK_SECRET_KEY on the deployment and try again.
        </div>
      );
    }
    return <div className="be-msg" data-kind="error">Not signed in.</div>;
  }
  if (!configured()) {
    return (
      <div className="be-msg" data-kind="error">
        DATABASE_URL is not set on the deployment. Add the Neon connection string and redeploy;
        the tables are created on first use.
      </div>
    );
  }
  return null;
}
