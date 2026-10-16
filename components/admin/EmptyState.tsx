import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  /** A lucide component (`icon={Inbox}`) from a Server Component, or an element. */
  icon?: LucideIcon | React.ReactElement;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** What a list says when it has nothing in it yet — and what to do about it. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  // lucide icons are forwardRef objects ({ $$typeof, render }), not plain functions.
  const isComponent = typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null && 'render' in Icon);
  const Component = Icon as LucideIcon;
  const mark = !Icon ? null : isComponent ? <Component className="h-5 w-5" aria-hidden /> : (Icon as React.ReactElement);

  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      {mark ? (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mkt-lavender text-mkt-violet [&_svg]:h-5 [&_svg]:w-5">
          {mark}
        </span>
      ) : null}
      <h3 className="mt-4 text-[15px] font-semibold text-mkt-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-[14px] leading-6 text-mkt-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
