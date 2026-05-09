---
plan: PR-1.3 — platform classes ClassImagesPanel 을 ui ImageGrid 로 마이그
date: 2026-05-09
phase: 1 (ImageGrid 통합)
pr id: PR-1.3
parent plan: ../image-grid-unification.md
master plan: ../../MASTER-PLAN.md (§ 9.1 — D-012)
governance: ../../governance.md
estimated: 2-3h
---

# PR-1.3 — platform classes ClassImagesPanel 마이그레이션

## 목표

`platform/frontend/components/classes/ClassImagesPanel.tsx` (200줄) 의 image grid 부분을 ui `<ImageGrid>` 로 교체. 도메인 부분 (annotation overlay, group count badge) 은 render slot 으로 분리.

또한 PR-1.1 의 ImageGrid API 누락 보완 (이번 PR 진행 중 발견 — 다음 PR 미루지 않고 본 PR scope 안에서 처리, 같은 Phase 안의 자연 보완).

## 왜 PR-1.2 (단위 test) 보다 먼저?

- 실제 사용처 마이그가 ImageGrid API 의 적합성 검증 — test 가 cover 못 하는 실 사용 신호 빠르게.
- PR-1.3 (classes) 가 가장 단순 → 부족 발견 시 PR-1.4/1.5 전에 fix.
- test 는 마이그 후 작성하면 실 사용 패턴 본 후 시나리오 더 정확 (D-008 의 "안정 후 일괄" 정신).

→ master plan 의 Phase 1 PR 순서 변경: PR-1.1 → **PR-1.3 → PR-1.4 → PR-1.5 → PR-1.2** (test 마지막).

## audit (2026-05-09)

### ClassImagesPanel 의 grid 부분 (line 124-192, ~70 줄)

**현황**:
```tsx
<ImageGrid /* styled.div, auto-fill minmax(120px) */ >
  {displayItems.map((img, index) => (
    <ThumbCard>
      {groupSize > 1 && <span>...{groupSize}</span>}        {/* 우상단 group badge (inline style) */}
      <Thumb
        src={...}
        onLoad={(e) => onUpdateLoadedImageSize(...)}        {/* natural size 추적 */}
        draggable onDragStart={(e) => ...}
        onContextMenu={(e) => onOpenContextMenu(...)}
        onClick={() => onOpenImage(index)}                   {/* index 필요 */}
      />
      <ThumbOverlay>                                         {/* annotation */}
        {filteredBboxes.map(...)}
        {filteredPoints.map(...)}
      </ThumbOverlay>
    </ThumbCard>
  ))}
</ImageGrid>
```

**ImageGrid 외부** (chips row, dataset 필터, loading/empty state) 은 그대로 유지.

### PR-1.1 ImageGrid API 의 누락

ClassImagesPanel 에 마이그 시도 시 다음 API 부족 발견:

| 부족 | 사용처 | 처리 옵션 |
|---|---|---|
| `onItemClick` 시그니처에 `index` 없음 | `onOpenImage(index)` 호출 | API 확장 (callback signature `+index`) |
| `onDragStart` prop 없음 | `event.dataTransfer.setData` (drag-to-dataset) | API 확장 (cell-level event) |
| `onContextMenu` prop 없음 | 우클릭 메뉴 (image 액션) | API 확장 |
| `onImageLoad` (natural size) | bbox percent projection | 옵션 (a) callback prop 추가 / (b) server meta 만 사용 |

### 결정 옵션

#### D1. API 확장 (index + onDragStart + onContextMenu)

→ **권장 채택**. 이유:
- callback 시그니처에 `index` 추가는 props 폭증 아님 (기존 callback 의 인자 1 추가)
- `onDragStart`, `onContextMenu` 는 dom 표준 이벤트, catalog (PR-1.4) 도 사용 — 한 번에 처리
- ImageGrid 내부 cell event 라 자연 fit

**API 변경 (image-grid.tsx + image-grid-cell.tsx + virtualized-image-grid.tsx)**:
```tsx
onItemClick?: (item: T, index: number, event: React.MouseEvent) => void
onItemDoubleClick?: (item: T, index: number, event: React.MouseEvent) => void
onSelectionChange?: (action: GridSelectionAction, id: string, index: number) => void  // index 추가
onDragStart?: (item: T, index: number, event: React.DragEvent) => void
onContextMenu?: (item: T, index: number, event: React.MouseEvent) => void
```

→ **이번 PR scope 자연 확장** (Phase 1 안에서 PR-1.1 보완). master plan § 9.1 의 "다음 PR 에 미룸" 원칙 예외 — 같은 Phase + 같은 컴포넌트 + 작은 fix.

#### D2. natural image size 추적 (`onUpdateLoadedImageSize`)

- 옵션 (a): ui ImageGridCell 에 `onImageLoad?: (item, dim)` callback prop 추가
- 옵션 (b) **권장**: ClassImagesPanel 의 `loadedImageSizes` 추적 폐기, server meta (`img.width`, `img.height`) 만 사용

→ **권장 (b)**. 이유:
- API 추가 회피 (governance simple)
- server meta 가 이미 신뢰 가능한 source (catalog/edge 도 server meta 사용)
- legacy data 의 부재 시 bbox 정확도 약간 ↓ — acceptable trade-off (annotation 은 시각 hint, 정확 위치 X 면 viewer 에서 확인)
- caller 단순화 (loadedImageSizes state, onUpdateLoadedImageSize callback prop 제거)

