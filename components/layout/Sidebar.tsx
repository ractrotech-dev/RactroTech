type TabKey = 'components' | 'templates' | 'pricing' | 'earnings' | 'support'

type SidebarProps = {
  tabs: { key: TabKey; label: string }[]
  activeTab: TabKey
  onTabChange: (key: TabKey) => void
}

export function Sidebar({ tabs, activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-60 border-r border-border bg-muted/40">
      <nav className="flex flex-col gap-1 px-3 py-4 text-sm">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={[
                'flex items-center rounded-md px-3 py-2 text-left transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted',
              ].join(' ')}
            >
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

