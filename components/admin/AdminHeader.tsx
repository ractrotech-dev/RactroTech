'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, Search, Menu, X, Inbox, FolderKanban, UserCircle, Loader2 } from 'lucide-react';
import type { AdminRole } from '@/utils/admin-roles';
import { getRoleLabel } from '@/utils/admin-roles';
import { searchAdminEntities } from '@/app/admin/actions';
import Link from 'next/link';
import { MarketingThemeToggle } from '@/components/marketing/theme-toggle';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onMobileMenuToggle: () => void;
  adminEmail: string;
  adminRole?: AdminRole;
  /** Real unread count from the layout; null when it could not be read (no badge then). */
  unreadCount?: number | null;
}

type SearchResult = {
  id: string;
  name: string;
  type: 'inquiry' | 'client' | 'project';
};

export default function AdminHeader({ onMobileMenuToggle, adminEmail, adminRole = 'admin', unreadCount = null }: AdminHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // ⌘K shortcut
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
      setResults([]);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Search logic with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchAdminEntities(searchQuery);
        setResults(data as SearchResult[]);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'inquiry': return <Inbox className="h-4 w-4" />;
      case 'client': return <UserCircle className="h-4 w-4" />;
      case 'project': return <FolderKanban className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'inquiry': return `/admin/inquiries/${result.id}`;
      case 'client': return `/admin/clients/${result.id}`;
      case 'project': return `/admin/projects/${result.id}`;
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setResults([]);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-mkt-line bg-mkt-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-3 px-4 md:px-8">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-mkt-line text-mkt-ink transition-colors hover:bg-mkt-ink/[0.04] md:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        {/* Search */}
        <div className="relative min-w-0 max-w-md flex-1">
          {searchOpen ? (
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-mkt-muted" aria-hidden />
              <input
                type="search"
                placeholder="Search inquiries, clients, projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                aria-label="Search"
                className="h-9 w-full rounded-lg border border-mkt-violet/50 bg-mkt-surface pl-9 pr-9 text-[14px] text-mkt-ink outline-none ring-2 ring-mkt-violet/15 placeholder:text-mkt-muted/80"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin text-mkt-muted" aria-hidden /> : null}
                <button type="button" onClick={closeSearch} aria-label="Close search" className="rounded p-0.5 text-mkt-muted hover:text-mkt-ink">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {results.length > 0 || (searchQuery.length >= 2 && !isSearching) ? (
                <div className="absolute left-0 top-full mt-2 max-h-[320px] w-full overflow-y-auto rounded-xl border border-mkt-line bg-mkt-surface p-1.5 shadow-[0_16px_40px_-16px_rgba(11,11,16,0.35)]">
                  {results.length > 0 ? (
                    <ul>
                      {results.map((result) => (
                        <li key={`${result.type}-${result.id}`}>
                          <Link
                            href={getUrl(result) ?? '/admin'}
                            onClick={closeSearch}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-mkt-ink/[0.04]"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-mkt-ink/[0.05] text-mkt-muted">
                              {getIcon(result.type)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[14px] font-medium text-mkt-ink">{result.name}</span>
                              <span className="block text-[12px] capitalize text-mkt-muted">{result.type}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-3 py-4 text-center text-[13px] text-mkt-muted">No results for “{searchQuery}”</p>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-mkt-line bg-mkt-ink/[0.02] px-3 text-[14px] text-mkt-muted transition-colors hover:border-mkt-ink/20 hover:text-mkt-ink"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span>Search</span>
              <kbd className="ml-auto hidden rounded border border-mkt-line px-1.5 text-[11px] font-medium sm:inline">⌘K</kbd>
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <MarketingThemeToggle variant="inline" className="h-9 w-9 rounded-lg text-mkt-muted hover:bg-mkt-ink/[0.04] hover:text-mkt-ink" />

          <Link
            href="/admin/notifications"
            aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-mkt-muted transition-colors hover:bg-mkt-ink/[0.04] hover:text-mkt-ink"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount ? (
              <span className="absolute right-0.5 top-0.5 min-w-[18px] rounded-full bg-mkt-violet px-1 text-center text-[11px] font-semibold leading-[18px] tabular-nums text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : null}
          </Link>

          <div className="ml-1 hidden items-center gap-2.5 border-l border-mkt-line pl-3 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mkt-lavender text-[13px] font-semibold uppercase text-mkt-violet">
              {adminEmail.charAt(0)}
            </span>
            <div className="hidden leading-tight lg:block">
              <p className={cn('max-w-[160px] truncate text-[13px] font-medium text-mkt-ink')}>{adminEmail.split('@')[0]}</p>
              <p className="text-[12px] text-mkt-muted">{getRoleLabel(adminRole)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
