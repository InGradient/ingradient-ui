import styled from 'styled-components'
import {
  AnalysisWidgetShell,
  DashboardOverviewPanel,
  DraggableAnalysisWidgetGrid,
} from '@ingradient/platform-pages'
import {
  defaultLayout,
  type DashboardWidgetKey,
} from '../../../../fixtures/platform/0.0.1/dashboard-analysis'
import { buildDashboardWidgets, dashboardWidgetTitles } from './build-widgets'

const StudyCanvas = styled.div`
  min-height: 100vh;
  padding: var(--ig-space-7) var(--ig-space-9);
  background: var(--ig-color-surface-canvas);
`

const Masonry = styled.div`
  column-count: 3;
  column-gap: var(--ig-space-5);

  @media (max-width: 1680px) {
    column-count: 2;
  }

  @media (max-width: 1024px) {
    column-count: 1;
  }
`

const MasonryItem = styled.div`
  break-inside: avoid;
  margin-bottom: var(--ig-space-5);
`

const SectionedStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-7);
`

const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
`

const SectionLabel = styled.h3`
  margin: 0;
  font-size: var(--ig-font-size-sm);
  font-weight: 700;
  color: var(--ig-color-text-secondary);
`

const summaryLayout: DashboardWidgetKey[][] = [
  ['data_collection', 'timeline'],
  ['labeling_status', 'class_ratio', 'pending_processed'],
]
const summaryWidgetKeys: readonly DashboardWidgetKey[] = [
  'data_collection', 'timeline', 'labeling_status', 'class_ratio', 'pending_processed',
]
const detailLayout: DashboardWidgetKey[][] = [
  ['labeling_by_person', 'defects_by_source'],
  ['dataset_distribution'],
]
const detailWidgetKeys: readonly DashboardWidgetKey[] = [
  'labeling_by_person', 'defects_by_source', 'dataset_distribution',
]

export type DashboardLayoutStudy = 'compact-masonry' | 'sectioned-grid'

export function DashboardLayoutStudyScene({ study }: { study: DashboardLayoutStudy }) {
  const widgets = buildDashboardWidgets()
  return study === 'compact-masonry' ? (
    <StudyCanvas>
      <DashboardOverviewPanel
        title="Compact Masonry"
        hint="Layout study · variable-height widget flow"
        dateLabel="All time"
      >
        <Masonry>
          {defaultLayout.flat().map((key) => (
            <MasonryItem key={key} data-widget-key={key}>
              <AnalysisWidgetShell>{widgets[key]}</AnalysisWidgetShell>
            </MasonryItem>
          ))}
        </Masonry>
      </DashboardOverviewPanel>
    </StudyCanvas>
  ) : (
    <StudyCanvas>
      <DashboardOverviewPanel
        title="Sectioned Grid"
        hint="Layout study · summary first, breakdown second"
        dateLabel="All time"
      >
        <SectionedStack>
          <SectionBlock aria-labelledby="dashboard-summary-study">
            <SectionLabel id="dashboard-summary-study">Summary</SectionLabel>
            <DraggableAnalysisWidgetGrid
              layout={summaryLayout}
              widgets={widgets}
              widgetTitles={dashboardWidgetTitles}
              widgetKeys={summaryWidgetKeys}
            />
          </SectionBlock>
          <SectionBlock aria-labelledby="dashboard-breakdown-study">
            <SectionLabel id="dashboard-breakdown-study">Breakdown</SectionLabel>
            <DraggableAnalysisWidgetGrid
              layout={detailLayout}
              widgets={widgets}
              widgetTitles={dashboardWidgetTitles}
              widgetKeys={detailWidgetKeys}
            />
          </SectionBlock>
        </SectionedStack>
      </DashboardOverviewPanel>
    </StudyCanvas>
  )
}

export const DASHBOARD_LAYOUT_STUDIES: readonly DashboardLayoutStudy[] = [
  'compact-masonry',
  'sectioned-grid',
]

export const dashboardLayoutStudyArgTypes = {
  study: {
    control: {
      type: 'select' as const,
      labels: {
        'compact-masonry': 'Compact Masonry',
        'sectioned-grid': 'Sectioned Grid',
      },
    },
    options: [...DASHBOARD_LAYOUT_STUDIES],
    description: 'Choose a preserved Dashboard layout study.',
    table: { category: 'Layout study' },
  },
}
