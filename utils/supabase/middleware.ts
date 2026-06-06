import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
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

    // Already signed in: skip the admin gate screen
    if (user && request.nextUrl.pathname === '/admin/login') {
        const dest = new URL('/admin', request.url)
        const redirectResponse = NextResponse.redirect(dest)
        supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
            redirectResponse.cookies.set(name, value)
        })
        return redirectResponse
    }

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/admin/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/signup') &&
        !request.nextUrl.pathname.startsWith('/forgot-password') &&
        request.nextUrl.pathname !== '/manifest.webmanifest' &&
        request.nextUrl.pathname !== '/robots.txt' &&
        request.nextUrl.pathname !== '/sitemap.xml' &&
        !(request.nextUrl.pathname === '/')
    ) {
        // no user, redirect to login page
        url.pathname = request.nextUrl.pathname.startsWith('/admin') ? '/admin/login' : '/login'
        return NextResponse.redirect(url)
    }
    // If user is logged in, allow them to stay on home; do not auto-redirect
    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}