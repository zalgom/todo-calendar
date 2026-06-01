/**
 * 투두 인라인 편집 입력 컴포넌트
 * - autoFocus로 즉시 포커스
 * - Enter / 포커스 아웃: 저장
 * - Escape: 취소 (원본 제목 복원)
 */
'use client'

import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { useTodos } from '@/hooks/useTodos'
import { useTodoStore } from '@/stores/todoStore'
import {
  updateTodoTitleSchema,
  type UpdateTodoTitleInput,
} from '@/lib/validations/todo.schema'

interface TodoEditInputProps {
  todoId: string
  originalTitle: string
}

export default function TodoEditInput({ todoId, originalTitle }: TodoEditInputProps) {
  const { updateTodoTitle } = useTodos()
  const { setEditingTodoId } = useTodoStore()
  const isSavingRef = useRef(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTodoTitleInput>({
    resolver: zodResolver(updateTodoTitleSchema),
    defaultValues: {
      title: originalTitle,
    },
  })

  // 편집 모드 종료
  const exitEditMode = () => {
    setEditingTodoId(null)
  }

  // 저장 처리
  const onSubmit = async (data: UpdateTodoTitleInput) => {
    if (isSavingRef.current) return
    isSavingRef.current = true

    await updateTodoTitle(todoId, data.title, originalTitle)
    exitEditMode()

    isSavingRef.current = false
  }

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(onSubmit)()
    } else if (e.key === 'Escape') {
      // Escape: 편집 취소
      exitEditMode()
    }
  }

  // 포커스 아웃 처리 (자동 저장)
  const handleBlur = () => {
    handleSubmit(onSubmit)()
  }

  return (
    <div className="flex-1">
      <Input
        {...register('title')}
        autoFocus
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`w-full text-sm py-0 h-auto ${
          errors.title ? 'border-red-400 animate-shake' : ''
        }`}
        style={{
          backgroundColor: 'transparent',
          borderColor: errors.title ? 'var(--app-error)' : 'var(--app-accent-primary)',
          color: 'var(--app-text-primary)',
          padding: '2px 6px',
          minHeight: '28px',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
      />
      {errors.title && (
        <p className="text-xs mt-1" style={{ color: 'var(--app-error)' }}>
          {errors.title.message}
        </p>
      )}
    </div>
  )
}
