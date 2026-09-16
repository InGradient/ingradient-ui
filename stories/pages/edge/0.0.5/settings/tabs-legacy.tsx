// 0.0.1 때 추출돼 그대로 쓰는 설정 탭 — 서버 · 데이터 · 카메라 · 현장 테스트 · 정보 · 로그.
import { useState } from 'react'
import {
  AboutTabView, BackendLogsContentView, CameraParamsTabView, DataTabView,
  FieldTestTabView, FrontendLogsContentView, ServerTabView, UnifiedLogsTabView,
  UpdateSectionView, type LogsSource,
} from '@ingradient/edge-pages'
import {
  ABOUT_TAB_LABELS, BACKEND_LOGS_LABELS, CAMERA_PARAMS_TAB_LABELS, DATA_TAB_LABELS,
  FIELD_TEST_TAB_LABELS, FRONTEND_LOGS_LABELS, SAMPLE_BACKEND_LOGS, SAMPLE_FRONTEND_LOGS,
  SERVER_TAB_LABELS, UNIFIED_LOGS_TAB_LABELS, UPDATE_SECTION_LABELS,
} from '../../../../fixtures/edge/0.0.5'

const noop = (): undefined => undefined
const APP_VERSION = '0.0.5'

export const ServerTabContent = (
  <ServerTabView
    baseUrl="https://app.ingradient.ai"
    runtimeMode="auto"
    saving={false}
    saveResult={null}
    saveMessage={null}
    connectivityResult={null}
    labels={SERVER_TAB_LABELS}
    onBaseUrlChange={noop}
    onRuntimeModeChange={noop}
    onSave={noop}
  />
)

export const DataTabContent = (
  <DataTabView
    dataDirPath="C:\ProgramData\Ingradient\Edge\data"
    totalBytes={1024 * 1024 ** 3}
    freeBytes={215 * 1024 ** 3}
    cacheSize={7 * 1024 ** 3}
    isCleaningCache={false}
    cleanupCompleted={false}
    labels={DATA_TAB_LABELS}
    onCleanCache={noop}
    onOpenDataDir={noop}
  />
)

export const CameraParamsTabContent = (
  <CameraParamsTabView
    isConnected
    cvsCamDllPath="C:\Program Files\CREVIS\cvsCam\cvsCam.dll"
    fetching={false}
    saving={false}
    saveResult={null}
    labels={CAMERA_PARAMS_TAB_LABELS}
    onDllPathChange={noop}
    onApplyDllPath={noop}
    onSave={noop}
    onReset={noop}
  />
)

export const FieldTestTabContent = (
  <FieldTestTabView
    running={false}
    progress={0}
    hasResults={false}
    log={[]}
    labels={FIELD_TEST_TAB_LABELS}
    onRun={noop}
    onCancel={noop}
    onReset={noop}
    onExport={noop}
  />
)

export const AboutTabContent = (
  <AboutTabView
    appVersion={APP_VERSION}
    licenseStatus="valid"
    licenseExpiresAt="2027-01-01"
    fingerprint="A1B2-C3D4-E5F6-7890"
    deactivationCode={null}
    deactivateError={null}
    isDeactivating={false}
    labels={ABOUT_TAB_LABELS}
    updateSection={(
      <UpdateSectionView
        currentVersion={APP_VERSION}
        status="idle"
        availableVersion={null}
        progress={0}
        error={null}
        labels={UPDATE_SECTION_LABELS}
        onCheckForUpdates={noop}
        onDownloadUpdate={noop}
        onInstallUpdate={noop}
      />
    )}
    onOpenDeactivateConfirm={noop}
    onCloseDeactivationCode={noop}
  />
)

export function LogsTabContent(): JSX.Element {
  const [logsSource, setLogsSource] = useState<LogsSource>('backend')
  return (
    <UnifiedLogsTabView
      source={logsSource}
      labels={UNIFIED_LOGS_TAB_LABELS}
      onSetSource={setLogsSource}
      backendLogsContent={(
        <BackendLogsContentView
          logs={SAMPLE_BACKEND_LOGS}
          loading={false}
          refreshing={false}
          searchQuery=""
          levelFilter="all"
          labels={BACKEND_LOGS_LABELS}
          onSearchChange={noop}
          onLevelFilterChange={noop}
          onRefresh={noop}
          onClear={noop}
          onExport={noop}
        />
      )}
      frontendLogsContent={(
        <FrontendLogsContentView
          logs={SAMPLE_FRONTEND_LOGS}
          refreshing={false}
          searchQuery=""
          levelFilter="all"
          labels={FRONTEND_LOGS_LABELS}
          onSearchChange={noop}
          onLevelFilterChange={noop}
          onRefresh={noop}
          onClear={noop}
          onExport={noop}
        />
      )}
    />
  )
}
