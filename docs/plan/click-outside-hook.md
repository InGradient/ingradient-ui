# `useClickOutside` Hook — 신규 추가 plan

작성일: 2026-05-09
요청 origin: ingradient-platform + ingradient-edge 의 styles Phase 3 작업 중 발견
관련:
- [ingradient-platform/docs/plans/frontend_styles_phase3.md](../../../ingradient-platform/docs/plans/frontend_styles_phase3.md)
- [ingradient-edge/docs/plan/frontend_styles_phase3.md](../../../ingradient-edge/docs/plan/frontend_styles_phase3.md)

## 목적

dropdown / popover / context menu 등 floating UI 가 외부 클릭 시 닫히는 패턴이 두 consumer 앱에 12+ 곳 흩어져 있음. ingradient-ui 의 `useClickOutside` hook 으로 통합.

## 현황 — 이미 ui 에 있는 것

`src/hooks/`:
- `useClipboard`
- `useDrawingCanvas`
- `useSelection`
- `useUndoRedo`
- `useZoomPan`

→ `useClickOutside` 없음. 추가 거리.

## 사용처 (양 consumer 통합 시)

### ingradient-edge (4 곳)

```
src/frontend/components/TopBarAccountMenu.tsx:35
src/frontend/components/dataset/DatasetSelectAccountMenu.tsx:34
src/frontend/components/log/LogPanel.tsx:52
src/frontend/components/capture/ImagesView.tsx:137
```

### ingradient-platform (8+ 곳)

```
frontend/features/catalog/use-catalog-viewport.ts:24
frontend/features/catalog/use-catalog-member-search.ts:14
frontend/features/catalog/use-catalog-dataset-menu.ts:25
frontend/features/gallery/use-gallery-image-menu.ts:60
frontend/features/gallery/use-gallery-toolbar-ui.ts:65
frontend/features/dashboard/use-dashboard-page-state.ts:86
frontend/features/dashboard/use-dashboard-page-state.ts:96 (2 위치)
frontend/features/classes/use-class-page-ui-state.ts:32
```

총 **12+ 사용처** — 추출 가치 충분.

## 변형 패턴 (현재)

발견된 변형:
1. **mousedown vs click event** — 일부는 `mousedown` (close before button trigger), 일부는 `click` (after trigger). props 로 받기.
2. **capture phase (third arg `true`)** — 일부 사용. props 로 받기.
3. **enabled/disabled toggle** — 일부 hook 은 dropdown open 일 때만 listener 등록. 본 hook 도 enabled flag 받기.
4. **target ref** — 단일 element. 향후 multiple refs (예: button + menu 둘 다 클릭은 무시) 거리.

## API 제안

```ts
// src/hooks/useClickOutside.ts

import { type RefObject, useEffect } from 'react'

interface UseClickOutsideOptions {
  /** 하나 이상의 element ref. 이 중 어느 하나라도 클릭/터치 영역 안이면 callback 안 부름. */
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[]
  /** 외부 클릭 발생 시 콜백. */
  onClickOutside: () => void
  /** 비활성화 (예: dropdown 닫혀 있을 때). default: true */
  enabled?: boolean
  /** 'click' (default) vs 'mousedown'. dropdown 은 mousedown 가 보통 더 자연. */
  event?: 'click' | 'mousedown'
  /** capture phase 사용 여부. default: false. context-menu 같이 stopPropagation 도달 전에 잡아야 하면 true. */
  capture?: boolean
}

export function useClickOutside({
  refs,
  onClickOutside,
  enabled = true,
  event = 'click',
  capture = false,
}: UseClickOutsideOptions): void {
  useEffect(() => {
    if (!enabled) return
    const refList = Array.isArray(refs) ? refs : [refs]
    const handler = (e: Event) => {
      const target = e.target as Node | null
      if (!target) return
      const inside = refList.some((r) => r.current?.contains(target))
      if (!inside) onClickOutside()
    }
    document.addEventListener(event, handler, capture)
    return () => document.removeEventListener(event, handler, capture)
  }, [refs, onClickOutside, enabled, event, capture])
}
```

## 사용 예시

**Before** (TopBarAccountMenu.tsx):
```tsx
useEffect(() => {
  if (!showAccountMenu) return
  const handler = (e: MouseEvent) => {
    if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
      setShowAccountMenu(false)
    }
  }
  document.addEventListener('click', handler)
  return () => document.removeEventListener('click', handler)
}, [showAccountMenu])
```

**After**:
```tsx
useClickOutside({
  refs: accountMenuRef,
  onClickOutside: () => setShowAccountMenu(false),
  enabled: showAccountMenu,
})
```

## 작업 순서

### Step 1: ingradient-ui PR

1. `src/hooks/useClickOutside.ts` 신설 (위 API)
2. `src/hooks/index.ts` 에 export 추가
3. `src/hooks/useClickOutside.test.ts` 단위 테스트:
   - inside click → callback 안 부름
   - outside click → callback 부름
   - enabled false → listener 등록 안 됨
   - mousedown event 분기
   - 다중 refs (배열)
4. CHANGELOG 추가
5. 새 버전 release (tgz 갱신)

### Step 2: edge consumer PR

- `package.json` 의 `@ingradient/ui` 버전 갱신
- 4 사용처 갱신:
  - TopBarAccountMenu, DatasetSelectAccountMenu (이미 통합 거리 있음 — `<AccountMenu>` 작업 시 함께)
  - LogPanel filter popover
  - ImagesView filter popover

### Step 3: platform consumer PR

- 동일하게 8+ 사용처 갱신
- 일부는 hook 안 hook (use-gallery-toolbar-ui 등) — wrapper hook 안에서 useClickOutside 호출하도록 단순화

## 위험 지점

1. **mousedown vs click 차이** — 기존 코드 분석 후 적절한 default 선택. 잘못 마이그레이션 시 dropdown 동작 변경 (예: close before action).
2. **capture phase 사용처** — 일부 코드가 capture=true 명시. props 로 받아 호환.
3. **stopPropagation 의존** — 일부 dropdown 의 button 자체가 click 받았을 때 toggle 처리. button 클릭이 outside 로 잡히지 않도록 button 도 ref 에 포함 (refs 배열 활용).

## Open Questions

- [ ] **단일 ref vs 다중 refs** — 마이그레이션 시 button + menu 둘 다 ref 에 넣어 button 클릭이 outside 로 잡히지 않도록. 패턴 검토.
- [ ] **`enabled` default value** — `true` (항상 listener) vs caller 가 명시. 위 안에서는 `true` default.
- [ ] **storybook 추가 거리** — Storybook 패턴 외 hook. usage example 만 README 에 거리.

## 영향 추정

- 12+ 사용처 통합 → ~120줄 boilerplate 제거
- 패턴 일관 (mousedown vs click 의도적 선택 + capture 명시)
- 새 dropdown/popover 만들 때 1 hook 호출로 끝
