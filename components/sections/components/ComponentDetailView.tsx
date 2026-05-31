'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { buildSrcDoc, getFrameWidthClass } from './build-src-doc';
import type { LibraryComponent, PreviewDevice } from './types';

type ComponentDetailViewProps = {
  component: LibraryComponent;
  categoryName?: string;
};

export function ComponentDetailView({ component, categoryName }: ComponentDetailViewProps) {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [darkPreview, setDarkPreview] = useState(false);

  const frameWidthClass = useMemo(() => getFrameWidthClass(device), [device]);
  const srcDoc = useMemo(
    () => buildSrcDoc(component.code, { darkMode: darkPreview }),
    [component.code, darkPreview]
  );

  const tags = component.tags ?? component.preview_metadata?.tags ?? [];
  const isCustom = tags.some((tag) => tag.toLowerCase() === 'custom');

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {categoryName && (
            <span className="inline-flex border-2 border-black bg-yellow-400 px-2 py-0.5 text-xs font-semibold">
              {categoryName}
            </span>
          )}
          {component.style_variant && (
            <span className="inline-flex border border-black/20 bg-white px-2 py-0.5 text-xs font-medium">
              {component.style_variant}
            </span>
          )}
          {component.industry_variant && (
            <span className="inline-flex border border-black/20 bg-white px-2 py-0.5 text-xs font-medium">
              {component.industry_variant}
            </span>
          )}
          {component.difficulty && (
            <span className="inline-flex border border-black/20 bg-white px-2 py-0.5 text-xs font-medium capitalize">
              {component.difficulty}
            </span>
          )}
          {isCustom && (
            <Link
              href={`/components/new?edit=${component.id}`}
              className="inline-flex items-center gap-1 border-2 border-black bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-black hover:bg-yellow-300"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Link>
          )}
        </div>
        <h1 className="retro-heading text-2xl font-bold md:text-3xl">{component.title}</h1>
        <p className="text-base font-medium text-black/75">{component.description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-black/15 bg-yellow-50 px-2 py-0.5 text-xs text-black/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <Card className="flex flex-col border-4 border-black bg-yellow-50">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b-4 border-black pb-3">
          <div>
            <CardTitle className="text-sm font-bold text-black">Code</CardTitle>
            <CardDescription className="text-sm text-black/60">
              Saved Tailwind markup
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-2 border-black bg-black text-sm font-semibold text-yellow-400 hover:bg-black/90"
            onClick={() => {
              if (!component.code) return;
              navigator.clipboard.writeText(component.code).catch(() => {});
            }}
          >
            Copy
          </Button>
        </CardHeader>
        <CardContent className="max-h-[420px] overflow-auto bg-yellow-100 p-4">
          <pre className="whitespace-pre text-xs leading-relaxed text-black">
            <code>{component.code}</code>
          </pre>
        </CardContent>
      </Card>

      <Card className="flex flex-col border-4 border-black bg-yellow-50">
        <CardHeader className="flex flex-col items-start justify-between gap-3 border-b-4 border-black pb-3 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-sm font-bold text-black">Preview</CardTitle>
            <CardDescription className="text-sm text-black/60">
              Check responsiveness and dark mode
            </CardDescription>
          </div>
          <div className="flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end">
            {component.supports_dark_mode !== false && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7 border-2 border-black px-2 text-xs font-medium',
                  darkPreview ? 'bg-black text-yellow-400' : 'bg-white text-black'
                )}
                onClick={() => setDarkPreview((v) => !v)}
              >
                {darkPreview ? 'Dark on' : 'Dark off'}
              </Button>
            )}
            <div className="flex max-w-full flex-wrap items-center gap-1 rounded-md border-2 border-black bg-yellow-100 p-0.5">
              {(['mobile', 'tablet', 'desktop'] as PreviewDevice[]).map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 px-2 text-xs font-medium capitalize',
                    device === value
                      ? 'bg-black text-yellow-400'
                      : 'bg-transparent text-black hover:bg-black hover:text-yellow-400'
                  )}
                  onClick={() => setDevice(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-2 border-black bg-yellow-100 text-xs font-semibold text-black hover:bg-black hover:text-yellow-400"
              disabled={!srcDoc}
              onClick={() => {
                if (!srcDoc) return;
                const blob = new Blob([srcDoc], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
            >
              Full screen
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <div className="flex h-[360px] min-w-0 justify-center overflow-x-auto bg-yellow-100 p-4">
            {srcDoc ? (
              <div
                className={cn(
                  'h-full max-h-full max-w-full overflow-hidden rounded-[1.25rem] border-4 border-black bg-black',
                  frameWidthClass
                )}
              >
                <iframe
                  title="Component preview"
                  srcDoc={srcDoc}
                  className="h-full w-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <p className="text-sm font-medium text-black/80">No preview available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
