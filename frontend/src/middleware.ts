// import { NextRequest, NextResponse } from 'next/server'

// // ✅ Define which routes are public
// const publicPaths = ['/sign-in', '/sign-up', '/', '/forgot-password']

// export default function middleware(request: NextRequest) {
//   const token = request.cookies.get('refreshToken')?.value
//   const pathname = request.nextUrl.pathname

//   // ✅ Skip static and internal assets
//   if (
//     pathname.startsWith('/_next') ||
//     pathname.endsWith('.css') ||
//     pathname.endsWith('.js') ||
//     pathname.endsWith('.png') ||
//     pathname.endsWith('.ico') ||
//     pathname.endsWith('.svg') ||
//     pathname.startsWith('/api')
//   ) {
//     return NextResponse.next()
//   }

//   const isPublic = publicPaths.includes(pathname)
//   const isLoggedIn = Boolean(token)

//   // ✅ If logged in and trying to access public route (e.g., sign-in), redirect to home
//   if (isLoggedIn && isPublic && pathname !== '/') {
//     return NextResponse.redirect(new URL('/', request.url))
//   }

//   // ✅ If not logged in and accessing a protected route (not in publicPaths)
//   if (!isLoggedIn && !isPublic) {
//     return NextResponse.redirect(new URL('/sign-in', request.url))
//   }

//   return NextResponse.next()
// }

// // ✅ Middleware config to apply it only to relevant routes
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }

export default function middleware() { }
