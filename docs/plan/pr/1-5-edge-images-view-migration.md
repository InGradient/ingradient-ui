---
plan: PR-1.5 — edge ImagesView grid 부분을 ui VirtualizedImageGrid 로 마이그
date: 2026-05-09
phase: 1 (ImageGrid 통합)
pr id: PR-1.5
parent plan: ../image-grid-unification.md
master plan: ../../MASTER-PLAN.md (§ 9.1 — D-012)
governance: ../../governance.md
estimated: 3-4h
---

# PR-1.5 — edge ImagesView grid 부분 마이그

## 목표

`edge/src/frontend/components/capture/ImagesView.tsx` (1442줄) 의 grid render 부분 (line 1118-1204, ~90줄) + `ThumbWithBbox` (line 1391-1442, ~50줄) + 가상화 logic + 도메인 cell parts → ui `<VirtualizedImageGrid>` + 도메인 컴포넌트로 분리.

## 왜

- ImagesView 1442줄 → ~1280줄 (~10% 감소). 사용자 stated "edge ImagesView ~1300 목표" (master plan § 7).
- TanStack `react-virtual` 의 첫 production 사용 (PR-1.1 의 `VirtualizedImageGrid` 검증).
- catalog (PR-1.4) 와 동일 패턴 — render slots + caller 도메인 컴포넌트.

## audit (2026-05-09)

### grid 부분 (line 1118-1204, ~90줄)

```tsx
<ImagesContainer ref={containerRef}>
  <VirtualScrollTrack $height={rowVirtualizer.getTotalSize()}>
    {virtualItems.map((virtualRow) => {
      const rowItems = virtualRows[virtualRow.index] ?? [];
      return (
        <VirtualGridRow ref={rowVirtualizer.measureElement} $top={virtualRow.start} $columns={columns}>
          {rowItems.map((img) => {
            // ... groupSize, sequenceGroupSize, isItemSelected, isProcessing, syncIcon* 계산
            return (
              <ImageCell $selected={isItemSelected} onClick={...}>
                <ImageCellCheckbox $visible={isItemSelected} />     {/* 선택 시 visible */}
                <ThumbWithBbox src={...} bboxes={...} classes={...} />  {/* 도메인 */}
                {badgeCount > 1 && <GroupBadgeWrap>...{badgeCount}</GroupBadgeWrap>}  {/* 그룹 */}
                {(isProcessing || sync) && <SyncStateIcon ... />}  {/* sync 상태 */}
                <ImageLabel>{img.label}</ImageLabel>  {/* filename */}
              </ImageCell>
            );
          })}
        </VirtualGridRow>
      );
    })}
  </VirtualScrollTrack>
</ImagesContainer>
```

### 도메인 거리

- `ThumbWithBbox` (50줄) — img + bbox SVG overlay + cover-resize 보정 (img naturalAspect 추적, viewBox 계산)
- `SyncStateIcon` — sync state badge (uploading/local_only/upload_failed)
- `GroupBadgeWrap` (count + delete button) — group representative
- `ImageCellCheckbox` — selected 시 visible
- `ImageLabel` — filename caption

### 가상화

- `useVirtualizer` ({ count: virtualRows.length, getScrollElement: containerRef, estimateSize, overscan }) — row-based
- `columns = floor((width + GAP) / (CELL_MIN + GAP))` — dynamic resize 따라 계산
- 무한스크롤: `lastVirtualIndex >= virtualRows.length - 3` 시 `loadMore()` 호출 (PR-1.1 의 VirtualizedImageGrid 와 동일)

### selection 동작

- `handleImageCellClick` — 그룹 aware (groupMembers 모두 selectedIds 갱신). shift/ctrl/single.
- `handleImageSelectionClick` — checkbox 클릭 시 (event.stopPropagation 후 별도 처리)

## 결정 옵션

### D1. `ThumbWithBbox` 의 cover-resize 보정 (img naturalAspect 추적)

**현황**: 각 cell 에 useRef + useState 로 imgEl ref + `aspectRatio` 추적. img onLoad 시 viewBox 계산.

- **옵션 A (권장)** — PR-1.3 일관. server meta `width/height` 만 사용. 셀 단위 useState 폐기. cover-resize 보정 약간 부정확 가능.
- 옵션 B — caller 가 cell wrapper 컴포넌트로 자체 useState. 큰 list 시 비효율 + render slot 모델 안 맞음.
- 옵션 C — ui Cell 의 onImageLoad callback prop 추가. PR-1.3 D2 결정과 충돌.

→ **권장 A**. server meta 신뢰 — bbox 위치 시각 검증 후 의도 강하면 후속.

### D2. ImageCellCheckbox UX

**현황**: ImageCellCheckbox 가 selected 시 visible (catalog 와 동일).

- **옵션 A (권장)** — checkbox 없음, cell selected border 만. catalog 의 PR-1.4 결정 일관 (D-013 simple).
- 옵션 B — caller renderCellOverlay 에서 checkbox + visibility 분기.

→ **권장 A**. UX 약간 변화 (선택 시 border 만, checkbox 사라짐).

