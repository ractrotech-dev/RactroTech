import { Metadata } from "next";

export const siteConfig = {
  name: "Ractrotech",
  description: "Ractrotech is a platform offering high-quality web development services, along with powerful tools and ready-to-use templates designed to help businesses and developers build, scale, and optimize their digital products efficiently.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ractrotech.com",
  ogImage: "https://ractrotech.com/og-image.jpg",
  links: {
    twitter: "https://twitter.com/ractrotech",
    github: "https://github.com/ractrotech",
  },
  keywords: [
    "web development",
    "software engineering",
    "templates",
    "react",
    "next.js",
    "saas",
    "digital products",
    "web optimization"
  ],
  author: "Ractrotech"
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
  canonicalUrl,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
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
      }
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
      creator: "@ractrotech", // Replace with actual handle
    },
    icons,
    metadataBase: new URL(siteConfig.url),
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

// Schema Markup Generators
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/logo.png`,
    "description": siteConfig.description,
    "sameAs": [
      siteConfig.links.twitter,
      siteConfig.links.github
    ]
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": `${siteConfig.url}${breadcrumb.item}`
    }))
  };
}
