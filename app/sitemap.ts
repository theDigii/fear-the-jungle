import type { MetadataRoute } from "next";

/**
 * The sitemap lists the public page and nothing else. /backend and /api are
 * never in it, whatever gets added later — add public pages here by hand.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://fearthejungle.com/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
