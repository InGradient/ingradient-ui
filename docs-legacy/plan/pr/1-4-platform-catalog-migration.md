---
plan: PR-1.4 — platform catalog virtualized-image-grid 를 ui ImageGrid 로 마이그
date: 2026-05-09
phase: 1 (ImageGrid 통합)
pr id: PR-1.4
parent plan: ../image-grid-unification.md
master plan: ../../MASTER-PLAN.md (§ 9.1 — D-012)
governance: ../../governance.md
estimated: 4-6h (가장 큰 거리)
---

# PR-1.4 — platform catalog virtualized-image-grid 마이그

## 목표

`platform/frontend/components/gallery/grid/` 의 4 파일 (553줄 + cell-parts 129줄 = 약 664줄) 을 ui `<ImageGrid>` 로 교체. 도메인 거리 (hover preview, archive, processing spinner) 는 render slot + caller 컴포넌트로 분리.

## 왜

- 이번 Phase 1 의 가장 큰 효과 (553+ 줄 감소).
- 사용자 stated #1 목표 (소비자 components 최소화).
- PR-1.3 의 API 검증 — catalog 의 더 복잡한 use case (가상화 X 이지만 hover preview + group stack + drag/drop + archive 등) 가 ui API 적합한지 검증.

## audit (2026-05-09)

### 현재 4 파일

| 파일 | 줄수 | 역할 |
|---|---|---|
| `virtualized-image-grid.tsx` | 155 | wrapper (sentinel, hover preview, scrollIntoView, click 분류) |
| `virtualized-image-cell.tsx` | 168 | cell (stack 레이아웃 + thumbnail + checkbox + overlay slots + processing + archive) |
| `virtualized-grid.styles.tsx` | 101 | styled (Grid, Cell, Sentinel, LoadMoreRow, HoverPreview*) |
| `virtualized-grid.styles.cell-parts.tsx` | 129 | styled (CellInner, CellHoverOverlay, CellOverlayLeft/Right, CellPersistentTopRight, StackLayer, etc) |
| **합계** | **553** | (cell-parts 포함 시 553+129 = 682) |

### 도메인 거리 (caller Body.tsx 가 주는 거)

- `thumbOverrideMap` (bbox thumbnail 오버라이드)
- `groupCount(item)` (그룹 stack 표현)
- `selectedIds` + `onSelectionChange (action, id, rangeStartId)` — range start id 받음 (anchor)
- `lastSelectedIndexRef` (mutable ref — caller 가 anchor index 추적)
- `highlightedImageId` (스크롤 위치 자동 이동)
- `alwaysShowOverlay` (선택 시 hover overlay 항상 표시)
- `processingIds: Set<string>` (processing spinner 오버레이)
- `singleClickToEdit` (편집 모드 진입)
- `enableHoverPreview` (마우스 over 시 큰 thumbnail floating)
- `renderCellOverlay` (kebab menu)
- `renderCellPersistentTopRight` (sync state + group count badge)
- `onCellContextMenu` (우클릭 메뉴)
- `onCellDragStart` (drag-to-dataset)
- `showFilenameBelow` (caption)

## 결정 옵션 (사용자 합의 필요)

### D1. stack 시각 (group count > 1 시 카드 겹친 모양)

**현황**: catalog 만 사용. cell 의 outer wrapper 안에서 5개 layer 카드 겹친 시각 (`StackLayer / StackWrap / StackSizer`). 그룹 representative 표시.

- **옵션 A (권장)** — 버림. group count badge 만 (classes 와 동일 시각). 시각 변화 큼.
  - 장점: D-013 (시각 통일) 일관, ui simple, 코드 가장 단순
  - 단점: 그룹 represent 의 시각 hint 약화 (badge count 만)
- 옵션 B — caller `renderCellOverlay` 안에서 box-shadow 로 stack 시각 흉내. caller +30줄.
- 옵션 C — ui ImageGrid 에 `renderCellMedia` slot 추가, caller 가 cell media 자체 override. props 폭증 + 모델 복잡.

