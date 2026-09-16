// 촬영 화면 좌우 패널 — 왼쪽 Logs, 오른쪽 Pattern Preview + Class.
import { useState } from 'react'
import { LogPanelView, RightPanelView, type WorkspaceTab } from '@ingradient/edge-pages'
import {
  LOG_PANEL_LABELS, PANEL_CLASSES, PATTERN_LABELS, RIGHT_PANEL_LABELS, SAMPLE_LOG_ENTRIES,
} from '../../../../fixtures/edge/0.0.5'

const noop = (): undefined => undefined

export function RightPanel({
  workspaceTab = 'capture',
  showPatternPreview = true,
}: { workspaceTab?: WorkspaceTab; showPatternPreview?: boolean } = {}): JSX.Element {
  const [classSearch, setClassSearch] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<string | null>('c1')
  const [previewPatternLabel, setPreviewPatternLabel] = useState<string | null>(null)

  return (
    <RightPanelView
      workspaceTab={workspaceTab}
      classes={PANEL_CLASSES}
      selectedClassId={selectedClassId}
      showPatternPreview={showPatternPreview}
      patternLabels={PATTERN_LABELS}
      previewPatternLabel={previewPatternLabel}
      showRoiButton={false}
      isDerivedViewActive={false}
      samActive={false}
      samViewerActive={false}
      classSearch={classSearch}
      labels={RIGHT_PANEL_LABELS}
      onSetClassSearch={setClassSearch}
      onSelectClass={setSelectedClassId}
      onTogglePattern={(pattern) => setPreviewPatternLabel((p) => (p === pattern ? null : pattern))}
      onToggleSamRoi={noop}
    />
  )
}

export function LogPanel({ filterOpen = false }: { filterOpen?: boolean } = {}): JSX.Element {
  const [showFilterPopover, setShowFilterPopover] = useState(filterOpen)
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'last7' | 'last30' | 'custom'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showProgress, setShowProgress] = useState(false)
  const [showConnections, setShowConnections] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [hoveredLogIndex, setHoveredLogIndex] = useState<number | null>(null)
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)

  const entries = SAMPLE_LOG_ENTRIES.map((log, index) => ({ log, index }))
  const hoveredLog = hoveredLogIndex !== null ? SAMPLE_LOG_ENTRIES[hoveredLogIndex] ?? null : null

  return (
    <LogPanelView
      entries={entries}
      hasMore={false}
      showFilterPopover={showFilterPopover}
      datePreset={datePreset}
      dateFrom={dateFrom}
      dateTo={dateTo}
      showProgress={showProgress}
      showConnections={showConnections}
      showDebug={showDebug}
      hoveredLogIndex={hoveredLogIndex}
      displayedLogIndex={hoveredLogIndex}
      hoveredLog={hoveredLog}
      displayImageUrl={null}
      modalImageUrl={modalImageUrl}
      labels={LOG_PANEL_LABELS}
      onToggleFilterPopover={() => setShowFilterPopover((v) => !v)}
      onCloseFilterPopover={() => setShowFilterPopover(false)}
      onSetDatePreset={setDatePreset}
      onSetDateFrom={setDateFrom}
      onSetDateTo={setDateTo}
      onSetShowProgress={setShowProgress}
      onSetShowConnections={setShowConnections}
      onSetShowDebug={setShowDebug}
      onSetHoveredLogIndex={setHoveredLogIndex}
      onSetPanelHovered={noop}
      onScrollNearBottom={noop}
      onOpenImageModal={setModalImageUrl}
      onCloseImageModal={() => setModalImageUrl(null)}
      onOpenSavedImage={noop}
    />
  )
}
