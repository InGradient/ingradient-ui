import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { DashboardView, DraggableAnalysisWidgetGrid } from '@ingradient/platform-pages'
import { AnalysisWidgetShell, DashboardOverviewPanel } from '@ingradient/ui/patterns'
import { downloadCaptureAsPng } from '@ingradient/ui/utils'
import {
  customizeToggleItems,
  defaultLayout,
  type DashboardWidgetKey,
} from '../../../fixtures/platform/0.0.1/dashboard-analysis'
import {
  dashboardScenarios,
  type DashboardScenarioKey,
} from '../../../fixtures/platform/0.0.1/dashboard-scenarios'
import { useDashboardScene } from './dashboard/use-dashboard-scene'
import { buildDashboardWidgets, dashboardWidgetKeys, dashboardWidgetTitles } from './dashboard/build-widgets'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Dashboard',
  referenceStory: 'Pages / Platform / 0.0.1 / Dashboard / Default',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/dashboard-{analysis,scenarios}.ts',
  requiredScenarios: [
    'default', 'no-project', 'loading', 'error', 'customize-open', 'date-range-open',
  ],
  interactions: [
    'Customize 클릭 → popover 토글',
    'Customize checkbox → widget visibility 즉시 적용',
    'Date Range 클릭 → DayPicker popover',
    'Date preset / DayPicker select → date draft',
    'Apply → preferences 저장',
    'Reset → layout 초기화',
  ],
  platformIntegration: [
    'DashboardView 를 그대로 import — props 에 hook 결과 연결',
    'useDashboardPageState() (frontend/features/dashboard/use-dashboard-page-state.ts)',
    'useAnalysisQuery() (real backend)',
    'handleSavePdf → html2canvas + jsPDF',
    'DnD reorder → @dnd-kit/core',
  ],
})

type Args = { scenario: DashboardScenarioKey }

const EMPTY_STATE_STYLE: React.CSSProperties = {
  padding: 24,
  textAlign: 'center',
  color: 'var(--ig-color-text-muted)',
}

const noop = () => undefined

const ComparisonCanvas = styled.div`
  min-height: 100vh;
  padding: var(--ig-space-7) var(--ig-space-9);
  background: var(--ig-color-surface-canvas);
`

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ig-space-7);
  align-items: start;

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
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

function DashboardScene({ scenario: key }: Args) {
  const scenario = dashboardScenarios[key]
  const s = useDashboardScene(scenario)
  const widgets = buildDashboardWidgets()
  const summaryLabel = s.dateDraft?.from
    ? `${s.dateDraft.from.toISOString().slice(0, 10)} → ${(s.dateDraft.to ?? s.dateDraft.from).toISOString().slice(0, 10)}`
    : 'All time'
  const state = scenario.noProject
    ? 'no-project'
    : scenario.loading
    ? 'loading'
    : scenario.error
    ? 'error'
    : 'data'
  const hint = scenario.noProject
    ? 'Select a project to load stats'
    : `Current project stats · ${s.dateLabel}`

  return (
    <DashboardView<DashboardWidgetKey>
      projectName={scenario.projectName}
      saveMessage={scenario.saveMessage}
      onSavePdf={noop}
      customize={{
        open: s.customizeOpen,
        onToggle: () => s.setCustomizeOpen(!s.customizeOpen),
        items: customizeToggleItems,
        visibility: s.preferences as unknown as Record<string, boolean>,
        onToggleItem: (key, checked) =>
          s.togglePreference(key as keyof typeof s.preferences, checked),
      }}
      state={state}
      errorMessage={scenario.error}
      hint={hint}
      dateLabel={s.dateLabel}
      onResetLayout={s.resetLayout}
      dateRange={{
        open: s.dateRangeOpen,
        onToggle: () => s.setDateRangeOpen(!s.dateRangeOpen),
        draft: s.dateDraft,
        onChangeDraft: s.setDateDraft,
        onSelectPreset: s.selectPreset,
        onReset: s.resetDate,
        onApply: s.applyDateDraft,
        summaryLabel,
      }}
      edgeAnalytics={scenario.edgeAnalytics}
      deflectometryEnabled={scenario.deflectometryEnabled}
      widgets={{
        layout: s.preferences.analysis_widget_layout,
        widgets: scenario.noData ? {} : widgets,
        widgetKeys: dashboardWidgetKeys,
        widgetTitles: dashboardWidgetTitles,
        onLayoutChange: s.setLayout,
        onDownloadWidget: (key, node) => {
          void downloadCaptureAsPng(node, { title: `dashboard-${key}` })
        },
        visibility: {
          data_collection: s.preferences.show_data_collection,
          timeline: s.preferences.show_timeline,
          labeling_status: s.preferences.show_labeling_status,
          class_ratio: s.preferences.show_class_ratio,
          labeling_by_person: s.preferences.show_labeling_by_person,
          defects_by_source: s.preferences.show_defects_by_source,
          pending_processed: s.preferences.show_pending_processed,
          dataset_distribution: s.preferences.show_dataset_distribution,
        },
        emptyState: (
          <div style={EMPTY_STATE_STYLE}>All widgets hidden. Enable some via Customize.</div>
        ),
      }}
    />
  )
}

