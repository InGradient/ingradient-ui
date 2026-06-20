// Images 탭 content — 캡처 이미지 그리드 + 라벨링 모달(BBoxCanvas).
import { useState } from 'react'
import { ImagesView } from '@ingradient/edge-pages'
import {
  SAMPLE_IMAGE_DATA_URL,
  SAMPLE_CLASSES_FULL,
  SAMPLE_BBOXES,
  SAMPLE_IMAGE_ITEMS,
} from '../../../../fixtures/edge/0.0.1/sample-images'
import { BBoxCanvasScene } from './build-bbox-canvas'

const IMAGES_LABELS = {
  filterTitle: 'Filter',
  selectAll: 'Select all',
  deleteSelected: (n: number) => (n > 0 ? `Delete (${n})` : 'Delete'),
  empty: 'No images',
  emptyOffline: 'No images offline',
  retry: 'Retry',
  deleteConfirmTitle: 'Delete images',
  deleteConfirmDesc: (n: number) => `Delete ${n} images? This cannot be undone.`,
  deleteConfirm: 'Delete', cancel: 'Cancel',
  loading: 'Loading…', loadingMore: 'Loading more…',
  dateFilter: {
    title: 'Date', all: 'All', today: 'Today',
    last7: 'Last 7 days', last30: 'Last 30 days', custom: 'Custom',
    from: 'From', to: 'To',
  },
  grid: {
    uploading: 'Uploading',
    conversionPending: 'Converting',
    uploadFailed: (err: string | null | undefined) => (err ? `Upload failed: ${err}` : 'Upload failed'),
    deleteGroup: 'Delete group',
  },
  modal: {
    cursorMode: 'Cursor mode', bboxMode: 'Draw bbox',
    hintDraw: 'Drag to draw a bbox', hintNoClass: 'Select a class first',
    hintSelect: 'Click bbox to select · drag handles to resize',
    close: 'Close', showAnnotations: 'Show annotations', hideAnnotations: 'Hide annotations',
    enterFullscreen: 'Enter fullscreen', exitFullscreen: 'Exit fullscreen',
    bboxCount: (n: number) => `${n} bbox`,
  },
}

export type ImagesModalMode = 'closed' | 'edit' | 'readonly'

export function ImagesContent({ modalMode = 'closed' }: { modalMode?: ImagesModalMode }): JSX.Element {
  const [selectedIds] = useState<Set<string>>(new Set())
  const [modalEditMode, setModalEditMode] = useState<'cursor' | 'bbox'>('bbox')
  const [annotationsVisible, setAnnotationsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const activeImage = SAMPLE_IMAGE_ITEMS[0]
  const isOpen = modalMode !== 'closed'
  const isEdit = modalMode === 'edit'

  const initialBboxes = (activeImage?.bboxes ?? SAMPLE_BBOXES) as typeof SAMPLE_BBOXES
  const [bboxCount, setBboxCount] = useState(initialBboxes.length)

  const canvasContent = isOpen
    ? <BBoxCanvasScene
        readOnly={!isEdit}
        inModal
        editMode={modalEditMode}
        annotationsVisible={annotationsVisible}
        imageSrc={activeImage?.fullSrc ?? SAMPLE_IMAGE_DATA_URL}
        initialBboxes={initialBboxes}
        onBboxesChange={(bboxes) => setBboxCount(bboxes.length)}
      />
    : null

  const hintText = isEdit
    ? (modalEditMode === 'bbox' ? IMAGES_LABELS.modal.hintDraw : IMAGES_LABELS.modal.hintSelect)
    : null

  return (
    <ImagesView
      groupedImages={SAMPLE_IMAGE_ITEMS}
      groupMap={new Map()}
      sequenceGroupMap={new Map()}
      groupSettings={null}
      classes={SAMPLE_CLASSES_FULL}
      loading={false} loadingMore={false} hasMore={false}
      isOnline isDeleting={false}
      datePreset="all" fromDate="" toDate="" filterOpen={false}
      selectedImageIds={selectedIds} selectionMode={false}
      modalOpen={isOpen}
      modalActiveImage={isOpen ? activeImage ?? null : null}
      modalImageSrc={isOpen ? (activeImage?.fullSrc ?? SAMPLE_IMAGE_DATA_URL) : null}
      modalEditMode={modalEditMode}
      modalCanvasContent={canvasContent}
      modalHintText={hintText}
      showModalToolbar={isEdit}
      showModalOverlayControls={isOpen}
      modalAnnotationsVisible={annotationsVisible}
      modalIsFullscreen={isFullscreen}
      modalBboxCount={bboxCount}
      pendingDelete={null}
      labels={IMAGES_LABELS}
      getDisplayedGroupMembers={(img) => [img]}
      onLoadMore={() => undefined}
      onSetDatePreset={() => undefined}
      onSetFromDate={() => undefined}
      onSetToDate={() => undefined}
      onToggleFilter={() => undefined}
      onSelectAll={() => undefined}
      onClearSelection={() => undefined}
      onToggleImageSelection={() => undefined}
      onCloseModal={() => undefined}
      onSetModalEditMode={setModalEditMode}
      onSetModalAnnotationsVisible={setAnnotationsVisible}
      onToggleModalFullscreen={() => setIsFullscreen((v) => !v)}
      onConfirmDelete={() => undefined}
      onCancelDelete={() => undefined}
      onDeleteGroup={() => undefined}
      onRetryReload={() => undefined}
      onImageCellClick={() => undefined}
    />
  )
}
