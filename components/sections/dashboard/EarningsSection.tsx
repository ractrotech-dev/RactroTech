export function EarningsSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Revenue
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Earnings
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your earnings, payouts, and performance over time.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
        This is a placeholder for charts, recent payouts, and key metrics. Hook
        it up to your analytics or payments data.
      </div>
    </div>
  )
}

