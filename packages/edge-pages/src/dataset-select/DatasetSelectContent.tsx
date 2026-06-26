import { Plus } from 'lucide-react'
import { EmptyState, iconSizeNumbers } from '@ingradient/ui'
import { Badge } from '@ingradient/ui/components'
import { Content, SectionLabel, ErrorMsg, Spinner } from './styles/page.styles'
import {
  RecentSection, RecentScroll, ProjectSection, ProjectHeader,
  ProjectName, ProjectTypeTag, AddDatasetBtn, DatasetGrid,
} from './dataset-grid.styles'
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
        <RecentSection>
          <SectionLabel>{labels.recentLabel}</SectionLabel>
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
        </RecentSection>
      )}

      {!loading && !fetchError && totalDatasets === 0 && !isOnline && (
        <EmptyState>{labels.emptyOffline}</EmptyState>
      )}

      {!loading && !fetchError && totalDatasets === 0 && isOnline && (
        <CreateProjectFormView labels={{ emptyOnline: labels.emptyOnline, createOnPlatform: labels.createOnPlatform }} />
      )}

      {!loading && !fetchError && groups.map((group) => (
        <ProjectSection key={group.project_id}>
          <ProjectHeader>
            <ProjectName>{group.project_name}</ProjectName>
            {group.deflectometry_enabled && <ProjectTypeTag>Deflectometry</ProjectTypeTag>}
            <Badge $tone={roleTone(group.role)}>{labels.roleLabel(group.role)}</Badge>
            <AddDatasetBtn onClick={(e) => { e.stopPropagation(); onAddDatasetClick(group.project_id) }}>
              <Plus size={iconSizeNumbers["2xs"]} />
              {labels.addDataset}
            </AddDatasetBtn>
          </ProjectHeader>
          <DatasetGrid>
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
          </DatasetGrid>
        </ProjectSection>
      ))}
    </Content>
  )
}
