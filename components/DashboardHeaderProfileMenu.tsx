'use client'

import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'

import { logout } from '@/app/auth/actions'
import { UserAvatar } from '@/components/auth/UserAvatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type DashboardHeaderProfileMenuProps = {
  avatarUrl: string | null
  displayName: string
  email: string
  className?: string
}

export function DashboardHeaderProfileMenu({
  avatarUrl,
  displayName,
  email,
  className,
}: DashboardHeaderProfileMenuProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="relative h-9 w-9 shrink-0 rounded-full p-0 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open account menu"
          >
            <UserAvatar
              displayName={displayName}
              email={email}
              avatarUrlOverride={avatarUrl}
              size="md"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="flex cursor-pointer items-center gap-2">
              <User className="h-4 w-4" />
              View Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="flex cursor-pointer items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="p-0 focus:bg-transparent"
            onSelect={(e) => e.preventDefault()}
          >
            <form action={logout} className="w-full">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
