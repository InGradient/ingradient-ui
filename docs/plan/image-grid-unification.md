---
plan: ImageGrid 통합 — platform catalog + classes + edge ImagesView 를 ui 의 단일 컴포넌트로
date: 2026-05-09
status: ✅ 완료 (2026-05-09)
governance: ../governance.md
---

# ImageGrid 통합 plan ✅ 완료

## 결과 요약 (2026-05-09)

5 PR 모두 완료. PR 순서 D-015 정신 따라 1.1 → 1.3 → 1.4 → 1.5 → 1.2 (test 마지막).

| PR | 결과 |
|---|---|
| PR-1.1 | ui ImageGrid 신규 (111줄) + VirtualizedImageGrid (124줄) + 헬퍼 (image-grid-cell 124, use-grid-selection 13). `@tanstack/react-virtual` ui dep 추가. |
| PR-1.3 | classes ClassImagesPanel 200 → 147줄. AnnotationOverlay (87줄) 추출. 6 styled 제거. |
| PR-1.4 | catalog 4 파일 (553+129) 제거. CatalogImageGrid (141) + HoverPreview (47) 추출. **순감소 -494줄**. |
| PR-1.5 | edge ImagesView 1442 → 1270 (-172, 11.9%). EdgeImagesGrid (153) + BboxOverlay (33) 추출. |
| PR-1.2 | 단위 test 16 시나리오. 전체 124/124 통과. |

ui API 자연 보완 (Phase 1 진행 중, D-015 예외): `index` 시그니처, `onDragStart`, `onContextMenu`, `onCellMouseEnter/Leave`, `highlightedId`.

핵심 결정 (각 sub-plan 의 D 기록 참조):
- D-013 (시각 통일) 일관 적용 — catalog stack 시각, edge selection checkbox 시각 의도 모두 ui 표준으로
- 가상화 split (단일 ImageGrid 가 200줄 limit 이내, VirtualizedImageGrid 별도 — react-virtual dep 격리 + tree-shake)
- selection range anchor — caller 책임 (PR-1.4 의 `lastSelectedIndexRef`, PR-1.5 의 group-aware logic)
- bbox annotation 의 cover-resize 보정 — server meta 만 사용 (D2 일관, useState 폐기)



## 목적

3 곳에 흩어진 image grid 구현을 ui 의 단일 컴포넌트로 통합. 디자이너가 ui 한 곳만 수정하면 모든 페이지에 반영. 색/크기 약간의 차이는 허용.

## 현황 (audit 결과)

| 위치 | 줄수 | 핵심 특징 |
|---|---|---|
| `@ingradient/ui` `ImageGrid` (기존) | 110 | 단순 카드 그리드. 가상화/무한스크롤/그룹 X |
| platform catalog (gallery) `virtualized-image-grid.tsx + cell + styles` | 553 (4 파일) | 그룹 stack, 호버 preview, archive overlay, 멀티셀렉트, 무한스크롤 (sentinel), 드래그/드롭 |
| platform classes `ClassImagesPanel.tsx` | 200 | bbox/point annotation overlay, 그룹 (sequence + regex), context menu |
| edge `ImagesView.tsx` | 1442 (페이지 전체) | TanStack 가상화 (row), 무한스크롤 (threshold), sync-state 아이콘, 날짜/local 필터, modal bbox 편집, SAM ROI |

**공통 부분**:
- CSS Grid 레이아웃 + lazy thumbnail
- 그룹 stack/badge (3 곳 중 2-3 곳)
- 멀티셀렉트 (3 곳 중 2 곳)
- 셀 위에 overlay/footer slot 거리 (3 곳 모두)

**다른 부분 (도메인 특수)**:
- Catalog: 호버 preview 플로팅 카드, archive 표시, 드래그/드롭 to dataset
- Classes: bbox/point annotation 오버레이 (class color 매핑)
- Edge: TanStack 가상화 (대량 데이터), sync 상태 아이콘, 날짜 필터, BBoxCanvas 모달

