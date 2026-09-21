// Synthetic in-memory gallery. No filesystem, camera, or backend operations.
import { useState } from 'react'
import { ImagesView, buildGroups, imagePassesDateFilter, type ImagesDatePreset, type ImageItem } from '@ingradient/edge-pages'
import { SAMPLE_CLASSES_FULL, SAMPLE_IMAGE_ITEMS } from '../../../../fixtures/edge/0.0.5'

const noop = (): undefined => undefined

const IMAGES_LABELS = {
  filterTitle: 'Filter',
  selectAll: 'Select all',
  deleteSelected: (n: number) => (n > 0 ? `Delete (${n})` : 'Delete'),
  empty: 'No images yet',
  emptyOffline: 'No images available offline.',
  retry: 'Retry',
  deleteConfirmTitle: 'Delete images',
  deleteConfirmDesc: (n: number) => `Remove ${n} synthetic fixture images from this preview? No files will be deleted.`,
  deleteConfirm: 'Delete',
  cancel: 'Cancel',
  loading: 'Loading images...',
  loadingMore: 'Loading more...',
  dateFilter: {
    title: 'Date', all: 'All', today: 'Today',
    last7: 'Last 7 days', last30: 'Last 30 days', custom: 'Custom range',
    from: 'From', to: 'To',
  },
  grid: {
    uploading: 'Uploading',
    conversionPending: 'Converting',
    uploadFailed: (err: string | null | undefined) => (err ? `Upload failed: ${err}` : 'Upload failed'),
    deleteGroup: 'Delete group',
  },
  modal: {
    cursorMode: 'Cursor', bboxMode: 'BBox',
    hintDraw: 'Drag to draw a bbox', hintNoClass: 'Select a class first',
    hintSelect: 'Click a bbox to select · drag handles to resize',
    close: 'Close', showAnnotations: 'Show annotations', hideAnnotations: 'Hide annotations',
    enterFullscreen: 'Enter fullscreen', exitFullscreen: 'Exit fullscreen',
    bboxCount: (n: number) => `${n} bbox`,
  },
}

/** Session-owned synthetic gallery state; retain this hook above tab unmount boundaries. */
export function useImagesDraft() {
  const [items, setItems] = useState(() => SAMPLE_IMAGE_ITEMS.map((image, index) => ({
    ...image, sequenceId: index < 3 ? 'synthetic-sequence' : null, sequenceStep: index,
  })))
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectionMode, setSelectionMode] = useState(false)
  const [datePreset, setDatePreset] = useState<ImagesDatePreset>('all')
  const [fromDate, setFromDate] = useState('2026-05-19')
  const [toDate, setToDate] = useState('2026-05-20')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [pendingIds, setPendingIds] = useState<string[] | null>(null)
  const [status, setStatus] = useState('Synthetic fixture: 12 images. Preview clock: 20 May 2026.')
  return {
    items, setItems, selectedIds, setSelectedIds, selectionMode, setSelectionMode,
    datePreset, setDatePreset, fromDate, setFromDate, toDate, setToDate,
    filterOpen, setFilterOpen, activeId, setActiveId, fullscreen, setFullscreen,
    pendingIds, setPendingIds, status, setStatus,
  }
}

export type ImagesDraft = ReturnType<typeof useImagesDraft>

/** Omitting draft preserves an independent gallery for standalone consumers. */
export function ImagesContent({ draft }: { draft?: ImagesDraft } = {}): JSX.Element {
  return draft ? <ControlledImagesContent draft={draft} /> : <StandaloneImagesContent />
}

function StandaloneImagesContent(): JSX.Element {
  const draft = useImagesDraft()
  return <ControlledImagesContent draft={draft} />
}

