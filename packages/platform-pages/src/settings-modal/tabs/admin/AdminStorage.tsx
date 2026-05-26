import { StorageAnalyticsTab } from '../../storage'
import type { AdminStorageProps } from '../../types'

export function AdminStorage({
  error,
  overviewSlot,
  tierChartSlot,
  projectChartSlot,
  resolutionChartSlot,
  formatChartSlot,
  tierTableSlot,
  costTableSlot,
  recommendationsSlot,
  onCopyReport,
}: AdminStorageProps) {
  return (
    <StorageAnalyticsTab
      onCopyReport={onCopyReport}
      error={error}
      overview={overviewSlot}
      tierChart={tierChartSlot}
      projectChart={projectChartSlot}
      resolutionChart={resolutionChartSlot}
      formatChart={formatChartSlot}
      tierTable={tierTableSlot}
      costTable={costTableSlot}
      recommendations={recommendationsSlot}
    />
  )
}
