/**
 * 메인 페이지
 * - 캘린더 (좌측) + 투두 목록 (우측) 레이아웃
 * - 반응형: 모바일 단일 열, 태블릿/데스크톱 좌우 분할
 */
import type { Metadata } from 'next'
import CalendarView from '@/components/calendar/CalendarView'
import TodoInput from '@/components/todo/TodoInput'
import TodoList from '@/components/todo/TodoList'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import SelectedDateDisplay from '@/components/todo/SelectedDateDisplay'

export const metadata: Metadata = {
  title: '투두 캘린더',
}

export default function MainPage() {
  return (
    <div className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
      {/*
       * 반응형 그리드 레이아웃
       * - 모바일 (<md): 단일 열 (캘린더 위, 투두 아래)
       * - 태블릿/데스크톱 (≥md): 좌측 캘린더 + 우측 투두
       */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.5fr] md:gap-6 lg:grid-cols-[1fr_2fr]">
        {/* 왼쪽: 캘린더 영역 */}
        <div className="h-fit">
          <ErrorBoundary>
            <CalendarView />
          </ErrorBoundary>
        </div>

        {/* 오른쪽: 투두 영역 (모바일에서는 캘린더 아래) */}
        <div
          className="rounded-xl p-4 shadow-sm flex flex-col gap-4"
          style={{
            backgroundColor: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
          }}
        >
          {/* 선택된 날짜 표시 */}
          <SelectedDateDisplay />

          {/* 투두 입력 */}
          <ErrorBoundary>
            <TodoInput />
          </ErrorBoundary>

          {/* 구분선 */}
          <div
            className="h-px"
            style={{ backgroundColor: 'var(--app-border-subtle)' }}
          />

          {/* 투두 목록 */}
          <ErrorBoundary>
            <TodoList />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
