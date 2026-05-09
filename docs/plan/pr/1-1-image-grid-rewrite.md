---
plan: PR-1.1 — ui ImageGrid 신규 작성 (render slots + 가상화 + 무한스크롤)
date: 2026-05-09
phase: 1 (ImageGrid 통합)
pr id: PR-1.1
parent plan: ../image-grid-unification.md
master plan: ../../MASTER-PLAN.md (§ 9.1 — D-012 plan-first)
governance: ../../governance.md (D-007 + § 4.1 props 설계 + § 4.2 200줄 limit)
estimated: 4-6h
---

# PR-1.1 — ui ImageGrid 신규 작성

## 목표

ui `ImageGrid` 를 신규 API 로 작성. render slots (overlay/footer/topRight) + 가상화 옵션 + 무한스크롤 + 멀티셀렉트 지원. 3 소비자 (platform catalog/classes + edge ImagesView) 모두 cover 가능한 generic 인터페이스.

이 PR 은 **ui 자체 작성만**. 소비자 마이그는 PR-1.3~1.5.

## 왜

- 사용자 stated #1 목표: components/ 최소화. ImageGrid 가 가장 큰 거리 (953줄 + ~150줄 = 1100+ 줄).
- governance D-007: 도메인 무관 + 재사용 가능 — generic shape `{ id }` 받아 caller 가 도메인 정보를 render slot 으로 주입.
- governance § 4.1 render prop > prop drilling: 도메인별 차이 (annotation, sync state, hover preview) 는 props 늘리지 않고 slot 으로.

## 핵심 결정 (사용자 합의 필요)

### D1. 기존 ImageGrid (110줄) 호환 vs 대체

**현황**: 기존 API 는 `getImageSrc + getTitle + getDescription + getMeta + selectedIds + onItemClick`. storybook (118줄) + 메타 카드 표시 use case 만 사용. 실제 페이지 사용 거의 없음.

**옵션**:
- **a (권장)** **대체** — 기존 API 폐기, 신규 API 만 export. storybook 갱신 (사용 패턴 변경). breaking change 명시.
- b. **호환** — 기존 props (`getTitle`, `getMeta`) 유지하면서 신규 props 추가. props 폭발 (12+ 개), 복잡.
- c. **공존** — 기존 `ImageGrid` + 신규 `<MediaGrid>` 같은 새 이름. 중복.

→ **권장 a (대체)**. 이유: 기존 사용처 없음 + governance "ui simple" 정신 + 신규가 단순 use case 도 cover (getMeta 는 renderCellFooter 로 자연 매핑).

### D2. `@tanstack/react-virtual` dep 추가 방식

**현황**: edge 만 이미 dep 보유. ui 에는 없음.

**옵션**:
- a. **bundled dep** (ui dependencies 에 추가) — 소비자 무관, ui import 시 자동 포함. 번들 약간 ↑.
- **b (권장)** **separate file + bundled** — `image-grid.tsx` (가상화 X) + `virtualized-image-grid.tsx` (가상화 O, react-virtual 의존). ui dep 추가하되 가상화 안 쓰는 caller 는 import 시 tree-shake.
- c. **peer dep** — 소비자가 install. 부담.
- d. **virtualization 지원 안 함** — caller 책임. catalog/classes 는 OK 지만 edge needs 미충족.

→ **권장 b**. governance § 4.2 (200줄 limit) + dep isolation + tree-shake 가능.

### D3. 단일 vs split 결정

D2 의 b 채택 시:
- `ImageGrid` (단순 그리드 + render slots + selection + 무한스크롤 sentinel) — ~150줄 예상
- `VirtualizedImageGrid` (TanStack row-based + render slots + selection + 무한스크롤) — ~150줄 예상

→ 둘 다 200줄 미만 가능. 코드 일부 중복 (cell render, selection logic) 은 internal helper (`image-grid-cell.tsx`, `useGridSelection.ts`) 로 추출.

### D4. `renderCellOverlay` — hover 분기

**옵션**:
- **a (권장)** **항상 렌더, caller 의 css 책임** — `renderCellOverlay` 는 항상 호출, caller 가 wrapper 의 `:hover { display: block }` 등으로 분기.
- b. ImageGrid 내부 hover state → `renderCellOverlay({ hovered })` 콜백 인자. props 늘어남.
- c. 별도 prop `renderCellHoverOverlay` — props 폭발.

→ **권장 a**. governance simple 원칙. caller 매번 hover css 작성 부담 있지만 명시적.

### D5. 멀티셀렉트 키 detect 위치

**옵션**:
- **a (권장)** **ImageGrid 내부 detect** — shift/ctrl 키 감지 → `onSelectionChange(action: 'toggle'|'range'|'single', id)` 콜백. caller 는 단순 callback 처리.
- b. caller 가 raw mouseEvent 받아 직접 분류.

→ **권장 a**. ImageGrid 가 selection UX 표준화 (양 repo 의 mouse event 처리 코드 중복 제거).

## 채택 결정 (assistant 권장 종합)

**D1=a, D2=b, D3=split, D4=a, D5=a** — governance simple 원칙 + 200줄 limit + dep isolation + 표준 UX.

## ui API 정의

### `ImageGrid<T>` (단순)

