'use client';

import Link from 'next/link';
import { useMemo } from 'react';
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
      className="group retro-card flex flex-col overflow-hidden border-4 bg-white transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    >
      <div
        ref={ref}
        className="relative h-48 overflow-hidden border-b-4 border-black bg-yellow-50"
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
          <div className="flex h-full items-center justify-center text-sm text-black/40">
            Loading preview...
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {categoryName && (
            <span className="inline-flex border-2 border-black bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-black">
              {categoryName}
            </span>
          )}
          {styleVariant && (
            <span className="inline-flex border border-black/20 bg-black/5 px-2 py-0.5 text-xs font-medium text-black/70">
              {styleVariant}
            </span>
          )}
          {industryVariant && (
            <span className="inline-flex border border-black/20 bg-black/5 px-2 py-0.5 text-xs font-medium text-black/70">
              {industryVariant}
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-black group-hover:underline">{title}</h3>
        <p className="line-clamp-2 text-sm text-black/65">{description}</p>
        {difficulty && (
          <p className="text-xs text-black/45 capitalize">Difficulty: {difficulty}</p>
        )}
      </div>
    </Link>
  );
}
