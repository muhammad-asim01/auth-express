import { NextRequest, NextResponse } from 'next/server'

// Paths you want to exclude from the middleware (login and sign-in)
const excludedPaths = ['/sign-in', '/sign-up']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const pathname = request.nextUrl.pathname

  console.log('[Middleware] pathname:', pathname)
  console.log('[Middleware] accessToken:', token)

   if (pathname.endsWith('.css') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // Check if the current path is excluded (login or sign-in)
  if (excludedPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // If protected route and no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Apply middleware to all routes, except the ones in excludedPaths
export const config = {
  matcher: ['/((?!sign-in|login).*)'], // Apply to all except /sign-in and /login
}



