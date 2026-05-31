'use client'

import {
  ComponentsSection,
  TemplatesSection,
  PricingSection,
  EarningsSection,
  CustomerSupportSection,
} from '@/components/sections/dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

type DashboardShellProps = {
  userEmail: string
}

const TABS = [
  { key: 'components', label: 'Components' },
  { key: 'templates', label: 'Templates' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'support', label: 'Customer Support' },
] as const

export function DashboardShell({ userEmail }: DashboardShellProps) {
  return (
    <Tabs defaultValue="components" className="flex min-h-[calc(100vh-4rem)] bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-muted/40 md:block">
        <ScrollArea className="h-full">
          <TabsList className="flex h-auto w-full flex-col items-stretch gap-1 bg-transparent p-3">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </aside>

      <section className="flex-1 border-l border-border bg-muted/30">
        <div className="border-b border-border p-3 md:hidden">
          <TabsList className="grid w-full grid-cols-2 gap-1">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
          <TabsContent value="components" className="mt-0 focus-visible:outline-none">
            <ComponentsSection userEmail={userEmail} />
          </TabsContent>
          <TabsContent value="templates" className="mt-0 focus-visible:outline-none">
            <TemplatesSection />
          </TabsContent>
          <TabsContent value="pricing" className="mt-0 focus-visible:outline-none">
            <PricingSection />
          </TabsContent>
          <TabsContent value="earnings" className="mt-0 focus-visible:outline-none">
            <EarningsSection />
          </TabsContent>
          <TabsContent value="support" className="mt-0 focus-visible:outline-none">
            <CustomerSupportSection />
          </TabsContent>
        </div>
      </section>
    </Tabs>
  )
}
