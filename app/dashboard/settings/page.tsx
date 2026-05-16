import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardSettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect('/signup')
  }

  return (
    <main className="flex-1 bg-background px-6 py-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <Button variant="ghost" asChild className="mb-4 -ml-2">
            <Link href="/dashboard">← Back to dashboard</Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Account preferences. More options can be added here later.
          </p>
        </div>
      </div>
    </main>
  )
}
