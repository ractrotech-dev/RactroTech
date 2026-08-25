import { cn } from '@/lib/utils';

/**
 * Small UI panels that sit inside the capability bento cards.
 * All decorative (`aria-hidden`); the card text carries the meaning.
 */

/** Stacked chat thread — used by the "one team, direct access" style cards. */
export function ChatPanelMock({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2 rounded-xl bg-mkt-surface p-3 ring-1 ring-mkt-line', className)} aria-hidden>
      <div className="flex gap-2">
        <div className="h-5 w-5 shrink-0 rounded-full bg-mkt-lavender-deep" />
        <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-mkt-lavender px-2.5 py-1.5 text-mkt-ink">
          <div className="h-1.5 w-24 rounded-full bg-mkt-ink/15" />
          <div className="mt-1 h-1.5 w-16 rounded-full bg-mkt-ink/10" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-mkt-violet px-2.5 py-1.5">
          <div className="h-1.5 w-20 rounded-full bg-white/70" />
          <div className="mt-1 h-1.5 w-28 rounded-full bg-white/40" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-5 shrink-0 rounded-full bg-mkt-mint" />
        <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-mkt-lavender px-2.5 py-1.5 text-mkt-ink">
          <div className="h-1.5 w-14 rounded-full bg-mkt-ink/15" />
        </div>
      </div>
    </div>
  );
}

/** Wireframe → design → code progression strip. */
export function DesignPanelMock({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-3 gap-2', className)} aria-hidden>
      {[
        { label: 'Wireframe', fill: 'bg-mkt-line' },
        { label: 'UI design', fill: 'bg-mkt-lilac' },
        { label: 'Shipped', fill: 'bg-mkt-violet' },
      ].map((step) => (
        <div key={step.label} className="rounded-xl bg-mkt-surface p-2 ring-1 ring-mkt-line text-mkt-ink">
          <div className={cn('mb-1.5 h-1 w-6 rounded-full', step.fill)} />
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-mkt-ink/10" />
            <div className="h-1.5 w-3/4 rounded-full bg-mkt-ink/10" />
            <div className="h-6 w-full rounded-md bg-mkt-ink/5" />
          </div>
          <div className="mt-1.5 text-[9px] font-medium text-mkt-muted">{step.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Deploy/status list — used by cloud + reliability cards. */
export function StatusPanelMock({ className }: { className?: string }) {
  const rows = [
    { label: 'production', state: 'Live', tone: 'text-[#2bb673] bg-[#2bb673]' },
    { label: 'preview-142', state: 'Building', tone: 'text-[#f0a71c] bg-[#f0a71c]' },
    { label: 'preview-141', state: 'Ready', tone: 'text-mkt-violet bg-mkt-violet' },
  ];

  return (
    <div className={cn('rounded-xl bg-mkt-surface p-2.5 ring-1 ring-mkt-line', className)} aria-hidden>
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={cn(
            'flex items-center gap-2 py-1.5',
            i !== rows.length - 1 && 'border-b border-mkt-line'
          )}
        >
          <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', r.tone.split(' ')[1])} />
          <span className="flex-1 truncate font-mono text-[10px] text-mkt-muted">{r.label}</span>
          <span className={cn('text-[9px] font-semibold', r.tone.split(' ')[0])}>{r.state}</span>
        </div>
      ))}
    </div>
  );
}

/** Checkout / payments summary card. */
export function CheckoutPanelMock({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl bg-mkt-surface p-3 ring-1 ring-mkt-line', className)} aria-hidden>
      <div className="mb-2 flex items-center justify-between">
        <div className="h-1.5 w-16 rounded-full bg-mkt-ink/15" />
        <div className="rounded-full bg-mkt-mint px-1.5 py-0.5 text-[8px] font-semibold text-mkt-success">
          Paid
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          ['w-full', 'w-8'],
          ['w-2/3', 'w-6'],
        ].map(([a, b], i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className={cn('h-1.5 rounded-full bg-mkt-ink/10', a)} />
            <div className={cn('h-1.5 rounded-full bg-mkt-ink/15', b)} />
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-mkt-line pt-2">
        <div className="text-[9px] font-medium text-mkt-muted">Total</div>
        <div className="h-2 w-10 rounded-full bg-mkt-violet" />
      </div>
      <div className="mt-2 h-6 rounded-lg bg-mkt-violet" />
    </div>
  );
}
