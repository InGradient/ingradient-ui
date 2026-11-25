import { SelectableListItem } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'

const LIST_STYLE = {
  position: 'absolute' as const,
  top: 'var(--ig-spacing-48)',
  left: 'var(--ig-spacing-12)',
  zIndex: 'var(--ig-z-capture)',
  padding: 'var(--ig-spacing-4)',
  borderRadius: 'var(--ig-radius-md)',
  background: 'var(--ig-color-surface-raised)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
}

export interface ImageViewListItem {
  id: string
  name: string
}

export interface ImageViewListProps {
  views: ImageViewListItem[]
  currentId?: string | null
  onSelect: (id: string) => void
}

/**
 * 이미지 한 장의 여러 보기 사이를 전환하는 왼쪽 floating 목록. 보기가 없으면 아무것도 렌더하지 않는다.
 * canvas 의 floating overlay 자리(position: relative 부모)에 넣어 쓴다.
 */
export function ImageViewList({ views, currentId, onSelect }: ImageViewListProps) {
  if (views.length === 0) return null
  return (
    <Stack
      gap="var(--ig-spacing-4)"
      style={LIST_STYLE}
      role="listbox"
      aria-label="Image views"
      data-ig-component="ImageViewList"
    >
      {views.map((view) => (
        <SelectableListItem
          key={view.id}
          role="option"
          aria-selected={view.id === currentId}
          selected={view.id === currentId}
          onClick={() => onSelect(view.id)}
        >
          {view.name}
        </SelectableListItem>
      ))}
    </Stack>
  )
}
