/**
 * 개별 투두 항목 컴포넌트
 * - 체크박스 완료 토글
 * - 제목 클릭 시 인라인 편집 모드 전환
 * - hover 시 삭제 버튼 표시
 * - 완료 상태 시각적 구분 (취소선 + 색상 변경)
 */
'use client'

import { memo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { useTodos } from '@/hooks/useTodos'
import { useTodoStore } from '@/stores/todoStore'
import TodoEditInput from './TodoEditInput'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
}

function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodos()
  const { editingTodoId, setEditingTodoId } = useTodoStore()

  const isEditing = editingTodoId === todo.id

  // 체크박스 토글
  const handleToggle = () => {
    toggleTodo(todo.id, todo.isCompleted)
  }

  // 제목 클릭 시 편집 모드 진입
  const handleTitleClick = () => {
    if (!todo.isCompleted) {
      setEditingTodoId(todo.id)
    }
  }

  // 삭제 처리
  const handleDelete = () => {
    deleteTodo(todo.id, todo.dueDate)
  }

  return (
    <div
      className="group flex items-start gap-3 px-3 py-3 rounded-lg transition-colors duration-150 animate-slide-up"
      style={{
        borderBottom: '1px solid var(--app-border-subtle)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.backgroundColor =
          'var(--app-bg-secondary)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
      }}
    >
      {/* 체크박스 */}
      <Checkbox
        checked={todo.isCompleted}
        onCheckedChange={handleToggle}
        className="mt-0.5 h-5 w-5 shrink-0 transition-transform duration-200 data-[state=checked]:animate-check"
        style={{
          borderColor: todo.isCompleted
            ? 'var(--app-success)'
            : 'var(--app-border)',
          backgroundColor: todo.isCompleted ? 'var(--app-success)' : undefined,
          minWidth: '20px',
          minHeight: '20px',
        }}
        aria-label={`${todo.title} ${todo.isCompleted ? '완료됨' : '미완료'}`}
      />

      {/* 제목 영역 (편집 모드 / 일반 모드) */}
      {isEditing ? (
        <TodoEditInput todoId={todo.id} originalTitle={todo.title} />
      ) : (
        <span
          className={`flex-1 text-sm leading-relaxed cursor-pointer transition-all duration-200 ${
            todo.isCompleted ? 'line-through' : ''
          }`}
          style={{
            color: todo.isCompleted
              ? 'var(--app-text-tertiary)'
              : 'var(--app-text-primary)',
          }}
          onClick={handleTitleClick}
          title={todo.isCompleted ? undefined : '클릭하여 편집'}
        >
          {todo.title}
        </span>
      )}

      {/* 삭제 버튼 (hover 시 표시) */}
      {!isEditing && (
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50"
          style={{ color: 'var(--app-text-tertiary)' }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color =
              'var(--app-error)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color =
              'var(--app-text-tertiary)'
          }}
          aria-label={`${todo.title} 삭제`}
        >
          ✕
        </button>
      )}
    </div>
  )
}

// 불필요한 리렌더링 방지
export default memo(TodoItem)
