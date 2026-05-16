import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Signs out the current session then sends the user to admin login.
 * Lives under /auth so it is not wrapped by the admin layout (which blocks non-admin users).
 */
export async function GET(req: NextRequest) {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/admin/login', req.url), { status: 302 })
}
