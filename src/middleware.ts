import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    if(process.env.NODE_ENV === "development") {
        return NextResponse.next()
    }
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  const targetDomain = 'www.uproll.org'

  // If the hostname is not the target domain, redirect to the target domain
  if (hostname !== targetDomain) {
    // Create the new URL with the target domain
    const newUrl = new URL(url.pathname + url.search, `https://${targetDomain}`)
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

// Configure the middleware to run on all paths except for specific ones
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 