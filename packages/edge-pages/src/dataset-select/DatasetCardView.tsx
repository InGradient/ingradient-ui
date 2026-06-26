import { useRef } from 'react'
import { iconSizeNumbers } from '@ingradient/ui'
import { Badge, Tag, IconButton, ContextMenuWithSubmenus, MoreIcon } from '@ingradient/ui/components'
import {
  DatasetCard, DatasetNameRow, DatasetName, Spacer,
  CardBottom, ImageCount, ClassChips, EDGE_TASK_TAG, edgeTaskTagStyle,
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
      <DatasetNameRow>
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
      </DatasetNameRow>
      <CardBottom>
        <ImageCount>{imagesLabel(dataset.image_count ?? 0)}</ImageCount>
        <ClassChips>{renderClassChips(dataset.classes, noClassesLabel)}</ClassChips>
      </CardBottom>
    </DatasetCard>
  )
}