function ControlledImagesContent({ draft }: { draft: ImagesDraft }): JSX.Element {
  const {
    items, setItems, selectedIds, setSelectedIds, selectionMode, setSelectionMode,
    datePreset, setDatePreset, fromDate, setFromDate, toDate, setToDate,
    filterOpen, setFilterOpen, activeId, setActiveId, fullscreen, setFullscreen,
    pendingIds, setPendingIds, status, setStatus,
  } = draft
  const visible = items.filter((image) => imagePassesDateFilter(image, datePreset, fromDate, toDate, new Date(2026, 4, 20, 23, 59, 59)))
  const { displayItems, groupMap, sequenceGroupMap } = buildGroups(visible, null)
  const members = (image: ImageItem) => image.sequenceId ? sequenceGroupMap.get(image.sequenceId) ?? [image] : [image]
  const active = visible.find((image) => image.id === activeId) ?? null
  const toggle = (ids: string[]) => setSelectedIds((previous) => {
    const next = new Set(previous)
    const remove = ids.every((id) => next.has(id))
    ids.forEach((id) => { if (remove) next.delete(id); else next.add(id) })
    return next
  })
  const navigate = (delta: number) => {
    const index = visible.findIndex((image) => image.id === activeId)
    setActiveId(visible[(index + delta + visible.length) % visible.length]?.id ?? null)
  }

  return (<>
    <p role="status">{status} Showing {visible.length} images in {displayItems.length} cells; {selectedIds.size} selected.</p>
    <ImagesView
      groupedImages={displayItems}
      groupMap={groupMap}
      sequenceGroupMap={sequenceGroupMap}
      groupSettings={null}
      classes={SAMPLE_CLASSES_FULL}
      loading={false}
      loadingMore={false}
      hasMore={false}
      isOnline={false}
      isDeleting={false}
      datePreset={datePreset}
      fromDate={fromDate}
      toDate={toDate}
      filterOpen={filterOpen}
      selectedImageIds={selectedIds}
      selectionMode={selectionMode}
      selectionModeLabel="Select individual images"
      onSetSelectionMode={setSelectionMode}
      modalOpen={active !== null}
      modalActiveImage={active}
      modalImageSrc={active?.fullSrc ?? null}
      modalEditMode="cursor"
      modalCanvasContent={null}
      modalHintText="Synthetic image inspector. Use Previous/Next or Left/Right arrow keys. No annotation data is saved."
      showModalToolbar={false}
      showModalOverlayControls={false}
      modalAnnotationsVisible
      modalIsFullscreen={fullscreen}
      modalBboxCount={active?.bboxes?.length ?? 0}
      pendingDelete={pendingIds ? { count: pendingIds.length } : null}
      labels={IMAGES_LABELS}
      getDisplayedGroupMembers={members}
      onLoadMore={noop}
      onSetDatePreset={(value) => { setDatePreset(value); setSelectedIds(new Set()) }}
      onSetFromDate={(value) => { setFromDate(value); setSelectedIds(new Set()) }}
      onSetToDate={(value) => { setToDate(value); setSelectedIds(new Set()) }}
      onToggleFilter={() => setFilterOpen((open) => !open)}
      onCloseFilter={() => setFilterOpen(false)}
      onSelectAll={() => toggle(visible.map((image) => image.id))}
      onClearSelection={() => setSelectedIds(new Set())}
      onToggleImageSelection={(id) => toggle([id])}
      onCloseModal={() => setActiveId(null)}
      onModalSwipeNavigate={navigate}
      onSetModalEditMode={noop}
      onSetModalAnnotationsVisible={noop}
      onToggleModalFullscreen={() => setFullscreen((value) => !value)}
      onRequestDelete={() => setPendingIds([...selectedIds])}
      onConfirmDelete={() => {
        if (!pendingIds) return
        setItems((current) => current.filter((image) => !pendingIds.includes(image.id)))
        setSelectedIds((current) => new Set([...current].filter((id) => !pendingIds.includes(id))))
        setStatus(`Removed ${pendingIds.length} synthetic fixture images from this preview only. No files deleted.`)
        setPendingIds(null)
      }}
      onCancelDelete={() => setPendingIds(null)}
      onDeleteGroup={(_image, group) => setPendingIds(group.map((image) => image.id))}
      onRetryReload={noop}
      onImageCellClick={(event, image, group) => {
        if (selectionMode || event.ctrlKey || event.metaKey || event.shiftKey) toggle(group.map((member) => member.id))
        else setActiveId(image.id)
      }}
    />
  </>)
}
