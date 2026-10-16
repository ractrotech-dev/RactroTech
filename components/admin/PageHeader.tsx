import Link from 'next/link';
import { ChevronLeft, type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  /** Where the back link goes, e.g. "Projects". A leading "←" is tolerated and dropped. */
  backLabel?: string;
  /** Accepted for older call sites; the header no longer shows an icon. */
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

/** Page title, one line of context, and the page's own actions on the right. */
export default function PageHeader({ title, subtitle, backHref, backLabel = 'Dashboard', actions }: PageHeaderProps) {
  const back = backLabel.replace(/^←\s*/, '');
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-[13px] font-medium text-mkt-muted transition-colors hover:text-mkt-ink"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {back}
          </Link>
        ) : null}
        <h1 className="font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] text-mkt-ink md:text-[28px]">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-[14px] leading-6 text-mkt-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
