# ImageViewer

줌/팬을 내장한 이미지 뷰어. children으로 overlay(DrawingLayer 등)를 주입할 수 있다.

## Import

```tsx
import { ImageViewer, ImageViewerToolbar } from '@ingradient/ui/components'
```

## ImageViewer Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `src` | `string` | — | 이미지 URL |
| `alt` | `string` | — | alt 텍스트 |
| `zoomOptions` | `UseZoomPanOptions` | — | min/max/step 설정 |
| `onZoomChange` | `(zoom: number) => void` | — | 줌 변경 콜백 |
| `children` | `ReactNode` | — | 오버레이 레이어 (DrawingLayer 등) |

## ImageViewerToolbar Props

| Prop | Type | 설명 |
|------|------|------|
| `zoom` | `number` | 현재 줌 |
| `onZoomIn` | `() => void` | 줌 인 |
| `onZoomOut` | `() => void` | 줌 아웃 |
| `onReset` | `() => void` | 리셋 |
| `children` | `ReactNode` | 추가 도구 버튼 슬롯 |

## When to use

- 이미지를 확대해서 세부 사항을 확인할 때
- annotation overlay가 필요할 때 children으로 DrawingLayer 주입
