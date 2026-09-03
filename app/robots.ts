import type { MetadataRoute } from "next";

/**
 * NOT YET PUBLIC. While LAUNCHED is false every crawler is asked to stay
 * out of everything, and layout.tsx sets the matching noindex meta tag for
 * anything that ignores robots.txt.
 *
 * When the site is ready to be found, flip LAUNCHED to true and delete the
 * `robots` block in layout.tsx in the same commit. /backend and /api stay
 * disallowed either way, and /backend additionally sends X-Robots-Tag from
 * the middleware, so it is never indexed even if this file is wrong.
 */
const LAUNCHED = false;

export default function robots(): MetadataRoute.Robots {
  if (!LAUNCHED) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/backend", "/backend/", "/api/"] },
    sitemap: "https://fearthejungle.gg/sitemap.xml",
  };
}
