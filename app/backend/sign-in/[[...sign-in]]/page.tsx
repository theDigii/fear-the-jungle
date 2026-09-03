import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

/**
 * Clerk's hosted sign-in, rendered on our page. Sign-up is NOT offered here
 * on purpose: create the admin accounts in the Clerk dashboard and set the
 * project's sign-up mode to Restricted, so this form can only ever log in
 * people you already made.
 */
export default function SignInPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <SignIn forceRedirectUrl="/backend" />
    </div>
  );
}
