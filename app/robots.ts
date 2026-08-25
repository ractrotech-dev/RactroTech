import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/account/",
        "/login",
        "/signup",
        "/forgot-password",
        "/webhook/",
        "/auth/",
        "/api/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