→ **권장 A**. 시각 검증 후 stack 시각 강하게 의도하면 후속 PR (옵션 B 추가).

### D2. hover preview (마우스 over 시 큰 thumbnail floating)

**현황**: cell mouse enter → preview state → floating `<HoverPreviewWrap>` 위치+크기 계산해 render.

- **옵션 A (권장)** — ui 에 `onCellMouseEnter` + `onCellMouseLeave` callback prop 추가. caller (catalog) 가 preview state 별도 관리.
- 옵션 B — caller 가 grid container 에 mouseOver delegation. data-id detect. 어려움.
- 옵션 C — hover preview 도 ui 가 받음. domain (image src) 모르므로 어려움.

→ **권장 A**. 작은 prop 추가, edge 도 미래 사용 가능. ui simple 정신 유지.

### D3. `highlightedImageId` scrollIntoView

**현황**: caller 가 highlighted id 주면 ImageGrid 가 자동 스크롤.

- **옵션 A (권장)** — ui 에 `highlightedId?: string` prop 추가. 매칭 cell 자동 scrollIntoView.
- 옵션 B — caller 가 ref + querySelector. 어려움 (ui dom 알아야).

→ **권장 A**. 도메인 무관 거리.

### D4. `alwaysShowOverlay` + selection-aware hover

**현황**: 선택된 cell 있을 때 모든 cell 의 hover overlay 항상 표시 (멀티셀렉트 UX).

- **옵션 A (권장)** — ui 안 받음. caller 가 `renderCellOverlay` 안에서 `selectedIds.size > 0` 시 inline style `visibility: visible` 처리. 또는 caller 가 wrapper className 으로 css 분기.
- 옵션 B — ui 에 `forceShowOverlay?: boolean` prop. props 추가.

→ **권장 A**. caller css 책임 (D4 PR-1.1 결정 일관).

### D5. archive overlay + processing spinner

도메인 — caller renderCellOverlay 안에서.

```tsx
renderCellOverlay={(item) => (
  <>
    {item.archived && <ArchivedOverlay />}
    {processingIds.has(item.id) && <ProcessingSpinner />}
    {/* checkbox + kebab + sync 등 */}
  </>
)}
```

### D6. selection range anchor (rangeStartId)

**현황**: caller 의 `lastSelectedIndexRef` mutable ref. ImageGrid 안에서 prev index 추적 후 range 시 onSelectionChange 의 3 번째 arg 로 rangeStartId 전달.

- **옵션 A (권장)** — caller wrapper. onSelectionChange `(action, id, index)` (PR-1.3 시그니처) 받고 caller 가 anchor 직접 추적.
  ```tsx
  onSelectionChange={(action, id, index) => {
    const rangeStartId = action === 'range' && anchorRef.current != null ? items[anchorRef.current]?.id : undefined
    anchorRef.current = index
    origHandler(action, id, rangeStartId)
  }}
  ```
- 옵션 B — ui 가 anchor 자체 추적 + `(action, id, rangeStartId)` 시그니처. ui state 추가.

→ **권장 A**. caller 책임 (PR-1.1 D5 결정 일관).

### D7. catalog 가상화 사용 여부

**현황**: catalog 는 sentinel 기반 (가상화 X). 큰 list 가능성 있으나 현재 OK.

- **옵션 A (권장)** — `<ImageGrid>` (단순, sentinel) 사용. 현 동작 유지.
- 옵션 B — `<VirtualizedImageGrid>` 로 업그레이드. 큰 list 성능 ↑. 그러나 row-based fixed column 한계.

→ **권장 A**. 현 catalog list 가상화 needs 명확하지 않음.

## ui API 확장 (PR-1.4 자연 보완 — D-015 정신)

이번 PR 진행 중 추가:
- `onCellMouseEnter?: (item: T, index: number, event: React.MouseEvent) => void`
- `onCellMouseLeave?: (item: T, index: number) => void`
- `highlightedId?: string` (auto scrollIntoView)

