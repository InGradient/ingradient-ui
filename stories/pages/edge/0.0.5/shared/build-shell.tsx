// Edge 앱 프레임. 실제 앱(App.tsx)의 EdgeAppShellView —
// TitleBar + content + BottomBar 구조를 그대로 재현한다.
// 4개 화면 스토리가 content 슬롯만 갈아끼워 재사용한다.
import type { ReactNode } from 'react'
import {
  AccountMenuView, BottomBarView, EdgeAppShellView, TitleBarView, TopBarView,
  type ConnectionStatus,
} from '@ingradient/edge-pages'
import {
  ACCOUNT_MENU_LABELS, BOTTOM_BAR_LABELS, SAMPLE_STATS, SAMPLE_USER,
  TITLE_BAR_LABELS, TOP_BAR_LABELS,
} from '../../../../fixtures/edge/0.0.5'

const noop = (): undefined => undefined

/** 언어 선택 자리. 실제 앱에서는 i18n 셀렉터가 들어간다. */
export const LangSlot = (
  <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-xs)' }}>EN</span>
)

export const AccountSlot = (
  <AccountMenuView
    currentUser={SAMPLE_USER}
    accountHistory={[]}
    dropdownOpen={false}
    changeAccountModalOpen={false}
    labels={ACCOUNT_MENU_LABELS}
    onToggleDropdown={noop}
    onCloseDropdown={noop}
    onOpenChangeAccount={noop}
    onCloseChangeAccount={noop}
    onLogout={noop}
    onSelectAccount={noop}
  />
)

export const TitleBarSlot = (
  <TitleBarView
    isMaximized={false}
    labels={TITLE_BAR_LABELS}
    onMinimize={noop}
    onMaximize={noop}
    onClose={noop}
  />
)

export function BottomBarSlot({ isConnected = true }: { isConnected?: boolean } = {}): JSX.Element {
  return (
    <BottomBarView
      isConnected={isConnected}
      syncStatus="idle"
      syncPending={0}
      syncFailed={0}
      stats={SAMPLE_STATS}
      deleteProgress={false}
      labels={BOTTOM_BAR_LABELS}
      onOpenMonitor={noop}
    />
  )
}

/** 데이터셋에 들어간 뒤의 상단 바 — 프로젝트/데이터셋 경로와 계정 메뉴. */
export function buildTopBar(opts: {
  project: string
  dataset: string
  connectionStatus?: ConnectionStatus
  settingsDialog?: ReactNode
}): ReactNode {
  return (
    <TopBarView
      selectedProjectName={opts.project}
      selectedDatasetName={opts.dataset}
      connectionStatus={opts.connectionStatus ?? 'connected'}
      connectionTitle="Online"
      isRefreshing={false}
      canSetupCamera
      labels={TOP_BAR_LABELS}
      langSelector={LangSlot}
      accountMenu={AccountSlot}
      settingsDialog={opts.settingsDialog ?? null}
      onBackToDatasets={noop}
      onRefresh={noop}
      onOpenSettings={noop}
    />
  )
}

/**
 * 로그인 전 화면은 하단 바가 없다(showFooter=false).
 * 로그인 후 화면(DatasetSelect / Workspace)은 하단 바를 단다.
 */
export function EdgeAppFrame(props: {
  content: ReactNode
  showFooter: boolean
  isConnected?: boolean
}): JSX.Element {
  return (
    <EdgeAppShellView
      isResolving={false}
      isShuttingDown={false}
      showFooter={props.showFooter}
      titleBar={TitleBarSlot}
      content={props.content}
      bottomBar={props.showFooter ? <BottomBarSlot isConnected={props.isConnected} /> : undefined}
    />
  )
}
