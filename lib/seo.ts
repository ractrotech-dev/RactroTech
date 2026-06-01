import { Metadata } from "next";

const DEFAULT_SITE_URL = "https://www.ractrotech.com";

/** Single canonical origin for metadata, sitemap, auth redirects, and schema. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_WEBSITE_URL ||
    DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

/** Absolute URL for a site path (e.g. `/blog` → `https://www.ractrotech.com/blog`). */
export function sitePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export const siteConfig = {
  name: "Ractrotech",
  description:
    "Ractrotech builds custom web apps, SaaS products, and ready-to-use Next.js templates. Ship faster with a developer-led team focused on performance and modern stacks.",
  get url() {
    return getSiteUrl();
  },
  get ogImage() {
    return `${getSiteUrl()}/opengraph-image`;
  },
  get logoUrl() {
    return `${getSiteUrl()}/icon.svg`;
  },
  links: {
    twitter: "https://twitter.com/ractrotech",
    github: "https://github.com/ractrotech",
  },
  keywords: [
    "web development services",
    "custom SaaS development",
    "Next.js development",
    "SaaS templates",
    "React component library",
    "web development agency",
    "digital products",
    "web optimization",
  ],
  author: "Ractrotech",
  /** Google Search Console HTML tag verification */
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
    "M2S9-dkQg2H8Q5tM-GANPTd0XiTxy0-ZoV8NTvX2cO0",
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  canonicalUrl,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: siteConfig.keywords,
    authors: [
      {
        name: siteConfig.author,
        url: siteConfig.url,
      },
    ],
    creator: siteConfig.author,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl || siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@ractrotech",
    },
    metadataBase: new URL(siteConfig.url),
    verification: {
      google: siteConfig.googleSiteVerification,
    },
    alternates: {
      canonical: canonicalUrl || siteConfig.url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: siteConfig.logoUrl,
    description: siteConfig.description,
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: `${siteConfig.url}${breadcrumb.item}`,
    })),
  };
}

type BlogPostingInput = {
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: Date | string | null;
  cover_image?: string | null;
};

export function generateBlogPostingSchema(post: BlogPostingInput) {
  const published =
    post.published_at instanceof Date
      ? post.published_at.toISOString()
      : post.published_at
        ? new Date(post.published_at).toISOString()
        : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: published,
    image: post.cover_image || siteConfig.ogImage,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.logoUrl,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": sitePath(`/blog/${post.slug}`),
    },
  };
}
