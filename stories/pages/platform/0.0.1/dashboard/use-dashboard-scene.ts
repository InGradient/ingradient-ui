import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import type { DashboardPreferences, DashboardWidgetKey } from '../../../../fixtures/platform/0.0.1/dashboard-analysis'
import type { DashboardScene } from '../../../../fixtures/platform/0.0.1/dashboard-scenarios'

export interface DashboardSceneState {
  preferences: DashboardPreferences
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

  useEffect(() => {
    setPreferences(scenario.preferences)
    setCustomizeOpen(!!scenario.customizeOpen)
    setDateRangeOpen(!!scenario.dateRangeOpen)
    setDateDraft(undefined)
  }, [scenario])

  const togglePreference = (key: keyof DashboardPreferences, checked: boolean) =>
    setPreferences((prev) => ({ ...prev, [key]: checked }))

  const applyDateDraft = () => {
    if (!dateDraft?.from) return
    const toIso = (d: Date) => d.toISOString().slice(0, 10)
    setPreferences((prev) => ({
      ...prev,
      overview_date_start: toIso(dateDraft.from!),
      overview_date_end: toIso(dateDraft.to ?? dateDraft.from!),
    }))
    setDateRangeOpen(false)
  }

  const resetDate = () => {
    setDateDraft(undefined)
    setPreferences((prev) => ({ ...prev, overview_date_start: null, overview_date_end: null }))
  }

  const selectPreset = (preset: 'today' | 'last7' | 'thisMonth') => {
    const today = new Date()
    if (preset === 'today') {
      setDateDraft({ from: today, to: today })
    } else if (preset === 'last7') {
      setDateDraft({ from: new Date(today.getTime() - 6 * 86400000), to: today })
    } else {
      setDateDraft({ from: new Date(today.getFullYear(), today.getMonth(), 1), to: today })
    }
  }

  const resetLayout = () => {
    setPreferences((prev) => ({ ...prev, analysis_widget_layout: scenario.preferences.analysis_widget_layout }))
  }

  const setLayout = (next: DashboardPreferences['analysis_widget_layout']) => {
    setPreferences((prev) => ({ ...prev, analysis_widget_layout: next }))
  }

  const dateLabel = scenario.dateLabel ?? formatRange(preferences.overview_date_start, preferences.overview_date_end)

  return {
    preferences, customizeOpen, setCustomizeOpen, togglePreference,
    dateRangeOpen, setDateRangeOpen, dateDraft, setDateDraft, dateLabel,
    applyDateDraft, resetDate, selectPreset, resetLayout, setLayout,
  }
}

export type { DashboardWidgetKey }
