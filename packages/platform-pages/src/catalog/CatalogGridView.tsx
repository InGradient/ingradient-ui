import { GalleryImageGrid } from '@ingradient/ui/patterns'
import { DragOverGrid } from './CatalogView.styles'
import type { CatalogImage, CatalogImagesPaneProps } from './types'

interface Props extends CatalogImagesPaneProps {
  dragOverGrid?: boolean
}

const PREVIEW_STYLE: React.CSSProperties = {
  width: 320,
  height: 240,
  objectFit: 'cover',
  borderRadius: 'var(--ig-radius-md)',
}

export function CatalogGridView({
  images,
  selectedImageIds,
  hoverImageId,
  onToggleSelect,
  onOpenDetail,
  onOpenMenu,
  dragOverGrid,
}: Props) {
  return (
    <>
      {dragOverGrid ? <DragOverGrid>Drop images here to upload</DragOverGrid> : null}
      <GalleryImageGrid<CatalogImage>
        items={images}
        selectedIds={selectedImageIds}
        padded
        hoverItemId={hoverImageId}
        onSelect={(image) => onToggleSelect(image.id, !selectedImageIds.has(image.id))}
        onOpen={(image) => onOpenDetail(image.id)}
        onOpenMenu={(image, anchor) => onOpenMenu(image.id, anchor)}
        renderHoverPreview={(image) => (
          <img src={image.thumb_url} alt={image.name} style={PREVIEW_STYLE} />
        )}
      />
    </>
  )
}
