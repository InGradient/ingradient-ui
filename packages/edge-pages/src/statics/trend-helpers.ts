import type { ImageItem } from '../images/image-helpers'
import type { TrendMode } from './types'

export const MS_PER_DAY = 86400000

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function formatDay(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export type TrendRow = { label: string } & Record<string, string | number>

export function buildClassTrend(
  images: ImageItem[],
  classes: { class_id: string; class_name: string; color: string }[],
  mode: TrendMode,
): TrendRow[] {
  const today = startOfDay(new Date())
  const buckets: { label: string; start: number; end: number; counts: Record<string, number> }[] = []

  if (mode === 'weeklyMonth') {
    for (let i = 3; i >= 0; i -= 1) {
      const start = today.getTime() - i * 7 * MS_PER_DAY
      const end = start + 7 * MS_PER_DAY
      const endDate = new Date(end - MS_PER_DAY)
      buckets.push({ label: `${formatDay(new Date(start))}-${formatDay(endDate)}`, start, end, counts: {} })
    }
  } else {
    const days = mode === 'daily14' ? 14 : 7
    for (let i = days - 1; i >= 0; i -= 1) {
      const start = today.getTime() - i * MS_PER_DAY
      buckets.push({ label: formatDay(new Date(start)), start, end: start + MS_PER_DAY, counts: {} })
    }
  }

  for (const image of images) {
    if (!image.capturedAt || !image.bboxes?.length) continue
    const captured = new Date(image.capturedAt).getTime()
    if (Number.isNaN(captured)) continue
    const bucket = buckets.find((item) => captured >= item.start && captured < item.end)
    if (!bucket) continue
    for (const bbox of image.bboxes) {
      bucket.counts[bbox.classId] = (bucket.counts[bbox.classId] ?? 0) + 1
    }
  }

  return buckets.map((bucket) => ({
    label: bucket.label,
    ...Object.fromEntries(classes.map((klass) => [klass.class_id, bucket.counts[klass.class_id] ?? 0])),
  }))
}
