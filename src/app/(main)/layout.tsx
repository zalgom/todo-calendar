/**
 * 메인 앱 레이아웃
 * - 헤더 포함
 * - 전체 화면 높이
 */
import Header from '@/components/layout/Header'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--app-bg-primary)' }}
    >
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
