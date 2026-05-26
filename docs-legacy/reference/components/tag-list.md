# TagList & TagListSearch

색상 태그 목록 + 검색 드롭다운.

## Import

```tsx
import { TagList, TagListSearch, ColorSwatch } from '@ingradient/ui/components'
```

## TagList Props

| Prop | Type | 설명 |
|------|------|------|
| `items` | `TagItemData[]` | `{ id, color, label, count? }` |
| `selectedId` | `string \| null` | 선택된 항목 |
| `activeIds` | `Set<string>` | 활성 항목들 |
| `onItemClick` | `(id: string) => void` | 클릭 |

## TagListSearch Props

| Prop | Type | 설명 |
|------|------|------|
| `candidates` | `TagSearchCandidate[]` | `{ id, color, label }` |
| `onSelect` | `(id: string) => void` | 후보 선택 |
| `emptyMessage` | `string` | 결과 없을 때 메시지 |
| `emptyAction` | `{ label, onClick }` | 결과 없을 때 액션 버튼 |

## ColorSwatch Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `$color` | `string` | — | 색상 |
| `$size` | `'xs' \| 'sm' \| 'md'` | `'sm'` | 8/12/16px |
| `$shape` | `'circle' \| 'square'` | `'circle'` | 형태 |

## When to use

- 라벨/클래스/카테고리 목록에서 색상 태그를 선택할 때
- TagListSearch는 검색 + 드롭다운으로 새 태그를 연결할 때
