import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ractrotech",
  description: "Ractrotech is a platform offering high-quality web development services, along with powerful tools and ready-to-use templates designed to help businesses and developers build, scale, and optimize their digital products efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Required for pricing table */}
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
