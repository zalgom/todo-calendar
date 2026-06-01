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
      className="sticky top-0 z-10 px-4 py-3 md:px-6 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--app-surface)',
        borderBottom: '1px solid var(--app-border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* 앱 이름 */}
      <div>
        <h1
          className="text-xl md:text-2xl font-bold tracking-tight"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--app-accent-primary)',
          }}
        >
          투두 캘린더
        </h1>
        <p
          className="text-xs hidden sm:block"
          style={{ color: 'var(--app-text-tertiary)' }}
        >
          날짜별 할 일 관리
        </p>
      </div>

      {/* 로그아웃 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={logout}
        disabled={isLoading}
        className="text-sm font-medium transition-all duration-200 hover:shadow-sm"
        style={{
          borderColor: 'var(--app-border)',
          color: 'var(--app-text-secondary)',
          minHeight: '36px',
        }}
      >
        {isLoading ? '로그아웃 중...' : '로그아웃'}
      </Button>
    </header>
  )
}