## 통합 전략

**원칙** (governance 기준):
- ui ImageGrid 는 도메인 무관 + props 5개 이하 + 200줄 미만
- 도메인 특수는 **render prop slot** 으로 외부 주입
- 기능을 props 로 다 받지 않음 — render prop 으로 caller 가 조립

### 통합 ui ImageGrid API

```tsx
// @ingradient/ui/components
interface ImageGridProps<T extends { id: string }> {
  // ── 필수 ────────────────────────────────────────────────────────
  items: T[]
  getThumbnailUrl: (item: T) => string

  // ── 선택 (자주) ──────────────────────────────────────────────────
  /** 그리드 layout. minWidth=고정 column 비율, columns=고정 컬럼 수 */
  layout?: { minWidth?: number; columns?: number; gap?: number }
  /** 단순 클릭 — open detail 등 */
  onItemClick?: (item: T, event: React.MouseEvent) => void
  /** 더블 클릭 — 편집 진입 등 (catalog) */
  onItemDoubleClick?: (item: T, event: React.MouseEvent) => void
  /** 멀티셀렉트 사용처 */
  selectedIds?: Set<string>
  onSelectionChange?: (action: 'toggle' | 'range' | 'single', id: string) => void

  // ── render slots (도메인 특수 주입) ──────────────────────────────
  /** 셀 위 hover 또는 항상 표시 overlay (e.g. annotation, checkbox) */
  renderCellOverlay?: (item: T, index: number) => React.ReactNode
  /** 셀 아래 footer (e.g. filename, sync status) */
  renderCellFooter?: (item: T, index: number) => React.ReactNode
  /** 셀 우상단 persistent 영역 (e.g. group count badge) */
  renderCellTopRight?: (item: T, index: number) => React.ReactNode

  // ── 가상화 (대량 데이터) ─────────────────────────────────────────
  /** TanStack virtual row 활성화 */
  virtualized?: boolean
  /** 무한스크롤 */
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}
```

→ **6 props 핵심 + 3 render slots + 3 가상화 옵션 = 총 12**. 5 미만 권장 어기지만, 가상화/무한스크롤/멀티셀렉트는 양 컨슈머 핵심 needs 이라 분리 어려움.

→ **대안**: `ImageGrid` (단순) + `VirtualizedImageGrid` (가상화) 2 컴포넌트로 split 검토. 일단 통합으로 진행, 200 줄 넘으면 split.

### 안 받는 것 (caller 가 책임)

- **그룹 logic** (sequence/regex 기반 representative 추출) — caller 가 미리 grouped items 만들어 전달
- **bbox/point overlay 계산** — `renderCellOverlay` 안에서 caller 가 직접 SVG 그림
- **호버 preview** — `renderCellOverlay` 또는 별도 wrapper
- **archive/sync 상태 아이콘** — `renderCellTopRight` / `renderCellFooter`
- **드래그 / context menu** — caller 의 wrapper 컴포넌트가 cell 에 wrap

## 통합 후 각 consumer 의 모습

### Platform Catalog (`virtualized-image-grid.tsx` 553줄 → ~80줄)

```tsx
// catalog page
<ImageGrid
  items={images}
  getThumbnailUrl={(img) => img.thumb_url ?? ''}
  layout={{ minWidth: 140, gap: 8 }}
  selectedIds={selectedIds}
  onSelectionChange={handleSelectionChange}
  onItemClick={handleClick}
  onItemDoubleClick={handleDoubleClick}
  renderCellOverlay={(img) => (
    <>
      <SelectCheckbox ... />
      {img.archived && <ArchiveOverlay />}
      <HoverPreview src={img.original_url} />
    </>
  )}
  renderCellTopRight={(img) => img.group_count > 1 && <GroupBadge count={img.group_count} />}
  virtualized={false}  // catalog 는 페이지네이션 없이 sentinel
  hasMore={hasMore}
  onLoadMore={loadMore}
/>
```

