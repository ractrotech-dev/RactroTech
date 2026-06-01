import { type NextRequest, NextResponse } from 'next/server'
import { applySecurityMiddleware } from '@/lib/security/middleware'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const securityResponse = applySecurityMiddleware(request)
    if (securityResponse) {
        return securityResponse
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
