import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RactroTech - Innovative Business Solutions',
  description: 'Custom websites, Micro SaaS, App Development, and Business Automation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      {/* Required for pricing table if used later */}
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <body
        className={`${inter.className} relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-50 antialiased`}
      >
        {/* Abstract background gradient */}
        <div className="absolute top-0 -z-10 h-full w-full bg-slate-950">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(120,119,198,0.15)] opacity-50 blur-[80px]"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
