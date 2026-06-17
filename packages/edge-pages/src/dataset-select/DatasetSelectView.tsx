import { ConfirmDialog } from '@ingradient/ui'
import { Wrap } from './styles/page.styles'
import { DatasetSelectHeader } from './DatasetSelectHeader'
import { DatasetSelectContent } from './DatasetSelectContent'
import type { DatasetSelectViewProps } from './types'

export function DatasetSelectView(props: DatasetSelectViewProps): JSX.Element {
  const {
    mode, connectionStatus, connectionTitle, canSetupCamera,
    loading, fetchError, recentDatasets, groups, totalDatasets, latestDatasetId,
    openDotMenuDatasetId, sessionExpired, labels,
    langSelector, accountMenu, settingsDialog, exportModal, addDatasetModal,
    onRefresh, onOpenSettings,
    onSelectDataset, onAddDatasetClick, onExportClick, onToggleDotMenu,
    onSessionExpiredConfirm, onSessionExpiredCancel,
  } = props

  const isOnline = mode === 'online'

  return (
    <Wrap>
      <DatasetSelectHeader
        title={labels.title}
        mode={mode}
        onlineLabel={labels.online}
        offlineLabel={labels.offline}
        connectionStatus={connectionStatus}
        connectionTitle={connectionTitle}
        refreshLabel={labels.refresh}
        loading={loading}
        onRefresh={onRefresh}
        settingsTitle={labels.settingsTitle}
        settingsDisabledTitle={labels.settingsDisabledTitle}
        canSetupCamera={canSetupCamera}
        onOpenSettings={onOpenSettings}
        langSelector={langSelector}
        accountMenu={accountMenu}
      />

      {settingsDialog}

      {sessionExpired && (
        <ConfirmDialog
          title={labels.sessionExpiredTitle}
          description={labels.sessionExpiredDesc}
          confirmLabel={labels.sessionExpiredConfirm}
          cancelLabel={labels.cancel}
          onConfirm={onSessionExpiredConfirm}
          onCancel={onSessionExpiredCancel}
        />
      )}

      <DatasetSelectContent
        loading={loading}
        fetchError={fetchError}
        recentDatasets={recentDatasets}
        groups={groups}
        totalDatasets={totalDatasets}
        latestDatasetId={latestDatasetId}
        isOnline={isOnline}
        openDotMenuDatasetId={openDotMenuDatasetId}
        labels={labels}
        onSelectDataset={onSelectDataset}
        onAddDatasetClick={onAddDatasetClick}
        onExportClick={onExportClick}
        onToggleDotMenu={onToggleDotMenu}
      />

      {exportModal}
      {addDatasetModal}
    </Wrap>
  )
}
