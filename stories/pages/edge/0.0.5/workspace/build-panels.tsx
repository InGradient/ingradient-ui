// 촬영 화면 좌우 패널 — 왼쪽 Logs, 오른쪽 Pattern Preview + Class.
import { useEffect, useState } from 'react'
import { filterLogEntries, LogPanelCollapsedView, LogPanelView, RightPanelCollapsedView, RightPanelView, type WorkspaceTab, type LogPanelEntry, type PreviewPatternLabel } from '@ingradient/edge-pages'
import { SIMULATION_LOGS, SYNTHETIC_CAPTURE } from './capture-fixtures'
import {
  LOG_PANEL_LABELS, PANEL_CLASSES, PATTERN_LABELS, RIGHT_PANEL_LABELS, SAMPLE_LOG_ENTRIES,
} from '../../../../fixtures/edge/0.0.5'

const noop = (): undefined => undefined

export function RightPanel({
  workspaceTab = 'capture',
  showPatternPreview = true,
  previewPatternLabel: controlledPattern,
  onPreviewPattern,
}: { workspaceTab?: WorkspaceTab; showPatternPreview?: boolean; previewPatternLabel?: PreviewPatternLabel | null; onPreviewPattern?: (pattern: PreviewPatternLabel | null) => void } = {}): JSX.Element {
  const [classSearch, setClassSearch] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<string | null>('c1')
  const [previewPatternLabel, setPreviewPatternLabel] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <RightPanelCollapsedView
        classes={PANEL_CLASSES.map((c) => ({ id: c.class_id, name: c.class_name, color: c.color }))}
        selectedClassId={selectedClassId}
        labels={{ expand: 'Expand panel' }}
        onClassClick={setSelectedClassId}
        onExpand={() => setCollapsed(false)}
      />
    )
  }

  return (
    <RightPanelView
      workspaceTab={workspaceTab}
      classes={PANEL_CLASSES}
      selectedClassId={selectedClassId}
      showPatternPreview={showPatternPreview}
      patternLabels={PATTERN_LABELS}
      previewPatternLabel={controlledPattern === undefined ? previewPatternLabel : controlledPattern}
      showRoiButton={false}
      isDerivedViewActive={false}
      samActive={false}
      samViewerActive={false}
      classSearch={classSearch}
      labels={RIGHT_PANEL_LABELS}
      onSetClassSearch={setClassSearch}
      onSelectClass={setSelectedClassId}
      onTogglePattern={(pattern) => {
        const current = controlledPattern === undefined ? previewPatternLabel : controlledPattern
        const next = current === pattern ? null : pattern as PreviewPatternLabel
        setPreviewPatternLabel(next)
        onPreviewPattern?.(next)
      }}
      onToggleSamRoi={noop}
      onToggleCollapsed={() => setCollapsed(true)}
    />
  )
}

export function LogPanel({ filterOpen = false, logs = [...SIMULATION_LOGS, ...SAMPLE_LOG_ENTRIES] }: { filterOpen?: boolean; logs?: LogPanelEntry[] } = {}): JSX.Element {
  const [showFilterPopover, setShowFilterPopover] = useState(filterOpen)
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'last7' | 'last30' | 'custom'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showProgress, setShowProgress] = useState(false)
  const [showConnections, setShowConnections] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [hoveredLogIndex, setHoveredLogIndex] = useState<number | null>(null)
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)
  useEffect(() => { setHoveredLogIndex(null) }, [datePreset, dateFrom, dateTo, showProgress, showConnections, showDebug])
  const [collapsed, setCollapsed] = useState(false)

  const entries = filterLogEntries(logs, { datePreset, dateFrom, dateTo, showProgress, showConnections, showDebug })
  const hoveredLog = entries.find(({ index }) => index === hoveredLogIndex)?.log ?? null

  if (collapsed) {
    return (
      <LogPanelCollapsedView
        entries={entries}
        hoveredLogIndex={hoveredLogIndex}
        labels={{ expandPanel: 'Expand panel' }}
        onSetHoveredLogIndex={setHoveredLogIndex}
        onExpand={() => setCollapsed(false)}
      />
    )
  }

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
      displayImageUrl={hoveredLog?.imagePath === 'simulation://capture' ? SYNTHETIC_CAPTURE : null}
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
      onOpenSavedImage={() => setModalImageUrl(SYNTHETIC_CAPTURE)}
      onToggleCollapsed={() => setCollapsed(true)}
    />
  )
}
