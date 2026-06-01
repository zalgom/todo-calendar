/**
 * 회원가입 폼 컴포넌트
 * - React Hook Form + Zod 유효성 검사
 * - 비밀번호 확인 필드 포함
 * - 회원가입 성공 시 안내 화면 표시
 */
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { signupSchema, type SignupInput } from '@/lib/validations/auth.schema'

export default function SignupForm() {
  const { signup, isLoading } = useAuth()
  // 회원가입 성공 여부 상태
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [signedUpEmail, setSignedUpEmail] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  })

  // 폼 제출 처리
  const onSubmit = async (data: SignupInput) => {
    const errorMessage = await signup(data)

    if (errorMessage) {
      // 서버 에러를 폼에 표시
      setError('root', { message: errorMessage })
      return
    }

    // 회원가입 성공
    setSignedUpEmail(data.email)
    setIsSignedUp(true)
  }

  // 회원가입 성공 화면
  if (isSignedUp) {
    return (
      <div className="w-full space-y-6 text-center animate-fade-in">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl"
          style={{ backgroundColor: 'var(--app-accent-light)' }}
        >
          ✉️
        </div>
        <div className="space-y-2">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--app-text-primary)' }}
          >
            이메일을 확인해주세요
          </h1>
          <p className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
            <strong style={{ color: 'var(--app-text-primary)' }}>{signedUpEmail}</strong>
            으로 인증 메일을 발송했습니다.
            <br />
            메일함을 확인하고 인증을 완료해주세요.
          </p>
        </div>
        <Link
          href="/login"
          className="block text-sm font-medium underline-offset-2 hover:underline transition-colors duration-200"
          style={{ color: 'var(--app-accent-primary)' }}
        >
          로그인 페이지로 이동
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* 헤더 */}
      <div className="space-y-2 text-center">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--app-text-primary)' }}
        >
          계정 만들기
        </h1>
        <p className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
          이메일로 간단하게 시작하세요
        </p>
      </div>

      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* 전역 에러 메시지 */}
        {errors.root && (
          <div
            className="rounded-md px-4 py-3 text-sm animate-shake"
            style={{
              backgroundColor: '#fdf2f2',
              color: 'var(--app-error)',
              border: '1px solid #f5c6c6',
            }}
          >
            {errors.root.message}
          </div>
        )}

        {/* 이메일 */}
        <div className="space-y-2">
          <Label htmlFor="email" style={{ color: 'var(--app-text-primary)' }}>
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            disabled={isLoading}
            {...register('email')}
            className={errors.email ? 'border-red-400 animate-shake' : ''}
            style={{
              backgroundColor: 'var(--app-surface)',
              borderColor: errors.email ? undefined : 'var(--app-border)',
            }}
          />
          {errors.email && (
            <p className="text-xs" style={{ color: 'var(--app-error)' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="space-y-2">
          <Label htmlFor="password" style={{ color: 'var(--app-text-primary)' }}>
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="6자 이상 입력해주세요"
            autoComplete="new-password"
            disabled={isLoading}
            {...register('password')}
            className={errors.password ? 'border-red-400 animate-shake' : ''}
            style={{
              backgroundColor: 'var(--app-surface)',
              borderColor: errors.password ? undefined : 'var(--app-border)',
            }}
          />
          {errors.password && (
            <p className="text-xs" style={{ color: 'var(--app-error)' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-2">
          <Label htmlFor="passwordConfirm" style={{ color: 'var(--app-text-primary)' }}>
            비밀번호 확인
          </Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            autoComplete="new-password"
            disabled={isLoading}
            {...register('passwordConfirm')}
            className={errors.passwordConfirm ? 'border-red-400 animate-shake' : ''}
            style={{
              backgroundColor: 'var(--app-surface)',
              borderColor: errors.passwordConfirm ? undefined : 'var(--app-border)',
            }}
          />
          {errors.passwordConfirm && (
            <p className="text-xs" style={{ color: 'var(--app-error)' }}>
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          className="w-full font-medium transition-all duration-200"
          disabled={isLoading}
          style={{
            backgroundColor: 'var(--app-accent-primary)',
            color: '#ffffff',
            minHeight: '44px',
          }}
        >
          {isLoading ? '가입 중...' : '회원가입'}
        </Button>
      </form>

      {/* 로그인 링크 */}
      <p className="text-center text-sm" style={{ color: 'var(--app-text-secondary)' }}>
        이미 계정이 있으신가요?{' '}
        <Link
          href="/login"
          className="font-medium underline-offset-2 hover:underline transition-colors duration-200"
          style={{ color: 'var(--app-accent-primary)' }}
        >
          로그인
        </Link>
      </p>
    </div>
  )
}
