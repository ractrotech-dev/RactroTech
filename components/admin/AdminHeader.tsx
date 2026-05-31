'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, Search, Menu, X, User, Inbox, FolderKanban, UserCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AdminRole } from '@/utils/admin-roles';
import { getRoleLabel } from '@/utils/admin-roles';
import { searchAdminEntities } from '@/app/admin/actions';
import Link from 'next/link';

interface AdminHeaderProps {
  onMobileMenuToggle: () => void;
  adminEmail: string;
  adminRole?: AdminRole;
}

type SearchResult = {
  id: string;
  name: string;
  type: 'inquiry' | 'client' | 'project';
};

export default function AdminHeader({ onMobileMenuToggle, adminEmail, adminRole = 'admin' }: AdminHeaderProps) {
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
      case 'inquiry': return <Inbox size={12} />;
      case 'client': return <UserCircle size={12} />;
      case 'project': return <FolderKanban size={12} />;
      default: return <Search size={12} />;
    }
  };

  const getUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'inquiry': return `/admin/inquiries/${result.id}`;
      case 'client': return `/admin/clients/${result.id}`;
      case 'project': return `/admin/projects/${result.id}`;
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b-4 border-black bg-white">
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center border-2 border-black transition-colors hover:bg-black hover:text-white md:hidden"
        >
          <Menu size={18} />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 40, opacity: 0.5 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: 40, opacity: 0.5 }}
                className="relative flex items-center"
              >
                <Search size={16} className="absolute left-3 text-black/40" />
                <input
                  type="text"
                  placeholder="Search inquiries, clients, projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="h-9 w-full border-2 border-black bg-gray-50 pl-9 pr-8 text-xs font-bold tracking-wider placeholder:font-bold placeholder:normal-case placeholder:tracking-normal placeholder:text-black/30 focus:bg-white focus:outline-none"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {isSearching && <Loader2 size={14} className="animate-spin text-yellow-500" />}
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      setResults([]);
                    }}
                    className="text-black/40 hover:text-black"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {(results.length > 0 || (searchQuery.length >= 2 && !isSearching)) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 top-full mt-2 w-full border-4 border-black bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-[300px] overflow-y-auto"
                    >
                      {results.length > 0 ? (
                        <div className="space-y-1">
                          {results.map((result) => (
                            <Link
                              key={`${result.type}-${result.id}`}
                              href={getUrl(result)}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery('');
                                setResults([]);
                              }}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-yellow-50 border-2 border-transparent hover:border-black transition-all group"
                            >
                              <div className="flex h-6 w-6 items-center justify-center border-2 border-black bg-yellow-400 group-hover:bg-black group-hover:text-white transition-colors">
                                {getIcon(result.type)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[11px] font-black tracking-wider">{result.name}</p>
                                <p className="text-[8px] font-bold tracking-[0.2em] text-black/40">{result.type}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="px-3 py-4 text-center">
                          <p className="text-[10px] font-black tracking-wider text-black/30">No results found for &quot;{searchQuery}&quot;</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-9 items-center gap-2 border-2 border-black/20 bg-gray-50 px-3 text-xs font-bold text-black/40 transition-colors hover:border-black hover:text-black"
              >
                <Search size={14} />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="ml-2 hidden rounded border border-black/20 px-1.5 py-0.5 text-[9px] font-bold sm:inline">
                  ⌘K
                </kbd>
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="group relative flex h-9 w-9 items-center justify-center border-2 border-black/20 transition-all hover:-translate-y-0.5 hover:border-black hover:bg-yellow-400">
            <Bell size={16} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center border border-black bg-red-500 text-[9px] font-black text-white">
              3
            </span>
          </button>

          {/* Admin profile pill */}
          <div className="hidden items-center gap-2 border-2 border-black bg-black px-3 py-1.5 sm:flex">
            <div className="flex h-6 w-6 items-center justify-center bg-yellow-400 text-[10px] font-black text-black">
              <User size={12} />
            </div>
            <div className="flex flex-col">
              <span className="max-w-[120px] truncate text-[10px] font-bold tracking-wider text-white">
                {adminEmail.split('@')[0]}
              </span>
              <span className="text-[7px] font-black tracking-wider text-yellow-400/80">
                {getRoleLabel(adminRole)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
