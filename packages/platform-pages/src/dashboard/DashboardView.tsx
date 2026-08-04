import type { DateRange } from 'react-day-picker'
import { Button, DateRangePicker, type DateRangePickerValue } from '@ingradient/ui/components'
import { WidgetGrid } from './widget-grid'
import { DashboardCustomizePopover } from './dashboard-customize-popover'
import { DashboardHeader } from './dashboard-header'
import { DashboardOverviewPanel } from './dashboard-overview-panel'
import { DraggableAnalysisWidgetGrid } from './DraggableAnalysisWidgetGrid'
import { DeflectometryDashboardSection } from './DeflectometryDashboardSection'
import { EdgeAnalyticsSection } from './EdgeAnalyticsSection'
import { Content, Page } from './DashboardView.styles'
import type { DashboardViewProps, DateRangePreset } from './types'

const DATE_PRESET_OPTIONS: Array<{ id: DateRangePreset; label: string }> = [
  { id: 'today', label: 'Today' },
  { id: 'last7', label: 'Last 7 days' },
  { id: 'thisMonth', label: 'This month' },
]

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

export function resolveDashboardDatePreset(
  preset: DateRangePreset,
  referenceDate = new Date(),
): DateRange {
  const to = startOfDay(referenceDate)
  if (preset === 'today') return { from: new Date(to), to: new Date(to) }
  if (preset === 'last7') {
    const from = new Date(to)
    from.setDate(from.getDate() - 6)
    return { from, to }
  }
  return { from: new Date(to.getFullYear(), to.getMonth(), 1), to }
}

export function DashboardView<K extends string = string>({
  projectName,
  saveMessage,
  onSavePdf,
  customize,
  state,
  errorMessage,
  hint,
  dateLabel,
  onResetLayout,
  dateRange,
  widgets,
  edgeAnalytics,
  deflectometryEnabled,
}: DashboardViewProps<K>) {
  const datePresets = DATE_PRESET_OPTIONS.map(({ id, label }) => ({
    id,
    label,
    resolve: () => {
      dateRange.onSelectPreset(id)
      return resolveDashboardDatePreset(id, dateRange.referenceDate)
    },
  }))

  return (
    <Page>
      <DashboardHeader
        projectName={projectName}
        saveMessage={saveMessage}
        actions={
          <>
            <Button variant="solid" type="button" onClick={onSavePdf}>
              Save PDF
            </Button>
            <Button variant="secondary" type="button" onClick={customize.onToggle}>
              Customize
            </Button>
            {customize.open ? (
              <DashboardCustomizePopover
                items={customize.items}
                visibility={customize.visibility}
                onToggle={customize.onToggleItem}
              />
            ) : null}
          </>
        }
      />
      <Content>
        <DashboardOverviewPanel
          state={state}
          hint={hint}
          dateLabel={dateLabel}
          errorMessage={errorMessage}
          onToggleDate={dateRange.onToggle}
          onResetLayout={onResetLayout}
          datePopover={
            dateRange.open ? (
              <DateRangePicker
                mode="range"
                value={dateRange.draft}
                onChange={(next: DateRangePickerValue) => dateRange.onChangeDraft(next as DateRange | undefined)}
                presets={datePresets}
                onReset={dateRange.onReset}
                onApply={dateRange.onApply}
                summaryLabel={dateRange.summaryLabel}
                title="Overview Date Range"
                subtitle="Filter all Project Overview widgets by created date."
                footerHint="Saved per user and restored on next visit."
              />
            ) : null
          }
        >
          {state === 'data' ? (
            widgets.widgetKeys && widgets.widgetTitles ? (
              <DraggableAnalysisWidgetGrid<K>
                layout={widgets.layout}
                widgets={widgets.widgets}
                widgetTitles={widgets.widgetTitles}
                widgetKeys={widgets.widgetKeys}
                visibility={widgets.visibility}
                onLayoutChange={widgets.onLayoutChange}
                onDownloadWidget={widgets.onDownloadWidget}
                emptyState={widgets.emptyState}
              />
            ) : (
              <WidgetGrid<K>
                layout={widgets.layout}
                widgets={widgets.widgets}
                visibility={widgets.visibility}
                emptyState={widgets.emptyState}
              />
            )
          ) : null}
          {state === 'data' && edgeAnalytics && deflectometryEnabled ? (
            <DeflectometryDashboardSection edgeAnalytics={edgeAnalytics} />
          ) : null}
          {state === 'data' && edgeAnalytics ? (
            <EdgeAnalyticsSection edgeAnalytics={edgeAnalytics} />
          ) : null}
        </DashboardOverviewPanel>
      </Content>
    </Page>
  )
}
