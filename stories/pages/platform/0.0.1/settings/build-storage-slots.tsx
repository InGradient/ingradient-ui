import { BarChartCard, PieChartCard } from '@ingradient/ui/patterns'
import {
  StorageOverview,
  StorageRecommendationsList,
  StorageStatsTable,
  type AdminStorageProps,
} from '@ingradient/platform-pages'
import type { SettingsScene } from '../../../../fixtures/platform/0.0.1/settings-scenarios'
import type { SettingsModalStoryActions } from './settings-modal-story-actions'
import {
  storageCostTableColumns,
  storageCostTableFooter,
  storageCostTableRows,
  storageFormatChartData,
  storageOverviewItems,
  storageProjectChartData,
  storageRecommendations,
  storageResolutionChartData,
  storageTierChartData,
  storageTierTableColumns,
  storageTierTableRows,
} from '../../../../fixtures/platform/0.0.1/settings-storage'

const ACCENT_SERIES_GB = [{ key: 'gb', label: 'GB', color: 'var(--ig-color-accent)' }]
const ACCENT_SERIES_COUNT = [{ key: 'count', label: 'Images', color: 'var(--ig-color-accent)' }]

export function buildStorageProps(
  scenario: SettingsScene,
  actions: SettingsModalStoryActions,
): AdminStorageProps {
  const loading = scenario.storageLoading
  return {
    loading,
    error: scenario.storageError,
    onCopyReport: () => actions.onStorageAction('copy-report'),
    overviewSlot: <StorageOverview items={storageOverviewItems} loading={loading} />,
    tierChartSlot: (
      <BarChartCard
        data={storageTierChartData}
        xKey="name"
        series={ACCENT_SERIES_GB}
        layout="vertical"
        height={180}
        loading={loading}
      />
    ),
    projectChartSlot: (
      <BarChartCard
        data={storageProjectChartData}
        xKey="name"
        series={ACCENT_SERIES_GB}
        layout="vertical"
        height={200}
        loading={loading}
      />
    ),
    resolutionChartSlot: (
      <BarChartCard
        data={storageResolutionChartData}
        xKey="name"
        series={ACCENT_SERIES_COUNT}
        height={200}
        loading={loading}
      />
    ),
    formatChartSlot: (
      <PieChartCard
        data={storageFormatChartData}
        innerRadius={0}
        outerRadius={70}
        paddingAngle={1}
        height={200}
        loading={loading}
      />
    ),
    tierTableSlot: (
      <StorageStatsTable
        columns={storageTierTableColumns}
        rows={storageTierTableRows}
        loading={loading}
        ariaLabel="Storage by tier"
      />
    ),
    costTableSlot: (
      <StorageStatsTable
        columns={storageCostTableColumns}
        rows={storageCostTableRows}
        footer={storageCostTableFooter}
        loading={loading}
        ariaLabel="Storage cost estimates"
      />
    ),
    recommendationsSlot: (
      <StorageRecommendationsList recommendations={storageRecommendations} loading={loading} />
    ),
  }
}
