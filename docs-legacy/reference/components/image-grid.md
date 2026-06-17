# Image Grid

## Import

```ts
import { ImageGrid } from '@ingradient/ui/components'
```

## What It Is

thumbnail browsing, selection, metadata chip을 위한 범용 media grid다.

## When To Use

- gallery-like browsing
- template preview grid
- visual asset list

## Main Props

- `items: T[]`
- `getImageSrc: (item) => string`
- `getTitle?: (item) => ReactNode`
- `getDescription?: (item) => ReactNode`
- `getMeta?: (item) => ReactNode`
- `selectedIds?: Array<string | number>`
- `onItemClick?: (item) => void`
- `minItemWidth?: number`

## States

- default
- hover
- selected

## Do

- selection은 `selectedIds`로 외부에서 제어한다
- visual browsing shell로 사용한다

## Don’t

- annotation, dataset action, export workflow를 core image grid 안에 넣지 않는다
