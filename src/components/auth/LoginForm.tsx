/**
 * 로그인 폼 컴포넌트
 * - React Hook Form + Zod 유효성 검사
 * - 로딩 상태 처리
 * - 서버 에러 표시
 */
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginInput } from '@/lib/validations/auth.schema'

export default function LoginForm() {
  const { login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 폼 제출 처리
  const onSubmit = async (data: LoginInput) => {
    const errorMessage = await login(data)

    if (errorMessage) {
      // 서버 에러를 폼에 표시
      setError('root', { message: errorMessage })
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* 헤더 */}
      <div className="space-y-2 text-center">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--app-text-primary)' }}
        >
          다시 오셨군요
        </h1>
        <p className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
          이메일과 비밀번호로 로그인하세요
        </p>
      </div>

      {/* 로그인 폼 */}
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
            placeholder="••••••••"
            autoComplete="current-password"
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

        {/* 로그인 버튼 */}
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
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      {/* 회원가입 링크 */}
      <p className="text-center text-sm" style={{ color: 'var(--app-text-secondary)' }}>
        아직 계정이 없으신가요?{' '}
        <Link
          href="/signup"
          className="font-medium underline-offset-2 hover:underline transition-colors duration-200"
          style={{ color: 'var(--app-accent-primary)' }}
        >
          회원가입
        </Link>
      </p>
    </div>
  )
}
