import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = '← Dashboard',
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-wider md:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xs font-bold tracking-wider text-black/40">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        {backHref && (
          <Link
            href={backHref}
            className="border-2 border-black px-4 py-2 text-[10px] font-black tracking-widest transition-all hover:-translate-y-0.5 hover:bg-black hover:text-white"
          >
            {backLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