function LayoutComparisonScene() {
  const widgets = buildDashboardWidgets()
  const orderedKeys = defaultLayout.flat()

  return (
    <ComparisonCanvas>
      <ComparisonGrid>
        <DashboardOverviewPanel
          title="Default Grid"
          hint="Current project stats · All time"
          dateLabel="All time"
        >
          <DraggableAnalysisWidgetGrid<DashboardWidgetKey>
            layout={defaultLayout}
            widgets={widgets}
            widgetTitles={dashboardWidgetTitles}
            widgetKeys={dashboardWidgetKeys}
            onDownloadWidget={noop}
          />
        </DashboardOverviewPanel>

        <DashboardOverviewPanel
          title="Compact Masonry"
          hint="Current project stats · All time"
          dateLabel="All time"
        >
          <Masonry>
            {orderedKeys.map((key) => (
              <MasonryItem key={key} data-widget-key={key}>
                <AnalysisWidgetShell onDownload={noop}>
                  {widgets[key]}
                </AnalysisWidgetShell>
              </MasonryItem>
            ))}
          </Masonry>
        </DashboardOverviewPanel>
      </ComparisonGrid>
    </ComparisonCanvas>
  )
}

const SCENARIO_KEYS = Object.keys(dashboardScenarios) as DashboardScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dashboard',
  component: DashboardScene,
  parameters: { layout: 'fullscreen', ...handoff },
  argTypes: {
    scenario: { control: 'select', options: SCENARIO_KEYS, table: { category: 'Page' } },
  },
  args: { scenario: 'default' as DashboardScenarioKey },
} satisfies Meta<typeof DashboardScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoProject: Story = { args: { scenario: 'no-project' } }
export const Loading: Story = { args: { scenario: 'loading' } }
export const Error: Story = { args: { scenario: 'error' } }
export const NoData: Story = { args: { scenario: 'no-data' } }
export const CustomizeOpen: Story = { args: { scenario: 'customize-open' } }
export const DateRangeOpen: Story = { args: { scenario: 'date-range-open' } }
export const SubsetWidgets: Story = { args: { scenario: 'subset-widgets' } }
export const Layout2Rows: Story = { args: { scenario: 'layout-2-rows' } }
export const Layout3PerRow: Story = { args: { scenario: 'layout-3-per-row' } }
export const Layout1PerRow: Story = { args: { scenario: 'layout-1-per-row' } }
export const SaveMessage: Story = { args: { scenario: 'save-message' } }
export const DateApplied: Story = { args: { scenario: 'date-applied' } }
export const NoProjectName: Story = { args: { scenario: 'no-project-name' } }
export const AllWidgetsHidden: Story = { args: { scenario: 'all-widgets-hidden' } }
export const WithEdgeAnalytics: Story = { args: { scenario: 'with-edge-analytics' } }
export const WithDeflectometry: Story = { args: { scenario: 'with-deflectometry' } }
export const LayoutComparison: Story = {
  render: () => <LayoutComparisonScene />,
}
