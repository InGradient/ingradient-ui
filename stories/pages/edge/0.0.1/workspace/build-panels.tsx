// Workspace 좌측 Activity(Log) 패널 + 우측 Class/Pattern(RightPanel) 패널.
import { useState } from 'react'
import { RightPanelView, LogPanelView } from '@ingradient/edge-pages'
import { SAMPLE_CLASSES_FULL } from '../../../../fixtures/edge/0.0.1/sample-images'
import { SAMPLE_LOG_ENTRIES } from '../../../../fixtures/edge/0.0.1/log-entries'

const RIGHT_PANEL_LABELS = {
  classLabel: 'CLASSES', noClasses: 'No classes', noClassMatches: 'No matches',
  searchClasses: 'Search…', patternPreview: 'PATTERN PREVIEW',
  samRoi: 'ROI', samRoiActive: 'ROI — drawing',
  samRoiViewer: 'ROI viewer', samRoiViewerActive: 'ROI viewer — on',
  samRoiHint: 'Segment with SAM', samRoiViewerHint: 'Show saved ROI',
}

const LOG_PANEL_LABELS = {
  title: 'Activity', filterButton: 'Filter', filterByDate: 'Filter by date',
  filterLogType: 'Log type', filterProgress: 'Show progress',
  filterConnections: 'Show connections', filterDebug: 'Show debug',
  dateAll: 'All', dateToday: 'Today', dateLast7: 'Last 7 days',
  dateLast30: 'Last 30 days', dateCustom: 'Custom', dateFrom: 'From', dateTo: 'To',
  noActivity: 'No activity yet.', hoverHint: 'Hover a log entry to see details.',
  openSavedImage: 'Open saved image',
}

export function RightPanel({
  workspaceTab = 'capture',
  isLabeling = false,
}: { workspaceTab?: 'capture' | 'images' | 'statics' | 'setup'; isLabeling?: boolean } = {}): JSX.Element {
  const [classSearch, setClassSearch] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('c1')
  return (
    <RightPanelView
      workspaceTab={workspaceTab}
      classes={SAMPLE_CLASSES_FULL}
      selectedClassId={selectedClassId}
      showPatternPreview={false} patternLabels={[]} previewPatternLabel={null}
      showRoiButton={isLabeling}
      isDerivedViewActive={false} samActive={false} samViewerActive={false}
      classSearch={classSearch} commentSection={null}
      labels={RIGHT_PANEL_LABELS}
      onSetClassSearch={setClassSearch}
      onSelectClass={setSelectedClassId}
      onTogglePattern={() => undefined}
      onToggleSamRoi={() => undefined}
    />
  )
}

export function LogPanel({ filterOpen = false }: { filterOpen?: boolean }): JSX.Element {
  const [showFilterPopover, setShowFilterPopover] = useState(filterOpen)
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'last7' | 'last30' | 'custom'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showProgress, setShowProgress] = useState(false)
  const [showConnections, setShowConnections] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [hoveredLogIndex, setHoveredLogIndex] = useState<number | null>(null)
  const [, setPanelHovered] = useState(false)
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
      onSetPanelHovered={setPanelHovered}
      onScrollNearBottom={() => undefined}
      onOpenImageModal={setModalImageUrl}
      onCloseImageModal={() => setModalImageUrl(null)}
      onOpenSavedImage={() => undefined}
    />
  )
}
