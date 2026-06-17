import { GalleryDetailModal } from '../catalog/gallery/gallery-detail-modal'
import { ImageInspectorCanvas } from '@ingradient/ui/patterns'

export interface ClassLightboxBbox {
  classId?: string
  x: number
  y: number
  w: number
  h: number
}

export interface ClassLightboxPoint {
  classId?: string
  x: number
  y: number
}

export interface ClassLightboxItem {
  id: string
  name?: string | null
  bboxes?: ClassLightboxBbox[] | null
  points?: ClassLightboxPoint[] | null
  width?: number | null
  height?: number | null
}

export interface ClassLightboxProps {
  open: boolean
  item: ClassLightboxItem | null
  imageUrl: string | null
  selectedClassId?: string | null
  classIdToColor?: Record<string, string>
  defaultAnnotationColor?: string
  onClose: () => void
}

const filterByClass = <T extends { classId?: string }>(
  items: T[] | null | undefined,
  classId?: string | null,
) => !items ? [] : (!classId ? items : items.filter((item) => !item.classId || item.classId === classId))

export function ClassLightbox({
  open,
  item,
  imageUrl,
  selectedClassId,
  classIdToColor = {},
  defaultAnnotationColor = 'var(--ig-color-accent)',
  onClose,
}: ClassLightboxProps) {
  if (!item || !imageUrl) return null

  const colorFor = (classId?: string) =>
    (classId && classIdToColor[classId]) || defaultAnnotationColor
  const boxes = filterByClass(item.bboxes, selectedClassId).map((box, index) => ({
    id: `bbox-${index}`,
    color: colorFor(box.classId),
    x: box.x,
    y: box.y,
    width: box.w,
    height: box.h,
  }))
  const points = filterByClass(item.points, selectedClassId).map((point, index) => ({
    id: `point-${index}`,
    color: colorFor(point.classId),
    x: point.x,
    y: point.y,
  }))

  return (
    <GalleryDetailModal
      image={{
        id: item.id,
        name: item.name ?? 'Image',
        thumb_url: imageUrl,
        width: item.width ?? undefined,
        height: item.height ?? undefined,
      }}
      open={open}
      onClose={onClose}
      main={
        <ImageInspectorCanvas
          imageUrl={imageUrl}
          imageAlt={item.name ?? 'Image'}
          boxes={boxes}
          points={points}
          showLabels={false}
          showZoomControls={false}
        />
      }
      sidebar={null}
    />
  )
}
