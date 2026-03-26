# SearchField

돋보기 아이콘 + clear 버튼이 포함된 검색 입력.

## Import

```tsx
import { SearchField } from '@ingradient/ui/components'
```

## Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `value` | `string` | — | 검색어 |
| `onChange` | `ChangeEventHandler` | — | 입력 변경 |
| `onClear` | `() => void` | — | clear 버튼 클릭 (없으면 버튼 숨김) |
| `size` | `'sm' \| 'md'` | `'md'` | 크기 |
| `placeholder` | `string` | — | placeholder 텍스트 |

## When to use

- 목록, 테이블, 사이드바에서 필터링 검색이 필요할 때
- `TextField type="search"` 대신 아이콘 + clear가 필요할 때
