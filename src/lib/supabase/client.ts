/**
 * 브라우저 환경에서 사용하는 Supabase 클라이언트
 * 클라이언트 컴포넌트('use client')에서만 사용
 */
import { createBrowserClient } from '@supabase/ssr'

/**
 * 브라우저용 Supabase 클라이언트를 생성하여 반환합니다.
 * 컴포넌트 내에서 매번 호출하거나, 싱글턴으로 관리해도 무방합니다.
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
