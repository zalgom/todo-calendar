/**
 * 회원가입 페이지
 */
import type { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: '회원가입 | 투두 캘린더',
}

export default function SignupPage() {
  return <SignupForm />
}
