import { cn } from '@/lib/utils';

/** Faux delivery board for the dark process section. Decorative only. */

const COLUMNS = [
  {
    title: 'Scoped',
    accent: 'bg-[#6b7280]',
    cards: [
      { title: 'Auth + roles', meta: 'Week 1' },
      { title: 'Billing model', meta: 'Week 1' },
    ],
  },
  {
    title: 'In design',
    accent: 'bg-[#f0a71c]',
    cards: [
      { title: 'Onboarding flow', meta: '3 screens' },
      { title: 'Admin dashboard', meta: 'In review' },
    ],
  },
  {
    title: 'In build',
    accent: 'bg-mkt-violet',
    cards: [
      { title: 'Stripe checkout', meta: 'PR #142' },
      { title: 'Team invites', meta: 'PR #147' },
      { title: 'Usage limits', meta: 'PR #151' },
    ],
  },
  {
    title: 'Shipped',
    accent: 'bg-[#2bb673]',
    cards: [{ title: 'Marketing site', meta: 'Live' }],
  },
];

export function KanbanMock({ className }: { className?: string }) {
  return (
    <div className={cn('bg-mkt-contrast-soft p-3 sm:p-4', className)} aria-hidden>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold text-white">Sprint 4 · Client SaaS</div>
          <div className="text-[10px] text-white/40">Weekly demo Thursday</div>
        </div>
        <div className="hidden gap-1 sm:flex">
          {['JD', 'AR', 'MK'].map((initials, i) => (
            <div
              key={initials}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-white ring-2 ring-mkt-ink-soft',
                i === 0 ? 'bg-mkt-violet' : i === 1 ? 'bg-[#2bb673]' : 'bg-[#f0a71c]'
              )}
            >
              {initials}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
            <div className="mb-2 flex items-center gap-1.5 px-0.5">
              <span className={cn('h-1.5 w-1.5 rounded-full', col.accent)} />
              <span className="text-[10px] font-medium text-white/70">{col.title}</span>
              <span className="ml-auto text-[10px] tabular-nums text-white/30">
                {col.cards.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {col.cards.map((card) => (
                <div key={card.title} className="rounded-lg border border-white/10 bg-white/[0.05] p-2">
                  <div className="truncate text-[10px] font-medium text-white/90">{card.title}</div>
                  <div className="mt-1 text-[9px] text-white/40">{card.meta}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
