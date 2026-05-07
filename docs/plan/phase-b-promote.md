# Phase B — P1 새 컴포넌트 승격 (1~2일)

> 목표: 양쪽에 따로 있거나 한쪽에만 있는 generic UI 패턴을 `@ingradient/ui`로 끌어올린다.
> Phase A 완료 후 진행 권장 (createStore가 ui에 있어야 B-2 토스트 통합이 깔끔).
> 자세한 배경은 [cross-app-sync-2026-05.md](./cross-app-sync-2026-05.md) 참고.

---

## B-1. `ErrorBoundary` + `DefaultErrorFallback` ui 승격

### 사전 상황
- edge: [src/ui/shared/ErrorBoundary.tsx](../../../ingradient-edge/src/ui/shared/ErrorBoundary.tsx) — 자체 React 클래스 컴포넌트, `fallback` / `onError` props
- platform: [frontend/app/ErrorFallback.tsx](../../../ingradient-platform/frontend/app/ErrorFallback.tsx) — `react-error-boundary` 라이브러리용 fallback. boundary 자체는 라이브러리가 제공
- 두 fallback UI 모두 하드코딩된 색상(`#ef4444`, `#888`) 사용

### 결정
- **ErrorBoundary 클래스 컴포넌트는 ui에 추가**한다. edge처럼 라이브러리 의존 없이 쓸 수 있어야 하기 때문.
- **DefaultErrorFallback 함수형 컴포넌트도 ui에 추가**한다. ErrorBoundary의 기본 fallback이자, platform이 `react-error-boundary`에 넘기는 컴포넌트로도 재사용 가능.
- platform은 `react-error-boundary` 유지 (변경 위험 큼). fallback만 ui 버전 사용.

### 작업

#### B-1.1 ui에 추가
[ingradient-ui/src/components/feedback/error-boundary.tsx](../../../ingradient-ui/src/components/feedback/error-boundary.tsx) 신규:

```typescript
import { Component, type ErrorInfo, type ReactNode } from 'react'
import styled from 'styled-components'

const FallbackBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  @supports (height: 100dvh) { min-height: 100dvh; }
  gap: var(--ig-space-4);
  padding: var(--ig-space-8);
  color: var(--ig-color-text-muted);
`
const Title = styled.h2`
  margin: 0;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-lg);
`
const Detail = styled.pre`
  color: var(--ig-color-danger);
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-sm);
  max-width: 600px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
`

export interface DefaultErrorFallbackProps {
  error: unknown
  resetErrorBoundary?: () => void
}
export function DefaultErrorFallback({ error, resetErrorBoundary }: DefaultErrorFallbackProps) {
  const message = error instanceof Error ? error.message : String(error)
  return (
    <FallbackBox role="alert">
      <Title>Something went wrong</Title>
      <Detail>{message}</Detail>
      {resetErrorBoundary && <button onClick={resetErrorBoundary}>Try again</button>}
    </FallbackBox>
  )
}

