import { useState } from 'react'
import { ChipTabs, type ChipTabsItem } from '@ingradient/ui/components'
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

export interface ClassLightboxItem extends ChipTabsItem {
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
  siblings?: ClassLightboxItem[]
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
  siblings = [],
  selectedClassId,
  classIdToColor = {},
  defaultAnnotationColor = 'var(--ig-color-accent)',
  onClose,
}: ClassLightboxProps) {
  const [selectedSibling, setSelectedSibling] = useState<ClassLightboxItem | null>(null)
  if (!item || !imageUrl) return null

  const activeItem =
    selectedSibling && siblings.some((s) => s.id === selectedSibling.id) ? selectedSibling : item

  const colorFor = (classId?: string) =>
    (classId && classIdToColor[classId]) || defaultAnnotationColor
  const boxes = filterByClass(activeItem.bboxes, selectedClassId).map((box, index) => ({
    id: `bbox-${index}`,
    color: colorFor(box.classId),
    x: box.x,
    y: box.y,
    width: box.w,
    height: box.h,
  }))
  const points = filterByClass(activeItem.points, selectedClassId).map((point, index) => ({
    id: `point-${index}`,
    color: colorFor(point.classId),
    x: point.x,
    y: point.y,
  }))

  return (
    <GalleryDetailModal
      image={{
        id: activeItem.id,
        name: activeItem.name ?? 'Image',
        thumb_url: imageUrl,
        width: activeItem.width ?? undefined,
        height: activeItem.height ?? undefined,
      }}
      open={open}
      onClose={onClose}
      main={
        <>
          <ChipTabs
            items={siblings}
            currentId={activeItem.id}
            onSelect={(s) => setSelectedSibling(s as ClassLightboxItem)}
          />
          <ImageInspectorCanvas
            imageUrl={imageUrl}
            imageAlt={activeItem.name ?? 'Image'}
            boxes={boxes}
            points={points}
            showLabels={false}
            showZoomControls={false}
          />
        </>
      }
      sidebar={null}
    />
  )
}
