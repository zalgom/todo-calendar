/**
 * 투두 목록 컴포넌트
 * - 미완료 → 완료 순서 정렬
 * - 로딩 상태: Skeleton UI
 * - 빈 상태: 안내 문구
 */
'use client'

import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTodoStore } from '@/stores/todoStore'
import TodoItem from './TodoItem'

export default function TodoList() {
  const { todos, isLoading } = useTodoStore()

  // 미완료 우선, 완료 항목은 하단 정렬
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.isCompleted === b.isCompleted) {
        // 같은 완료 상태면 생성일 오름차순
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      // 미완료(false)가 완료(true)보다 앞에
      return a.isCompleted ? 1 : -1
    })
  }, [todos])

  // 로딩 상태: Skeleton UI
  if (isLoading) {
    return (
      <div className="space-y-1 py-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3">
            <Skeleton
              className="h-5 w-5 rounded shrink-0"
              style={{ backgroundColor: 'var(--app-bg-secondary)' }}
            />
            <Skeleton
              className="h-4 flex-1 rounded"
              style={{
                backgroundColor: 'var(--app-bg-secondary)',
                width: `${60 + i * 15}%`,
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  // 빈 상태
  if (sortedTodos.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-center animate-fade-in"
        role="status"
        aria-label="투두가 없습니다"
      >
        {/* 빈 상태 아이콘 */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl"
          style={{ backgroundColor: 'var(--app-bg-secondary)' }}
        >
          📋
        </div>
        <p
          className="text-base font-medium mb-1"
          style={{ color: 'var(--app-text-secondary)' }}
        >
          이 날의 할 일이 없습니다
        </p>
        <p className="text-sm" style={{ color: 'var(--app-text-tertiary)' }}>
          새 할 일을 추가해보세요
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {/* 투두 개수 표시 */}
      <div className="flex items-center gap-2 px-3 py-1 mb-1">
        <span className="text-xs font-medium" style={{ color: 'var(--app-text-tertiary)' }}>
          전체 {sortedTodos.length}개
        </span>
        {sortedTodos.some((t) => t.isCompleted) && (
          <>
            <span style={{ color: 'var(--app-border)' }}>·</span>
            <span className="text-xs" style={{ color: 'var(--app-success)' }}>
              완료 {sortedTodos.filter((t) => t.isCompleted).length}개
            </span>
          </>
        )}
      </div>

      {/* 투두 목록 */}
      {sortedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}
