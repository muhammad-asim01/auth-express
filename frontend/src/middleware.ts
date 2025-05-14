import { NextRequest, NextResponse } from 'next/server'

// Define which routes are public (accessible without login)
const publicPaths = ['/sign-in', '/sign-up']

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken')?.value
  const pathname = request.nextUrl.pathname

  // Skip static and internal assets
  if (
    pathname.startsWith('/_next') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.svg') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  const isPublic = publicPaths.includes(pathname)
  const isLoggedIn = Boolean(token)

  // If logged in and trying to access public route (like sign-in), redirect to homepage
  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If not logged in and trying to access a protected route (including home page)
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}