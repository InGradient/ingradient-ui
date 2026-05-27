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
import type { DashboardViewProps } from './types'

const DATE_PRESETS = [
  { id: 'today', label: 'Today', resolve: (): DateRange => { const d = new Date(); return { from: d, to: d } } },
  { id: 'last7', label: 'Last 7 days', resolve: (): DateRange => { const to = new Date(); const from = new Date(to); from.setDate(from.getDate() - 6); return { from, to } } },
  { id: 'thisMonth', label: 'This month', resolve: (): DateRange => { const now = new Date(); return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now } } },
]

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
  return (
    <Page>
      <DashboardHeader
        projectName={projectName}
        saveMessage={saveMessage}
        actions={
          <>
            <Button variant="secondary" type="button" onClick={onSavePdf}>
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
                presets={DATE_PRESETS}
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
