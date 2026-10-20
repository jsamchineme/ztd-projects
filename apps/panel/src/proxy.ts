import { NextRequest, NextResponse } from 'next/server';

// Proxy (Next 16, formerly middleware). Expose the current path to server components (for the active sidebar item).
export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('x-pathname', req.nextUrl.pathname);
  // request header so layout/server components can read it
  const headers = new Headers(req.headers);
  headers.set('x-pathname', req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|ztdoffice-logo.svg).*)'] };
