import { cn } from '@/lib/utils';

/**
 * Faux project-delivery dashboard used as the hero "screenshot".
 * Built entirely from divs + inline SVG so it stays crisp at any size and needs no assets.
 * `aria-hidden` — the surrounding section carries the real, readable copy.
 */

const NAV = [
  { label: 'Overview', active: true },
  { label: 'Projects', active: false },
  { label: 'Design', active: false },
  { label: 'Deploys', active: false },
  { label: 'Team', active: false },
];

const PROJECTS = [
  { name: 'Client SaaS platform', phase: 'Build', progress: 78, tone: 'bg-mkt-violet' },
  { name: 'Founder MVP', phase: 'Design', progress: 46, tone: 'bg-[#2bb673]' },
  { name: 'Store replatform', phase: 'QA', progress: 91, tone: 'bg-[#f0a71c]' },
];

const ACTIVITY = [
  { who: 'Design', what: 'Handoff approved', when: '2m' },
  { who: 'Engineering', what: 'Checkout flow merged', when: '18m' },
  { who: 'QA', what: 'Regression suite green', when: '1h' },
];

/** Deterministic bar heights — no Math.random, so SSR and client markup match. */
const BARS = [38, 52, 44, 68, 58, 82, 71, 94, 76, 88];

export function DashboardMock({ className }: { className?: string }) {
  return (
    <div className={cn('flex bg-mkt-surface text-mkt-ink', className)} aria-hidden>
      {/* Sidebar */}
      <div className="hidden w-[168px] shrink-0 flex-col gap-1 border-r border-mkt-line bg-mkt-lavender/40 p-3 sm:flex text-mkt-ink">
        <div className="mb-3 flex items-center gap-2 px-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-mkt-violet text-[10px] font-bold text-white">
            R
          </div>
          <div className="text-[11px] font-semibold">Ractrotech</div>
        </div>
        {NAV.map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px]',
              item.active ? 'bg-mkt-surface font-medium text-mkt-ink shadow-sm' : 'text-mkt-muted'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                item.active ? 'bg-mkt-violet' : 'bg-mkt-line'
              )}
            />
            {item.label}
          </div>
        ))}
        <div className="mt-auto rounded-lg bg-mkt-lavender p-2.5 text-mkt-ink">
          <div className="text-[10px] font-semibold text-mkt-ink">Next review</div>
          <div className="mt-0.5 text-[10px] text-mkt-muted">Thursday, 10:00</div>
        </div>
      </div>

      {/* Main */}
      <div className="min-w-0 flex-1 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-[13px] font-semibold">Delivery overview</div>
            <div className="text-[10px] text-mkt-muted">3 active builds · 1 launching this week</div>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-mkt-violet px-2.5 py-1 text-[10px] font-medium text-white sm:flex">
            Ship update
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-[1.35fr_1fr]">
          {/* Chart card */}
          <div className="rounded-xl border border-mkt-line p-3">
            <div className="mb-2 flex items-baseline justify-between">
              <div className="text-[10px] font-medium text-mkt-muted">Velocity</div>
              <div className="text-[10px] font-semibold text-[#2bb673]">On track</div>
            </div>
            <div className="flex h-[62px] items-end gap-1.5">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 rounded-sm',
                    i >= BARS.length - 3 ? 'bg-mkt-violet' : 'bg-mkt-lavender-deep'
                  )}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Activity card */}
          <div className="rounded-xl border border-mkt-line p-3">
            <div className="mb-2 text-[10px] font-medium text-mkt-muted">Latest activity</div>
            <div className="space-y-2">
              {ACTIVITY.map((a) => (
                <div key={a.what} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-mkt-violet" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[10px] font-medium">{a.what}</div>
                    <div className="text-[9px] text-mkt-muted">
                      {a.who} · {a.when} ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project rows */}
        <div className="mt-2.5 rounded-xl border border-mkt-line">
          {PROJECTS.map((p, i) => (
            <div
              key={p.name}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5',
                i !== PROJECTS.length - 1 && 'border-b border-mkt-line'
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-medium">{p.name}</div>
                <div className="text-[9px] text-mkt-muted">{p.phase}</div>
              </div>
              <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-mkt-lavender sm:block text-mkt-ink">
                <div className={cn('h-full rounded-full', p.tone)} style={{ width: `${p.progress}%` }} />
              </div>
              <div className="w-8 shrink-0 text-right text-[10px] font-semibold tabular-nums">
                {p.progress}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
