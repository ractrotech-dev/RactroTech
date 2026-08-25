'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Download, Lock, Maximize2, Moon, Pencil, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { buildSrcDoc, getFrameWidthClass } from './build-src-doc';
import type { LibraryComponent, PreviewDevice } from './types';

type ComponentDetailViewProps = {
  component: LibraryComponent;
  categoryName?: string;
};

const DEVICES: PreviewDevice[] = ['mobile', 'tablet', 'desktop'];

/** Compact pill action used across both panel headers. */
const pillAction =
  'inline-flex h-9 items-center justify-center gap-2 rounded-full border border-mkt-line px-3.5 text-[13px] font-medium text-mkt-muted transition-colors hover:border-mkt-ink/25 hover:text-mkt-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export function ComponentDetailView({ component, categoryName }: ComponentDetailViewProps) {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [darkPreview, setDarkPreview] = useState(false);
  const [codeRevealed, setCodeRevealed] = useState(false);
  const { handleProtectedAction, isAuthenticated } = useProtectedAction();

  const revealCode = () => setCodeRevealed(true);

  const downloadCode = () => {
    if (!component.code) return;
    const blob = new Blob([component.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${component.title.replace(/\s+/g, '-').toLowerCase()}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const frameWidthClass = useMemo(() => getFrameWidthClass(device), [device]);
  const srcDoc = useMemo(
    () => buildSrcDoc(component.code, { darkMode: darkPreview }),
    [component.code, darkPreview]
  );

  const tags = component.tags ?? component.preview_metadata?.tags ?? [];
  const isCustom = tags.some((tag) => tag.toLowerCase() === 'custom');
  const isCodeHidden = !codeRevealed && !isAuthenticated;

  return (
    <div className="space-y-8">
      <header>
        <div className="flex flex-wrap items-center gap-1.5">
          {categoryName && (
            <span className="rounded-full bg-mkt-lavender px-2.5 py-1 text-[12px] font-medium text-mkt-violet text-mkt-ink">
              {categoryName}
            </span>
          )}
          {component.style_variant && (
            <span className="rounded-full border border-mkt-line px-2.5 py-1 text-[12px] font-medium capitalize text-mkt-muted">
              {component.style_variant}
            </span>
          )}
          {component.industry_variant && (
            <span className="rounded-full border border-mkt-line px-2.5 py-1 text-[12px] font-medium capitalize text-mkt-muted">
              {component.industry_variant}
            </span>
          )}
          {component.difficulty && (
            <span className="rounded-full border border-mkt-line px-2.5 py-1 text-[12px] font-medium capitalize text-mkt-muted">
              {component.difficulty}
            </span>
          )}
          {isCustom && (
            <Link
              href={`/components/new?edit=${component.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-mkt-violet px-2.5 py-1 text-[12px] font-medium text-white transition-colors hover:bg-mkt-violet-soft"
            >
              <Pencil className="h-3 w-3" aria-hidden />
              Edit
            </Link>
          )}
        </div>

        <h1 className="mkt-display mt-5 text-[30px] leading-[1.1] sm:text-[38px]">
          {component.title}
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-mkt-muted">
          {component.description}
        </p>

        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-mkt-surface-2 px-2.5 py-1 text-[12px] text-mkt-muted text-mkt-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Preview sits above the code: the code panel is gated for signed-out visitors,
          so leading with it would put a blurred block at the top of the page. */}
      <section className="mkt-card overflow-hidden">
        <div className="flex flex-col items-start gap-3 border-b border-mkt-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mkt-display text-[15px]">Preview</h2>
            <p className="mt-0.5 text-[13px] text-mkt-muted">
              Check responsiveness and dark mode
            </p>
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            {component.supports_dark_mode !== false && (
              <button
                type="button"
                onClick={() => setDarkPreview((v) => !v)}
                aria-pressed={darkPreview}
                className={cn(
                  pillAction,
                  darkPreview &&
                    'border-transparent bg-mkt-violet text-white hover:border-transparent hover:text-white'
                )}
              >
                {darkPreview ? (
                  <Moon className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Sun className="h-3.5 w-3.5" aria-hidden />
                )}
                Dark
              </button>
            )}

            <div
              className="flex items-center gap-1 rounded-full border border-mkt-line p-1"
              role="group"
              aria-label="Preview width"
            >
              {DEVICES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDevice(value)}
                  aria-pressed={device === value}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[13px] font-medium capitalize transition-colors',
                    device === value
                      ? 'bg-mkt-violet text-white'
                      : 'text-mkt-muted hover:text-mkt-ink'
                  )}
                >
                  {value}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={pillAction}
              disabled={!srcDoc}
              onClick={() => {
                if (!srcDoc) return;
                const blob = new Blob([srcDoc], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden />
              Full screen
            </button>
          </div>
        </div>

        <div className="bg-mkt-surface-2 p-4 sm:p-6 text-mkt-ink">
          <div className="flex h-[380px] min-w-0 justify-center overflow-x-auto">
            {srcDoc ? (
              <div
                className={cn(
                  'h-full max-h-full max-w-full overflow-hidden rounded-2xl border border-mkt-line bg-mkt-surface shadow-[0_18px_44px_-26px_rgba(11,11,16,0.4)]',
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
              <p className="self-center text-[15px] text-mkt-muted">No preview available.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mkt-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-mkt-line px-5 py-4">
          <div>
            <h2 className="mkt-display text-[15px]">Code</h2>
            <p className="mt-0.5 text-[13px] text-mkt-muted">Saved Tailwind markup</p>
          </div>
          <button
            type="button"
            className={pillAction}
            onClick={() => handleProtectedAction(downloadCode)}
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Download
          </button>
        </div>

        {/* `mkt-contrast` is dark in both themes, so the code block reads the same way
            whichever theme the visitor is in. */}
        <div className="relative bg-mkt-contrast">
          <div className="max-h-[420px] overflow-auto p-5">
            <pre
              className={cn(
                'whitespace-pre font-mono text-[12.5px] leading-relaxed text-white/85 transition-all duration-300',
                isCodeHidden && 'select-none blur-sm'
              )}
            >
              <code>{component.code}</code>
            </pre>
          </div>

          {isCodeHidden ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-mkt-contrast/40 backdrop-blur-[2px]">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                <Lock className="h-4 w-4" aria-hidden />
              </span>
              <button
                type="button"
                className="mkt-btn-primary"
                onClick={() => handleProtectedAction(revealCode)}
              >
                View premium content
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
