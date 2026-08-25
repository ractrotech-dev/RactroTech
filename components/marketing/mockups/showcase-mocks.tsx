import { cn } from '@/lib/utils';

/**
 * Full-bleed product mockups for the project showcase marquee.
 *
 * Same rules as mockups/panel-mocks.tsx — divs and design tokens only, no image assets,
 * everything `aria-hidden` because the card text beside them carries the real meaning.
 * These are sized for a ~540px card rather than a bento tile, which is why they live
 * here instead of being squeezed out of the existing panel mocks.
 *
 * Every fill is an `mkt` token, so all four invert correctly in dark mode.
 */

/** Marketing landing page — hero band over a three-up feature row. */
export function LandingMock({ className }: { className?: string }) {
  return (
    <div className={cn('h-full bg-mkt-surface p-4 sm:p-5', className)} aria-hidden>
      <div className="rounded-xl bg-mkt-lavender px-4 py-5 text-center sm:py-6 text-mkt-ink">
        <div className="mx-auto h-2 w-20 rounded-full bg-mkt-violet/40" />
        <div className="mx-auto mt-3 h-3 w-[70%] rounded-full bg-mkt-ink/25" />
        <div className="mx-auto mt-2 h-3 w-[45%] rounded-full bg-mkt-ink/15" />
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-6 w-20 rounded-full bg-mkt-violet" />
          <div className="h-6 w-16 rounded-full bg-mkt-surface ring-1 ring-mkt-line text-mkt-ink" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {['bg-mkt-mint', 'bg-mkt-butter', 'bg-mkt-sky'].map((tone) => (
          <div key={tone} className="rounded-xl border border-mkt-line p-2.5">
            <div className={cn('h-5 w-5 rounded-md', tone)} />
            <div className="mt-2 h-1.5 w-full rounded-full bg-mkt-ink/15" />
            <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-mkt-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Storefront — search + cart bar over a product grid with prices. */
export function StorefrontMock({ className }: { className?: string }) {
  const products = ['bg-mkt-pink', 'bg-mkt-sky', 'bg-mkt-butter', 'bg-mkt-mint', 'bg-mkt-lilac', 'bg-mkt-lavender-deep'];

  return (
    <div className={cn('h-full bg-mkt-surface p-4 sm:p-5', className)} aria-hidden>
      <div className="mb-3 flex items-center gap-2.5">
        <div className="h-6 flex-1 rounded-full bg-mkt-lavender/60 ring-1 ring-mkt-line text-mkt-ink" />
        <div className="relative h-6 w-6 shrink-0 rounded-full bg-mkt-violet">
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-mkt-mint ring-2 ring-mkt-surface" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {products.map((tone, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-mkt-line">
            <div className={cn('h-[46px] sm:h-[58px]', tone)} />
            <div className="p-2">
              <div className="h-1.5 w-full rounded-full bg-mkt-ink/15" />
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="h-1.5 w-8 rounded-full bg-mkt-ink/25" />
                <div className="h-3 w-3 rounded-full bg-mkt-violet/70" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Editorial / CMS — article body beside a sidebar of categories. */
export function EditorialMock({ className }: { className?: string }) {
  return (
    <div className={cn('h-full bg-mkt-surface p-4 sm:p-5', className)} aria-hidden>
      <div className="grid grid-cols-[1.7fr_1fr] gap-4">
        <div>
          <div className="h-1.5 w-14 rounded-full bg-mkt-violet" />
          <div className="mt-2.5 h-3 w-full rounded-full bg-mkt-ink/25" />
          <div className="mt-2 h-3 w-3/4 rounded-full bg-mkt-ink/25" />

          <div className="mt-3 flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-mkt-lavender-deep" />
            <div className="h-1.5 w-16 rounded-full bg-mkt-ink/12" />
            <div className="h-1.5 w-10 rounded-full bg-mkt-ink/10" />
          </div>

          <div className="mt-3.5 h-[52px] rounded-xl bg-mkt-lavender sm:h-[64px] text-mkt-ink" />

          <div className="mt-3 space-y-1.5">
            {['w-full', 'w-full', 'w-[88%]', 'w-[60%]'].map((w, i) => (
              <div key={i} className={cn('h-1.5 rounded-full bg-mkt-ink/10', w)} />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-1.5 w-12 rounded-full bg-mkt-ink/20" />
          {['bg-mkt-mint', 'bg-mkt-butter', 'bg-mkt-pink', 'bg-mkt-sky'].map((tone) => (
            <div
              key={tone}
              className="flex items-center gap-2 rounded-lg border border-mkt-line px-2 py-1.5"
            >
              <span className={cn('h-2 w-2 shrink-0 rounded-full', tone)} />
              <span className="h-1.5 flex-1 rounded-full bg-mkt-ink/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Component library — a tile sheet of primitives, mirroring what /components ships. */
export function ComponentGridMock({ className }: { className?: string }) {
  return (
    <div className={cn('h-full bg-mkt-surface p-4 sm:p-5', className)} aria-hidden>
      <div className="grid grid-cols-3 gap-2.5">
        {/* Buttons */}
        <div className="space-y-1.5 rounded-xl border border-mkt-line p-2.5">
          <div className="h-5 w-full rounded-full bg-mkt-violet" />
          <div className="h-5 w-full rounded-full bg-mkt-surface ring-1 ring-mkt-line text-mkt-ink" />
          <div className="h-5 w-2/3 rounded-full bg-mkt-lavender text-mkt-ink" />
        </div>

        {/* Input + toggle */}
        <div className="space-y-2 rounded-xl border border-mkt-line p-2.5">
          <div className="h-5 w-full rounded-md bg-mkt-lavender/50 ring-1 ring-mkt-line text-mkt-ink" />
          <div className="h-5 w-full rounded-md bg-mkt-surface ring-1 ring-mkt-violet text-mkt-ink" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-3.5 w-6 items-center rounded-full bg-mkt-violet p-0.5">
              <span className="ml-auto h-2.5 w-2.5 rounded-full bg-white" />
            </div>
            <div className="h-1.5 w-6 rounded-full bg-mkt-ink/12" />
          </div>
        </div>

        {/* Avatars + badges */}
        <div className="space-y-2 rounded-xl border border-mkt-line p-2.5">
          <div className="flex -space-x-1.5">
            {['bg-mkt-violet', 'bg-mkt-mint', 'bg-mkt-butter'].map((tone) => (
              <span key={tone} className={cn('h-5 w-5 rounded-full ring-2 ring-mkt-surface', tone)} />
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {['bg-mkt-mint', 'bg-mkt-pink', 'bg-mkt-sky'].map((tone) => (
              <span key={tone} className={cn('h-3 w-8 rounded-full', tone)} />
            ))}
          </div>
          <div className="h-1.5 w-full rounded-full bg-mkt-ink/10" />
        </div>

        {/* Chart tile */}
        <div className="col-span-2 rounded-xl border border-mkt-line p-2.5">
          <div className="mb-2 h-1.5 w-12 rounded-full bg-mkt-ink/15" />
          <div className="flex h-[42px] items-end gap-1 sm:h-[52px]">
            {[42, 65, 51, 78, 60, 88, 72, 95].map((h, i) => (
              <div
                key={i}
                className={cn('flex-1 rounded-sm', i >= 6 ? 'bg-mkt-violet' : 'bg-mkt-lavender-deep')}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Stat tile */}
        <div className="rounded-xl bg-mkt-lavender p-2.5 text-mkt-ink">
          <div className="h-1.5 w-8 rounded-full bg-mkt-ink/20" />
          <div className="mt-2 h-4 w-12 rounded-full bg-mkt-violet" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-mkt-ink/12" />
        </div>
      </div>
    </div>
  );
}
