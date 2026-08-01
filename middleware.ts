import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PROTECTED = ['/dashboard', '/upload', '/incident'];
const AUTH_ONLY = ['/login'];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user: supabaseUser } = await updateSession(request);
  const isDemo = request.cookies.get('gravitas_demo_user')?.value === 'true';
  const hasUser = !!supabaseUser || isDemo;

  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));

  if (isProtected && !hasUser) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnly && hasUser) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
