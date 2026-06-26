import { iconSizeNumbers } from '@ingradient/ui'
import { Badge, Tag } from '@ingradient/ui/components'
import { MoreHorizontal, Download } from 'lucide-react'
import {
  DatasetCard, DatasetNameRow, DatasetName, Spacer,
  CardBottom, ImageCount, ClassChips, EDGE_TASK_TAG, edgeTaskTagStyle,
} from './dataset-card.styles'
import {
  DotsBtnWrap, DotsBtn, DotMenuOverlay, DotMenuWrap, DotMenuItem,
} from './dot-menu.styles'
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
        <DotsBtnWrap>
          <DotsBtn
            onClick={(e) => {
              e.stopPropagation()
              onToggleDotMenu(isDotMenuOpen ? null : dataset.dataset_id)
            }}
            title={moreLabel}
          >
            <MoreHorizontal size={iconSizeNumbers.sm} />
          </DotsBtn>
          {isDotMenuOpen && (
            <>
              <DotMenuOverlay onClick={(e) => { e.stopPropagation(); onToggleDotMenu(null) }} />
              <DotMenuWrap onClick={(e) => e.stopPropagation()}>
                <DotMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleDotMenu(null)
                    onExportClick(dataset)
                  }}
                >
                  <Download size={iconSizeNumbers.xsPlus} />
                  {exportLabel}
                </DotMenuItem>
              </DotMenuWrap>
            </>
          )}
        </DotsBtnWrap>
      </DatasetNameRow>
      <CardBottom>
        <ImageCount>{imagesLabel(dataset.image_count ?? 0)}</ImageCount>
        <ClassChips>{renderClassChips(dataset.classes, noClassesLabel)}</ClassChips>
      </CardBottom>
    </DatasetCard>
  )
}