interface ErrorBoundaryProps {
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
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }
  reset = () => this.setState({ error: null })
  render() {
    const { error } = this.state
    if (!error) return this.props.children
    const { fallback } = this.props
    if (typeof fallback === 'function') return fallback(error, this.reset)
    return fallback ?? <DefaultErrorFallback error={error} resetErrorBoundary={this.reset} />
  }
}
```

- `src/components/feedback/index.ts` 에 export 추가
- 단순한 storybook 스토리 + 기본 테스트 1개 (throw → fallback 렌더 확인)

#### B-1.2 edge 마이그레이션
- `src/ui/shared/ErrorBoundary.tsx` 삭제
- import 사용처를 `from '@ingradient/ui'` 로 교체 (App.tsx 등)

#### B-1.3 platform 마이그레이션
- `frontend/app/ErrorFallback.tsx` 삭제
- `frontend/app/App.tsx`에서 `ErrorFallback` 사용 → ui `DefaultErrorFallback` 으로 교체

### 검증
- 의도적으로 throw하는 임시 컴포넌트로 fallback이 토큰 색상으로 렌더되는지 확인
- edge `npm run dev`, platform `npm run dev` 양쪽에서 정상 마운트

### 추정 시간
**2~3시간**.

---

## B-2. Toast 통합 (RFC + 마이그레이션)

### 사전 상황
- ui: [src/components/feedback/toast.tsx](../../../ingradient-ui/src/components/feedback/toast.tsx) — Context + `useToast(message, opts)` 즉시 호출형. tone(info/success/warning/error/danger), duration 지원. **action 버튼 미지원**, 영구 토스트 미지원, 외부 dispatch 미지원.
- edge: [src/ui/stores/useToastStore.ts](../../../ingradient-edge/src/ui/stores/useToastStore.ts) — Zustand store. kind(info/warn/error/success), action 버튼, durationMs(0=영구) 지원. ToastContainer가 store 구독해서 렌더.
- edge 토스트 사용처 4곳: App.tsx, useImageActions, useCommentActions, AboutTab — 모두 hook/이벤트 핸들러 외부에서 push 필요

### 결정 (요약)
**edge 패턴(Zustand store)을 ui로 흡수한다.** 이유:
1. 외부 dispatch (예: 백엔드 동기화 결과 알림) 가 platform/edge 양쪽에 미래 요구사항으로 남
2. action 버튼, 영구 토스트는 실제 사용 중인 기능
3. ui의 Context 버전은 같은 이름의 hook(`useToast`)를 호출형으로 expose 가능 — store 위에 얇은 wrapper만 있으면 됨

### 작업

#### B-2.1 ui에 toast store + container 추가
- [ingradient-ui/src/components/feedback/toast-store.ts](../../../ingradient-ui/src/components/feedback/toast-store.ts): edge `useToastStore`를 옮겨오되 A-3에서 만든 ui `createStore`를 사용
- [ingradient-ui/src/components/feedback/toast-container.tsx](../../../ingradient-ui/src/components/feedback/toast-container.tsx): edge ToastContainer를 옮겨오되:
  - 색상을 토큰으로 (`var(--ig-color-info)`, `var(--ig-color-warning)`, `var(--ig-color-danger)`, `var(--ig-color-success)`)
  - 기존 `Item` styled에 `alertToneStyles`를 활용하면 더 깔끔
- 기존 `toast.tsx`의 `ToastProvider` / `useToast`는 **deprecated** 처리 (당장 제거 X — 외부 사용이 있을 수 있음, 다음 phase에서 정리)
- 신규 export: `useToastStore`, `ToastContainer`, `Toast` 타입, `ToastKind` 타입

선택적으로 즉시 호출 helper도 제공:
```typescript
// 호출형 wrapper (ui-internal)
export function showToast(toast: Omit<Toast, 'id'>) {
  return useToastStore.getState().addToast(toast)
}
```

#### B-2.2 edge 마이그레이션
- `src/ui/stores/useToastStore.ts` 삭제
- `src/ui/shared/ToastContainer.tsx` 삭제
- 4개 사용처에서 import path를 `from '@ingradient/ui'`로 교체
- `App.tsx` 에서 `<ToastContainer />` 도 ui import로

#### B-2.3 platform 적용
platform은 현재 토스트 사용처 0건. 다음 작업이 진행되는 시점에 `<ToastContainer />` 를 `App.tsx`에 마운트하기만 하면 됨 (옵션). 이번 phase에서는 마운트 안 해도 무방.

### 색상 매핑 표
edge 하드코딩 → ui 토큰:

| 종류 | 기존 | 교체 |
|------|------|------|
| info | `#3b82f6` | `var(--ig-color-info)` |
| warn | `#f59e0b` | `var(--ig-color-warning)` |
| error | `#ef4444` | `var(--ig-color-danger)` |
| success | `#22c55e` | `var(--ig-color-success)` |

토큰 이름이 ingradient-ui와 다르면 [tokens/foundations](../../../ingradient-ui/src/tokens/foundations) 에서 맞춰서 사용.

### 검증
- edge: 카메라 capture 흐름에서 success/error 토스트 정상 출력
- edge: AboutTab 액션 토스트 동작
- platform (선택): App.tsx에 ToastContainer 마운트 후 `useToastStore.getState().addToast({ kind: 'info', message: 'test' })` 임시 호출

### 추정 시간
**4~5시간** (ui 옮기기 + 토큰화 + edge 4곳 마이그레이션 + storybook).

---

## B-3. `DraftNumberInput` 처리 (NumberField에 통합)

