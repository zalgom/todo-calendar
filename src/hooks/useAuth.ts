/**
 * 인증 관련 커스텀 훅
 * - 로그인, 회원가입, 로그아웃 기능 제공
 * - Supabase Auth 연동
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { LoginInput, SignupInput } from '@/lib/validations/auth.schema'

/**
 * Supabase Auth 에러 코드를 한국어 메시지로 변환합니다.
 */
const getAuthErrorMessage = (error: { message: string }): string => {
  const message = error.message.toLowerCase()

  if (message.includes('invalid login credentials')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다'
  }
  if (message.includes('user already registered')) {
    return '이미 가입된 이메일입니다'
  }
  if (message.includes('email not confirmed')) {
    return '이메일 인증이 필요합니다. 메일함을 확인해주세요'
  }
  if (message.includes('password should be at least')) {
    return '비밀번호는 최소 6자 이상이어야 합니다'
  }
  if (message.includes('rate limit')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요'
  }
  if (message.includes('email rate limit exceeded')) {
    return '이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해주세요'
  }

  return error.message || '오류가 발생했습니다. 다시 시도해주세요'
}

export const useAuth = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 이메일/비밀번호로 로그인합니다.
   */
  const login = async (input: LoginInput): Promise<string | null> => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      })

      if (error) {
        return getAuthErrorMessage(error)
      }

      // 로그인 성공: 메인 페이지로 이동
      router.push('/')
      router.refresh()
      return null
    } catch {
      return '로그인 중 오류가 발생했습니다'
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 이메일/비밀번호로 회원가입합니다.
   */
  const signup = async (input: SignupInput): Promise<string | null> => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      })

      if (error) {
        return getAuthErrorMessage(error)
      }

      // 회원가입 성공 안내
      toast.success('회원가입이 완료되었습니다!', {
        description: '이메일을 확인하여 계정을 인증해주세요.',
      })

      return null
    } catch {
      return '회원가입 중 오류가 발생했습니다'
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 로그아웃합니다.
   */
  const logout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast.error('로그아웃 중 오류가 발생했습니다')
        return
      }

      // 로그인 페이지로 이동
      router.push('/login')
      router.refresh()
    } catch {
      toast.error('로그아웃 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    login,
    signup,
    logout,
  }
}
