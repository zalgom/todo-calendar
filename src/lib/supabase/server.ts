/**
 * 서버 환경에서 사용하는 Supabase 클라이언트
 * Server Components, Server Actions, Route Handlers에서 사용
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 서버용 Supabase 클라이언트를 생성하여 반환합니다.
 * 쿠키 기반 세션 관리를 지원합니다.
 */
export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 쿠키 읽기
        getAll() {
          return cookieStore.getAll()
        },
        // 쿠키 설정 (Server Components에서는 실제 설정 불가 - 경고 무시)
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서 호출 시 에러 발생 - 미들웨어에서 처리됨
          }
        },
      },
    }
  )
}
