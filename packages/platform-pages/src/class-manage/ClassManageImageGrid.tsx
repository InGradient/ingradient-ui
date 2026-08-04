import { opacityScale, popupSizeNumbers } from '@ingradient/ui/tokens'
import { Badge } from '@ingradient/ui/components'
import { AnnotationOverlay, ImageGrid } from '@ingradient/ui/patterns'
import type { ClassImage, ClassImagesPaneProps } from './types'

type Props = Pick<
  ClassImagesPaneProps,
  'images' | 'selectedClassId' | 'classIdToColor' | 'onOpenImage' | 'onOpenContextMenu'
>

const GRID_LAYOUT = {
  minWidth: popupSizeNumbers['2xs'],
  gap: 5,
  fixedWidth: true,
  aspectRatio: '4/3' as const,
}

export function ClassManageImageGrid({
  images,
  selectedClassId,
  classIdToColor,
  onOpenImage,
  onOpenContextMenu,
}: Props) {
  const sequenceCounts = images.reduce<Map<string, number>>((counts, image) => {
    if (image.sequence_id) {
      counts.set(image.sequence_id, (counts.get(image.sequence_id) ?? 0) + 1)
    }
    return counts
  }, new Map())

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
        img.sequence_id ? <Badge $tone="neutral">{sequenceCounts.get(img.sequence_id)}</Badge> : null
      }
    />
  )
}
