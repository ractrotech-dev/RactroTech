import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/webhook/", "/auth/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
