import { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo";

const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/saas-development",
  "/mvp-development",
  "/nextjs-development",
  "/web-app-development",
  "/ui-ux-design",
  "/startup-development",
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

export const revalidate = 3600;

async function fetchBlogEntries(base: string, now: string): Promise<MetadataRoute.Sitemap> {
  if (!process.env.DATABASE_URL) return [];

  try {
    const { eq } = await import("drizzle-orm");
    const { db } = await import("@/utils/db/db");
    const { postsTable } = await import("@/utils/db/schema");

    const posts = await db
      .select({
        slug: postsTable.slug,
        published_at: postsTable.published_at,
        updated_at: postsTable.updated_at,
      })
      .from(postsTable)
      .where(eq(postsTable.status, "published"));

    return posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified:
        (post.updated_at && new Date(post.updated_at).toISOString().split("T")[0]) ||
        (post.published_at && new Date(post.published_at).toISOString().split("T")[0]) ||
        now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date().toISOString().split("T")[0];

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : ("weekly" as const),
    priority: route === "" ? 1 : route.startsWith("/saas") || route.includes("development") ? 0.9 : 0.8,
  }));

  const postEntries = await fetchBlogEntries(base, now);

  return [...staticEntries, ...postEntries];
}
