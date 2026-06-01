/**
 * 현재 선택된 날짜를 표시하는 클라이언트 컴포넌트
 * - Zustand 스토어에서 selectedDate 구독
 * - 날짜 포맷팅 (YYYY년 M월 D일 요일)
 */
'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useCalendarStore } from '@/stores/calendarStore'

export default function SelectedDateDisplay() {
  const { selectedDate } = useCalendarStore()

  // YYYY-MM-DD -> Date 객체 (타임존 이슈 방지를 위해 T00:00:00 추가)
  const dateObj = new Date(selectedDate + 'T00:00:00')
  const isToday =
    format(new Date(), 'yyyy-MM-dd') === selectedDate

  const formattedDate = format(dateObj, 'M월 d일 (EEE)', { locale: ko })
  const year = format(dateObj, 'yyyy')

  return (
    <div className="flex items-baseline gap-2">
      <h2
        className="text-xl font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--app-text-primary)',
        }}
      >
        {formattedDate}
      </h2>
      <span className="text-sm" style={{ color: 'var(--app-text-tertiary)' }}>
        {year}
      </span>
      {isToday && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'var(--app-accent-light)',
            color: 'var(--app-accent-primary)',
          }}
        >
          오늘
        </span>
      )}
    </div>
  )
}
