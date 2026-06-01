/**
 * Next.js 16 Proxy (구 Middleware)
 * - Supabase 세션 자동 갱신
 * - 인증 상태에 따른 라우팅 보호
 * 참고: Next.js 16부터 middleware.ts는 proxy.ts로, 함수명은 proxy로 변경됨
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Supabase 클라이언트 생성 (미들웨어용)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 요청 쿠키 업데이트
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          // 응답 쿠키 업데이트
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신 (IMPORTANT: getUser() 호출 필수 - 세션 토큰을 자동으로 갱신함)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 인증이 필요한 경로에서 비인증 사용자를 /login으로 리다이렉트
  const isAuthRoute = pathname === '/login' || pathname === '/signup'
  const isProtectedRoute = pathname === '/' || pathname.startsWith('/(main)')

  if (!user && isProtectedRoute) {
    // 비인증 상태에서 보호된 경로 접근 시 로그인 페이지로 이동
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // 인증 상태에서 로그인/회원가입 페이지 접근 시 메인으로 이동
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 요청에 미들웨어 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     * - 이미지 파일 확장자
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
