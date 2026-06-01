/**
 * 에러 바운더리 컴포넌트
 * - 예상치 못한 에러로 앱이 중단되지 않도록 방어
 * - 에러 발생 시 안내 메시지 + 재시도 버튼 표시
 */
'use client'

import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // 실제 서비스에서는 에러 모니터링 서비스로 전송
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className="flex flex-col items-center justify-center min-h-64 p-8 text-center rounded-xl"
          style={{
            backgroundColor: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div className="text-2xl mb-4">⚠️</div>
          <h3
            className="text-base font-semibold mb-2"
            style={{ color: 'var(--app-text-primary)' }}
          >
            오류가 발생했습니다
          </h3>
          <p
            className="text-sm mb-6"
            style={{ color: 'var(--app-text-secondary)' }}
          >
            예상치 못한 오류가 발생했습니다.
            <br />
            페이지를 새로고침하거나 다시 시도해주세요.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={this.handleReset}
              size="sm"
              style={{
                borderColor: 'var(--app-border)',
                color: 'var(--app-text-secondary)',
              }}
            >
              다시 시도
            </Button>
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              style={{
                backgroundColor: 'var(--app-accent-primary)',
                color: '#ffffff',
              }}
            >
              새로고침
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
