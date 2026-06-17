# SelectionActionBar

아이템 선택 시 상단에 나타나는 액션 바.

## Import

```tsx
import { SelectionActionBar } from '@ingradient/ui/components'
```

## Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `selectedCount` | `number` | — | 선택된 수 (0이면 렌더링 안 함) |
| `totalCount` | `number` | — | 전체 수 (표시용) |
| `onClearSelection` | `() => void` | — | 선택 해제 |
| `onSelectAll` | `() => void` | — | 전체 선택 (없으면 버튼 숨김) |
| `actions` | `ReactNode` | — | 오른쪽 액션 버튼 슬롯 |