### D3. AnnotationOverlay 별도 컴포넌트

annotation rendering (bbox + point + classId 매핑) 은 classes 도메인 → ui 에 안 둠 (image-grid-unification.md anti-goal).

→ **`platform/frontend/components/classes/AnnotationOverlay.tsx`** 신규 (~40줄):
```tsx
export function AnnotationOverlay({ bboxes, points, selectedClassId, classIdToColor, imageWidth, imageHeight }) {
  const filteredBboxes = filterBboxesForClass(bboxes, selectedClassId)
  const filteredPoints = filterPointsForClass(points, selectedClassId)
  return (
    <>
      {filteredBboxes.map(...)} 
      {filteredPoints.map(...)}
    </>
  )
}
```

caller 의 `renderCellOverlay` 안에서 사용:
```tsx
renderCellOverlay={(img) => (
  <AnnotationOverlay
    bboxes={img.bboxes}
    points={img.points}
    selectedClassId={selectedClassId}
    classIdToColor={classIdToColor}
    imageWidth={img.width ?? 0}
    imageHeight={img.height ?? 0}
  />
)}
```

### D4. group badge → renderCellTopRight

inline style 의 group count badge → ui `<Badge>` (이미 있음) 또는 caller styled. 판단: ui Badge 가 cover 가능.

```tsx
renderCellTopRight={(img) => {
  const count = groupCounts.get(img.id)
  return count && count > 1 ? <Badge $tone="neutral">{count}</Badge> : null
}}
```

## 변경 파일

### ui (PR-1.1 API 확장)

1. **`src/components/data-display/image-grid.tsx`** — onItemClick/DoubleClick/SelectionChange 시그니처 +index, onDragStart/onContextMenu 추가
2. **`src/components/data-display/image-grid-cell.tsx`** — props pass-through + 이벤트 attach
3. **`src/components/data-display/virtualized-image-grid.tsx`** — props pass-through

### platform

4. **`frontend/components/classes/ClassImagesPanel.tsx`** — 200줄 → ~100줄 마이그
5. **`frontend/components/classes/ClassImagesPanel.styles.ts`** — `ImageGrid / Thumb / ThumbCard / ThumbOverlay / ThumbBbox / ThumbPoint` 제거. `Main / ChipsRow / Chip / ChipCount / ChipsRowLabel / NoDatasetsHint / EmptyRight` 유지
6. **`frontend/components/classes/AnnotationOverlay.tsx`** — 신규 (~40-50줄)
7. **`frontend/features/classes/classes.utils.ts`** — `filterBboxesForClass / filterPointsForClass / projectToCoverSquare / getAnnotationColor` 는 그대로 (AnnotationOverlay 내부에서 사용)

### Props prop 흐름 정리 (ClassImagesPanel)

`onUpdateLoadedImageSize` prop, `loadedImageSizes` prop 제거 (D2 채택). 호출처 (`ClassesContainer.tsx` 같은 부모) 도 갱신 필요.

## 변경 안 함

- `Main / ChipsRow / Chip / ChipCount / ChipsRowLabel / EmptyRight / NoDatasetsHint` styled — grid 외부, 그대로
- 그룹 logic (sequence/regex 기반 representative) — caller `useMemo` 안에서 그대로
- 단위 test — PR-1.2 (마지막) 에서

## 시각 변화 양상

- **그리드 cell 모양**: ClassImagesPanel 의 단순 styled (border-radius 8 + img only) → ui ImageGridCell (Panel + 더 큰 radius + Box-shadow)
- **그룹 badge**: inline span (rgba 12,16,24,0.92) → ui `Badge` (tone neutral)
- **annotation overlay 위치**: img natural size 가 server meta 와 다르면 percent 약간 다름 (D2 채택)

→ D-013 (시각 통일) 정신 — ui 표준으로 통일.

## 검증

1. **ui typecheck + build** — API 확장 후 (`npx tsc --noEmit && npm run build:package`)
2. **platform typecheck** — symlink 라 ui 변경 즉시 반영 (`cd platform/frontend && npx tsc --noEmit`)
3. **edge typecheck** — 본 PR 변경 영향 X 인지 확인 (ImageGrid API 확장만 — 사용처 X)
4. **시각 검증**: 마지막 일괄 (사용자 결정)

## 위험 / trade-off

- **API 확장**: PR-1.1 의 props 12개 → 14개 (callback signature 변경 + 2 새 callback). governance "5 권장" 더 어김. 그러나 dom 표준 이벤트 (drag/contextmenu) + index 필요는 자연.
- **loadedImageSizes 폐기**: legacy data (server meta 없는 경우) 의 annotation 위치 부정확 가능. 사용자 시각 검증 후 필요 시 후속 PR (callback prop 추가).
- **PR scope 자연 확장**: master plan § 9.1 의 "다음 PR 에 미룸" 원칙 예외. 사유: 같은 Phase + 같은 컴포넌트 + 작은 fix + 같은 caller 타이밍에 자연 fit.

## 후속

- PR-1.4: platform catalog virtualized-image-grid 마이그 (가장 큰 거리)
- PR-1.5: edge ImagesView grid 부분 추출 + 마이그
- PR-1.2: 단위 test (Phase 1 마지막)
