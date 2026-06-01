/**
 * 캘린더 Zustand 스토어
 * - 선택된 날짜 및 현재 월 상태 관리
 * - 날짜별 투두 현황 (인디케이터용) 관리
 */
import { create } from 'zustand'
import { format } from 'date-fns'
import type { CalendarDayInfo, DailySummaryMap } from '@/types'

interface CalendarState {
  // 현재 선택된 날짜 (YYYY-MM-DD 형식)
  selectedDate: string
  // 현재 표시 중인 월
  currentMonth: Date
  // 날짜별 투두 현황 맵 (캘린더 인디케이터용)
  dailySummary: DailySummaryMap
}

interface CalendarActions {
  // 선택 날짜 변경
  setSelectedDate: (date: string) => void
  // 현재 월 변경
  setCurrentMonth: (month: Date) => void
  // 전체 날짜별 현황 갱신
  setDailySummary: (summary: DailySummaryMap) => void
  // 특정 날짜 현황 업데이트 (투두 CRUD 후 즉시 반영)
  updateDaySummary: (date: string, info: CalendarDayInfo) => void
}

type CalendarStore = CalendarState & CalendarActions

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayString = () => format(new Date(), 'yyyy-MM-dd')

export const useCalendarStore = create<CalendarStore>((set) => ({
  // 초기값: 오늘 날짜 선택, 현재 월
  selectedDate: getTodayString(),
  currentMonth: new Date(),
  dailySummary: {},

  setSelectedDate: (selectedDate) => set({ selectedDate }),

  setCurrentMonth: (currentMonth) => set({ currentMonth }),

  setDailySummary: (dailySummary) => set({ dailySummary }),

  updateDaySummary: (date, info) =>
    set((state) => ({
      dailySummary: {
        ...state.dailySummary,
        [date]: info,
      },
    })),
}))
