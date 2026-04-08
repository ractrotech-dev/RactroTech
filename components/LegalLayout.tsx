import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-gray-400">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Home
        </Link>
        <div className="mb-4 border-b border-white/10 pb-2">
          <h1 className="mb-1 text-xl font-semibold tracking-tight text-white md:text-2xl">
            {title}
          </h1>
          <p className="text-xs text-gray-500">Last Updated: {lastUpdated}</p>
        </div>
        <div className="space-y-3">{children}</div>
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-gray-500">
          <h3 className="font-semibold text-gray-300">RactroTech Technologies</h3>
          <p>
            For legal inquiries:{' '}
            <a
              href="mailto:legal@ractrotech.com"
              className="text-gray-300 underline transition-colors hover:text-white"
            >
              legal@ractrotech.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-1">
      <h2 className="text-sm font-semibold text-gray-200">{title}</h2>
      <div className="space-y-1 text-sm leading-snug text-gray-400">{children}</div>
    </section>
  );
}

export function LegalParagraph({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`text-sm ${className}`}>{children}</p>;
}

export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul className="ml-5 list-outside list-disc space-y-0.5 text-sm text-gray-400">{children}</ul>
  );
}
