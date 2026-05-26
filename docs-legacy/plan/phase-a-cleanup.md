# Phase A — P0 정리 (반나절)

> 목표: ingradient-ui에 이미 있는데 platform/edge가 따로 들고 있는 사본/발산을 제거한다.
> 모든 작업이 **독립적**이라 순서 무관하게 진행 가능.
> 자세한 배경은 [cross-app-sync-2026-05.md](./cross-app-sync-2026-05.md) 참고.

---

## A-1. `useSelection` 사본 삭제 (platform)

### 사전 확인
- ui 정본: [ingradient-ui/src/hooks/useSelection.ts](../../../ingradient-ui/src/hooks/useSelection.ts)
- platform 사본 1: [ingradient-platform/frontend/shared/hooks/useSelection.ts](../../../ingradient-platform/frontend/shared/hooks/useSelection.ts) (54줄, 옛 버전)
- platform 사본 2: [ingradient-platform/frontend/hooks/useSelection.ts](../../../ingradient-platform/frontend/hooks/useSelection.ts) (1줄, re-export)

**검증된 사실**: platform의 실제 소비자는 [features/gallery/hooks/useGalleryGrouping.ts:3](../../../ingradient-platform/frontend/features/gallery/hooks/useGalleryGrouping.ts#L3) 단 1곳이며, 이미 `@ingradient/ui/components`에서 import 중. 따라서 두 사본 파일은 **사용처 없는 dead code**.

`gallery.utils.ts`, `useGalleryImageMenu.ts`에 보이는 `useSelection`은 hook이 아니라 `ImageMenuAnchor` 타입의 boolean 프로퍼티 이름이므로 무관.

### 작업
1. `frontend/hooks/useSelection.ts` 삭제
2. `frontend/shared/hooks/useSelection.ts` 삭제
3. `frontend/hooks/` 디렉토리에 다른 파일이 있는지 확인 — `useNotices.ts`, `useOrgRole.ts`는 유지
4. `frontend/shared/hooks/` 디렉토리에 다른 파일이 있는지 확인 — 없으면 빈 디렉토리도 정리

### 검증
- `npm run typecheck` (또는 `tsc --noEmit`) 통과
- `npm run build` 통과
- 갤러리 화면에서 다중 선택(클릭, Shift+클릭, Cmd+클릭) 동작 확인

### 롤백
git revert. 사본 파일 복원하면 끝.

### 추정 시간
**15분** (삭제 + 검증).

---

## A-2. `useZoomPan` 사본 삭제 (edge)

### 사전 확인
- ui 정본: [ingradient-ui/src/hooks/useZoomPan.ts](../../../ingradient-ui/src/hooks/useZoomPan.ts) (옵션 인자 지원)
- edge 사본: [ingradient-edge/src/ui/hooks/useZoomPan.ts](../../../ingradient-edge/src/ui/hooks/useZoomPan.ts) (옵션 미지원)

**검증된 사실**: `grep useZoomPan` 결과 edge 코드베이스 내 사용처 0건. 정의만 있고 호출 없음 → **dead code**.

### 작업
1. `src/ui/hooks/useZoomPan.ts` 삭제
2. `src/ui/hooks/` 폴더에 hook index 파일이 있다면 export 정리

### 검증
- `npm run typecheck`
- `npm run build:web` (있다면)
- Electron `npm run dev` 띄워서 capture/labeling 화면 zoom/pan 정상 동작 확인 (리스크는 낮음 — 사용처가 없으니 회귀할 것도 없음)

### 추정 시간
**10분**.

---

## A-3. `createStore` ui로 승격 — **차단 (2026-05-07)**

### 차단 사유: zustand 메이저 버전 불일치
- platform/frontend `zustand@^4.5.7` (실제 4.5.7 설치)
- platform 루트(server) `zustand@^5.0.12`
- edge `zustand@^5.0.11`

ui의 `createStore`가 빌드 시점에 임의 한 버전의 zustand 타입에 종속되면, 다른 메이저 버전을 쓰는 소비자에서 .d.ts 타입 불일치 또는 미묘한 런타임 회귀가 발생할 수 있음. zustand는 v4 → v5에서 import shape, hook 분리 등 breaking change 있음.

### 사전 작업 필요 (별도 결정/PR)
1. platform/frontend를 zustand v5로 업그레이드 (수 시간, store 4개 + useShallow 사용처 점검 필요)
2. 양쪽 합의되면 ui에 `zustand`를 peerDependency로 선언 후 createStore 추가

### 차단 풀린 후 작업 (참고용)
- platform 사본: [ingradient-platform/frontend/shared/utils/createStore.ts](../../../ingradient-platform/frontend/shared/utils/createStore.ts)
  - dev 검사: `process.env.NODE_ENV === 'development'`
  - 소비자 4곳: `store/useClassStore.ts`, `useProjectStore.ts`, `useAuthStore.ts`, `useSettingsStore.ts`
- edge 사본: [ingradient-edge/src/ui/stores/createStore.ts](../../../ingradient-edge/src/ui/stores/createStore.ts)
  - dev 검사: `import.meta.env.DEV`
  - 소비자 11곳: edge `src/ui/stores/` 내 11개 store

### 작업

#### A-3.1 ui에 `createStore` 추가
새 파일 [ingradient-ui/src/utils/create-store.ts](../../../ingradient-ui/src/utils/create-store.ts) 생성:

```typescript
import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

// Both webpack/CRA (process.env) and Vite (import.meta.env) projects need to detect dev mode.
// Try import.meta.env.DEV first (Vite), fall back to process.env.NODE_ENV (Node-shaped envs).
function isDevMode(): boolean {
  // @ts-expect-error import.meta.env is Vite-specific
  if (typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined') {
    // @ts-expect-error
    return Boolean(import.meta.env.DEV)
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development'
  }
  return false
}

export function createStore<T>(
  name: string,
  initializer: StateCreator<T, [['zustand/devtools', never]]>,
) {
  if (isDevMode()) {
    return create<T>()(devtools(initializer, { name }))
  }
  return create<T>()(initializer as StateCreator<T>)
}
```

- `src/utils/index.ts`에 `export * from './create-store'` 추가 (없으면 새로 생성)
- `src/index.ts`에 `export * from './utils'` 추가

> **주의**: `zustand`는 ingradient-ui의 dependency가 되어야 함. 현재 peer로 두는 게 좋을지 확인 필요. 양쪽 소비자가 모두 zustand를 갖고 있으므로 peerDependency 권장.

#### A-3.2 platform 마이그레이션
- 4개 store 파일에서 `from '../shared/utils/createStore'` → `from '@ingradient/ui'`
- `frontend/shared/utils/createStore.ts` 삭제

#### A-3.3 edge 마이그레이션
- 11개 store 파일에서 `from './createStore'` → `from '@ingradient/ui'`
- `src/ui/stores/createStore.ts` 삭제

### 검증
- platform: `npm run typecheck`, `npm run dev`로 store 동작 확인 (Redux DevTools에서 store 이름 보이는지)
- edge: 동일하게 typecheck + Electron 띄워서 동작 확인

### 롤백
zustand peer 추가가 깨지면 `dependencies`로 옮겨도 됨. 마이그레이션 자체는 git revert로 충분.

### 추정 시간
**1~1.5시간** (ui에 추가 + 빌드 + tgz 재생성 + 양쪽 마이그레이션).

> **빌드 주기 메모**: ingradient-ui 변경 후 양쪽 프로젝트가 `ingradient-ui-0.0.1.tgz`를 참조 중이라면 ui에서 `npm run build && npm pack` → 양쪽에서 `npm install ../ingradient-ui/ingradient-ui-0.0.1.tgz` 재실행 필요. 워크스페이스/심볼릭 링크라면 자동 반영.

---

## A-4. `logger` ui로 승격

### 사전 확인
- platform 사본: [ingradient-platform/frontend/shared/utils/logger.ts](../../../ingradient-platform/frontend/shared/utils/logger.ts)
- 소비자 2곳:
  - `frontend/api/detection.ts:2`
  - `frontend/features/gallery/image-detail-modal.tsx:12`
- edge ui 영역에는 logger 사용처 없음 (electron main의 `electron/shared/logger.ts`는 별개로 유지)

### 작업

#### A-4.1 ui에 `logger` 추가
새 파일 [ingradient-ui/src/utils/logger.ts](../../../ingradient-ui/src/utils/logger.ts) 생성:

```typescript
function isDevMode(): boolean {
  // @ts-expect-error
  if (typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined') {
    // @ts-expect-error
    return Boolean(import.meta.env.DEV)
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development'
  }
  return false
}

const noop = (..._args: unknown[]) => {}
const dev = isDevMode()

export const logger = {
  debug: dev ? console.debug.bind(console) : noop,
  log: dev ? console.log.bind(console) : noop,
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
}
```

- `src/utils/index.ts`에 `export * from './logger'` 추가

#### A-4.2 platform 마이그레이션
- `frontend/api/detection.ts:2` → `from '@ingradient/ui'`
- `frontend/features/gallery/image-detail-modal.tsx:12` → `from '@ingradient/ui'`
- `frontend/shared/utils/logger.ts` 삭제

#### A-4.3 edge는 변경 없음
edge ui 코드는 logger를 안 쓰므로 이번 phase에서는 건드리지 않음. 추후 필요 시 ui logger import.

### 검증
- platform `npm run typecheck`, `npm run dev`
- 콘솔에 `logger.debug` 호출이 dev에서만 보이는지 빠르게 확인

### 추정 시간
**30분**.

---

## Phase A 통합 체크리스트

작업 종료 시 다음이 모두 참이어야 한다:

- [ ] platform `frontend/hooks/useSelection.ts` 부재
- [ ] platform `frontend/shared/hooks/useSelection.ts` 부재
- [ ] edge `src/ui/hooks/useZoomPan.ts` 부재
- [ ] platform `frontend/shared/utils/createStore.ts` 부재
- [ ] edge `src/ui/stores/createStore.ts` 부재
- [ ] platform `frontend/shared/utils/logger.ts` 부재
- [ ] ui에 `createStore`, `logger` export 추가됨
- [ ] platform `npm run typecheck` 통과
- [ ] edge `npm run typecheck` 통과
- [ ] platform `npm run build` 통과
- [ ] edge `npm run build` 통과
- [ ] platform: 갤러리 다중 선택, store 동작 (특히 settings/auth) 수동 확인
- [ ] edge: zoom/pan, toast/store 기반 동작 수동 확인

### 커밋 단위 권장
4개 항목을 각각 별도 커밋으로 분리. 회귀 시 bisect 용이.

```
refactor(platform): useSelection 중복 사본 삭제
refactor(edge): 사용 안 하는 useZoomPan 사본 삭제
refactor(ui): createStore 유틸 추가 및 platform/edge 마이그레이션
refactor(ui): logger 유틸 추가 및 platform 마이그레이션
```

### 총 추정 시간
**약 2.5~3시간** (작업 + 빌드/재설치 + 수동 검증).
