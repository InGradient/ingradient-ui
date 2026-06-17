import { opacityScale } from '@ingradient/ui'
import { Badge } from '@ingradient/ui/components'
import { AnnotationOverlay, ImageGrid } from '@ingradient/ui/patterns'
import type { ClassImage, ClassImagesPaneProps } from './types'

type Props = Pick<
  ClassImagesPaneProps,
  'images' | 'selectedClassId' | 'classIdToColor' | 'onOpenImage' | 'onOpenContextMenu'
>

// gap: 5 → var(--ig-space-5) = 12px (simon GalleryImageGrid DEFAULT_GAP=12 대응).
const GRID_LAYOUT = { minWidth: 'var(--ig-popup-2xs-narrow)' as unknown as number, gap: 5 }

export function ClassManageImageGrid({
  images,
  selectedClassId,
  classIdToColor,
  onOpenImage,
  onOpenContextMenu,
}: Props) {
  return (
    <ImageGrid
      items={images}
      getThumbnailUrl={(img) => img.thumb_url}
      layout={GRID_LAYOUT}
      padded
      onItemClick={(img) => onOpenImage(img)}
      onContextMenu={(img, _i, e) => {
        e.preventDefault()
        onOpenContextMenu(img, { top: e.clientY, left: e.clientX })
      }}
      onDragStart={(img, _i, e) => {
        e.dataTransfer.setData('text/plain', img.id)
        e.dataTransfer.effectAllowed = 'copy'
      }}
      renderCellOverlay={(img) => (
        <AnnotationOverlay
          bboxes={img.bboxes}
          points={img.points}
          getColor={(id) => (id ? classIdToColor[id] : undefined)}
          selectedClassId={selectedClassId}
          imageWidth={img.width}
          imageHeight={img.height}
          fillOpacity={opacityScale.svgFillMedium}
          emphasize
        />
      )}
      renderCellTopRight={(img: ClassImage) =>
        img.sequence_id ? <Badge $tone="neutral">4</Badge> : null
      }
    />
  )
}
