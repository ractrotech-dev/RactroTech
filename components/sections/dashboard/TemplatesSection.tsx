export function TemplatesSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Library
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Templates
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse and manage reusable templates for your projects.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
        Connect this section to your actual templates data. For now, this is a
        placeholder layout with room for a list, filters, and actions.
      </div>
    </div>
  )
}