3 파일 (image-grid + image-grid-cell + virtualized-image-grid) props pass.

## 변경 파일

### ui (API 확장)

1. `src/components/data-display/image-grid-cell.tsx` — onCellMouseEnter/Leave 추가, highlightedId 시 scrollIntoView
2. `src/components/data-display/image-grid.tsx` — props pass
3. `src/components/data-display/virtualized-image-grid.tsx` — props pass

### platform 신규 / 변경

4. **`frontend/components/gallery/CatalogImageGrid.tsx`** — 신규 (~120줄). Body.tsx 에서 분리한 catalog grid + 도메인 캡슐화 (selection anchor + hover preview + overlay assembly).
5. **`frontend/components/gallery/HoverPreview.tsx`** — 신규 (~50줄). use-hover-preview.ts 그대로 활용 + floating div.
6. **`frontend/components/gallery/Body.tsx`** — `<VirtualizedImageGrid>` → `<CatalogImageGrid>` 호출 변경 (~10줄 변경)

### platform 제거

7. **`frontend/components/gallery/grid/virtualized-image-grid.tsx`** — 155줄 제거
8. **`frontend/components/gallery/grid/virtualized-image-cell.tsx`** — 168줄 제거
9. **`frontend/components/gallery/grid/virtualized-grid.styles.tsx`** — 101줄 제거 (HoverPreviewImg / HoverPreviewWrap 만 HoverPreview.tsx 로 이동)
10. **`frontend/components/gallery/grid/virtualized-grid.styles.cell-parts.tsx`** — 129줄 제거

### 변경 안 함

- `images-table.tsx` (table view, 다른 거리)
- `ArchivedOverlay.tsx` (도메인 컴포넌트, 그대로 유지)
- `use-hover-preview.ts` (hook, HoverPreview 안에서 사용)
- 기타 catalog domain 컴포넌트 (CellTopRightBadges, ImageOptionBtn, GroupCountCircle, SyncStateChip 등 — 그대로 유지, renderCell* slot 안에서 사용)

## 시각 변화 양상

- **stack 시각 사라짐** (D1 옵션 A) — 그룹 representative 가 단일 카드 + group count badge 만
- **hover overlay 표시 timing**: 이전 alwaysShowOverlay → caller css 책임 (선택 시 시각 약간 다를 수 있음)
- **cell 모양**: catalog 의 styled cell → ui ImageGridCell (radius / shadow / border 약간 다름, D-013 일관)

## 줄수 효과

| 항목 | 변경 |
|---|---|
| 4 파일 제거 | -553 (cell-parts 포함 시 -682) |
| Body.tsx | ~10줄 변경 (props 갱신) |
| CatalogImageGrid 신규 | +120 |
| HoverPreview 신규 | +50 |
| **순감소** | **약 -383줄** (cell-parts 포함 시 -512) |

## 위험 / trade-off

- **stack 시각 손실** — D-013 정신 따라 수용. 사용자 시각 검증 후 의도 강하면 후속 PR.
- **PR scope 자연 확장 (D-015 정신)** — ui API 3 prop 추가. 본 PR 에서 작은 보완.
- **alwaysShowOverlay 의 multi-select UX** — caller css 책임으로 시각 약간 변할 수 있음. 시각 검증 후 조정.
- **scrollIntoView 의 Element 타입** — TanStack VirtualizedImageGrid 와 호환 — virtualized 시 cell 이 dom 에 없을 수도. caller 가 highlightedId 사용 시 가상화 X 권장 (catalog 는 가상화 X 라 OK).

## 검증

1. ui typecheck + build (API 확장)
2. platform typecheck — symlink 즉시 반영
3. edge typecheck — 본 PR 영향 X 인지 확인
4. 시각 검증: 마지막 일괄 (사용자 결정)

## 후속

- PR-1.5: edge ImagesView grid 부분 추출 + 마이그
- PR-1.2: 단위 test (Phase 1 마지막)
- 후속 거리: stack 시각 / hover preview UX 미세 조정 (필요 시)
