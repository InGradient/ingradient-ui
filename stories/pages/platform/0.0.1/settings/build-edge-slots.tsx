import {
  ExportTabUI,
  ImportTabUI,
  WorkOptionsTabUI,
} from '@ingradient/platform-pages'
import type { EdgeTabPaneProps } from '@ingradient/platform-pages'
import type { SettingsScene } from '../../../../fixtures/platform/0.0.1/settings-scenarios'
import {
  buildMockPatternLabels,
  mockComputeTotalPatterns,
  mockEdgeDatasets,
  mockEdgeImportJobCompleted,
  mockEdgeImportJobUploading,
  mockEdgeMembers,
  mockEdgePackages,
  mockFormatBadgeLabel,
  mockRenderPattern,
} from '../../../../fixtures/platform/0.0.1/settings-edge'
import type { useEdgeTabState } from './use-edge-tab-state'

const noop = () => undefined

/**
 * scenario + edge tab state → EdgeTabPaneProps. SettingsModalView 의 `edge` slot 채움.
 */
export function buildEdgeSlots(
  scenario: SettingsScene,
  s: ReturnType<typeof useEdgeTabState>,
  projectId: string | null,
  deflectometryEnabled: boolean,
): EdgeTabPaneProps {
  const importJob =
    scenario.edgeImportMode === 'uploading'
      ? mockEdgeImportJobUploading
      : scenario.edgeImportMode === 'completed'
        ? mockEdgeImportJobCompleted
        : null

  const importBusy = scenario.edgeImportMode === 'uploading'

  return {
    projectId,
    subTab: s.subTab,
    onSubTabChange: s.setSubTab,
    workSlot: (
      <WorkOptionsTabUI
        options={s.options}
        onOptionsChange={s.setOptions}
        deflectometryEnabled={deflectometryEnabled}
        defl={s.defl}
        onDeflChange={s.setDefl}
        totalPatterns={mockComputeTotalPatterns(s.defl)}
        patternLabels={buildMockPatternLabels(s.defl)}
        formatBadgeLabel={mockFormatBadgeLabel}
        renderPattern={mockRenderPattern}
        savePending={false}
        onSave={noop}
      />
    ),
    exportSlot: (
      <ExportTabUI
        datasets={mockEdgeDatasets}
        members={mockEdgeMembers}
        packages={mockEdgePackages}
        selectedDatasets={s.selectedDatasets}
        selectedUsers={s.selectedUsers}
        deviceName={s.deviceName}
        uniqueMissingHash={[]}
        pending={{ create: false, download: false, reissue: false, rename: false }}
        onDeviceNameChange={s.setDeviceName}
        onToggleDataset={s.toggleDataset}
        onToggleUser={s.toggleUser}
        onSelectAllDatasets={(checked) => s.selectAllDatasets(mockEdgeDatasets.map((d) => d.id), checked)}
        onCreate={noop}
        onDownload={noop}
        onReissue={noop}
        onRenameDevice={noop}
      />
    ),
    importSlot: (
      <ImportTabUI
        job={importJob}
        busy={importBusy}
        pct={importJob?.progress ?? 0}
        label={importBusy ? 'Uploading 12 MB' : ''}
        onFiles={noop}
        onCancel={noop}
      />
    ),
  }
}
