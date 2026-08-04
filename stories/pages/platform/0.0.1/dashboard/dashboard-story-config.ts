import type { DashboardScenarioKey } from '../../../../fixtures/platform/0.0.1/dashboard-scenarios'
import { defineHandoff } from '../../../../support/handoff'

export const DASHBOARD_SCENARIO_LABELS: Record<DashboardScenarioKey, string> = {
  default: 'Populated dashboard workspace',
  'no-project': 'No project selected',
  loading: 'Dashboard loading',
  error: 'Dashboard load error',
  'no-data': 'No analysis data',
  'customize-open': 'Customize panel open',
  'date-range-open': 'Date range panel open',
  'subset-widgets': 'Subset of widgets visible',
  'layout-2-rows': 'Legacy default layout duplicate',
  'layout-3-per-row': 'Three widgets per row',
  'layout-1-per-row': 'One widget per row',
  'save-message': 'PDF save feedback',
  'date-applied': 'Applied date range',
  'no-project-name': 'Missing project name',
  'all-widgets-hidden': 'All widgets hidden',
  'with-edge-analytics': 'Edge analytics',
  'with-deflectometry': 'Deflectometry analytics',
}

const dashboardHandoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Dashboard',
  referenceStory: 'Pages / Platform / 0.0.1 / Dashboard / Workspace / Overview',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/dashboard-{analysis,scenarios}.ts',
  requiredScenarios: [
    'default',
    'no-project',
    'loading',
    'error',
    'no-data',
    'no-project-name',
    'layout-3-per-row',
    'layout-1-per-row',
    'with-edge-analytics',
    'with-deflectometry',
    'compact-masonry-study',
    'sectioned-grid-study',
  ],
  interactions: [
    'Customize → widget visibility / all-hidden state → Action payload',
    'Date Range → draft 변경 / Apply → persisted date label + Action payload',
    'Save PDF / widget download → feedback + Action payload',
    'Reset → default widget layout 복원',
    'drag handle → keyboard/pointer reorder callback',
  ],
  platformIntegration: [
    'DashboardView 를 그대로 import — story runtime 이 controlled props 를 구성',
    'preferences / layout → user dashboard preference persistence',
    'analysis widgets → project analysis query results',
    'Save PDF / widget download → capture utilities',
  ],
})

const ACTION_ARG_TYPE = {
  control: { disable: true },
  table: { category: 'Actions', disable: true },
} as const

export function dashboardArgTypes(options: readonly DashboardScenarioKey[]) {
  return {
    scenario: {
      control: {
        type: 'select' as const,
        labels: Object.fromEntries(options.map((key) => [key, DASHBOARD_SCENARIO_LABELS[key]])),
      },
      options: [...options],
      description: 'Choose a documented Dashboard state in this group.',
      table: { category: 'Dashboard state' },
    },
    onSavePdf: ACTION_ARG_TYPE,
    onCustomizeToggle: ACTION_ARG_TYPE,
    onWidgetVisibilityChange: ACTION_ARG_TYPE,
    onDateRangeToggle: ACTION_ARG_TYPE,
    onDateDraftChange: ACTION_ARG_TYPE,
    onDateReset: ACTION_ARG_TYPE,
    onDateApply: ACTION_ARG_TYPE,
    onLayoutReset: ACTION_ARG_TYPE,
    onLayoutChange: ACTION_ARG_TYPE,
    onWidgetDownload: ACTION_ARG_TYPE,
  }
}

export function dashboardParameters(description: string) {
  return {
    layout: 'fullscreen' as const,
    ...dashboardHandoff,
    a11y: { test: 'error' as const },
    controls: { expanded: true },
    docs: {
      ...dashboardHandoff.docs,
      description: {
        component: `${description}\n\n${dashboardHandoff.docs.description.component}`,
      },
    },
  }
}
