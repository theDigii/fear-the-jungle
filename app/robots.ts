import type { MetadataRoute } from "next";

// NOT YET PUBLIC. Every crawler is asked to stay out, and layout.tsx sets
// the matching noindex meta tag for anything that ignores robots.txt.
// When the site is ready to be found, delete this file and the `robots`
// block in layout.tsx together — one without the other is a half-open door.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
