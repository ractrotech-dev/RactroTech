import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardProfilePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect('/signup')
  }

  const fullName =
    typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : ''

  return (
    <main className="flex-1 bg-background px-6 py-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <Button variant="ghost" asChild className="mb-4 -ml-2">
            <Link href="/dashboard">← Back to dashboard</Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your account details from Supabase auth.</p>
        </div>
        <dl className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm">
          <div>
            <dt className="font-medium text-muted-foreground">Display name</dt>
            <dd className="mt-1 text-foreground">{fullName || '—'}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Email</dt>
            <dd className="mt-1 text-foreground">{user.email}</dd>
          </div>
        </dl>
      </div>
    </main>
  )
}
