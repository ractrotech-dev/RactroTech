'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  Puzzle,
  Settings,
} from 'lucide-react';

import { NotificationBell } from '@/components/auth/NotificationBell';
import { UserAvatar } from '@/components/auth/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { cn } from '@/lib/utils';

type UserMenuProps = {
  className?: string;
  showNotification?: boolean;
};

export function UserMenu({ className, showNotification = true }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const { profile, displayName, email } = useProfile();

  if (!user) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showNotification ? <NotificationBell /> : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full outline-none ring-offset-background transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            aria-label="Open account menu"
          >
            <UserAvatar user={user} profile={profile} displayName={displayName} email={email} size="md" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="retro-border w-64 border-4 border-black bg-white p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
              <DropdownMenuLabel className="border-b-2 border-black px-4 py-3 font-normal">
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} profile={profile} displayName={displayName} email={email} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black tracking-wide">{displayName || 'Account'}</p>
                    <p className="truncate text-xs font-semibold text-black/60">{email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <div className="p-1">
                <MenuLink href="/account" icon={LayoutDashboard} label="Dashboard" />
                <MenuLink href="/account/components" icon={Puzzle} label="My Components" />
                <MenuLink href="/account/favorites" icon={Heart} label="Favorites" />
                <MenuLink href="/account/settings" icon={Settings} label="Settings" />
                <MenuLink href="/account/billing" icon={CreditCard} label="Billing" />
                <DropdownMenuSeparator className="bg-black/10" />
                <MenuLink href="/account/purchases" icon={Package} label="Purchases" />
              </div>

              <DropdownMenuSeparator className="bg-black/10" />
              <div className="p-1">
                <DropdownMenuItem
                  className="cursor-pointer font-bold focus:bg-black focus:text-yellow-400"
                  onSelect={(e) => {
                    e.preventDefault();
                    void signOut();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </div>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <DropdownMenuItem asChild className="cursor-pointer font-bold focus:bg-yellow-100">
      <Link href={href} className="flex w-full items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </DropdownMenuItem>
  );
}
