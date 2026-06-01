import { MetadataRoute } from "next";
import { eq } from "drizzle-orm";

import { siteConfig } from "@/lib/seo";
import { db } from "@/utils/db/db";
import { postsTable } from "@/utils/db/schema";

const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/contact",
  "/templates",
  "/components",
  "/components/new",
  "/blog",
  "/start-project",
  "/review",
  "/subscribe",
  "/privacy",
  "/terms",
  "/license",
  "/cookies",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date().toISOString().split("T")[0];

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await db
      .select({ slug: postsTable.slug, published_at: postsTable.published_at, updated_at: postsTable.updated_at })
      .from(postsTable)
      .where(eq(postsTable.status, "published"));

    postEntries = posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified:
        (post.updated_at && new Date(post.updated_at).toISOString().split("T")[0]) ||
        (post.published_at && new Date(post.published_at).toISOString().split("T")[0]) ||
        now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable at build time — static routes still ship
  }

  return [...staticEntries, ...postEntries];
}
