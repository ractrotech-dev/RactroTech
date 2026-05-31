'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { AdminRole } from '@/utils/admin-roles'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useIsMdUp } from '@/hooks/use-media-query'

interface AdminShellProps {
  children: React.ReactNode
  adminEmail: string
  adminRole?: AdminRole
}

export default function AdminShell({
  children,
  adminEmail,
  adminRole = 'admin',
}: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMdUp = useIsMdUp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-amber-50/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="hidden md:block">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          adminEmail={adminEmail}
          adminRole={adminRole}
        />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0 md:hidden">
          <AdminSidebar
            collapsed={false}
            onToggle={() => setMobileMenuOpen(false)}
            adminEmail={adminEmail}
            adminRole={adminRole}
          />
        </SheetContent>
      </Sheet>

      <motion.div
        initial={false}
        animate={{
          marginLeft: isMdUp ? (sidebarCollapsed ? 72 : 260) : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex min-h-screen flex-col"
      >
        <AdminHeader
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          adminEmail={adminEmail}
          adminRole={adminRole}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </motion.div>
    </div>
  )
}
