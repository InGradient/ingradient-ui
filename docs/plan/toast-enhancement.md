---
plan: ingradient-ui Toast enhancement (action + persistent + close button)
date: 2026-05-09
related:
  - ../../../ingradient-edge/docs/plan/toast-migration.md (소비자: 마이그레이션 후속)
  - ./click-outside-hook.md (같은 시리즈 cross-app sync)
---

# ingradient-ui Toast Enhancement

## 배경

`@ingradient/ui` 의 `useToast`/`ToastProvider` (`src/components/feedback/toast.tsx`) 가 platform 에서 정상 사용 중. 그러나 edge 가 동일 기능을 자체 재구현 (`src/frontend/shared/ToastContainer.tsx` + `store/useToastStore.ts`, 9 파일 사용처) — ui 의 Toast 를 쓰지 못한 이유는 **ui Toast 에 일부 기능이 없기 때문**.

Cross-app sync 의 일환으로 ui Toast 에 부족한 기능을 추가, edge 마이그레이션 가능하도록 만든다.

## 현재 ui Toast API

```ts
type ToastTone = 'info' | 'success' | 'warning' | 'danger'

const toast = useToast()
toast(message, { tone, duration })
```

특징:
- 함수 시그니처 `(message, opts)` — 단순
- tone tokens (`alertToneStyles`) 기반 스타일
- `duration` ms 후 auto-dismiss (default 4000ms)
- 클릭 시 dismiss
- 별도 close button **없음**
- action button **없음**

## edge 의 자체 Toast 가 사용하는 추가 기능

조사 결과 (`grep -rn "addToast" edge/src/frontend`):

### 기능 1: action button (사용처 2 곳)

`edge/src/frontend/app/App.tsx:361, :374` — disk space 부족/위험 토스트:
```ts
addToast({
  kind: 'warn',
  message: `저장 공간이 부족합니다 (잔여 ${Math.round(data.availableMb)} MB)`,
  durationMs: 0,
  action: { label: '정리하기', onClick: () => useSystemStatsStore.getState().openModal('cleanup') },
});
```

→ user-actionable toast 패턴 (e.g. "정리하기", "Undo", "Retry"). UX 상 가치 있음.

### 기능 2: persistent toast (durationMs: 0 = never)

사용처 3 곳:
- `App.tsx:162` — license fingerprint mismatch (`durationMs: 0`)
- `App.tsx:361, :374` — disk space (`durationMs: 0`, action 함께)

ui Toast 는 `duration: 0` 을 주면 `setTimeout(0)` → 즉시 dismiss (의도와 반대).

→ persistent flag 또는 `duration: 0` 의 명시적 "never" 처리 필요.

### 기능 3: 명시적 close button (×)

edge 는 모든 toast 에 우측 × 버튼. ui 는 click-anywhere-to-dismiss.

→ 우선순위 낮음. action button + persistent 와 함께 dismiss 옵션이 명확해야 close button 도 함께 도입할 가치.

### 기능 4: addToast 가 id 반환 (사용처 0 곳)

edge `addToast` 는 id string 반환 — programmatic dismiss 용도지만 grep 결과 실제 사용처 없음. **마이그레이션 시 무시 가능**.

## 설계 — ui Toast API 확장

기존 함수 시그니처 유지하되 옵션 확장:

```ts
type ToastTone = 'info' | 'success' | 'warning' | 'danger'

interface ToastOptions {
  tone?: ToastTone
  duration?: number      // ms. default 4000. 0 또는 Infinity → never auto-dismiss
  action?: {             // 신규
    label: string
    onClick: () => void  // dismiss 자동 호출
  }
  // dismissible?: boolean — 모든 toast 에 close button 표시 (default true). 기존 click-to-dismiss 와 호환.
}

const toast = useToast()
toast(message, { tone: 'warning', duration: 0, action: { label: '정리하기', onClick: ... } })
```

### 변경점

1. `duration: 0` → `setTimeout` skip (persistent). `durationMs: 0` (edge) 와 의미 일치.
2. `action?: { label, onClick }` — 토스트 우측에 action 버튼 렌더. 클릭 시 onClick → 자동 dismiss.
3. close button (×) — 항상 표시 (default), 토스트 어디든 클릭하지 않아도 명시적으로 닫기 가능.
4. tone 매핑 표 (edge → ui):
   - `info` → `info`
   - `success` → `success`
   - `warn` → `warning`
   - `error` → `danger`

### 비파괴 변경

- 기존 platform 사용처 (`StorageAnalyticsTab`, `WorkOptionsTab`) 는 그대로 동작.
- 기본 동작 (toast click 시 dismiss) 유지.
- `duration: 0` 만 의미 변경 (이전: 즉시 dismiss / 이후: never) — platform 사용처는 0 을 안 쓰므로 영향 없음.

## 작업 단위

PR 1 (ui): Toast 확장
- `src/components/feedback/toast.tsx` 수정:
  - `ToastItem` 인터페이스에 `action`, `persistent` 추가
  - `ToastEntry`: `duration <= 0` 또는 `Infinity` 면 timer skip
  - `ToastEntry`: action prop 있으면 button 렌더, 클릭 시 onClick + dismiss
  - close button (×) 추가
- `toast.stories.tsx` 에 action/persistent 시나리오 추가
- `toast.test.tsx` 추가/갱신
- `package.json` version bump
- `bun run build && bun run pack` → tarball

PR 2 (edge): 새 ui 버전으로 마이그레이션 — 별도 plan: [ingradient-edge/docs/plan/toast-migration.md](../../../ingradient-edge/docs/plan/toast-migration.md)

## 영향 범위

- platform: zero impact (기능 추가만)
- edge: 마이그레이션 후 `shared/ToastContainer.tsx` + `store/useToastStore.ts` 삭제 가능 (~140 줄 + 30 줄)

## Open Questions

- [ ] close button 을 항상 표시 vs `dismissible?: boolean` opt-in — 디자이너 합의
- [ ] action button 스타일 — tone 별 색상 vs 단일 neutral. (edge 는 단일 neutral)
- [ ] platform 의 기존 사용처 (`StorageAnalyticsTab` 등) 가 close button 추가로 시각 변화 — 회귀 검증 필요