### 사전 상황
- edge: [src/ui/shared/DraftNumberInput.tsx](../../../ingradient-edge/src/ui/shared/DraftNumberInput.tsx) — `0` 입력 중 `0.1`이 되기 전 clamp 방지를 위한 draft 문자열 유지
- 내부에서 edge `SetupNumberInput` styled 컴포넌트에 의존 (분리 필요)
- ui 기존: [src/components/inputs/number-field.tsx](../../../ingradient-ui/src/components/inputs/number-field.tsx) — 일반 number input

### 결정
**`NumberField`에 `mode: 'draft'` prop을 추가**한다. 별도 컴포넌트 신설보다 통합이 사용자 학습 부담 적음.

### 작업

#### B-3.1 ui `NumberField` 확장
- 기존 props 그대로 유지
- 추가: `mode?: 'instant' | 'draft'` (기본 `'instant'`)
- 추가: `format?: (v: number) => string`, `parse?: (s: string) => number` (draft 모드에서 사용)
- draft 모드 동작:
  - 내부에 `draft: string | null` state
  - onChange는 draft에만 반영
  - onBlur, Enter 시 commit (parse + clamp + 부모 onChange 호출)
  - ArrowUp/Down은 즉시 commit + arrowStep 적용

NumberField가 200줄 넘어갈 가능성 있음 → draft 로직만 별도 hook (`useDraftNumber`) 으로 분리해서 컴포넌트는 얇게 유지.

#### B-3.2 edge 마이그레이션
- `src/ui/shared/DraftNumberInput.tsx` 삭제
- 사용처 (capture 설정 등) 에서 `<NumberField mode="draft" ... />` 로 교체
- edge `SetupNumberInput` styled 의존성 제거

### 검증
- 카메라 파라미터 입력에서 `0`을 지웠다가 `0.1` 입력 시 중간 상태가 끊기지 않는지 (draft 동작 회귀 없음)
- 화살표 키 증감 동작
- platform 측 NumberField 사용처에 회귀 없는지 (`mode` 기본값이 `'instant'`이므로 변경 없어야 함)

### 추정 시간
**2~3시간**.

---

## B-4. edge LoginScreen 네이티브 checkbox → ui `Checkbox`

### 사전 상황
- [edge: features/auth/LoginScreen.tsx](../../../ingradient-edge/src/ui/features/auth/LoginScreen.tsx) L98, L102 — `<input type="checkbox">` 직접 사용
- ui: `Checkbox` 가 `toggles.tsx`에 export됨 (`@ingradient/ui` 패키지)

### 작업
1. `<input type="checkbox" ... />` 두 곳을 `<Checkbox ... />` 로 교체
2. label은 ui `Checkbox`가 제공하는 패턴에 맞춰 정리
3. 관련 styled 래퍼 (있다면) 정리

### 검증
- 로그인 화면에서 체크박스 동작 (포커스, 클릭, 키보드 토글) 정상
- 시각적으로 ui 디자인 시스템과 일관

### 추정 시간
**30분**.

---

## Phase B 통합 체크리스트

- [ ] ui `ErrorBoundary` + `DefaultErrorFallback` export 추가
- [ ] edge `src/ui/shared/ErrorBoundary.tsx` 삭제, import 교체
- [ ] platform `frontend/app/ErrorFallback.tsx` 삭제, App.tsx import 교체
- [ ] ui `useToastStore`, `ToastContainer`, `Toast` 타입 export 추가
- [ ] edge toast 사본 4개 (store, container, 그리고 4곳 사용처) ui import로 교체
- [ ] ui `NumberField`에 `mode='draft'` 추가
- [ ] edge `DraftNumberInput.tsx` 삭제, 사용처 NumberField로 교체
- [ ] edge LoginScreen 네이티브 checkbox 2개 ui `Checkbox`로 교체
- [ ] 양쪽 typecheck/build 통과
- [ ] storybook에서 새 컴포넌트 정상 표시
- [ ] 수동 테스트: 에러 fallback, 토스트(action 포함), draft 입력, 로그인 체크박스

### 커밋 단위 권장
```
feat(ui): ErrorBoundary + DefaultErrorFallback 추가
refactor(platform,edge): 자체 ErrorBoundary 사본 제거
feat(ui): Toast store + container 추가 (deprecate Context useToast)
refactor(edge): 자체 toast store/container 제거
feat(ui): NumberField에 draft 모드 추가
refactor(edge): DraftNumberInput 제거, NumberField mode=draft 사용
fix(edge): LoginScreen 네이티브 checkbox를 Checkbox 컴포넌트로 교체
```

### 총 추정 시간
**1~2일** (10~14시간).
