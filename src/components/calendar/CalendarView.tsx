/**
 * 캘린더 뷰 컴포넌트
 * - react-day-picker v10 사용
 * - 한국어 locale
 * - 날짜 선택 및 월 이동
 * - 날짜별 투두 인디케이터
 */
'use client'

import { useEffect, useCallback } from 'react'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import 'react-day-picker/style.css'
import { useCalendarStore } from '@/stores/calendarStore'
import { useTodoStore } from '@/stores/todoStore'
import { useTodos } from '@/hooks/useTodos'
import CalendarDay from './CalendarDay'

export default function CalendarView() {
  const { selectedDate, currentMonth, dailySummary, setSelectedDate, setCurrentMonth } =
    useCalendarStore()
  const { reset } = useTodoStore()
  const { fetchTodosByDate, fetchMonthSummary } = useTodos()

  // 현재 월의 투두 현황 로드
  const loadMonthSummary = useCallback(
    async (month: Date) => {
      const monthStart = format(startOfMonth(month), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(month), 'yyyy-MM-dd')
      await fetchMonthSummary(monthStart, monthEnd)
    },
    [fetchMonthSummary]
  )

  // 초기 로드: 오늘 날짜 투두 및 이번 달 현황
  useEffect(() => {
    fetchTodosByDate(selectedDate)
    loadMonthSummary(currentMonth)
    // 초기 마운트 시만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 날짜 선택 처리
  const handleDayClick = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    setSelectedDate(dateStr)
    // 투두 목록 초기화 후 새 날짜 데이터 로드
    reset()
    fetchTodosByDate(dateStr)
  }

  // 월 변경 처리
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month)
    loadMonthSummary(month)
  }

  // 선택된 날짜를 Date 객체로 변환
  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined

  return (
    <div
      className="rounded-xl p-2 shadow-sm"
      style={{
        backgroundColor: 'var(--app-surface)',
        border: '1px solid var(--app-border)',
      }}
    >
      <DayPicker
        mode="single"
        selected={selectedDateObj}
        onDayClick={handleDayClick}
        month={currentMonth}
        onMonthChange={handleMonthChange}
        locale={ko}
        // 커스텀 날짜 셀 렌더링 (인디케이터 표시)
        components={{
          DayButton: ({ day, modifiers, ...buttonProps }) => {
            const dateStr = format(day.date, 'yyyy-MM-dd')
            const dayInfo = dailySummary[dateStr]
            const dayNum = day.date.getDate()

            return (
              <button
                {...buttonProps}
                className={`
                  w-full h-full flex flex-col items-center justify-center rounded-md
                  transition-colors duration-150 text-sm font-medium
                  hover:bg-[var(--app-bg-secondary)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent-primary)]
                  ${modifiers.selected
                    ? 'bg-[var(--app-accent-light)] text-[var(--app-accent-primary)] font-semibold'
                    : ''
                  }
                  ${modifiers.today && !modifiers.selected
                    ? 'ring-2 ring-[var(--app-accent-primary)] ring-inset'
                    : ''
                  }
                  ${modifiers.outside ? 'opacity-30' : ''}
                `}
                style={{
                  backgroundColor: modifiers.selected ? 'var(--app-accent-light)' : undefined,
                  color: modifiers.selected
                    ? 'var(--app-accent-primary)'
                    : modifiers.outside
                      ? 'var(--app-text-tertiary)'
                      : 'var(--app-text-primary)',
                  minHeight: '40px',
                  minWidth: '40px',
                }}
              >
                <CalendarDay date={dayNum} dayInfo={dayInfo} />
              </button>
            )
          },
        }}
        classNames={{
          root: 'w-full',
          months: 'w-full',
          month: 'w-full',
          month_caption: 'flex justify-center items-center py-3 font-semibold',
          caption_label: 'text-base font-semibold',
          nav: 'flex items-center justify-between absolute w-full px-2 top-0',
          button_previous:
            'w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--app-bg-secondary)] transition-colors',
          button_next:
            'w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--app-bg-secondary)] transition-colors',
          month_grid: 'w-full border-collapse',
          weekdays: 'flex mb-1',
          weekday:
            'flex-1 text-center text-xs font-medium py-2 text-[var(--app-text-tertiary)]',
          weeks: 'w-full',
          week: 'flex',
          day: 'flex-1 aspect-square p-0.5',
          day_button: 'w-full h-full',
          selected: '',
          today: '',
          outside: '',
          disabled: 'opacity-40 cursor-not-allowed',
        }}
        style={
          {
            '--rdp-accent-color': 'var(--app-accent-primary)',
            '--rdp-background-color': 'var(--app-accent-light)',
          } as React.CSSProperties
        }
      />
    </div>
  )
}
