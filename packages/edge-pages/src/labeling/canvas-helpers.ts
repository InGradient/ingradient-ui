import { chartColors } from '@ingradient/ui'
import type { DrawingObject } from '@ingradient/ui/components'

export interface BBox {
  classId: string
  x: number
  y: number
  w: number
  h: number
}

export interface ClassInfo {
  class_id: string
  class_name: string
  color: string
}

export interface EdgeOptions {
  require_labeling: boolean
  require_min_bbox_count: number
  block_next_without_labeling: boolean
}

export const HANDLE_HIT_PX = 12
export const DEFAULT_MODULATION_THRESHOLD = 0.08
export const DEFAULT_MODULATION_DARKEN_FACTOR = 0.3
export const ROI_COLOR = chartColors.gold

export function toDrawingObjects(bboxes: BBox[], classMap: Record<string, ClassInfo>): DrawingObject[] {
  return bboxes.map((b, i) => ({
    id: `bbox-${i}`,
    type: 'rect' as const,
    x: b.x,
    y: b.y,
    w: b.w,
    h: b.h,
    color: classMap[b.classId]?.color ?? 'var(--ig-color-text-muted)',
    label: classMap[b.classId]?.class_name,
  }))
}

export function toBboxes(objects: DrawingObject[], prevBboxes: BBox[], selectedClassId: string | null): BBox[] {
  return objects
    .filter((o): o is DrawingObject & { w: number; h: number } => o.type === 'rect' && o.w != null && o.h != null)
    .map((o, i) => ({
      classId: prevBboxes[i]?.classId ?? selectedClassId ?? '',
      x: o.x,
      y: o.y,
      w: o.w,
      h: o.h,
    }))
}
