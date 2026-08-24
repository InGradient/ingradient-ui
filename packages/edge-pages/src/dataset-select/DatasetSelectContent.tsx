import { EmptyState, iconSizeNumbers } from '@ingradient/ui'
import { Badge, Button, PlusIcon } from '@ingradient/ui/components'
import { Grid, Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Content, ErrorMsg, Spinner } from './styles/page.styles'
import { RecentScroll } from './dataset-grid.styles'
import { RecentDatasetCard } from './RecentDatasetCard'
import { DatasetCardView } from './DatasetCardView'
import { CreateProjectFormView } from '../dataset-modals/CreateProjectFormView'
import type { DatasetSelectViewProps } from './types'

const ROLE_TONE = {
  owner: 'warning',
  manager: 'accent',
  labeler: 'success',
} as const

function roleTone(role: string) {
  return ROLE_TONE[role as keyof typeof ROLE_TONE] ?? 'neutral'
}

interface DatasetSelectContentProps {
  loading: boolean
  fetchError: string | null
  recentDatasets: DatasetSelectViewProps['recentDatasets']
  groups: DatasetSelectViewProps['groups']
  totalDatasets: number
  latestDatasetId: string | null
  isOnline: boolean
  openDotMenuDatasetId: string | null

  labels: DatasetSelectViewProps['labels']

  onSelectDataset: DatasetSelectViewProps['onSelectDataset']
  onAddDatasetClick: DatasetSelectViewProps['onAddDatasetClick']
  onExportClick: DatasetSelectViewProps['onExportClick']
  onToggleDotMenu: DatasetSelectViewProps['onToggleDotMenu']
}

export function DatasetSelectContent(props: DatasetSelectContentProps): JSX.Element {
  const {
    loading, fetchError, recentDatasets, groups, totalDatasets, latestDatasetId,
    isOnline, openDotMenuDatasetId, labels,
    onSelectDataset, onAddDatasetClick, onExportClick, onToggleDotMenu,
  } = props

  return (
    <Content>
      {loading && <Spinner>{labels.loading}</Spinner>}
      {!loading && fetchError && <ErrorMsg>{fetchError}</ErrorMsg>}

      {!loading && !fetchError && recentDatasets.length > 0 && (
        <Stack gap="var(--ig-space-4)">
          <Text size="var(--ig-font-size-2xs)" weight="bold" tone="muted" uppercase letterSpacing="widest">{labels.recentLabel}</Text>
          <RecentScroll>
            {recentDatasets.map(({ dataset, isLatest }) => (
              <RecentDatasetCard
                key={dataset.dataset_id}
                dataset={dataset}
                isLatest={isLatest}
                recentBadgeLabel={labels.recentBadge}
                noClassesLabel={labels.noClasses}
                imagesLabel={labels.images}
                onSelect={onSelectDataset}
              />
            ))}
          </RecentScroll>
        </Stack>
      )}

      {!loading && !fetchError && totalDatasets === 0 && !isOnline && (
        <EmptyState>{labels.emptyOffline}</EmptyState>
      )}

      {!loading && !fetchError && totalDatasets === 0 && isOnline && (
        <CreateProjectFormView labels={{ emptyOnline: labels.emptyOnline, createOnPlatform: labels.createOnPlatform }} />
      )}

      {!loading && !fetchError && groups.map((group) => (
        <Stack key={group.project_id} gap="var(--ig-space-5)">
          <Inline gap="var(--ig-space-4)" wrap="nowrap">
            <Text size="var(--ig-font-size-sm)" weight="bold" tone="muted" uppercase letterSpacing="wider">{group.project_name}</Text>
            {group.deflectometry_enabled && <Badge $tone="accent">Deflectometry</Badge>}
            <Badge $tone={roleTone(group.role)}>{labels.roleLabel(group.role)}</Badge>
            <Button
              variant="secondary"
              size="sm"
              style={{ marginLeft: 'auto' }}
              onClick={(e) => { e.stopPropagation(); onAddDatasetClick(group.project_id) }}
            >
              <PlusIcon size={iconSizeNumbers["2xs"]} />
              {labels.addDataset}
            </Button>
          </Inline>
          <Grid columns="repeat(auto-fill, minmax(var(--ig-popup-sm), 1fr))" gap="var(--ig-space-4)">
            {group.datasets.map((d) => (
              <DatasetCardView
                key={d.dataset_id}
                dataset={d}
                isRecent={d.dataset_id === latestDatasetId}
                isDotMenuOpen={openDotMenuDatasetId === d.dataset_id}
                recentBadgeLabel={labels.recentBadge}
                noClassesLabel={labels.noClasses}
                moreLabel={labels.more}
                exportLabel={labels.export}
                imagesLabel={labels.images}
                onSelect={onSelectDataset}
                onToggleDotMenu={onToggleDotMenu}
                onExportClick={onExportClick}
              />
            ))}
          </Grid>
        </Stack>
      ))}
    </Content>
  )
}
