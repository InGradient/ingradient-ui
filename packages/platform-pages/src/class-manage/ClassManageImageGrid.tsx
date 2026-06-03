import { AnnotationOverlay, Badge } from '@ingradient/ui/components'
import { GalleryImageGrid } from '@ingradient/ui/patterns'
import type { ClassImage, ClassImagesPaneProps } from './types'

type Props = Pick<
  ClassImagesPaneProps,
  'images' | 'selectedClassId' | 'classIdToColor' | 'onOpenImage' | 'onOpenContextMenu'
>

export function ClassManageImageGrid({
  images,
  selectedClassId,
  classIdToColor,
  onOpenImage,
  onOpenContextMenu,
}: Props) {
  return (
    <GalleryImageGrid<ClassImage>
      items={images}
      padded
      showKebab={false}
      onOpen={onOpenImage}
      onContextMenu={(image, event) => {
        event.preventDefault()
        onOpenContextMenu(image, { top: event.clientY, left: event.clientX })
      }}
      onDragStart={(image, event) => {
        event.dataTransfer.setData('text/plain', image.id)
        event.dataTransfer.effectAllowed = 'copy'
      }}
      renderOverlay={(image) => (
        <AnnotationOverlay
          bboxes={image.bboxes}
          points={image.points}
          getColor={(id) => (id ? classIdToColor[id] : undefined)}
          selectedClassId={selectedClassId}
          imageWidth={image.width}
          imageHeight={image.height}
          fillOpacity={0.22}
          emphasize
        />
      )}
      renderTopRight={(image) => (
        image.sequence_id ? <Badge $tone="neutral">4</Badge> : null
      )}
    />
  )
}
