'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Inbox,
  FolderKanban,
  FileText,
  BarChart3,
  UsersRound,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bell,
  UserCircle,
  FolderOpen,
  Shield,
  MessageSquare,
} from 'lucide-react';
import type { AdminRole } from '@/utils/admin-roles';
import { getRoleLabel, getRoleBadgeClasses } from '@/utils/admin-roles';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: string;
  requiredRole?: AdminRole;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        label: 'Inquiries',
        href: '/admin/inquiries',
        icon: Inbox,
      },
      {
        label: 'Clients',
        href: '/admin/clients',
        icon: UserCircle,
      },
      {
        label: 'Projects',
        href: '/admin/projects',
        icon: FolderKanban,
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        label: 'Users',
        href: '/admin/users',
        icon: Users,
      },
      {
        label: 'Team',
        href: '/admin/team',
        icon: UsersRound,
        badge: 'Soon',
      },
      {
        label: 'Content',
        href: '/admin/content',
        icon: FileText,
      },
      {
        label: 'Media',
        href: '/admin/media',
        icon: FolderOpen,
      },
      {
        label: 'Reviews',
        href: '/admin/reviews',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Insights',
    items: [
      {
        label: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  adminEmail: string;
  adminRole?: AdminRole;
}

export default function AdminSidebar({ collapsed, onToggle, adminEmail, adminRole = 'admin' }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r-4 border-black bg-black text-white"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b-4 border-yellow-400/30 px-4">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-xl font-black uppercase tracking-widest text-yellow-400">
                  RT
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Admin
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <Link href="/admin" className="mx-auto">
            <span className="text-xl font-black text-yellow-400">RT</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-3">
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-1.5 px-3 text-[8px] font-black uppercase tracking-[0.3em] text-white/20"
                >
                  {group.title}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.badge ? '#' : item.href}
                      className={`group relative flex items-center gap-3 rounded px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                        active
                          ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(250,204,21,0.4)]'
                          : item.badge
                            ? 'cursor-not-allowed text-white/20'
                            : 'text-white/60 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={item.badge ? (e) => e.preventDefault() : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon size={16} className="shrink-0" />
                      <AnimatePresence mode="wait">
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {item.badge && !collapsed && (
                        <span className="ml-auto rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white/30">
                          {item.badge}
                        </span>
                      )}
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute -left-2 top-1/2 h-5 w-1 -translate-y-1/2 bg-yellow-400"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t-4 border-yellow-400/20 px-2 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40 transition-colors hover:text-white"
        >
          <ExternalLink size={14} className="shrink-0" />
          {!collapsed && <span>Back to App</span>}
        </Link>

        {!collapsed && (
          <div className="mt-2 flex items-center gap-2 px-3">
            <div className="flex h-6 w-6 items-center justify-center bg-yellow-400 text-[10px] font-black text-black">
              <Shield size={10} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold text-white/50">
                {adminEmail.split('@')[0]}
              </p>
              <span
                className={`inline-block border px-1 py-0.5 text-[7px] font-black uppercase tracking-wider ${getRoleBadgeClasses(adminRole)}`}
              >
                {getRoleLabel(adminRole)}
              </span>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 transition-all hover:bg-white/10 hover:text-white"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
