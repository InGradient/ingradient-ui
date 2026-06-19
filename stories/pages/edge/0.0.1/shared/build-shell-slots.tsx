// Edge 전체 화면 합성 셸. 실제 앱(ingradient-edge/src/frontend/app/App.tsx)의
// EdgeAppShellView(TitleBar + content + BottomBar + SystemMonitorModal) 프레임을
// 스토리에서 재현한다. 4개 전체 화면 스토리가 content 슬롯만 갈아끼워 재사용한다.
import type { ReactNode } from 'react'
import {
  EdgeAppShellView,
  TitleBarView,
  TopBarView,
  BottomBarView,
  type ConnectionStatus,
} from '@ingradient/edge-pages'
import { NORMAL_STATS } from '../../../../fixtures/edge/0.0.1/system-stats'
import {
  TITLE_BAR_LABELS,
  TOP_BAR_LABELS,
  BOTTOM_BAR_LABELS,
  SAMPLE_USER,
} from './labels'

export const LANG_SLOT = (
  <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>EN</span>
)

export const ACCOUNT_SLOT = (
  <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>{SAMPLE_USER.name}</span>
)

export const TitleBarSlot = (
  <TitleBarView
    isMaximized={false}
    labels={TITLE_BAR_LABELS}
    onMinimize={() => undefined}
    onMaximize={() => undefined}
    onClose={() => undefined}
  />
)

export const BottomBarSlot = (
  <BottomBarView
    isConnected
    syncStatus="idle"
    syncPending={0}
    syncFailed={0}
    stats={NORMAL_STATS}
    deleteProgress={false}
    labels={BOTTOM_BAR_LABELS}
    onOpenMonitor={() => undefined}
  />
)

/** Workspace 화면의 MainLayoutView topBar 슬롯. 데이터셋 진입 후 표시. */
export function buildTopBar(opts: {
  project?: string | null
  dataset?: string | null
  connectionStatus?: ConnectionStatus
  settingsDialog?: ReactNode
}): ReactNode {
  return (
    <TopBarView
      selectedProjectName={opts.project ?? null}
      selectedDatasetName={opts.dataset ?? null}
      connectionStatus={opts.connectionStatus ?? 'connected'}
      connectionTitle="Connected"
      isRefreshing={false}
      canSetupCamera
      labels={TOP_BAR_LABELS}
      langSelector={LANG_SLOT}
      accountMenu={ACCOUNT_SLOT}
      settingsDialog={opts.settingsDialog ?? null}
      onBackToDatasets={() => undefined}
      onRefresh={() => undefined}
      onOpenSettings={() => undefined}
    />
  )
}

/**
 * 전체 화면 프레임. content 를 EdgeAppShellView 의 content 슬롯에 넣어
 * TitleBar / (옵션)BottomBar / (옵션)SystemMonitorModal 과 함께 렌더한다.
 * - 로그인 전(Login/License): showFooter=false → BottomBar 숨김
 * - 로그인 후(DatasetSelect/Workspace): showFooter=true
 */
export function EdgeAppFrame(props: {
  content: ReactNode
  showFooter: boolean
  isResolving?: boolean
  isShuttingDown?: boolean
  systemMonitorModal?: ReactNode
}): JSX.Element {
  return (
    <EdgeAppShellView
      isResolving={props.isResolving ?? false}
      isShuttingDown={props.isShuttingDown ?? false}
      showFooter={props.showFooter}
      titleBar={TitleBarSlot}
      content={props.content}
      bottomBar={props.showFooter ? BottomBarSlot : undefined}
      systemMonitorModal={props.systemMonitorModal}
    />
  )
}