```tsx
// src/components/data-display/image-grid.tsx (~150줄 예상)
interface ImageGridProps<T extends { id: string }> {
  // 필수
  items: T[]
  getThumbnailUrl: (item: T) => string

  // layout
  layout?: { minWidth?: number; columns?: number; gap?: number }

  // 클릭
  onItemClick?: (item: T, event: React.MouseEvent) => void
  onItemDoubleClick?: (item: T, event: React.MouseEvent) => void

  // 멀티셀렉트
  selectedIds?: Set<string>
  onSelectionChange?: (action: 'toggle' | 'range' | 'single', id: string) => void

  // render slots
  renderCellOverlay?: (item: T, index: number) => React.ReactNode
  renderCellFooter?: (item: T, index: number) => React.ReactNode
  renderCellTopRight?: (item: T, index: number) => React.ReactNode

  // 무한스크롤 (sentinel 기반)
  hasMore?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
}
```

→ **props 12개**. governance 권장 5개 초과지만 render slots (3) + 가상화 (3) 는 양 컨슈머 핵심 needs 라 분리 어려움. 5 미만 하드룰 아니라 권장.

### `VirtualizedImageGrid<T>` (가상화)

동일 props (D2b 의 split). 추가 prop:
- `estimatedItemHeight?: number` (TanStack 의존, default 220px)
- `overscan?: number` (default 3)

```tsx
// src/components/data-display/virtualized-image-grid.tsx (~150줄 예상)
```

### internal helpers (split 후 중복 회피)

```
src/components/data-display/image-grid-cell.tsx (~50줄)  — 셀 1개 render (overlay/footer/topRight slot 호출)
src/components/data-display/use-grid-selection.ts (~30줄) — shift/ctrl 키 감지 + action 분류
```

## 변경 파일

### ui 추가/변경

1. **`src/components/data-display/image-grid.tsx`** — 기존 110줄 → 신규 ~150줄 (대체)
2. **`src/components/data-display/virtualized-image-grid.tsx`** — 신규 ~150줄
3. **`src/components/data-display/image-grid-cell.tsx`** — 신규 ~50줄 (internal)
4. **`src/components/data-display/use-grid-selection.ts`** — 신규 ~30줄 (internal)
5. **`src/components/data-display/index.ts`** — `virtualized-image-grid` re-export 추가
6. **`src/components/data-display/image-grid.stories.tsx`** — 기존 118줄, 신규 API 로 재작성 (~120줄)
7. **`package.json`** — `@tanstack/react-virtual` dependency 추가

### 변경 안 함 (이번 PR)

- 소비자 마이그 (PR-1.3, 1.4, 1.5)
- 단위 test (PR-1.2)
- storybook 의 추가 시나리오 (Phase 3 일괄)

## 200줄 위협 / split 사전 결정

D3 에 따라 split 사전 결정 — `VirtualizedImageGrid` 별도 파일.

기준: 각 파일 < 200줄 유지. 만약 신규 작성 시 200 넘으면 internal helper 추가 분리.

## dep 결정 record

`@tanstack/react-virtual` 을 **ui 의 dependencies 에 추가**. peer 가 아니라 bundled.
- 근거: edge 이미 사용 중 (소비자 부담 X), 새 소비자도 ui import 만으로 가상화 가능
- 영향: ui bundle size 약간 ↑ (react-virtual 자체는 작음, ~5KB)
- tree-shake: virtualized-image-grid 는 별도 파일 → import 안 하면 번들에 포함 안 됨

## 검증

1. **ui typecheck** (`npx tsc --noEmit`)
2. **ui build** (`npm run build:package`) — d.ts 생성 + edge sync 위해
3. **기존 storybook 깨짐 확인** — `npm run storybook` (또는 build) — image-grid stories 만 갱신, 다른 stories 영향 X
4. ImageGrid 의 단순 use case (storybook A 스토리) 시각 정상
5. 소비자 typecheck — 본 PR 에서는 안 함 (소비자 마이그 PR-1.3~1.5 에서)

## 위험 / trade-off

- **breaking change**: 기존 ImageGrid 사용처 깨짐. storybook 만 사용 중이라 영향 범위 작음. 소비자 마이그 시점에 새 API 사용.
- **props 12 개**: governance 권장 (5 이하) 어김. 그러나 render slots / 가상화 옵션이 도메인 차이 흡수 위해 필요. props 늘리지 않으면 ImageGrid 가 도메인 의존하게 됨 (governance 위배 더 큼).
- **selection 의 mouse event**: shift+click range 는 마지막 selected id 기억 필요 → 내부 ref 또는 caller 가 prevSelectedId 상태 관리. caller 책임으로 단순화 가능 (이번 PR 에서는 caller 책임 — `onSelectionChange` 의 action='range' 시 caller 가 알아서 range 계산).
- **TanStack row-based 가상화 한계**: column 수가 viewport 따라 동적이면 row-height 계산 복잡. 일단 fixed-column 가정. dynamic 하면 row 가 잘못 계산될 수 있음 — PR-1.5 (edge) 진행 중 확인.

## 후속

- PR-1.2: 단위 test (a11y + selection action + click)
- PR-1.3: platform classes ClassImagesPanel 마이그 (가장 단순)
- PR-1.4: platform catalog virtualized-image-grid 마이그 (큰 거리)
- PR-1.5: edge ImagesView grid 부분 추출 + 마이그
- 시각 검증: 마지막 일괄 (사용자 결정)
