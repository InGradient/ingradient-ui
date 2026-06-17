---
title: PR-E0b — DrawingLayer 자체 ResizeObserver self-measure
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E0b — DrawingLayer self-measure ResizeObserver

## 1. 증상

ui Storybook `Components / Data Display / DrawingLayer` Review story 의 "Annotation set / Selected object / Drafting preview" 카드에서 class label 글자가 *위아래로 눌림* — aspect ratio 왜곡.

platform / edge 실 사용 (CatalogImageDetailModal, BBoxCanvas) 에서는 정상 — storybook 만의 시각적 결함처럼 보이지만 실은 *prop 값이 실 DOM 과 안 맞을 때* 양 어느 쪽에서든 발생할 수 있는 잠재 버그.

## 2. 근본 원인

### 2.1 label transform 분석

[drawing-layer.tsx:145](src/components/data-display/drawing-layer.tsx#L145):

```tsx
<g transform={`translate(${obj.x}, ${obj.y}) scale(${1 / (cw * z)}, ${1 / (ch * z)})`}>
```

이 `g` 안에서 label rect / text 를 *픽셀 단위* 로 그림 (font-size 11px 등). `viewBox="0 0 1 1"` + `preserveAspectRatio="none"` 인 SVG 안에서 비-등방성 픽셀 → 정규화 좌표로 환원하기 위해:
- x 방향 정규화 단위 1 == cw 픽셀 → 픽셀 1 = `1/(cw*z)` 정규화 단위
- y 방향 동일하게 `1/(ch*z)`

**`cw == ch` 면 균등 (uniform) scale → glyph 정상**.
**`cw ≠ ch` (실 DOM 가변) 면 비-등방성 → glyph 왜곡**.

### 2.2 storybook 에서 발생 이유

[drawing-layer.stories.tsx:42-43](src/components/data-display/drawing-layer.stories.tsx#L42-L43) 에서:
```tsx
containerWidth: CANVAS_WIDTH,   // 640
containerHeight: CANVAS_HEIGHT, // 360
```

[drawing-layer.stories.tsx:97](src/components/data-display/drawing-layer.stories.tsx#L97) 그리드 `repeat(auto-fit, minmax(280px, 1fr))` → 카드 width 가 280~340px 사이 가변 + DrawingFrame `min-height: 280` 만 명시 → 카드 안 SVG 의 실제 DOM 크기는 약 `300 × 280` 등 unspecified ratio.

→ DrawingLayer 가 받은 prop = 640/360 (≈ 1.78), 실제 DOM ≈ 300/280 (≈ 1.07) → ratio 불일치 → label glyph aspect 왜곡.

### 2.3 platform / edge 에서 정상인 이유

- platform CatalogImageDetailModal: ImageViewer 안에 DrawingLayer 배치 + ImageViewer 가 ResizeObserver 로 자기 DOM 측정 → ImageViewerContext 로 cw/ch 정확 공급 → DrawingLayer 가 [drawing-layer.tsx:66-67](src/components/data-display/drawing-layer.tsx#L66-L67) 에서 Context 값 사용
- edge BBoxCanvas: 자체 ResizeObserver 로 측정 후 DrawingLayer 에 prop 명시 → 정확 공급

→ **PR-D1 의 Context auto-supply 가 적용된 곳에서만 정상**. 그 외 caller (current storybook standalone) 는 prop 하드코딩 가변 DOM 환경에서 깨짐.

## 3. 해결 — DrawingLayer 자체 ResizeObserver fallback

caller 가 prop 안 주고 ImageViewer 안에도 안 들어간 경우, DrawingLayer 가 *자기 자신의 SVG element* 크기를 ResizeObserver 로 측정 → cw/ch 자동 공급.

**우선순위**: `prop > Context > self-measured > 0`
- 명시 prop 이 최우선 (caller 가 *물리 source* 를 다르게 알고 있을 가능성)
- ImageViewer 안 → Context 사용
- standalone → self-measure
- 위 3개 모두 0 → uniform=false 폴백 (현재 동작 유지)

## 4. 변경 내용

[drawing-layer.tsx](src/components/data-display/drawing-layer.tsx):

### 4.1 import 추가
```tsx
import { useContext, useEffect, useRef, useState } from 'react'
```

### 4.2 Component body 추가

```tsx
const svgRef = useRef<SVGSVGElement | null>(null)
const [measured, setMeasured] = useState({ w: 0, h: 0 })

useEffect(() => {
  const el = svgRef.current
  if (!el) return
  const ro = new ResizeObserver(([entry]) => {
    if (!entry) return
    const { width, height } = entry.contentRect
    setMeasured((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }))
  })
  ro.observe(el)
  return () => ro.disconnect()
}, [])

const cw = (containerWidth ?? ctx?.containerWidth ?? measured.w) || 0
const ch = (containerHeight ?? ctx?.containerHeight ?? measured.h) || 0
```

### 4.3 svg 에 ref 부착
```tsx
<svg ref={svgRef} ...>
```

### 4.4 storybook 정리 (선택 — separate PR or same PR)

self-measure 동작 검증을 위해 standalone 카드의 `containerWidth/Height` prop 명시 제거:

[drawing-layer.stories.tsx:101-105](src/components/data-display/drawing-layer.stories.tsx#L101-L105) 등 3 카드:
```tsx
<DrawingLayer
  objects={sampleObjects}
  // containerWidth/Height 제거 — self-measure 가 자동
  showLabels
/>
```

또한 meta.args 에서 [stories:42-43](src/components/data-display/drawing-layer.stories.tsx#L42-L43) `containerWidth/Height` 값 제거 → Playground 도 self-measure 사용.

"Standalone (explicit props)" 카드는 *명시 prop 우선* 동작 검증 위해 그대로 유지.

## 5. 영향 분석

**ui 단**:
- caller 가 prop 명시 안 해도 + ImageViewer 안에 안 들어가도 → 정상 동작
- prop 명시 또는 Context 환경에서는 동작 변경 0 (우선순위 위)
- API 단순화 — caller burden 감소 (D-007 정신)

**performance**:
- ResizeObserver 1개 추가 — 부담 무시 가능
- React state update 가 measured.w/h 변경 시만 발생 (메모 체크) → 불필요 re-render 방지

**consumer**:
- platform CatalogImageDetailModal: 동일 동작 (Context 사용 우선)
- edge BBoxCanvas: 동일 동작 (prop 명시 우선)
- 회귀 0

**잠재 회귀**:
- ResizeObserver SSR 환경 에서 undefined → useEffect 안 client-side 실행이라 안전 (ChartResponsive 도 동일 패턴)
- React strict mode double-mount 에서 observer disconnect 정상 — useEffect cleanup 확인

## 6. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook 시각:
   - "Annotation set / Selected object / Drafting preview" — label 정상 비율 (위아래 안 눌림)
   - "Zoom-stable rendering / Auto-supply" — Context 환경 정상 (회귀 없음)
   - "Zoom-stable rendering / Standalone (explicit props)" — prop 명시 정상 (회귀 없음)
   - Playground — meta.args 변경 후 정상
3. ui storybook tests `npm run test-storybook` — 102 tests pass
4. platform CatalogImageDetailModal spot-check (변경 없어야 함)
5. edge BBoxCanvas spot-check (변경 없어야 함)

## 7. 위험

- 낮음. fallback 로직 (prop > Context > measured) 으로 기존 caller 동작 보존
- ResizeObserver 가 SVGSVGElement 측정 — DOM API 표준 (Chrome / Firefox / Safari 모두 지원)

## 8. MASTER-PLAN 갱신

D-016 (zoom-stable rendering) 정신 보강:
- DrawingLayer 가 어떤 environment 에서도 정상 동작
- caller 가 명시 안 해도 self-measure → robust

→ post-phase3-followups.md 에 한 줄 + MASTER-PLAN § 6 D-016 본문에 self-measure 추가
