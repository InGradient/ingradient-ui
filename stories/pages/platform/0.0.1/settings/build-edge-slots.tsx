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
import type { SettingsModalStoryActions } from './settings-modal-story-actions'

/**
 * scenario + edge tab state → EdgeTabPaneProps. SettingsModalView 의 `edge` slot 채움.
 */
export function buildEdgeSlots(
  scenario: SettingsScene,
  s: ReturnType<typeof useEdgeTabState>,
  projectId: string | null,
  deflectometryEnabled: boolean,
  actions: SettingsModalStoryActions,
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
    onSubTabChange: (tab) => {
      actions.onEdgeSubTabChange(tab)
      s.setSubTab(tab)
    },
    workSlot: (
      <WorkOptionsTabUI
        options={s.options}
        onOptionsChange={(value) => {
          actions.onEdgeAction('change-work-options', JSON.stringify(value))
          s.setOptions(value)
        }}
        deflectometryEnabled={deflectometryEnabled}
        defl={s.defl}
        onDeflChange={(value) => {
          actions.onEdgeAction('change-deflectometry')
          s.setDefl(value)
        }}
        totalPatterns={mockComputeTotalPatterns(s.defl)}
        patternLabels={buildMockPatternLabels(s.defl)}
        formatBadgeLabel={mockFormatBadgeLabel}
        renderPattern={mockRenderPattern}
        savePending={false}
        onSave={() => actions.onEdgeAction('save-work-options')}
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
        onDeviceNameChange={(value) => {
          actions.onEdgeAction('change-device-name', value)
          s.setDeviceName(value)
        }}
        onToggleDataset={(id) => {
          actions.onEdgeAction('toggle-dataset', id)
          s.toggleDataset(id)
        }}
        onToggleUser={(id) => {
          actions.onEdgeAction('toggle-user', id)
          s.toggleUser(id)
        }}
        onSelectAllDatasets={(checked) => {
          actions.onEdgeAction('select-all-datasets', checked)
          s.selectAllDatasets(mockEdgeDatasets.map((d) => d.id), checked)
        }}
        onCreate={() => actions.onEdgeAction('create-package')}
        onDownload={(id) => actions.onEdgeAction('download-package', id)}
        onReissue={(id) => actions.onEdgeAction('reissue-package', id)}
        onRenameDevice={() => actions.onEdgeAction('rename-device')}
      />
    ),
    importSlot: (
      <ImportTabUI
        job={importJob}
        busy={importBusy}
        pct={importJob?.progress ?? 0}
        label={importBusy ? 'Uploading 12 MB' : ''}
        onFiles={(files) => actions.onEdgeAction('import-files', String(files.length))}
        onCancel={() => actions.onEdgeAction('cancel-import')}
      />
    ),
  }
}
