// SystemMonitorModalView 의 monitor / cleanup 탭 슬롯 합성 scene.
import { useState } from 'react'
import {
  SystemMonitorCleanupTabView,
  SystemMonitorModalView,
  SystemMonitorMonitorTabView,
} from '@ingradient/edge-pages'
import type { SystemMonitorTab } from '@ingradient/edge-pages'
import {
  CLEANUP_TAB_LABELS,
  MONITOR_TAB_LABELS,
  SAMPLE_CLEANUP_STATS,
  SAMPLE_MONITOR_HISTORY,
  SAMPLE_MONITOR_LATEST,
  SYSTEM_MONITOR_LABELS,
} from '../../../../fixtures/edge/0.0.1/system-monitor'

export function SystemMonitorContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState<SystemMonitorTab>('monitor')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(['datasets']),
  )

  const toggleCategory = (category: string): void => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  const monitorContent = (
    <SystemMonitorMonitorTabView
      latest={SAMPLE_MONITOR_LATEST}
      history={SAMPLE_MONITOR_HISTORY}
      labels={MONITOR_TAB_LABELS}
    />
  )

  const cleanupContent = (
    <SystemMonitorCleanupTabView
      stats={SAMPLE_CLEANUP_STATS}
      loading={false}
      running={false}
      result={null}
      selectedCategories={selectedCategories}
      labels={CLEANUP_TAB_LABELS}
      onToggleCategory={toggleCategory}
      onRun={() => undefined}
      onRefresh={() => undefined}
    />
  )

  return (
    <SystemMonitorModalView
      activeTab={activeTab}
      labels={SYSTEM_MONITOR_LABELS}
      monitorContent={monitorContent}
      cleanupContent={cleanupContent}
      onClose={() => undefined}
      onSetActiveTab={setActiveTab}
    />
  )
}
