/**
 * 투두 입력 컴포넌트
 * - Enter 키 또는 버튼으로 투두 추가
 * - React Hook Form + Zod 유효성 검사
 * - 제출 후 입력창 자동 초기화
 */
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTodos } from '@/hooks/useTodos'
import { useCalendarStore } from '@/stores/calendarStore'
import {
  createTodoSchema,
  type CreateTodoInput,
} from '@/lib/validations/todo.schema'

export default function TodoInput() {
  const { createTodo } = useTodos()
  const { selectedDate } = useCalendarStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      dueDate: selectedDate,
    },
  })

  // 투두 추가 처리
  const onSubmit = async (data: CreateTodoInput) => {
    await createTodo({
      title: data.title.trim(),
      dueDate: selectedDate,
    })
    // 입력창 초기화
    reset({ title: '', dueDate: selectedDate })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex gap-2">
        {/* 투두 제목 입력창 */}
        <div className="flex-1">
          <Input
            {...register('title')}
            placeholder="새 할 일을 입력하세요..."
            disabled={isSubmitting}
            className={`transition-all duration-200 ${
              errors.title ? 'animate-shake' : ''
            }`}
            style={{
              backgroundColor: 'var(--app-surface)',
              borderColor: errors.title ? 'var(--app-error)' : 'var(--app-border)',
              color: 'var(--app-text-primary)',
              minHeight: '44px',
            }}
            // Enter 키로 폼 제출
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(onSubmit)()
              }
            }}
          />
        </div>

        {/* 추가 버튼 */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 font-medium transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: 'var(--app-accent-primary)',
            color: '#ffffff',
            minHeight: '44px',
            minWidth: '64px',
          }}
        >
          {isSubmitting ? '추가 중' : '추가'}
        </Button>
      </div>

      {/* 유효성 검사 에러 메시지 */}
      {errors.title && (
        <p className="text-xs" style={{ color: 'var(--app-error)' }}>
          {errors.title.message}
        </p>
      )}
    </form>
  )
}
