import { useRef } from 'react'
import { iconSizeNumbers } from '@ingradient/ui'
import { Badge, Tag, IconButton, ContextMenuWithSubmenus, MoreIcon } from '@ingradient/ui/components'
import { Inline } from '@ingradient/ui/primitives'
import {
  DatasetCard, DatasetName, Spacer, CardBottom, ImageCount,
  EDGE_TASK_TAG, edgeTaskTagStyle,
} from './dataset-card.styles'
import { renderClassChips } from './class-chips'
import type { EdgeDataset } from './types'

interface DatasetCardViewProps {
  dataset: EdgeDataset
  isRecent: boolean
  isDotMenuOpen: boolean
  recentBadgeLabel: string
  noClassesLabel: string
  moreLabel: string
  exportLabel: string
  imagesLabel: (count: number) => string
  onSelect: (dataset: EdgeDataset) => void
  onToggleDotMenu: (datasetId: string | null) => void
  onExportClick: (dataset: EdgeDataset) => void
}

export function DatasetCardView(props: DatasetCardViewProps): JSX.Element {
  const {
    dataset, isRecent, isDotMenuOpen, recentBadgeLabel, noClassesLabel,
    moreLabel, exportLabel, imagesLabel,
    onSelect, onToggleDotMenu, onExportClick,
  } = props

  const dotsBtnRef = useRef<HTMLButtonElement>(null)
  const taskStyle = dataset.task_type ? edgeTaskTagStyle(dataset.task_type) : null

  return (
    <DatasetCard $isRecent={isRecent} onClick={() => onSelect(dataset)}>
      <Inline align="flex-start" gap="var(--ig-space-2)" wrap="nowrap" style={{ width: '100%' }}>
        <DatasetName title={dataset.dataset_name}>{dataset.dataset_name}</DatasetName>
        <Spacer />
        {isRecent && <Badge $tone="accent">{recentBadgeLabel}</Badge>}
        {dataset.task_type && taskStyle && (
          <Tag $bg={taskStyle.bg} $color={taskStyle.color}>
            {EDGE_TASK_TAG[dataset.task_type] ?? 'OD'}
          </Tag>
        )}
        <IconButton
          ref={dotsBtnRef}
          variant="ghost"
          size="sm"
          title={moreLabel}
          aria-label={moreLabel}
          onClick={(e) => {
            e.stopPropagation()
            onToggleDotMenu(isDotMenuOpen ? null : dataset.dataset_id)
          }}
        >
          <MoreIcon size={iconSizeNumbers.sm} />
        </IconButton>
        {isDotMenuOpen && (
          <ContextMenuWithSubmenus
            anchorEl={dotsBtnRef.current}
            onClose={() => onToggleDotMenu(null)}
            actions={[
              {
                key: 'export',
                label: exportLabel,
                onClick: () => {
                  onToggleDotMenu(null)
                  onExportClick(dataset)
                },
              },
            ]}
          />
        )}
      </Inline>
      <CardBottom>
        <ImageCount>{imagesLabel(dataset.image_count ?? 0)}</ImageCount>
        <Inline gap="var(--ig-space-1)" justify="flex-end">{renderClassChips(dataset.classes, noClassesLabel)}</Inline>
      </CardBottom>
    </DatasetCard>
  )
}
