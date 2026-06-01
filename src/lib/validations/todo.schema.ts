/**
 * 투두 관련 Zod 유효성 검사 스키마
 */
import { z } from 'zod'

// 투두 생성 스키마
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(200, '200자 이내로 입력해주세요'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)'),
})

// 투두 수정 스키마 (모든 필드 선택적)
export const updateTodoSchema = createTodoSchema.partial()

// 투두 제목 수정 스키마 (인라인 편집용)
export const updateTodoTitleSchema = z.object({
  title: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(200, '200자 이내로 입력해주세요'),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type UpdateTodoTitleInput = z.infer<typeof updateTodoTitleSchema>
