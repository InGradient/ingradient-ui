import { Badge } from '@ingradient/ui/components'
import { Inline, Text } from '@ingradient/ui/primitives'
import {
  RecentCard, DatasetName, Spacer, CardBottom, ImageCount,
} from './dataset-card.styles'
import { renderClassChips } from './class-chips'
import type { EdgeDataset } from './types'

interface RecentDatasetCardProps {
  dataset: EdgeDataset
  isLatest: boolean
  recentBadgeLabel: string
  noClassesLabel: string
  imagesLabel: (count: number) => string
  onSelect: (dataset: EdgeDataset) => void
}

export function RecentDatasetCard(props: RecentDatasetCardProps): JSX.Element {
  const { dataset, isLatest, recentBadgeLabel, noClassesLabel, imagesLabel, onSelect } = props
  return (
    <RecentCard $isLatest={isLatest} onClick={() => onSelect(dataset)}>
      <Inline align="flex-start" gap="var(--ig-space-2)" wrap="nowrap" style={{ width: '100%' }}>
        <DatasetName title={dataset.dataset_name}>{dataset.dataset_name}</DatasetName>
        {isLatest && <><Spacer /><Badge $tone="accent">{recentBadgeLabel}</Badge></>}
      </Inline>
      <Text size="var(--ig-font-size-2xs)" tone="muted">{dataset.project_name}</Text>
      <CardBottom>
        <ImageCount>{imagesLabel(dataset.image_count ?? 0)}</ImageCount>
        <Inline gap="var(--ig-space-1)" justify="flex-end">{renderClassChips(dataset.classes, noClassesLabel)}</Inline>
      </CardBottom>
    </RecentCard>
  )
}
