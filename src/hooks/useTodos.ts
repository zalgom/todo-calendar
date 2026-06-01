/**
 * 투두 CRUD 커스텀 훅
 * - 낙관적 업데이트 패턴 적용
 * - Supabase DB 연동
 * - 캘린더 인디케이터 실시간 업데이트
 */
'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useTodoStore } from '@/stores/todoStore'
import { useCalendarStore } from '@/stores/calendarStore'
import type { Todo, TodoRow, CreateTodoInput } from '@/types'

/**
 * Supabase snake_case 행을 camelCase Todo로 변환합니다.
 */
const mapRowToTodo = (row: TodoRow): Todo => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  isCompleted: row.is_completed,
  dueDate: row.due_date,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const useTodos = () => {
  const { setTodos, addTodo, updateTodo, removeTodo, setLoading, setError } =
    useTodoStore()
  const { selectedDate, dailySummary, updateDaySummary } = useCalendarStore()

  /**
   * 특정 날짜의 투두 목록을 가져옵니다.
   */
  const fetchTodosByDate = useCallback(
    async (date: string) => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setError('로그인이 필요합니다')
          return
        }

        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .eq('user_id', user.id)
          .eq('due_date', date)
          .order('created_at', { ascending: true })

        if (error) {
          setError('투두 목록을 불러오는 중 오류가 발생했습니다')
          return
        }

        const todos = (data as TodoRow[]).map(mapRowToTodo)
        setTodos(todos)
      } catch {
        setError('투두 목록을 불러오는 중 오류가 발생했습니다')
      } finally {
        setLoading(false)
      }
    },
    [setTodos, setLoading, setError]
  )

  /**
   * 새 투두를 생성합니다. (낙관적 업데이트)
   */
  const createTodo = async (input: CreateTodoInput) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('로그인이 필요합니다')
      return
    }

    // 임시 ID로 낙관적 업데이트
    const tempId = `temp-${Date.now()}`
    const now = new Date().toISOString()
    const optimisticTodo: Todo = {
      id: tempId,
      userId: user.id,
      title: input.title,
      isCompleted: false,
      dueDate: input.dueDate,
      createdAt: now,
      updatedAt: now,
    }

    addTodo(optimisticTodo)

    // 캘린더 인디케이터 즉시 업데이트
    const currentInfo = dailySummary[input.dueDate]
    updateDaySummary(input.dueDate, {
      date: input.dueDate,
      totalCount: (currentInfo?.totalCount ?? 0) + 1,
      completedCount: currentInfo?.completedCount ?? 0,
    })

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          user_id: user.id,
          title: input.title,
          due_date: input.dueDate,
          is_completed: false,
        })
        .select()
        .single()

      if (error) {
        // 실패 시 낙관적 업데이트 롤백
        removeTodo(tempId)
        const rollbackInfo = dailySummary[input.dueDate]
        if (rollbackInfo) {
          updateDaySummary(input.dueDate, {
            ...rollbackInfo,
            totalCount: Math.max(0, rollbackInfo.totalCount - 1),
          })
        }
        toast.error('투두 추가에 실패했습니다')
        return
      }

      // 서버 응답으로 임시 항목 교체
      const realTodo = mapRowToTodo(data as TodoRow)
      removeTodo(tempId)
      addTodo(realTodo)
    } catch {
      removeTodo(tempId)
      toast.error('투두 추가 중 오류가 발생했습니다')
    }
  }

  /**
   * 투두 완료 상태를 토글합니다. (낙관적 업데이트)
   */
  const toggleTodo = async (id: string, currentCompleted: boolean) => {
    // 낙관적 업데이트
    updateTodo(id, { isCompleted: !currentCompleted })

    // 캘린더 인디케이터 즉시 업데이트
    const currentInfo = dailySummary[selectedDate]
    if (currentInfo) {
      updateDaySummary(selectedDate, {
        ...currentInfo,
        completedCount: currentCompleted
          ? Math.max(0, currentInfo.completedCount - 1)
          : currentInfo.completedCount + 1,
      })
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('todos')
        .update({
          is_completed: !currentCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) {
        // 롤백
        updateTodo(id, { isCompleted: currentCompleted })
        if (currentInfo) {
          updateDaySummary(selectedDate, currentInfo)
        }
        toast.error('상태 변경에 실패했습니다')
      }
    } catch {
      updateTodo(id, { isCompleted: currentCompleted })
      toast.error('상태 변경 중 오류가 발생했습니다')
    }
  }

  /**
   * 투두 제목을 수정합니다. (낙관적 업데이트)
   */
  const updateTodoTitle = async (
    id: string,
    newTitle: string,
    originalTitle: string
  ) => {
    if (newTitle.trim() === originalTitle) return

    // 낙관적 업데이트
    updateTodo(id, { title: newTitle.trim() })

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('todos')
        .update({
          title: newTitle.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) {
        // 롤백
        updateTodo(id, { title: originalTitle })
        toast.error('수정에 실패했습니다')
      }
    } catch {
      updateTodo(id, { title: originalTitle })
      toast.error('수정 중 오류가 발생했습니다')
    }
  }

  /**
   * 투두를 삭제합니다. (낙관적 업데이트)
   */
  const deleteTodo = async (id: string, dueDate: string) => {
    // 현재 상태 스냅샷 (롤백용)
    const { todos } = useTodoStore.getState()
    const deletedTodo = todos.find((t) => t.id === id)

    if (!deletedTodo) return

    // 낙관적 업데이트
    removeTodo(id)

    // 캘린더 인디케이터 즉시 업데이트
    const currentInfo = dailySummary[dueDate]
    if (currentInfo) {
      updateDaySummary(dueDate, {
        ...currentInfo,
        totalCount: Math.max(0, currentInfo.totalCount - 1),
        completedCount: deletedTodo.isCompleted
          ? Math.max(0, currentInfo.completedCount - 1)
          : currentInfo.completedCount,
      })
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from('todos').delete().eq('id', id)

      if (error) {
        // 롤백
        addTodo(deletedTodo)
        if (currentInfo) {
          updateDaySummary(dueDate, currentInfo)
        }
        toast.error('삭제에 실패했습니다')
      }
    } catch {
      addTodo(deletedTodo)
      toast.error('삭제 중 오류가 발생했습니다')
    }
  }

  /**
   * 현재 월의 날짜별 투두 현황을 가져옵니다.
   */
  const fetchMonthSummary = async (monthStart: string, monthEnd: string) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('todos')
        .select('due_date, is_completed')
        .eq('user_id', user.id)
        .gte('due_date', monthStart)
        .lte('due_date', monthEnd)

      if (error || !data) return

      // 날짜별 집계 변환
      const summaryMap: Record<string, { totalCount: number; completedCount: number }> = {}

      ;(data as { due_date: string; is_completed: boolean }[]).forEach((row) => {
        const date = row.due_date
        if (!summaryMap[date]) {
          summaryMap[date] = { totalCount: 0, completedCount: 0 }
        }
        summaryMap[date].totalCount += 1
        if (row.is_completed) {
          summaryMap[date].completedCount += 1
        }
      })

      // CalendarStore에 저장
      const { setDailySummary } = useCalendarStore.getState()
      const dailySummaryResult = Object.entries(summaryMap).reduce(
        (acc, [date, info]) => {
          acc[date] = { date, ...info }
          return acc
        },
        {} as Parameters<typeof setDailySummary>[0]
      )

      setDailySummary(dailySummaryResult)
    } catch {
      // 현황 조회 실패는 무시 (인디케이터가 표시 안 될 뿐)
    }
  }

  return {
    fetchTodosByDate,
    createTodo,
    toggleTodo,
    updateTodoTitle,
    deleteTodo,
    fetchMonthSummary,
  }
}
