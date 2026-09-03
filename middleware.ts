import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * THE DOOR TO /backend.
 *
 * Only /backend routes pass through here (see `config.matcher`), so the
 * public site never touches Clerk and keeps working with no Clerk keys at
 * all. Everything under /backend except the sign-in page itself demands a
 * signed-in Clerk session; Clerk's own rate limiting, bot detection and
 * optional MFA stand in front of that sign-in, which is what makes the
 * password un-brute-forceable without any code here.
 *
 * Whether a signed-in account is ALLOWED in is decided per page and per
 * action by lib/admin.ts against the email allowlist.
 *
 * Every /backend response also carries X-Robots-Tag, so the section stays
 * out of search results whatever robots.txt says.
 */
const isSignIn = createRouteMatcher(["/backend/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isSignIn(req)) await auth.protect();
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return res;
});

export const config = {
  matcher: ["/backend/:path*"],
};
