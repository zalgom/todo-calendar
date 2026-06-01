/**
 * 인증 페이지 공통 레이아웃
 * - 중앙 정렬 카드 형식
 * - 브랜드 배경 디자인
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--app-bg-primary)' }}
    >
      {/* 배경 장식 요소 */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ backgroundColor: 'var(--app-accent-light)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--app-accent-primary)' }}
        />
      </div>

      {/* 인증 카드 */}
      <div
        className="relative w-full max-w-sm rounded-2xl shadow-lg p-8 animate-fade-in"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
        }}
      >
        {/* 앱 로고 */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <p
              className="text-2xl font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--app-accent-primary)',
              }}
            >
              투두 캘린더
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--app-text-tertiary)' }}>
              날짜별 할 일 관리
            </p>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
