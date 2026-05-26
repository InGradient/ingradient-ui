import type { DatePreset } from './log-filters'

export interface LogPanelEntry {
  msg: string
  type: 'info' | 'success' | 'error'
  /** ISO timestamp for date filter. */
  createdAt?: string | null
  /** Optional structured/raw detail shown in DetailPanel. */
  detail?: string | null
  /** Optional pre-loaded image data URL. */
  imageUrl?: string | null
  /** Optional file path — if no imageUrl but path, container resolves via IPC. */
  imagePath?: string | null
}

export interface LogPanelLabels {
  title: string
  filterButton: string
  filterByDate: string
  filterLogType: string
  filterProgress: string
  filterConnections: string
  filterDebug: string
  dateAll: string
  dateToday: string
  dateLast7: string
  dateLast30: string
  dateCustom: string
  dateFrom: string
  dateTo: string
  noActivity: string
  hoverHint: string
  openSavedImage: string
}

export interface LogPanelViewProps {
  // ── data ──
  entries: { log: LogPanelEntry; index: number }[]
  hasMore: boolean

  // ── filter state ──
  showFilterPopover: boolean
  datePreset: DatePreset
  dateFrom: string
  dateTo: string
  showProgress: boolean
  showConnections: boolean
  showDebug: boolean

  // ── hover / detail state ──
  hoveredLogIndex: number | null
  displayedLogIndex: number | null
  hoveredLog: LogPanelEntry | null
  /** Container 가 IPC 후 resolve 한 image data URL. */
  displayImageUrl: string | null

  // ── image modal state ──
  modalImageUrl: string | null

  labels: LogPanelLabels

  // ── callbacks ──
  onToggleFilterPopover: () => void
  onCloseFilterPopover: () => void
  onSetDatePreset: (p: DatePreset) => void
  onSetDateFrom: (v: string) => void
  onSetDateTo: (v: string) => void
  onSetShowProgress: (v: boolean) => void
  onSetShowConnections: (v: boolean) => void
  onSetShowDebug: (v: boolean) => void
  onSetHoveredLogIndex: (i: number | null) => void
  onSetPanelHovered: (v: boolean) => void
  onScrollNearBottom: () => void
  onOpenImageModal: (url: string) => void
  onCloseImageModal: () => void
  onOpenSavedImage: (path: string) => void
}

export interface LogDetailTableViewProps {
  /** Edge 패턴: raw text 를 line 단위 parse. */
  text?: string | null
  /** Phase 11 호환: Record key-value. */
  details?: Record<string, unknown>
}
