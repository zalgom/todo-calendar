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
      className="sticky top-0 z-10 px-4 py-4 md:px-6 flex items-center"
      style={{
        backgroundColor: 'var(--app-surface)',
        borderBottom: '1px solid var(--app-border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* 메인 페이지와 동일한 그리드 레이아웃 */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.5fr] lg:grid-cols-[1fr_2fr] gap-4 md:gap-6 items-center">
        {/* 좌측: 캘린더 위치 - 제목 및 부제목 */}
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

        {/* 우측: 투두 위치 - 로그아웃 버튼 */}
        <div className="flex justify-end">
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
        </div>
      </div>
    </header>
  )
}
