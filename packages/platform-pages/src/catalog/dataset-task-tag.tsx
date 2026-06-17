import { Tag } from '@ingradient/ui/components'
import { type DatasetTaskType } from '@ingradient/ui/patterns'

export type { DatasetTaskType }

const taskTypeStyles: Record<DatasetTaskType, { bg: string; color: string; short: string; full: string }> = {
  object_detection: {
    bg: 'var(--ig-color-tag-object-detection-bg)', color: 'var(--ig-color-accent)',
    short: 'OD', full: 'Object Detection',
  },
  classification: {
    bg: 'var(--ig-color-tag-classification-bg)', color: 'var(--ig-color-tag-classification-text)',
    short: 'CLS', full: 'Classification',
  },
  segmentation: {
    bg: 'var(--ig-color-tag-segmentation-bg)', color: 'var(--ig-color-tag-segmentation-text)',
    short: 'Seg', full: 'Segmentation',
  },
  point: {
    bg: 'var(--ig-color-tag-object-detection-bg)', color: 'var(--ig-color-accent)',
    short: 'PT', full: 'Point',
  },
}

export interface DatasetTaskTagProps {
  taskType: DatasetTaskType
  format?: 'short' | 'full'
  className?: string
  'data-ig-component'?: string
  'data-ig-label'?: string
  'data-ig-slot'?: string
}

export function DatasetTaskTag({
  taskType,
  format = 'short',
  className,
  'data-ig-component': componentHint,
  'data-ig-label': componentLabel,
  'data-ig-slot': slotHint,
}: DatasetTaskTagProps) {
  const componentName = 'DatasetTaskTag'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)
  const style = taskTypeStyles[taskType]
  return (
    <Tag
      $bg={style.bg}
      $color={style.color}
      className={className}
      title={style.full}
      data-ig-component={componentName}
      data-ig-layer="patterns"
      data-ig-slot={slotName}
      data-ig-kind="tag"
      data-ig-label={componentLabel ?? style.full}
    >
      {format === 'short' ? style.short : style.full}
    </Tag>
  )
}
