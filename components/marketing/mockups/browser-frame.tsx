import { cn } from '@/lib/utils';

type BrowserFrameProps = {
  children: React.ReactNode;
  /** Text shown in the fake address bar. */
  url?: string;
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * Decorative browser chrome wrapping an in-code UI mockup. Purely presentational —
 * hidden from assistive tech by the callers, which own the real content.
 */
export function BrowserFrame({
  children,
  url = 'app.ractrotech.com',
  tone = 'light',
  className,
}: BrowserFrameProps) {
  const dark = tone === 'dark';

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border shadow-[0_30px_80px_-30px_rgba(11,11,16,0.35)]',
        dark ? 'border-white/10 bg-mkt-contrast-soft' : 'border-mkt-line bg-mkt-surface',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 border-b px-4 py-3',
          dark ? 'border-white/10 bg-white/[0.04]' : 'border-mkt-line bg-mkt-lavender/40'
        )}
      >
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div
          className={cn(
            'mx-auto flex h-6 w-full max-w-[240px] items-center justify-center rounded-md text-[11px] font-medium',
            dark ? 'bg-white/[0.06] text-white/50' : 'bg-mkt-surface text-mkt-muted ring-1 ring-mkt-line'
          )}
        >
          {url}
        </div>
        <div className="w-[42px] shrink-0" />
      </div>
      {children}
    </div>
  );
}
