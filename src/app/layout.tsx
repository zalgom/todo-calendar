/**
 * 루트 레이아웃
 * - Google Fonts (Playfair Display) 로드
 * - 기본 메타데이터 설정
 * - Toast 알림 프로바이더 설정
 */
import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

// Playfair Display: 디스플레이용 세리프 폰트 (제목/브랜딩)
const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '투두 캘린더',
  description: '날짜 기반 캘린더와 통합된 투두리스트 앱',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${playfairDisplay.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        {/* 전역 Toast 알림 */}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'var(--font-body)',
            },
          }}
        />
      </body>
    </html>
  )
}
