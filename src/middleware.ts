// /middleware.ts (루트 디렉토리에 생성)
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  // 로그인 여부에 따른 리다이렉션 처리

  // 1. 인증이 필요한 페이지 정의 (대시보드 등)
  const isAuthRoute = nextUrl.pathname.startsWith('/dashboard');

  // 2. 로그인하지 않은 상태에서 인증 필요 페이지 접근 시
  if (isAuthRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. 이미 로그인한 상태에서 로그인/가입 페이지 접근 시
  const isLoginPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  return NextResponse.next();
});

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
