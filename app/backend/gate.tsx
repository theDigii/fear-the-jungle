import { checkAdmin } from "@/lib/admin";
import { configured } from "@/lib/db";

/**
 * Every backend page starts by rendering this. It either returns null (carry
 * on) or a message explaining exactly why the page is not being shown, so a
 * misconfigured deploy tells you which env var to set instead of erroring.
 */
export async function Gate(): Promise<React.ReactElement | null> {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "no-list") {
      return (
        <div className="be-msg" data-kind="error">
          Signed in as {check.email}, but BACKEND_ADMIN_EMAILS is not set on the deployment,
          so nobody is allowed in yet. Add your email to that env var and redeploy.
        </div>
      );
    }
    if (check.reason === "not-allowed") {
      return (
        <div className="be-msg" data-kind="error">
          {check.email} is signed in but is not on the backend allowlist.
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
