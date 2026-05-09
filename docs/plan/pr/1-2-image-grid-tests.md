---
plan: PR-1.2 — ui ImageGrid + 헬퍼의 단위 test
date: 2026-05-09
phase: 1 (ImageGrid 통합 — 마지막)
pr id: PR-1.2
parent plan: ../image-grid-unification.md
master plan: ../../MASTER-PLAN.md (§ 9.1)
governance: ../../governance.md (§ 4.5 test)
estimated: 1-2h
---

# PR-1.2 — ImageGrid 단위 test (Phase 1 마지막)

## 목표

`<ImageGrid>` + `<VirtualizedImageGrid>` + `classifySelectionAction` 의 핵심 동작을 단위 test 로 잠금. PR-1.3/1.4/1.5 의 실 사용 패턴 본 후 시나리오 정확히 작성 (D-015 정신).

## 왜

- governance § 4.5: 단위 test 는 a11y + render + interaction 거리.
- Phase 1 의 마지막 — ui ImageGrid API 가 PR-1.3~1.5 마이그 후 안정 (큰 변경 안 일어남).
- 향후 PR (Phase 2 ~ 4) 에서 ImageGrid props 변경 시 회귀 잠금.

## 시나리오 (각 컴포넌트별)

### `classifySelectionAction` (use-grid-selection.ts)

가장 단순 — pure 함수.

- single click → `'single'`
- ctrl+click → `'toggle'`
- meta+click → `'toggle'`
- shift+click → `'range'`
- shift+ctrl 동시 → `'range'` (shift 우선)

### `<ImageGrid>` (image-grid.tsx)

- **renders all items** with thumbnails (img src 검증)
- **onItemClick 호출**: cell click 시 `(item, index, event)` 인자
- **selectedIds → selected style**: cell 의 `data-grid-id` 검증, 선택 cell 표시
- **onSelectionChange action**: ctrl+click → 'toggle', shift+click → 'range', single → 'single'
- **render slots**: renderCellOverlay / renderCellFooter / renderCellTopRight 가 cell 안에 render
- **highlightedId scrollIntoView**: jsdom 에서 `scrollIntoView` mock — 매칭 cell 의 호출 검증
- **hasMore + onLoadMore**: IntersectionObserver mock — sentinel 가시 시 onLoadMore 호출 (단순 mock)
- **onDragStart / onContextMenu**: callback 호출 검증
- **onCellMouseEnter / Leave**: callback 호출

### `<VirtualizedImageGrid>` (virtualized-image-grid.tsx)

가상화 자체는 jsdom 에서 dom rect 를 제대로 측정 못 함. 핵심 검증:

- **columns prop**: rowItems 가 columns 만큼 chunk 됨 (현재 render 된 것만)
- **render slots pass-through**: 동일 (renderCellOverlay 등)
- **selection 매핑**: 동일

→ 가상화 동작 자체는 TanStack 의 책임 — ui 안에서 cell render 가 정상 호출되는지만 검증.

## 변경 파일

1. **`src/components/data-display/use-grid-selection.test.ts`** — 신규 (~30줄, pure 함수 5 시나리오)
2. **`src/components/data-display/image-grid.test.tsx`** — 신규 (~120줄)
3. **`src/components/data-display/virtualized-image-grid.test.tsx`** — 신규 (~50줄, 단순)

→ 합계 ~200줄 test 코드.

## 검증

1. `npm run test:unit` 실행 — 새 test 통과
2. ui typecheck 통과
3. 기존 test 깨짐 X

## 위험 / trade-off

- **jsdom 의 가상화 한계**: TanStack `useVirtualizer` 가 jsdom 에서 element rect 0 을 받아 0 row render 가능. 시나리오 단순화 (item 수 적게, 가상화 동작 자체는 검증 안 함).
- **IntersectionObserver mock**: jsdom 에 IntersectionObserver 없음 — vitest 의 `setup` 에서 mock 또는 test 안 inline mock.
- **scrollIntoView**: jsdom 에 없음 — `Element.prototype.scrollIntoView = vi.fn()` mock.

## 후속

- Phase 2 (잔여 audit 거리) 진입 — sub-plan 작성 후 PR-A3 (MenuPopover anchor) 부터.
