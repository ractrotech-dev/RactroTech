import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { constructMetadata, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import { AppProviders } from "@/providers/app-providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/** Display face for marketing headlines — consumed via `font-display` in tailwind.config.ts. */
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();
  const webSchema = generateWebsiteSchema();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <AppProviders>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }}
          />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
