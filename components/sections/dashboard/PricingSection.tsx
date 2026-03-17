export function PricingSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Billing
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Pricing & plans
        </h1>
        <p className="text-sm text-muted-foreground">
          Review your current plan and available upgrades.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Current plan
          </p>
          <p className="mt-2 text-base font-semibold text-foreground">
            Starter
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ideal while you are exploring and building.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Use this space to integrate your real pricing tiers and Stripe
          checkout links.
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Show usage limits, upcoming invoices, or discounts here.
        </div>
      </div>
    </div>
  )
}