### D3. Group selection (group members 모두 toggle)

caller wrapper — `onSelectionChange(action, id, _index)` 받고 group members 의 모든 id 처리.

```tsx
const handleSelectionChange = (action, id, _index) => {
  const members = getDisplayedGroupMembers(itemById.get(id))
  // toggle/range/single 로직 — caller 의 기존 handleImageCellClick logic 재활용
  applyToAll(action, members.map(m => m.id))
}
```

### D4. 가상화 columns

`columns` 변수가 dynamic. caller 가 매 render 마다 prop 으로 전달:
```tsx
<VirtualizedImageGrid columns={columns} ... />
```

ui VirtualizedImageGrid 는 `columns` prop (default 4) 받음 (PR-1.1). re-render 시 column 수 변경 OK.

### D5. ImagesContainer (containerRef)

ui VirtualizedImageGrid 가 자체 scroll container 만듬. caller 의 `ImagesContainer` (containerRef) 는 layout wrapper 만 — overflow 처리는 ui 안에서.

→ caller 의 ImagesContainer 는 `<VirtualizedImageGrid>` 의 wrapper 로 유지 (border, padding 등 outer chrome).

### D6. EdgeImagesGrid 별도 컴포넌트

PR-1.4 의 `CatalogImageGrid` 와 동일 패턴 — `EdgeImagesGrid.tsx` 신규 (~150줄). ImagesView 에서 호출.

## 변경 파일

### edge 신규

1. **`src/frontend/components/capture/EdgeImagesGrid.tsx`** — 신규 (~150줄). VirtualizedImageGrid 호출 + 도메인 캡슐화 (selection wrapper, render slots).
2. **`src/frontend/components/capture/BboxOverlay.tsx`** — 신규 (~30줄). `ThumbWithBbox` 의 SVG overlay 부분만 추출 (img 자체는 ui Cell 사용). server meta 기반 cover-resize 보정.

### edge 변경

3. **`ImagesView.tsx`** — 1442줄 → ~1280-1300줄. grid render block (line 1118-1204) + `ThumbWithBbox` (line 1391-1442) → `<EdgeImagesGrid>` 호출 (~10줄)
4. **`ImagesView.styles.ts`** — `VirtualScrollTrack`, `VirtualGridRow`, `ImageCell`, `ImageCellCheckbox`, `ImageThumbWrap`, `ImageLabel` 제거 (~30줄). `BBoxOverlaySvg`, `GroupBadge`, `GroupBadgeWrap`, `GroupDeleteBtn`, `SyncStateIcon` 은 유지 (BboxOverlay/EdgeImagesGrid 에서 import).

### 변경 안 함

- modal bbox edit (line 600-1000 영역)
- date 필터 (ImagesFilter*)
- selection toolbar (export, delete)
- sync progress listener
- groupSettings, dataset selection

## 시각 변화

- **selection checkbox** 사라짐 (cell selected border 만)
- **cover-resize 보정**: server meta 사용 — 부정확 가능
- **ui Cell 시각**: ui ImageGridCell (radius / shadow / Panel-like) — edge 의 dark cell 과 다름

## 줄수 효과

| 항목 | 변경 |
|---|---|
| ImagesView.tsx grid 부분 제거 | -90줄 |
| ImagesView.tsx ThumbWithBbox 제거 | -50줄 |
| ImagesView.tsx 가상화 boilerplate 제거 (rowVirtualizer 등) | -30줄 |
| ImagesView.styles.ts 6 styled 제거 | -30줄 |
| EdgeImagesGrid.tsx 신규 | +150줄 |
| BboxOverlay.tsx 신규 | +30줄 |
| **순변화** | **약 -20줄** (눈에 띄는 코드 정리, 1442 → ~1280) |

→ 줄수 효과는 catalog (PR-1.4) 만큼 크지 않음. 그러나:
- ui ImageGrid 의 cross-app 검증 (마지막 큰 use case)
- ImagesView 의 가독성 ↑ (가상화 + grid render 분리)
- TanStack 사용처가 ui 안으로 모아짐 (edge 의 dep 제거 거리)

## 위험 / trade-off

- **cover-resize 보정 부정확** — server meta 의 width/height 가 실제 thumbnail 과 다를 수 있음 (예: 종횡비 보정 안 된 raw meta). 시각 검증 후 의도 강하면 후속 PR.
- **selection checkbox UX 변경** — D-013 (시각 통일) 일관. 사용자 시각 검증 후 의도 강하면 후속.
- **edge 의 `@tanstack/react-virtual` dep**: ui 가 이미 가짐 → edge package.json 에서 제거 거리 (다른 사용처 없으면). 본 PR 에서 진행 vs 별도. 권장: 본 PR 에서 다른 사용처 audit 후 결정.

## 검증

1. ui typecheck (PR-1.5 영향 X 확인)
2. **ui build → edge node_modules sync** (D-014)
3. edge typecheck
4. 시각: 마지막 일괄

## 후속

- PR-1.2: 단위 test (Phase 1 마지막)
- edge react-virtual dep 제거 (다른 사용처 audit 후)
- cover-resize 보정 fix (필요 시)
