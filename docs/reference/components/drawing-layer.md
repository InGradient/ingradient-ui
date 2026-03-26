# DrawingLayer

이미지 위에 사각형/점을 렌더링하는 SVG 오버레이. `useDrawingCanvas`와 함께 사용.

## Import

```tsx
import { DrawingLayer, useDrawingCanvas, type DrawingObject } from '@ingradient/ui/components'
```

## DrawingLayer Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `objects` | `DrawingObject[]` | — | 렌더링할 객체 |
| `selectedId` | `string \| null` | — | 선택된 객체 ID |
| `drawingPreview` | `DrawingPreview \| null` | — | 드래그 중 미리보기 |
| `showHandles` | `boolean` | `true` | 리사이즈 핸들 표시 |
| `showLabels` | `boolean` | `false` | 라벨 텍스트 표시 |
| `showCrosshair` | `boolean` | `false` | 십자선 표시 |
| `cursorX/Y` | `number` | — | 십자선 위치 (정규화 0~1) |

## DrawingObject

```tsx
{ id: string; type: 'rect' | 'point'; x: number; y: number; w?: number; h?: number; color?: string; label?: string }
```

모든 좌표는 0~1 정규화 값.

## When to use

- 이미지 위에 사각형/점을 그리거나 표시할 때
- `ImageViewer`의 children으로 주입
- class 할당, 저장 등 비즈니스 로직은 앱에서 처리
