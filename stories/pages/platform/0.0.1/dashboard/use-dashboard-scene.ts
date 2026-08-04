import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import {
  customizeToggleItems,
  defaultLayout,
  type DashboardPreferences,
  type DashboardWidgetKey,
} from '../../../../fixtures/platform/0.0.1/dashboard-analysis'
import type { DashboardScene } from '../../../../fixtures/platform/0.0.1/dashboard-scenarios'

export interface DashboardSceneState {
  preferences: DashboardPreferences
  customizeItems: typeof customizeToggleItems
  customizeOpen: boolean
  setCustomizeOpen: (v: boolean) => void
  togglePreference: (key: keyof DashboardPreferences, checked: boolean) => void

  dateRangeOpen: boolean
  setDateRangeOpen: (v: boolean) => void
  dateDraft: DateRange | undefined
  setDateDraft: (v: DateRange | undefined) => void
  dateLabel: string
  applyDateDraft: () => void
  resetDate: () => void
  selectPreset: (preset: 'today' | 'last7' | 'thisMonth') => void

  resetLayout: () => void
  setLayout: (next: DashboardPreferences['analysis_widget_layout']) => void

  saveMessage: string | null
  setSaveMessage: (message: string | null) => void
}

export const DASHBOARD_STORY_REFERENCE_DATE = new Date(2026, 4, 14)

export function toDashboardDateString(value: Date): string {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatRange(start: string | null, end: string | null): string {
  if (!start || !end) return 'All time'
  return `${start} → ${end}`
}

export function useDashboardScene(scenario: DashboardScene): DashboardSceneState {
  const [preferences, setPreferences] = useState<DashboardPreferences>(scenario.preferences)
  const [customizeOpen, setCustomizeOpen] = useState<boolean>(!!scenario.customizeOpen)
  const [dateRangeOpen, setDateRangeOpen] = useState<boolean>(!!scenario.dateRangeOpen)
  const [dateDraft, setDateDraft] = useState<DateRange | undefined>(undefined)
  const [saveMessage, setSaveMessage] = useState<string | null>(scenario.saveMessage ?? null)

  useEffect(() => {
    setPreferences(scenario.preferences)
    setCustomizeOpen(!!scenario.customizeOpen)
    setDateRangeOpen(!!scenario.dateRangeOpen)
    setDateDraft(undefined)
    setSaveMessage(scenario.saveMessage ?? null)
  }, [scenario])

  const togglePreference = (key: keyof DashboardPreferences, checked: boolean) =>
    setPreferences((prev) => ({ ...prev, [key]: checked }))

  const applyDateDraft = () => {
    if (!dateDraft?.from) return
    setPreferences((prev) => ({
      ...prev,
      overview_date_start: toDashboardDateString(dateDraft.from!),
      overview_date_end: toDashboardDateString(dateDraft.to ?? dateDraft.from!),
    }))
    setDateRangeOpen(false)
  }

  const resetDate = () => {
    setDateDraft(undefined)
    setPreferences((prev) => ({ ...prev, overview_date_start: null, overview_date_end: null }))
  }

  const selectPreset = (preset: 'today' | 'last7' | 'thisMonth') => {
    const today = new Date(DASHBOARD_STORY_REFERENCE_DATE)
    if (preset === 'today') {
      setDateDraft({ from: today, to: today })
    } else if (preset === 'last7') {
      setDateDraft({ from: new Date(today.getTime() - 6 * 86400000), to: today })
    } else {
      setDateDraft({ from: new Date(today.getFullYear(), today.getMonth(), 1), to: today })
    }
  }

  const resetLayout = () => {
    setPreferences((prev) => ({
      ...prev,
      analysis_widget_layout: defaultLayout.map((row) => [...row]),
    }))
  }

  const setLayout = (next: DashboardPreferences['analysis_widget_layout']) => {
    setPreferences((prev) => ({ ...prev, analysis_widget_layout: next }))
  }

  const dateLabel = formatRange(
    preferences.overview_date_start,
    preferences.overview_date_end,
  )

  return {
    preferences, customizeItems: customizeToggleItems, customizeOpen, setCustomizeOpen, togglePreference,
    dateRangeOpen, setDateRangeOpen, dateDraft, setDateDraft, dateLabel,
    applyDateDraft, resetDate, selectPreset, resetLayout, setLayout,
    saveMessage, setSaveMessage,
  }
}

export type { DashboardWidgetKey }