→ 553줄 (그리드+셀+styles 4 파일) → **~80줄 caller + ~50줄 사용처별 보조 컴포넌트** (ArchiveOverlay, HoverPreview, SelectCheckbox 는 그대로 유지)

### Platform Classes (`ClassImagesPanel.tsx` 200줄 → ~100줄)

```tsx
<ImageGrid
  items={classImagesGrouped}  // sequence/regex 그룹 미리 적용
  getThumbnailUrl={(img) => img.thumb_url ?? ''}
  layout={{ minWidth: 120, gap: 12 }}
  onItemClick={handleOpenImage}
  renderCellOverlay={(img) => (
    <AnnotationOverlay
      bboxes={img.bboxes}
      points={img.points}
      classId={selectedClassId}
      classIdToColor={classIdToColor}
    />
  )}
  renderCellTopRight={(img) => img.group_count > 1 && <GroupBadge count={img.group_count} />}
  // 드래그 + context menu 는 caller 가 wrapper div 에 attach
/>
```

→ 200줄 → **~100줄 caller + ~40줄 AnnotationOverlay 별도 컴포넌트** (annotation rendering 은 도메인 특수, classes 만 사용)

### Edge ImagesView (`ImagesView.tsx` 1442줄 — 페이지 전체)

ImagesView 의 1442줄 중 image grid 부분만 추출하면 ~150줄. 통합 후:

```tsx
<ImageGrid
  items={imagesGrouped}
  getThumbnailUrl={(img) => img.thumb_url ?? ''}
  layout={{ minWidth: 140, gap: 8 }}
  selectedIds={selectedIds}
  onSelectionChange={handleSelectionChange}
  onItemClick={handleOpenModal}
  renderCellOverlay={(img) => (
    <>
      {selectedIds.has(img.id) && <SelectCheckbox checked />}
      {img.bboxes && <BboxOverlay bboxes={img.bboxes} />}
      {img.processing && <ProcessingSpinner />}
    </>
  )}
  renderCellFooter={(img) => (
    <>
      <SyncStatusIcon status={img.sync_state} />
      <FilenameLabel name={img.label} />
    </>
  )}
  renderCellTopRight={(img) => img.group_count > 1 && <GroupBadge count={img.group_count} />}
  virtualized  // edge 는 대량 데이터 → TanStack 가상화 활성화
  hasMore={hasMore}
  onLoadMore={loadMore}
/>
```

→ ImagesView 의 grid 부분 ~150줄 → **~80줄 caller + ~50줄 도메인 컴포넌트** (BboxOverlay, SyncStatusIcon, FilenameLabel)

ImagesView 의 나머지 1300줄 (페이지 layout, modal, BBoxCanvas, SAM ROI, 필터 UI 등) 는 그대로 유지 — 도메인 특수.

## ui ImageGrid 구현 단계 (PR-1.1 ~ PR-1.5)

### PR-1.1: 신규 ImageGrid 작성

기존 `src/components/data-display/image-grid.tsx` (110줄, 단순 카드) 를 확장 또는 대체.

대체 추천 — 기존 단순 ImageGrid 는 storybook/docs 외 사용 거의 없음. 새 ImageGrid 가 단순 use case 도 cover 가능.

```
src/components/data-display/image-grid.tsx (신규, ~180줄)
```

storybook 은 Phase 3 에서 일괄 작성 (D-008).

핵심 구현:
- CSS Grid (auto-fit + minWidth 또는 columns 고정)
- `virtualized` 옵션 시 TanStack `react-virtual` 사용 (row-based)
- 무한스크롤: `IntersectionObserver` sentinel (TanStack 와 무관하게 작동)
- 멀티셀렉트: shift/ctrl 키 detect → action 분류 (toggle/range/single)
- render slot 호출

### PR-1.2: ImageGrid 단위 test

