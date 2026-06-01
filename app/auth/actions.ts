"use server"

import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'
import { getClientIp } from '@/lib/auth/client-ip'
import { AUTH_ERRORS } from '@/lib/auth/constants'
import { validatePassword } from '@/lib/auth/password'
import {
  checkForgotPasswordRateLimit,
  checkLoginRateLimit,
  checkSignupRateLimit,
} from '@/lib/security/rate-limit'
import { logSecurityEvent } from '@/lib/security/logger'
import { parseFormData } from '@/lib/validation/parse-form'
import { loginSchema, signupSchema } from '@/lib/validation/schemas'
import { sanitizePlainText } from '@/lib/validation/sanitize'
import { isEmailVerified } from '@/lib/auth/verification'

import { getSiteUrl } from "@/lib/seo";

const PUBLIC_URL = getSiteUrl();

type AuthFormState = { message: string }

export async function resetPassword(_currentState: AuthFormState, formData: FormData) {
  const supabase = createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (password !== confirmPassword) {
    return { message: "Passwords do not match." }
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    return { message: passwordError }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      message: 'Your reset link has expired or is invalid. Please request a new password reset.',
    }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return { message: AUTH_ERRORS.genericFailure }
  }

  await supabase.auth.signOut()
  redirect('/forgot-password/reset/success')
}

export async function forgotPassword(_currentState: AuthFormState, formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email) {
    return { message: 'Email is required.' }
  }

  const ip = getClientIp()
  if (!checkForgotPasswordRateLimit(ip, email)) {
    return { message: AUTH_ERRORS.rateLimited }
  }

  const supabase = createClient()
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${PUBLIC_URL}/forgot-password/confirm`,
  })

  // Always show success to avoid account enumeration.
  redirect('/forgot-password/success')
}

export async function signup(_currentState: AuthFormState, formData: FormData) {
  const ip = getClientIp()
  if (!checkSignupRateLimit(ip)) {
    logSecurityEvent({ type: 'rate_limit', ip, path: 'signup', action: 'signup' })
    return { message: AUTH_ERRORS.rateLimited }
  }

  const parsed = parseFormData(signupSchema, formData)
  if (!parsed.ok) {
    return { message: parsed.message }
  }

  const data = {
    email: parsed.data.email,
    password: parsed.data.password,
    name: sanitizePlainText(parsed.data.name, 120),
    phone: parsed.data.phone,
    address: sanitizePlainText(parsed.data.address, 300),
  }

  const passwordError = validatePassword(data.password)
  if (passwordError) {
    return { message: passwordError }
  }

  const supabase = createClient()

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${PUBLIC_URL}/auth/callback`,
      data: {
        full_name: data.name,
        phone: data.phone,
        address: data.address,
      },
    },
  })

  if (signUpError) {
    logSecurityEvent({
      type: 'auth_attempt',
      success: false,
      ip,
      action: 'signup',
      email: data.email,
      reason: 'signup_failed',
    })
    if (signUpError.message.includes('already registered')) {
      return { message: 'An account with this email already exists. Try signing in or resetting your password.' }
    }
    return { message: AUTH_ERRORS.genericFailure }
  }

  logSecurityEvent({ type: 'auth_attempt', success: true, ip, action: 'signup', email: data.email })

  if (!signUpData?.user) {
    return { message: AUTH_ERRORS.genericFailure }
  }

  // No session until email is confirmed — sign out any partial session and prompt verification.
  if (!signUpData.session) {
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect(`/signup/verify-email?email=${encodeURIComponent(data.email)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function loginUser(_currentState: AuthFormState, formData: FormData) {
  const ip = getClientIp()
  const parsed = parseFormData(loginSchema, formData)
  if (!parsed.ok) {
    return { message: parsed.message }
  }

  const { email, password } = parsed.data

  if (!checkLoginRateLimit(ip, email)) {
    logSecurityEvent({ type: 'rate_limit', ip, path: 'login', action: 'login' })
    return { message: AUTH_ERRORS.rateLimited }
  }

  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    logSecurityEvent({
      type: 'auth_attempt',
      success: false,
      ip,
      action: 'login',
      email,
      reason: 'invalid_credentials',
    })
    return { message: AUTH_ERRORS.invalidCredentials }
  }

  if (data.user && !isEmailVerified(data.user)) {
    await supabase.auth.signOut()
    logSecurityEvent({
      type: 'auth_attempt',
      success: false,
      ip,
      action: 'login',
      email,
      reason: 'email_not_verified',
    })
    return { message: AUTH_ERRORS.emailNotVerified }
  }

  logSecurityEvent({ type: 'auth_attempt', success: true, ip, action: 'login', email })
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/signup')
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithGithub() {
  const supabase = createClient()
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithFacebook() {
  const supabase = createClient()
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function resendVerificationEmail(_currentState: AuthFormState, formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email) {
    return { message: 'Email is required.' }
  }

  const ip = getClientIp()
  if (!checkForgotPasswordRateLimit(ip, email)) {
    return { message: AUTH_ERRORS.rateLimited }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${PUBLIC_URL}/auth/callback`,
    },
  })

  if (error) {
    return { message: AUTH_ERRORS.genericFailure }
  }

  return { message: 'Verification email sent. Check your inbox.' }
}
