import type { ReactNode } from 'react'
import type { DateRange } from 'react-day-picker'
import type {
  DashboardCustomizeItem,
  DateRangePreset,
  WidgetGridLayout,
} from '@ingradient/ui/patterns'
import type { EdgeAnalyticsView } from './edge-analytics-types'

export type { DashboardCustomizeItem, DateRangePreset, WidgetGridLayout }

export type DashboardState = 'no-project' | 'loading' | 'error' | 'data'

export interface DashboardCustomizePaneProps {
  open: boolean
  onToggle: () => void
  items: DashboardCustomizeItem[]
  visibility: Record<string, boolean>
  onToggleItem: (key: string, checked: boolean) => void
}

export interface DashboardDateRangePaneProps {
  open: boolean
  onToggle: () => void
  draft: DateRange | undefined
  onChangeDraft: (next: DateRange | undefined) => void
  onSelectPreset: (preset: DateRangePreset) => void
  onReset: () => void
  onApply: () => void
  summaryLabel: string
}

export interface DashboardWidgetsPaneProps<K extends string = string> {
  layout: WidgetGridLayout<K>
  widgets: Partial<Record<K, ReactNode>>
  visibility?: Partial<Record<K, boolean>>
  emptyState?: ReactNode
  /** 모든 widget key (드래그 reorder 정규화에 사용). 없으면 비-드래그 모드. */
  widgetKeys?: readonly K[]
  /** widget 별 표시 제목 (drag overlay / aria-label). widgetKeys 와 함께 제공 시 드래그 활성화. */
  widgetTitles?: Record<K, string>
  /** layout 변경 콜백. widgetKeys 와 widgetTitles 와 함께 제공 시 드래그 reorder 가능. */
  onLayoutChange?: (next: WidgetGridLayout<K>) => void
  /** widget 별 download 콜백. dom node 캡쳐용 ref 가 두 번째 인자로 전달. */
  onDownloadWidget?: (key: K, node: HTMLElement | null) => void
}

export interface DashboardViewProps<K extends string = string> {
  projectName?: string | null
  saveMessage?: string | null
  onSavePdf: () => void

  customize: DashboardCustomizePaneProps

  state: DashboardState
  errorMessage?: string | null
  hint?: string
  dateLabel: string
  onResetLayout: () => void
  dateRange: DashboardDateRangePaneProps

  widgets: DashboardWidgetsPaneProps<K>

  /** Dashboard 하단 Edge analytics 섹션 데이터. 있으면 widget grid 아래 렌더. */
  edgeAnalytics?: EdgeAnalyticsView
  /** true 일 때 Deflectometry summary 섹션도 표시. `edgeAnalytics` 필요. */
  deflectometryEnabled?: boolean
}
