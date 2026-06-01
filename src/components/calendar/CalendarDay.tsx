/**
 * 캘린더 날짜 셀 컴포넌트
 * - 날짜 숫자 표시
 * - 투두 인디케이터 (점) 표시
 * - 완료율에 따른 인디케이터 색상
 */
import type { CalendarDayInfo } from '@/types'

interface CalendarDayProps {
  date: number
  dayInfo?: CalendarDayInfo
}

export default function CalendarDay({ date, dayInfo }: CalendarDayProps) {
  const hasTodos = dayInfo && dayInfo.totalCount > 0
  const isAllCompleted =
    hasTodos && dayInfo.completedCount === dayInfo.totalCount
  const hasPartialCompleted =
    hasTodos && dayInfo.completedCount > 0 && !isAllCompleted

  // 인디케이터 색상 결정
  const indicatorColor = isAllCompleted
    ? 'var(--app-success)'          // 모두 완료: 그린
    : hasPartialCompleted
      ? 'var(--app-warning)'        // 일부 완료: 오렌지
      : 'var(--app-accent-primary)' // 미완료: 기본 그린

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-0.5">
      {/* 날짜 숫자 */}
      <span className="text-sm leading-none">{date}</span>

      {/* 투두 인디케이터 */}
      {hasTodos && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: indicatorColor }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
