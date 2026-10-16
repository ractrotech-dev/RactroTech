import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { secureCookieOptions } from '@/lib/auth/cookies'
import { isEmailVerified } from '@/lib/auth/verification'

function isProtectedPath(pathname: string): boolean {
    return (
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/account')
    )
}

/** Learn DSA pages that only make sense signed in; the lessons themselves stay public. */
function isDsaAccountPath(pathname: string): boolean {
    return pathname.startsWith('/dsa/profile') || pathname.startsWith('/dsa/welcome')
}

function requiresMiddlewareAuth(pathname: string): boolean {
    if (pathname === '/admin/login') return false
    return pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || isDsaAccountPath(pathname)
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    if (!supabaseUrl || !anonKey) {
        return supabaseResponse
    }

    const supabase = createServerClient(
        supabaseUrl,
        anonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, secureCookieOptions(options))
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()

    if (request.nextUrl.pathname.startsWith('/webhook')) {
        return supabaseResponse
    }

    if (user && request.nextUrl.pathname === '/admin/login') {
        const dest = new URL('/admin', request.url)
        const redirectResponse = NextResponse.redirect(dest)
        supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
            redirectResponse.cookies.set(name, value)
        })
        return redirectResponse
    }

    if (user && !isEmailVerified(user) && isProtectedPath(request.nextUrl.pathname)) {
        url.pathname = '/signup/verify-email'
        url.searchParams.set('email', user.email ?? '')
        const redirectResponse = NextResponse.redirect(url)
        supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
            redirectResponse.cookies.set(name, value)
        })
        return redirectResponse
    }

    if (!user && requiresMiddlewareAuth(request.nextUrl.pathname)) {
        url.pathname = request.nextUrl.pathname.startsWith('/admin') ? '/admin/login' : '/login'
        if (isDsaAccountPath(request.nextUrl.pathname)) {
            // Back to the course after signing in, not the site home page.
            url.search = ''
            url.searchParams.set('next', request.nextUrl.pathname)
        }
        const redirectResponse = NextResponse.redirect(url)
        supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
            redirectResponse.cookies.set(name, value)
        })
        return redirectResponse
    }

    return supabaseResponse
}