```
src/components/data-display/image-grid.test.tsx (a11y + selection + click)
```

### 소비자 마이그레이션 PR (PR-1.3 ~ PR-1.5) — D-015 순서 변경: test 마지막

각 사용처 별 PR (작은 단위):
- **PR-1.3**: platform classes ClassImagesPanel — 가장 단순, annotation overlay 만 render slot 으로 분리 (sub-plan: `pr/1-3-platform-classes-migration.md`)
- **PR-1.4**: platform catalog virtualized-image-grid — hover preview + archive overlay + drag/drop wrapper 분리
- **PR-1.5**: edge ImagesView 의 grid 부분 추출 — TanStack 가상화 + sync state + filename slot
- **PR-1.2** (마지막): 단위 test (D-015) — 실 사용 패턴 본 후 시나리오 정확

각 PR:
1. 기존 styled.div + map 코드를 `<ImageGrid>` 호출로 교체
2. 도메인 특수 부분 (overlay 등) 별도 컴포넌트로 분리 → render slot 에 주입
3. 기존 ImageGrid styled 파일 삭제
4. typecheck + 시각 회귀

## Anti-goals (안 할 것)

- **annotation rendering 을 ui 에 넣기** — bbox/point 의 class color 매핑은 domain 코드. ui 에 두면 generic prop drilling 폭발
- **modal/detail view 통합** — image-detail-modal 은 page-specific (이미 governance 거부 명단)
- **드래그/드롭 to specific target** — drag start 까지는 wrapper 가 하면 됨, 드롭 target 정의는 도메인
- **호버 preview 의 위치/크기 정책 통합** — caller 가 자체 컴포넌트로

## 위험 / 검증

### 가상화 차이
- catalog 는 sentinel 기반 (가상화 X)
- edge 는 TanStack row-based (가상화 O)
- 한 컴포넌트에 둘 다 지원 시 코드 분기 (~30줄). 200줄 limit 위협.
- → 200줄 넘기면 `VirtualizedImageGrid` 별도 컴포넌트로 split

### 셀렉션 의미
- catalog 는 멀티셀렉트 + drag/drop (셀렉트된 것들 같이 옮김)
- classes 는 셀렉트 X (단순 클릭)
- edge 는 멀티셀렉트 + select-all + 일괄 작업 (transfer/delete)
- → API 동일, caller 가 다르게 사용. OK

### 호버 동작 차이
- catalog: 호버 시 preview 카드 + checkbox 노출 + 사용자 액션 overlay
- classes: 호버 효과 없음
- edge: 호버 효과 없음 (셀렉트되어야 checkbox)
- → `renderCellOverlay` 는 항상 렌더, 안에서 caller 가 hover state 관리

## 효과 추정

| 항목 | 현재 | 통합 후 |
|---|---|---|
| platform catalog grid | 553줄 (4 파일) | ~80줄 caller + 보조 컴포넌트 |
| platform classes grid | 200줄 | ~100줄 caller + AnnotationOverlay |
| edge ImagesView grid 부분 | ~150줄 | ~80줄 caller + 도메인 컴포넌트 |
| ui ImageGrid | 110줄 | ~180줄 (확장) |
| **합계** | **1013** | **~440 + ui 확장 70 + 도메인 컴포넌트 ~140** |

→ 약 **45% 코드 감소** + 디자인 일관 + 추후 새 페이지에서 1줄로 사용

## Open Questions

- [ ] **`VirtualizedImageGrid` split 결정** — ui ImageGrid 200줄 넘으면 split 또는 그대로?
- [ ] **TanStack `react-virtual` dependency** — ui 에 추가 가능 여부 (peer dep 인지 bundled 인지). 이미 edge 에 있어서 추가 부담은 없음.
- [ ] **renderCellOverlay 의 호버 vs 항상 표시 분기** — `alwaysVisible?: boolean` prop 또는 caller 의 css 책임?
