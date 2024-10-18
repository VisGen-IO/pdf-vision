import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { cookies } from 'next/headers'

export async function middleware (request: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get('access_token')
  const url = request.nextUrl;

  if(token && ( 
    url.pathname.startsWith('/login') || 
    url.pathname.startsWith('/sign-up') || 
    url.pathname === '/'
    )){
    return NextResponse.redirect(new URL('/dashboard', request.url)) 

  }
  if(
    !token && 
    (url.pathname.startsWith('/dashboard'))
    ){
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/signin','/signup', '/dashboard/:path*','/verify/:path*'],
}