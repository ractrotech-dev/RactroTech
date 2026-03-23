'use client'

import { useState } from 'react'

import { Sidebar } from './Sidebar'
import {
  ComponentsSection,
  TemplatesSection,
  PricingSection,
  EarningsSection,
  CustomerSupportSection,
} from '@/components/sections/dashboard'

type DashboardShellProps = {
  userEmail: string
}

type TabKey = 'components' | 'templates' | 'pricing' | 'earnings' | 'support'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'components', label: 'Components' },
  { key: 'templates', label: 'Templates' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'support', label: 'Customer Support' },
]

export function DashboardShell({ userEmail }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('components')

  const renderContent = () => {
    switch (activeTab) {
      case 'components':
        return <ComponentsSection userEmail={userEmail} />
      case 'templates':
        return <TemplatesSection />
      case 'pricing':
        return <PricingSection />
      case 'earnings':
        return <EarningsSection />
      case 'support':
        return <CustomerSupportSection />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <Sidebar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <section className="flex-1 border-l border-border bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
          {renderContent()}
        </div>
      </section>
    </div>
  )
}

