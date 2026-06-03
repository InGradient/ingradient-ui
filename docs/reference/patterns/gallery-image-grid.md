# Gallery Image Grid

## Import

```ts
import { GalleryImageGrid } from '@ingradient/ui/patterns'
```

## What It Is

Catalog 스타일의 4:3 이미지 카드 그리드를 공유하는 pattern이다.

## When To Use

- Catalog 같은 이미지 탐색 그리드
- class 이미지처럼 같은 카드 스타일에 overlay를 주입해야 하는 영역
- hover preview, context menu, drag start가 필요한 gallery

## Main Props

- `items`
- `selectedIds`
- `minItemWidth`
- `gap`
- `padded`
- `hoverItemId`
- `showKebab`
- `onOpen`
- `onSelect`
- `onOpenMenu`
- `onContextMenu`
- `onDragStart`
- `renderOverlay`
- `renderTopRight`
- `renderHoverPreview`

## Do

- 카드 visual은 `GalleryImageGrid` / `GalleryImageCard`로 공유한다.
- 기본 컬럼 폭은 Catalog 기준인 `140px`로 고정해 다른 page에서도 이미지 크기를 일관되게 유지한다.
- Catalog 같은 full-pane gallery는 `padded`를 사용해 같은 panel spacing을 유지한다.
- annotation, badge 같은 domain-specific UI는 render slot으로 주입한다.

## Don't

- Catalog와 ClassManage에서 이미지 카드 spacing, radius, selection border를 따로 정의하지 않는다.
