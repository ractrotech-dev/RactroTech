import { Bell, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/utils/supabase/server'
import { getStripePlan } from '@/utils/stripe/api'
import { DashboardHeaderGreeting } from '@/components/DashboardHeaderGreeting'
import { DashboardHeaderProfileMenu } from '@/components/DashboardHeaderProfileMenu'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import type { User } from '@supabase/supabase-js'

function getDashboardDisplayName(user: User): string {
  const raw = user.user_metadata?.full_name
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  return user.email ?? 'there'
}

function getAvatarUrl(user: User): string | null {
  const raw = user.user_metadata?.avatar_url
  if (typeof raw !== 'string' || !raw.trim()) return null
  try {
    const u = new URL(raw.trim())
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
    return raw.trim()
  } catch {
    return null
  }
}

async function StripePlanBadge({ email }: { email: string }) {
  const stripePlan = await getStripePlan(email)
  return (
    <Badge variant="outline" className="mr-2 shrink-0">
      {stripePlan}
    </Badge>
  )
}

export default async function DashboardHeader() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  const displayName = getDashboardDisplayName(user)
  const avatarUrl = getAvatarUrl(user)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-14 max-w-screen-2xl flex-col gap-2 py-2 sm:flex-row sm:items-center sm:gap-3 sm:py-0 md:h-14 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 md:mr-4 md:flex-none lg:flex-1">
          <div className="mr-2 hidden shrink-0 items-center space-x-2 md:flex">
            <Link className="flex items-center space-x-2" href="/dashboard">
              <Image src="/logo.png" alt="RactroTech" width={25} height={25} />
            </Link>
            <Suspense
              fallback={
                <Badge variant="outline" className="mr-2 shrink-0">
                  <Skeleton className="h-5 w-14 rounded-full" />
                </Badge>
              }
            >
              <StripePlanBadge email={user.email} />
            </Suspense>
            <nav className="hidden items-center space-x-6 text-sm font-medium lg:flex">
              <Link
                className="text-foreground transition-colors hover:text-foreground/80"
                href="/dashboard"
              >
                Home
              </Link>
              <Link
                className="text-foreground/60 transition-colors hover:text-foreground/80"
                href="/dashboard"
              >
                Projects
              </Link>
              <Link
                className="text-foreground/60 transition-colors hover:text-foreground/80"
                href="/dashboard"
              >
                Tasks
              </Link>
              <Link
                className="text-foreground/60 transition-colors hover:text-foreground/80"
                href="/dashboard"
              >
                Reports
              </Link>
            </nav>
          </div>

          <Button variant="outline" size="icon" className="shrink-0 md:hidden" type="button">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          <DashboardHeaderGreeting
            displayName={displayName}
            className="flex-1 sm:text-left lg:ml-0 lg:max-w-md lg:flex-none xl:max-w-lg"
          />
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
          <form className="min-w-0 w-full sm:max-w-xs md:max-w-[200px] lg:max-w-[300px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search…"
                className="h-9 w-full pl-8"
                aria-label="Search"
              />
            </div>
          </form>
          <div className="flex shrink-0 items-center justify-end gap-2 sm:justify-start">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="shrink-0" type="button">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DashboardHeaderProfileMenu
              avatarUrl={avatarUrl}
              displayName={displayName}
              email={user.email}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
