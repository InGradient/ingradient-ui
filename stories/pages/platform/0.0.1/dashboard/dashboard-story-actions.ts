import { fn } from 'storybook/test'
import type { DashboardWidgetKey } from '../../../../fixtures/platform/0.0.1/dashboard-analysis'

export interface DashboardStoryActions {
  onSavePdf: () => void
  onCustomizeToggle: (open: boolean) => void
  onWidgetVisibilityChange: (key: string, checked: boolean) => void
  onDateRangeToggle: (open: boolean) => void
  onDateDraftChange: (from: string | null, to: string | null) => void
  onDateReset: () => void
  onDateApply: (from: string | null, to: string | null) => void
  onLayoutReset: () => void
  onLayoutChange: (layout: DashboardWidgetKey[][]) => void
  onWidgetDownload: (key: DashboardWidgetKey) => void
}

export function createDashboardActionArgs(): DashboardStoryActions {
  return {
    onSavePdf: fn<() => void>(),
    onCustomizeToggle: fn<(open: boolean) => void>(),
    onWidgetVisibilityChange: fn<(key: string, checked: boolean) => void>(),
    onDateRangeToggle: fn<(open: boolean) => void>(),
    onDateDraftChange: fn<(from: string | null, to: string | null) => void>(),
    onDateReset: fn<() => void>(),
    onDateApply: fn<(from: string | null, to: string | null) => void>(),
    onLayoutReset: fn<() => void>(),
    onLayoutChange: fn<(layout: DashboardWidgetKey[][]) => void>(),
    onWidgetDownload: fn<(key: DashboardWidgetKey) => void>(),
  }
}
