/**
 * ErrorBoundary — React 클래스 기반 에러 경계 + 기본 fallback UI.
 *
 * 직접 사용:
 *   <ErrorBoundary><App /></ErrorBoundary>
 *
 * 커스텀 fallback (ReactNode 또는 함수형 — error/reset 받음):
 *   <ErrorBoundary fallback={<div>커스텀</div>}>
 *   <ErrorBoundary fallback={(err, reset) => <MyFallback ... />}>
 *
 * react-error-boundary 호환: DefaultErrorFallback을 FallbackComponent로 전달 가능
 *   <ReactErrorBoundary FallbackComponent={DefaultErrorFallback}>
 */
import { Component, type ErrorInfo, type ReactNode } from 'react'
import styled from 'styled-components'

const FallbackBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  @supports (height: 100dvh) {
    min-height: 100dvh;
  }
  gap: var(--ig-space-4);
  padding: var(--ig-space-8);
  color: var(--ig-color-text-muted);
`

const FallbackTitle = styled.h2`
  margin: 0;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-lg);
`

const FallbackDetail = styled.pre`
  color: var(--ig-color-danger);
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-sm);
  max-width: 600px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
`

const FallbackButton = styled.button`
  padding: var(--ig-space-3) var(--ig-space-6);
  cursor: pointer;
`

export interface DefaultErrorFallbackProps {
  error: unknown
  resetErrorBoundary?: () => void
}

export function DefaultErrorFallback({ error, resetErrorBoundary }: DefaultErrorFallbackProps) {
  const message = error instanceof Error ? error.message : String(error)
  return (
    <FallbackBox role="alert">
      <FallbackTitle>Something went wrong</FallbackTitle>
      <FallbackDetail>{message}</FallbackDetail>
      {resetErrorBoundary ? (
        <FallbackButton onClick={resetErrorBoundary}>Try again</FallbackButton>
      ) : null}
    </FallbackBox>
  )
}

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, info: ErrorInfo) => void
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, info)
    this.props.onError?.(error, info)
  }

  reset = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children

    const { fallback } = this.props
    if (typeof fallback === 'function') return fallback(error, this.reset)
    if (fallback !== undefined) return fallback

    return <DefaultErrorFallback error={error} resetErrorBoundary={this.reset} />
  }
}
