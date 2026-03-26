# Recipe: Tag Management Panel

TagListSearch + TagList + ColorSwatch 조합으로 태그 검색/추가/선택 패널.

## 코드

```tsx
import { useState } from 'react'
import { TagList, TagListSearch, type TagItemData } from '@ingradient/ui/components'

function ClassPanel({
  connected,
  available,
  onAdd,
  onSelect,
}: {
  connected: TagItemData[]
  available: TagItemData[]
  onAdd: (id: string) => void
  onSelect: (id: string) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TagListSearch
        placeholder="Search class to add..."
        candidates={available}
        onSelect={onAdd}
        emptyMessage="No matching classes."
        emptyAction={{ label: 'Go to Classes', onClick: () => {} }}
      />
      <TagList
        items={connected}
        selectedId={selectedId}
        onItemClick={(id) => { setSelectedId(id); onSelect(id) }}
      />
    </div>
  )
}
```

## 앱에서 추가로 처리할 것

- `onAdd`: API 호출로 class를 dataset에 연결
- `onSelect`: 선택된 class를 annotation에 적용
- `available` 목록: 아직 연결되지 않은 class 필터링
