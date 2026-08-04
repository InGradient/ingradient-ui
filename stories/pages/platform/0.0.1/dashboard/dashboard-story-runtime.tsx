import styled from 'styled-components'
import { DashboardView } from '@ingradient/platform-pages'
import { stateCenteredLayout, stateTitleText } from '@ingradient/ui/primitives'
import {
  dashboardScenarios,
  type DashboardScenarioKey,
} from '../../../../fixtures/platform/0.0.1/dashboard-scenarios'
import type { DashboardStoryActions } from './dashboard-story-actions'
import { buildDashboardWidgets, dashboardWidgetKeys, dashboardWidgetTitles } from './build-widgets'
import {
  DASHBOARD_STORY_REFERENCE_DATE,
  toDashboardDateString,
  useDashboardScene,
} from './use-dashboard-scene'

export interface DashboardStoryArgs extends DashboardStoryActions {
  scenario: DashboardScenarioKey
}

const EmptyState = styled.div`
  ${stateTitleText}
  ${stateCenteredLayout}
  padding: var(--ig-space-7);
`

function toIso(value: Date | undefined) {
  return value ? toDashboardDateString(value) : null
}

export function DashboardScene({ scenario: key, ...actions }: DashboardStoryArgs) {
  const scenario = dashboardScenarios[key]
  const state = useDashboardScene(scenario)
  const widgets = buildDashboardWidgets()
  const dashboardState = scenario.noProject
    ? 'no-project'
    : scenario.loading
      ? 'loading'
      : scenario.error
        ? 'error'
        : 'data'
  const hint = scenario.noProject
    ? 'Select a project to load stats'
    : `Current project stats · ${state.dateLabel}`
  const summaryLabel = state.dateDraft?.from
    ? `${toIso(state.dateDraft.from)} → ${toIso(state.dateDraft.to ?? state.dateDraft.from)}`
    : 'All time'

  return (
    <DashboardView
      projectName={scenario.projectName}
      saveMessage={state.saveMessage}
      onSavePdf={() => {
        actions.onSavePdf()
        state.setSaveMessage('PDF saved.')
      }}
      customize={{
        open: state.customizeOpen,
        onToggle: () => {
          const open = !state.customizeOpen
          actions.onCustomizeToggle(open)
          state.setCustomizeOpen(open)
        },
        items: state.customizeItems,
        visibility: state.preferences as unknown as Record<string, boolean>,
        onToggleItem: (itemKey, checked) => {
          actions.onWidgetVisibilityChange(itemKey, checked)
          state.togglePreference(itemKey as keyof typeof state.preferences, checked)
        },
      }}
      state={dashboardState}
      errorMessage={scenario.error}
      hint={hint}
      dateLabel={state.dateLabel}
      onResetLayout={() => {
        actions.onLayoutReset()
        state.resetLayout()
      }}
      dateRange={{
        open: state.dateRangeOpen,
        onToggle: () => {
          const open = !state.dateRangeOpen
          actions.onDateRangeToggle(open)
          state.setDateRangeOpen(open)
        },
        draft: state.dateDraft,
        onChangeDraft: (next) => {
          actions.onDateDraftChange(toIso(next?.from), toIso(next?.to ?? next?.from))
          state.setDateDraft(next)
        },
        onSelectPreset: state.selectPreset,
        referenceDate: DASHBOARD_STORY_REFERENCE_DATE,
        onReset: () => {
          actions.onDateReset()
          state.resetDate()
        },
        onApply: () => {
          actions.onDateApply(
            toIso(state.dateDraft?.from),
            toIso(state.dateDraft?.to ?? state.dateDraft?.from),
          )
          state.applyDateDraft()
        },
        summaryLabel,
      }}
      edgeAnalytics={scenario.edgeAnalytics}
      deflectometryEnabled={scenario.deflectometryEnabled}
      widgets={{
        layout: state.preferences.analysis_widget_layout,
        widgets: scenario.noData ? {} : widgets,
        widgetKeys: dashboardWidgetKeys,
        widgetTitles: dashboardWidgetTitles,
        onLayoutChange: (layout) => {
          actions.onLayoutChange(layout)
          state.setLayout(layout)
        },
        onDownloadWidget: (widgetKey) => actions.onWidgetDownload(widgetKey),
        visibility: {
          data_collection: state.preferences.show_data_collection,
          timeline: state.preferences.show_timeline,
          labeling_status: state.preferences.show_labeling_status,
          class_ratio: state.preferences.show_class_ratio,
          labeling_by_person: state.preferences.show_labeling_by_person,
          defects_by_source: state.preferences.show_defects_by_source,
          pending_processed: state.preferences.show_pending_processed,
          dataset_distribution: state.preferences.show_dataset_distribution,
        },
        emptyState: (
          <EmptyState>
            {scenario.noData
              ? 'No analysis data is available for this project.'
              : 'All widgets hidden. Enable some via Customize.'}
          </EmptyState>
        ),
      }}
    />
  )
}
