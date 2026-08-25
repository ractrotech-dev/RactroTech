'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { buildSrcDoc } from './build-src-doc';
import { useLazyIframe } from './use-lazy-iframe';

type ComponentPreviewCardProps = {
  id: string;
  title: string;
  description: string;
  code: string;
  categoryName?: string;
  styleVariant?: string | null;
  industryVariant?: string | null;
  difficulty?: string | null;
};

export function ComponentPreviewCard({
  id,
  title,
  description,
  code,
  categoryName,
  styleVariant,
  industryVariant,
  difficulty,
}: ComponentPreviewCardProps) {
  const { ref, isVisible } = useLazyIframe();
  const srcDoc = useMemo(() => (code ? buildSrcDoc(code) : ''), [code]);

  return (
    <Link
      href={`/components/${id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-mkt-line bg-mkt-surface transition-shadow duration-200 hover:shadow-[0_18px_44px_-26px_rgba(11,11,16,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet focus-visible:ring-offset-2 text-mkt-ink"
    >
      <div
        ref={ref}
        className="relative h-48 overflow-hidden border-b border-mkt-line bg-mkt-surface-2 text-mkt-ink"
      >
        {isVisible && srcDoc ? (
          <iframe
            title={`Preview of ${title}`}
            srcDoc={srcDoc}
            className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            tabIndex={-1}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-mkt-muted">
            Loading preview…
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          {categoryName && (
            <span className="rounded-full bg-mkt-lavender px-2.5 py-1 text-[12px] font-medium text-mkt-violet text-mkt-ink">
              {categoryName}
            </span>
          )}
          {styleVariant && (
            <span className="rounded-full border border-mkt-line px-2.5 py-1 text-[12px] font-medium capitalize text-mkt-muted">
              {styleVariant}
            </span>
          )}
          {industryVariant && (
            <span className="rounded-full border border-mkt-line px-2.5 py-1 text-[12px] font-medium capitalize text-mkt-muted">
              {industryVariant}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="mkt-display text-[17px] leading-snug">{title}</h3>
          <ArrowUpRight
            className="mt-0.5 h-5 w-5 shrink-0 text-mkt-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>

        <p className="mt-2 line-clamp-2 flex-1 text-[15px] leading-relaxed text-mkt-muted">
          {description}
        </p>

        {difficulty && (
          <p className="mt-4 text-[12px] capitalize text-mkt-muted">Difficulty: {difficulty}</p>
        )}
      </div>
    </Link>
  );
}
