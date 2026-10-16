'use client'

import { useState } from 'react'
import type { AdminRole } from '@/utils/admin-roles'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface AdminShellProps {
  children: React.ReactNode
  adminEmail: string
  adminRole?: AdminRole
  /** Real count from the notifications table; null when it could not be read. */
  unreadCount?: number | null
}

/**
 * Sidebar, header, and a centred content column on a faintly tinted page, so white cards
 * read as surfaces without needing shadows. Built on the marketing tokens, so it follows
 * the site's light and dark themes.
 */
export default function AdminShell({ children, adminEmail, adminRole = 'admin', unreadCount = null }: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-mkt-surface text-mkt-ink">
      <div className="hidden md:block">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          adminEmail={adminEmail}
          adminRole={adminRole}
          unreadCount={unreadCount}
        />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[272px] border-mkt-line bg-mkt-surface p-0 md:hidden">
          <AdminSidebar
            collapsed={false}
            onToggle={() => setMobileMenuOpen(false)}
            onNavigate={() => setMobileMenuOpen(false)}
            adminEmail={adminEmail}
            adminRole={adminRole}
            unreadCount={unreadCount}
            embedded
          />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          'flex min-h-screen flex-col bg-mkt-ink/[0.02] transition-[margin] duration-200 ease-out',
          sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[248px]'
        )}
      >
        <AdminHeader
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          adminEmail={adminEmail}
          adminRole={adminRole}
          unreadCount={unreadCount}
        />
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
