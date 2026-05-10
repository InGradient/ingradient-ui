---
title: PR-E2 — AnnotationOverlay 통합 (platform + edge → ui)
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui (foundation) + ingradient-platform / ingradient-edge (consumers)
status: planning — 사용자 review 대기
---

# PR-E2 — AnnotationOverlay 통합

## 1. 목적

platform `AnnotationOverlay` (87줄) + edge `BboxOverlay` (33줄) 가 *비슷한 의도* (썸네일 이미지 위 bbox/point overlay). ui 단일 컴포넌트로 통합. ImageGrid 의 `renderCellOverlay` slot 안에 들어가는 사용 패턴 양 repo 동일.

## 2. 현황 inventory

### 2.1 platform [AnnotationOverlay.tsx](frontend/components/classes/AnnotationOverlay.tsx) (87줄)

- **렌더 방식**: `<div>` + `position: absolute` + percentage left/top/width/height
- **bbox**: 외곽 border (2px) + 22% color tint background. 흰색 1px + 검은색 3px 이중 shadow (썸네일 위 가독성)
- **point**: 10x10 dot, 흰색 2px border, 검은색 2px shadow
- **좌표계**: `projectToCoverSquare` — object-fit: cover 정사각형 썸네일 안에서 잘리는 영역 반영. percentage 좌표 반환
- **filter**: `selectedClassId` 기반 — *선택된 class 의 annotation 만* 표시
- **color**: `getAnnotationColor(classId, map)` 헬퍼 (없으면 #7f8b9d fallback)
- **caller**: [ClassImagesPanel.tsx:126](frontend/components/classes/ClassImagesPanel.tsx#L126)

### 2.2 edge [BboxOverlay.tsx](src/frontend/components/capture/BboxOverlay.tsx) (33줄)

- **렌더 방식**: `<svg>` + viewBox (object-fit: cover 보정)
- **bbox**: stroke only (fill="none"), 별도 background 없음. strokeWidth = vw * 0.008 (scale 인식). 그림자 없음
- **point**: **미지원**
- **좌표계**: viewBox `${vx} ${vy} ${vw} ${vh}` + `preserveAspectRatio="none"` — SVG 가 자체 cover 보정
- **filter**: 없음 — *모든 class* 의 bbox 동시 표시
- **color**: `classes.find().color ?? '#4d88ff'` (caller 가 dataset classes 배열 전달)
- **caller**: [EdgeImagesGrid.tsx:106](src/frontend/components/capture/EdgeImagesGrid.tsx#L106)

## 3. 차이 분석

| 측면 | platform | edge | 통합 방안 |
|---|---|---|---|
| 렌더 element | `<div>` + % | `<svg>` + viewBox | 둘 다 가능. **SVG 통일** — `vector-effect: non-scaling-stroke` 로 zoom-stable, color-mix 도 인라인 fill 로 가능 |
| bbox fill | 22% color tint | 없음 (fill="none") | prop `fillOpacity` (default 0 = edge 호환, platform 은 0.22) |
| bbox 외곽 shadow | 흰색+검은색 이중 | 없음 | prop `emphasize` boolean (default false = edge, platform 은 true) |
| point 지원 | ✅ | ❌ | ui 가 양쪽 — edge 가 안 쓰면 무시 |
| classFilter | selectedClassId | 없음 | prop `selectedClassId?` optional. 안 주면 모든 class |
| color resolution | `Record<classId, color>` | `{class_id, color}[]` | prop type 통일 — `getColor: (classId) => string \| undefined` 함수 콜백. caller 가 자체 자료구조 → 색 함수 변환 |
| 좌표계 보정 | `projectToCoverSquare` (utility) | viewBox SVG | **SVG 통일** + 통합된 cover 보정. utility 는 platform-only 도메인 logic 이라 *ui 안 이동 안 함*. 단 ui 가 imageWidth/Height prop 받아 자체 보정 |

## 4. ui 통합 컴포넌트 설계

### 4.1 API

```tsx
export interface AnnotationOverlayBbox {
  classId: string
  x: number      // 0~1 normalized
  y: number
  w: number
  h: number
}

export interface AnnotationOverlayPoint {
  classId: string
  x: number      // 0~1 normalized
  y: number
}

export interface AnnotationOverlayProps {
  bboxes?: AnnotationOverlayBbox[]
  points?: AnnotationOverlayPoint[]
  /** Resolves classId → color hex. Returns undefined to use defaultColor. */
  getColor: (classId: string) => string | undefined
  /** Fallback color when getColor returns undefined. Default '#4d88ff'. */
  defaultColor?: string
  /** Filter — only render annotations matching this classId. Omit/null = all. */
  selectedClassId?: string | null
  /** Original image dimensions (for object-fit: cover crop boundary calc). */
  imageWidth: number
  imageHeight: number
  /** Tint bbox fill at this opacity (0~1). Default 0 (no fill). platform 은 0.22 */
  fillOpacity?: number
  /** Draw white/black double outline around bbox/point (썸네일 가독성). Default false. */
  emphasize?: boolean
}
```

### 4.2 렌더 — SVG 통일

```tsx
const Layer = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`

export function AnnotationOverlay({
  bboxes, points, getColor, defaultColor = '#4d88ff',
  selectedClassId, imageWidth, imageHeight,
  fillOpacity = 0, emphasize = false,
}: AnnotationOverlayProps) {
  // cover crop viewBox calc
  const w = imageWidth || 0
  const h = imageHeight || 0
  const ar = w > 0 && h > 0 ? w / h : 1
  let vx = 0, vy = 0, vw = 1, vh = 1
  if (ar > 1) { vw = 1 / ar; vx = (1 - vw) / 2 }
  else if (ar < 1) { vh = ar; vy = (1 - vh) / 2 }

  const visibleBboxes = selectedClassId
    ? (bboxes ?? []).filter((b) => b.classId === selectedClassId)
    : (bboxes ?? [])
  const visiblePoints = selectedClassId
    ? (points ?? []).filter((p) => p.classId === selectedClassId)
    : (points ?? [])

  const strokeBase = vw * 0.008
  const strokeEmphasis = vw * 0.012

  return (
    <Layer viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="none">
      {visibleBboxes.map((bbox, i) => {
        const color = getColor(bbox.classId) ?? defaultColor
        return (
          <g key={`bbox-${i}`}>
            {emphasize && (
              <rect x={bbox.x} y={bbox.y} width={bbox.w} height={bbox.h}
                fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth={strokeEmphasis} />
            )}
            <rect x={bbox.x} y={bbox.y} width={bbox.w} height={bbox.h}
              fill={fillOpacity > 0 ? color : 'none'}
              fillOpacity={fillOpacity}
              stroke={color} strokeWidth={strokeBase} opacity={emphasize ? 1 : 0.9} />
          </g>
        )
      })}
      {visiblePoints.map((point, i) => {
        const color = getColor(point.classId) ?? defaultColor
        const r = vw * 0.015
        return (
          <g key={`point-${i}`}>
            {emphasize && <circle cx={point.x} cy={point.y} r={r * 1.4} fill="rgba(0,0,0,0.6)" />}
            <circle cx={point.x} cy={point.y} r={r} fill={color}
              stroke={emphasize ? 'var(--ig-color-text-primary)' : 'none'}
              strokeWidth={emphasize ? vw * 0.004 : 0} />
          </g>
        )
      })}
    </Layer>
  )
}
```

### 4.3 platform 의 platform-only 헬퍼

`projectToCoverSquare`, `filterBboxesForClass`, `filterPointsForClass`, `getAnnotationColor` 는 **ui 로 안 옮김** — 도메인 utility 또는 ui 가 직접 처리:
- `filterBboxesForClass` / `filterPointsForClass`: ui AnnotationOverlay 가 `selectedClassId` prop 직접 처리 — 헬퍼 호출 사라짐
- `getAnnotationColor`: caller 의 `getColor` 콜백으로 흡수
- `projectToCoverSquare`: ui 가 자체 viewBox calc — *div 기반 rendering 안 함*. caller 가 *div mode 가 필요한 경우* projectToCoverSquare 별도 사용 가능 (platform features/classes 에 유지)

→ **platform helpers 자체는 유지** (다른 곳에서도 쓸 수 있게 호환). 단 AnnotationOverlay 의존성 제거.

## 5. consumer 마이그

### 5.1 platform [ClassImagesPanel.tsx:126](frontend/components/classes/ClassImagesPanel.tsx#L126)

```tsx
// 이전
<AnnotationOverlay
  bboxes={img.bboxes as Bbox[] | undefined}
  points={img.points as Point[] | undefined}
  selectedClassId={selectedClassId}
  classIdToColor={classIdToColor}
  imageWidth={img.width ?? 0}
  imageHeight={img.height ?? 0}
/>

// 이후
<AnnotationOverlay
  bboxes={img.bboxes}
  points={img.points}
  selectedClassId={selectedClassId}
  getColor={(id) => classIdToColor[id]}
  imageWidth={img.width ?? 0}
  imageHeight={img.height ?? 0}
  fillOpacity={0.22}
  emphasize
/>
```

### 5.2 edge [EdgeImagesGrid.tsx:106](src/frontend/components/capture/EdgeImagesGrid.tsx#L106)

```tsx
// 이전
<BboxOverlay
  bboxes={img.bboxes ?? null}
  classes={selectedDatasetClasses}
  imageWidth={...}
  imageHeight={...}
/>

// 이후
<AnnotationOverlay
  bboxes={img.bboxes ?? []}
  getColor={(id) => selectedDatasetClasses.find((c) => c.class_id === id)?.color}
  imageWidth={...}
  imageHeight={...}
/>
```

## 6. 변경 파일 list

### 6.1 ui (신규)

| 파일 | 내용 |
|---|---|
| `src/components/data-display/annotation-overlay.tsx` | 본 컴포넌트 (~100줄) |
| `src/components/data-display/annotation-overlay.stories.tsx` | Storybook variants (썸네일 grid + emphasize + filter 등) (~150줄) |
| `src/components/data-display/index.ts` | export 추가 |
| `src/components/index.ts` | (간접 export) |

### 6.2 platform (제거 + 마이그)

| 파일 | 변경 |
|---|---|
| `frontend/components/classes/AnnotationOverlay.tsx` | **삭제** (-87줄) |
| `frontend/components/classes/ClassImagesPanel.tsx` | import 변경 + props 변경 |
| `frontend/features/classes/classes.utils.ts` | filterBboxes/Points 사용처 0 → 제거 가능 (단 다른 caller 확인 필요) |

### 6.3 edge (제거 + 마이그)

| 파일 | 변경 |
|---|---|
| `src/frontend/components/capture/BboxOverlay.tsx` | **삭제** (-33줄) |
| `src/frontend/components/capture/EdgeImagesGrid.tsx` | import 변경 + props 변경 |
| `src/frontend/components/capture/ImagesView.styles.ts` | `BBoxOverlaySvg` styled 제거 (사용처 0 후) |

## 7. 영향 분석

**줄수 변화 추정**:
- ui +100 (annotation-overlay.tsx) + ~150 (stories) = +250줄
- platform -87 (AnnotationOverlay.tsx) - 약간 (filter helpers 사용처 0 후 정리) = 약 -90줄
- edge -33 (BboxOverlay.tsx) - 약간 (BBoxOverlaySvg styled) = 약 -40줄
- 양 repo 합 **약 -130줄** (audit 추정 -120 부합)
- ui 의 +250 은 stories 포함 — 코드 본체만 +100

**시각 변화**:
- **platform**: div → SVG. percentage 좌표 → SVG viewBox. 시각 동등 (cover crop boundary 동일 계산). border / fill / shadow 동등 매핑
- **edge**: 그대로 SVG. 거의 변화 없음

**기능 변화**:
- platform: filter helpers (`filterBboxesForClass` 등) 호출 안 함 — ui 가 selectedClassId 자체 처리
- edge: bbox stroke opacity 0.9 → emphasize=false 일 때 0.9 (동등)

**recharts/d3 등 dependency**: 추가 없음 — SVG primitive 만

## 8. 검증 절차

1. ui:
   - typecheck `npx tsc --noEmit`
   - storybook 시각 (양 mode): annotation-overlay.stories 의 thumb 위 bbox / point 정상
   - storybook tests pass
2. ui build → platform symlink + edge sync
3. platform:
   - typecheck pass
   - `npm run dev` → Classes 페이지 → Class Images Panel → 이미지 위 annotation overlay 정상
4. edge:
   - typecheck pass
   - `npm run dev:web` → Capture 화면 → 썸네일 위 bbox 정상

## 9. 위험

- 중간. platform 의 div→SVG 전환이 visual edge case 있을 수 있음 (border-radius inherit / overflow hidden 등). 시각 spot-check 필수
- platform 의 `Layer` 가 `border-radius: inherit` + `overflow: hidden` 처리하던 부분 — SVG 도 동일 처리 필요 (Layer styled css 그대로 적용)

## 10. 후속

- ui AnnotationOverlay 가 향후 zoom-aware 사용 시 vector-effect non-scaling-stroke 거리. 현 PR scope 밖
- platform `projectToCoverSquare` 가 본 PR 후 caller 0 이면 features/classes/classes.utils 에서 정리 거리 (별도 PR)
