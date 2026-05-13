'use server'

import { createClient } from '@/utils/supabase/server'
import { ensureAuthUserInDb } from '@/utils/auth-user-sync'
import { redirect } from 'next/navigation'

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.ractrotech.com'

export async function loginAdminUser(
  currentState: { message: string } | undefined,
  formData: FormData,
) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    return { message: error.message }
  }

  if (signInData?.user) {
    // Ensures your row exists in users_table so RBAC can work in `getAdminUser()`.
    await ensureAuthUserInDb(signInData.user)
  }

  redirect('/admin')
}

export async function signInWithGoogleAdmin() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback?next=/admin`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.url) redirect(data.url)
}

export async function signInWithGithubAdmin() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback?next=/admin`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.url) redirect(data.url)
}

export async function signInWithFacebookAdmin() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback?next=/admin`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.url) redirect(data.url)
}

