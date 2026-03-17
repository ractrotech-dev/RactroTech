import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function Dashboard() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <main className="flex-1">
            <DashboardShell userEmail={data.user.email ?? ''} />
        </main>
    )
}