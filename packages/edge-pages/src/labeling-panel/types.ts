import type { ReactNode } from 'react'

export interface PanelClassInfo {
  class_id: string
  class_name: string
  color: string
}

export interface RightPanelLabels {
  classLabel: string
  noClasses: string
  noClassMatches: string
  searchClasses: string
  patternPreview: string
  /** 패널을 접는 버튼의 툴팁. 접기 버튼을 쓰지 않으면 필요 없다. */
  collapsePanel?: string
  samRoi: string
  samRoiActive: string
  samRoiViewer: string
  samRoiViewerActive: string
  samRoiHint: string
  samRoiViewerHint: string
}

export interface RightPanelViewProps {
  workspaceTab: 'capture' | 'images' | 'statics' | 'setup'
  classes: PanelClassInfo[]
  selectedClassId: string | null

  // Pattern preview (capture tab + deflectometry)
  showPatternPreview: boolean
  patternLabels: string[]
  previewPatternLabel: string | null

  // ROI button
  showRoiButton: boolean
  isDerivedViewActive: boolean
  samActive: boolean
  samViewerActive: boolean

  // Search state
  classSearch: string

  // Setup slot id (for ReactDOM.createPortal target)
  setupSlotId?: string

  // Comment section slot
  commentSection?: ReactNode

  labels: RightPanelLabels

  onSetClassSearch: (q: string) => void
  onSelectClass: (classId: string) => void
  onTogglePattern: (pattern: string) => void
  onToggleSamRoi: () => void
  /** 접기 버튼. 넘기지 않으면 버튼이 나오지 않는다. */
  onToggleCollapsed?: () => void
}

// ── Comment section ──────────────────────────────────────────────────────────

export interface CommentItem {
  id: string
  author: string
  text: string
  timestamp: string
  synced?: boolean
}

export interface RightPanelCommentSectionLabels {
  placeholder: string
  send: string
  sending: string
  empty: string
  title: string
}

export interface RightPanelCommentSectionProps {
  comments: CommentItem[]
  pendingComment: string
  isSending: boolean
  labels: RightPanelCommentSectionLabels
  onPendingCommentChange: (value: string) => void
  onSend: () => void
}
