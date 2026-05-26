import {
  RecentCard, DatasetNameRow, DatasetName, Spacer, DatasetProjectLabel,
  CardBottom, ImageCount, ClassChips, RecentBadge,
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
      <DatasetNameRow>
        <DatasetName title={dataset.dataset_name}>{dataset.dataset_name}</DatasetName>
        {isLatest && <><Spacer /><RecentBadge>{recentBadgeLabel}</RecentBadge></>}
      </DatasetNameRow>
      <DatasetProjectLabel>{dataset.project_name}</DatasetProjectLabel>
      <CardBottom>
        <ImageCount>{imagesLabel(dataset.image_count ?? 0)}</ImageCount>
        <ClassChips>{renderClassChips(dataset.classes, noClassesLabel)}</ClassChips>
      </CardBottom>
    </RecentCard>
  )
}
