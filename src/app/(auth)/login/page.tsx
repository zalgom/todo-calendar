/**
 * 로그인 페이지
 */
import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: '로그인 | 투두 캘린더',
}

export default function LoginPage() {
  return <LoginForm />
}
