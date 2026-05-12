'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AdminRole } from '@/utils/admin-roles';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminShellProps {
  children: React.ReactNode;
  adminEmail: string;
  adminRole?: AdminRole;
}

export default function AdminShell({ children, adminEmail, adminRole = 'admin' }: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsMdUp(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-amber-50/40">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          adminEmail={adminEmail}
          adminRole={adminRole}
        />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 md:hidden"
            >
              <AdminSidebar
                collapsed={false}
                onToggle={() => setMobileMenuOpen(false)}
                adminEmail={adminEmail}
                adminRole={adminRole}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
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
  );
}
