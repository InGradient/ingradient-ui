# Recipe: Gallery with Selection

ImageGrid + useSelection + SelectionActionBar 조합으로 이미지 갤러리 + 멀티 셀렉트.

## 코드

```tsx
import {
  ImageGrid, useSelection, SelectionActionBar, Button,
} from '@ingradient/ui/components'

const images = [
  { id: '1', name: 'IMG_001.png', src: '/thumbs/1.jpg' },
  { id: '2', name: 'IMG_002.png', src: '/thumbs/2.jpg' },
  // ...
]

function Gallery() {
  const { selectedIds, clearSelection, selectAll, onSelectionChange } = useSelection(images)

  return (
    <div>
      <SelectionActionBar
        selectedCount={selectedIds.size}
        totalCount={images.length}
        onClearSelection={clearSelection}
        onSelectAll={() => selectAll()}
        actions={<Button variant="secondary" tone="danger">Delete</Button>}
      />
      <ImageGrid
        items={images}
        getImageSrc={(img) => img.src}
        getTitle={(img) => img.name}
        selectedIds={[...selectedIds]}
        onItemClick={(img) => onSelectionChange('toggle', img.id)}
      />
    </div>
  )
}
```
