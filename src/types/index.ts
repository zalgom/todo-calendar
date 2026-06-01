/**
 * 투두-캘린더 앱 공통 타입 정의
 */

// ===========================
// Todo 관련 타입
// ===========================

/** 투두 항목 */
export interface Todo {
  id: string
  userId: string
  title: string
  isCompleted: boolean
  dueDate: string // 'YYYY-MM-DD' 형식
  createdAt: string
  updatedAt: string
}

/** Supabase DB에서 반환되는 원시 투두 타입 (snake_case) */
export interface TodoRow {
  id: string
  user_id: string
  title: string
  is_completed: boolean
  due_date: string
  created_at: string
  updated_at: string
}

/** 투두 생성 입력 타입 */
export interface CreateTodoInput {
  title: string
  dueDate: string
}

/** 투두 수정 입력 타입 */
export interface UpdateTodoInput {
  title?: string
  isCompleted?: boolean
}

// ===========================
// 캘린더 관련 타입
// ===========================

/** 특정 날짜의 투두 현황 정보 */
export interface CalendarDayInfo {
  date: string // 'YYYY-MM-DD' 형식
  totalCount: number
  completedCount: number
}

/** 날짜별 투두 현황 맵 */
export type DailySummaryMap = Record<string, CalendarDayInfo>

// ===========================
// 인증 관련 타입
// ===========================

/** 사용자 프로필 */
export interface UserProfile {
  id: string
  email: string | null
  createdAt: string
}

// ===========================
// 공통 UI 타입
// ===========================

/** 비동기 작업 상태 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

/** API 에러 응답 */
export interface ApiError {
  message: string
  code?: string
}
