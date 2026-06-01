import { Button } from '@ingradient/ui/components'
import {
  AnalysisWidgetGrid,
  DashboardCustomizePopover,
  DashboardDateRangePopover,
  DashboardHeader,
  DashboardOverviewPanel,
} from '@ingradient/ui/patterns'
import { DraggableAnalysisWidgetGrid } from './DraggableAnalysisWidgetGrid'
import { DeflectometryDashboardSection } from './DeflectometryDashboardSection'
import { EdgeAnalyticsSection } from './EdgeAnalyticsSection'
import { Content, Page } from './DashboardView.styles'
import type { DashboardViewProps } from './types'

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
            <DashboardDateRangePopover
              open={dateRange.open}
              dateDraft={dateRange.draft}
              onChangeDraft={dateRange.onChangeDraft}
              onSelectPreset={dateRange.onSelectPreset}
              onReset={dateRange.onReset}
              onApply={dateRange.onApply}
              summaryLabel={dateRange.summaryLabel}
            />
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
              <AnalysisWidgetGrid<K>
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
