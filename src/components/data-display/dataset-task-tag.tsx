import styled, { css } from 'styled-components'

export type DatasetTaskType = 'object_detection' | 'classification' | 'segmentation' | 'point'

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

const Tag = styled.span<{ $type: DatasetTaskType }>`
  ${({ $type }) => {
    const s = taskTypeStyles[$type]
    return css`
      background: ${s.bg};
      color: ${s.color};
    `
  }}
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.03em;
  white-space: nowrap;
  flex-shrink: 0;
`

export interface DatasetTaskTagProps {
  taskType: DatasetTaskType
  format?: 'short' | 'full'
  className?: string
}

export function DatasetTaskTag({ taskType, format = 'short', className }: DatasetTaskTagProps) {
  const style = taskTypeStyles[taskType]
  return (
    <Tag $type={taskType} className={className} title={style.full}>
      {format === 'short' ? style.short : style.full}
    </Tag>
  )
}
