/**
 * 앱 헤더 컴포넌트
 * - 앱 이름 표시
 * - 로그아웃 버튼
 * - 반응형 디자인
 */
'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { logout, isLoading } = useAuth()

  return (
    <header
      className="sticky top-0 z-10 px-4 py-4 md:px-8 md:py-5 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--app-surface)',
        borderBottom: '1px solid var(--app-border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* 앱 이름 및 부제목 */}
      <div className="flex flex-col gap-0.5">
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--app-accent-primary)',
            letterSpacing: '-0.5px',
          }}
        >
          투두 캘린더
        </h1>
        <p
          className="text-xs md:text-sm"
          style={{ color: 'var(--app-text-tertiary)' }}
        >
          날짜를 통해 할 일 관리
        </p>
      </div>

      {/* 로그아웃 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={logout}
        disabled={isLoading}
        className="text-sm font-medium transition-all duration-200 hover:shadow-md"
        style={{
          backgroundColor: 'var(--app-accent-light)',
          borderColor: 'var(--app-accent-primary)',
          color: 'var(--app-accent-primary)',
          minHeight: '40px',
          minWidth: '90px',
        }}
      >
        {isLoading ? '중...' : '로그아웃'}
      </Button>
    </header>
  )
}
