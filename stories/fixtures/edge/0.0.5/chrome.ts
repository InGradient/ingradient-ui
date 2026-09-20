// Edge 앱 chrome(TitleBar / TopBar / BottomBar / AccountMenu) 라벨과 공통 상수.
// 문구는 edge 의 `src/frontend/locales/en.json` 값을 그대로 옮긴 것이다.
import type {
  AccountMenuLabels, BottomBarLabels, SystemStats, TitleBarLabels, TopBarLabels,
} from '@ingradient/edge-pages'

export const TITLE_BAR_LABELS: TitleBarLabels = {
  appName: 'Ingradient Edge',
  minimize: 'Minimize',
  maximize: 'Maximize',
  restore: 'Restore',
  close: 'Close',
}

export const TOP_BAR_LABELS: TopBarLabels = {
  refresh: 'Refresh',
  settingsTitle: 'Settings',
  settingsDisabledTitle: 'Settings',
}

export const BOTTOM_BAR_LABELS: BottomBarLabels = {
  deletingSimple: 'Deleting...',
  syncing: (count) => `Uploading ${count}`,
  syncDone: 'Sync complete',
  syncFailed: (count) => `Failed ${count}`,
  openMonitor: 'Open system monitor',
  connected: 'Connected',
  disconnected: 'Disconnected',
  diskUsage: (pct) => `Disk usage ${pct}`,
  cpuUsage: (pct) => `CPU usage ${pct}`,
  memoryUsage: (pct) => `Memory usage ${pct}`,
}

export const ACCOUNT_MENU_LABELS: AccountMenuLabels = {
  account: 'Account',
  changeAccount: 'Change Account',
  logout: 'Logout',
  accountHistory: 'Past Accounts',
  noAccountHistory: 'No account history',
  cancel: 'Cancel',
}

export const SAMPLE_USER = { name: 'JOON HO LEE', email: 'june@ingradient.ai' }

/** 현장 PC 의 실제 사용률대. 디스크가 늘 가장 높다 — 촬영 이미지가 쌓인다. */
export const SAMPLE_STATS: SystemStats = { disk: 79, cpu: 45, memory: 70 }

export const PROJECT_NAME = 'FINEMTECH'
export const PROJECT_NAME_PS = 'FINEMTECH (Metal)'
export const DATASET_NAME = '26.09.02 New Raw Material'
