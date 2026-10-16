'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  FileText,
  FolderKanban,
  FolderOpen,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UserCircle,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import { BrandLogo } from '@/components/marketing/brand-logo';
import type { AdminRole } from '@/utils/admin-roles';
import { getRoleLabel } from '@/utils/admin-roles';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  /** Not built yet: shown, but not clickable. */
  soon?: boolean;
}

const NAV: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    ],
  },
  {
    title: 'Pipeline',
    items: [
      { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
      { label: 'Clients', href: '/admin/clients', icon: UserCircle },
      { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Team', href: '/admin/team', icon: UsersRound, soon: true },
      { label: 'Content', href: '/admin/content', icon: FileText },
      { label: 'Media', href: '/admin/media', icon: FolderOpen },
      { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    ],
  },
  {
    title: 'Insights',
    items: [{ label: 'Analytics', href: '/admin/analytics', icon: BarChart3 }],
  },
  {
    title: 'System',
    items: [{ label: 'Settings', href: '/admin/settings', icon: Settings }],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  /** Closes the mobile sheet after a link is followed. */
  onNavigate?: () => void;
  adminEmail: string;
  adminRole?: AdminRole;
  unreadCount?: number | null;
  /** Rendered inside the mobile sheet: in the flow, full height, no collapse control. */
  embedded?: boolean;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
  onNavigate,
  adminEmail,
  adminRole = 'admin',
  unreadCount = null,
  embedded = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-mkt-line bg-mkt-surface text-mkt-ink transition-[width] duration-200 ease-out',
        embedded ? 'w-full' : 'fixed left-0 top-0 z-40',
        !embedded && (collapsed ? 'w-[72px]' : 'w-[248px]')
      )}
    >
      <div className={cn('flex h-16 shrink-0 items-center border-b border-mkt-line', collapsed ? 'justify-center px-2' : 'gap-2.5 px-5')}>
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5" aria-label="Admin dashboard">
          {collapsed ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mkt-violet text-[13px] font-semibold text-white">R</span>
          ) : (
            <>
              <BrandLogo className="h-[20px] text-mkt-brand" />
              <span className="rounded-md bg-mkt-ink/[0.06] px-1.5 py-0.5 text-[12px] font-medium text-mkt-muted">Admin</span>
            </>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        {NAV.map((group) => (
          <div key={group.title} className="mb-5 last:mb-0">
            {!collapsed ? (
              <p className="mb-1.5 px-2.5 text-[12px] font-medium text-mkt-muted">{group.title}</p>
            ) : (
              <div className="mx-auto mb-2 h-px w-6 bg-mkt-line" aria-hidden />
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item);
                const count = item.href === '/admin/notifications' && unreadCount ? unreadCount : 0;
                const Icon = item.icon;

                if (item.soon) {
                  return (
                    <li key={item.href}>
                      <span
                        className={cn(
                          'flex cursor-not-allowed items-center gap-3 rounded-lg px-2.5 py-2 text-[14px] font-medium text-mkt-muted/60',
                          collapsed && 'justify-center'
                        )}
                        title={collapsed ? `${item.label} (coming soon)` : undefined}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                        {!collapsed ? (
                          <>
                            <span className="truncate">{item.label}</span>
                            <span className="ml-auto text-[12px] font-normal">Soon</span>
                          </>
                        ) : null}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[14px] font-medium transition-colors duration-150',
                        collapsed && 'justify-center',
                        active ? 'bg-mkt-lavender text-mkt-violet' : 'text-mkt-ink/75 hover:bg-mkt-ink/[0.04] hover:text-mkt-ink'
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                      {!collapsed ? <span className="truncate">{item.label}</span> : null}
                      {count > 0 ? (
                        <span
                          className={cn(
                            'rounded-full bg-mkt-violet px-1.5 text-[11px] font-semibold leading-[18px] tabular-nums text-white',
                            collapsed ? 'absolute right-1.5 top-1' : 'ml-auto'
                          )}
                          aria-label={`${count} unread`}
                        >
                          {count > 99 ? '99+' : count}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-mkt-line p-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          title={collapsed ? 'Back to app' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg px-2.5 py-2 text-[14px] font-medium text-mkt-muted transition-colors hover:bg-mkt-ink/[0.04] hover:text-mkt-ink',
            collapsed && 'justify-center'
          )}
        >
          <ExternalLink className="h-[18px] w-[18px] shrink-0" aria-hidden />
          {!collapsed ? <span>Back to app</span> : null}
        </Link>

        {!collapsed ? (
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mkt-lavender text-[13px] font-semibold uppercase text-mkt-violet">
              {adminEmail.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium">{adminEmail}</p>
              <p className="text-[12px] text-mkt-muted">{getRoleLabel(adminRole)}</p>
            </div>
          </div>
        ) : null}

        {!embedded ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-mkt-muted transition-colors hover:bg-mkt-ink/[0.04] hover:text-mkt-ink',
              collapsed && 'justify-center'
            )}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" aria-hidden /> : <ChevronsLeft className="h-4 w-4" aria-hidden />}
            {!collapsed ? <span>Collapse</span> : null}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
