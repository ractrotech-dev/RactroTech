export function CustomerSupportSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Support
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Customer support
        </h1>
        <p className="text-sm text-muted-foreground">
          Centralize conversations, tickets, and help resources for your users.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
        Add your own inbox view, ticket list, or links to external tools (like
        email, chat, or help center) here.
      </div>
    </div>
  )
}

