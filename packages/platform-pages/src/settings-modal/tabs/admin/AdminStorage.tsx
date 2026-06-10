import { SettingsSection, StorageAnalyticsTab } from '@ingradient/ui/patterns'
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
    <SettingsSection title="Storage analytics">
      <StorageAnalyticsTab
        title=""
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
    </SettingsSection>
  )
}
