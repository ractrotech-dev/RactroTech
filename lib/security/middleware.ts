import { NextResponse, type NextRequest } from 'next/server';
import { checkEdgeRateLimit, getRequestIp } from '@/lib/security/edge-rate-limit';

const SCRAPE_PREFIXES = ['/components', '/blog', '/api'] as const;

function isScrapeTarget(pathname: string): boolean {
  return SCRAPE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function applySecurityMiddleware(request: NextRequest): NextResponse | null {
  const ip = getRequestIp(request);
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto');
    if (proto === 'http') {
      const dest = request.nextUrl.clone();
      dest.protocol = 'https:';
      return NextResponse.redirect(dest, 308);
    }
  }

  if (pathname.startsWith('/webhook')) {
    if (!checkEdgeRateLimit(`webhook:${ip}`, 40, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  if (isScrapeTarget(pathname) && request.method === 'GET') {
    if (!checkEdgeRateLimit(`scrape:${ip}`, 100, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  const userAgent = request.headers.get('user-agent') ?? '';
  if (
    request.method === 'GET' &&
    isScrapeTarget(pathname) &&
    /curl|wget|python-requests|scrapy|httpclient/i.test(userAgent) &&
    !checkEdgeRateLimit(`bot:${ip}`, 20, 60_000)
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
