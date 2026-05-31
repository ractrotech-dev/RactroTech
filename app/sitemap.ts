import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/contact",
    "/templates",
    "/components",
    "/components/new",
    "/blog",
    "/login",
    "/signup",
    "/forgot-password",
    "/start-project",
    "/review",
    "/subscribe",
    "/privacy",
    "/terms",
    "/license",
    "/cookies",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes];
}
