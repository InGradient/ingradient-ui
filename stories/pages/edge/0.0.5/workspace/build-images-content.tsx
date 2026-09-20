// [임시] Images 탭 — 촬영 이미지 그리드.
// mock 이미지라 실제 촬영물과 다르다. 라벨링 모달은 아직 붙이지 않았다.
import { useState } from 'react'
import { ImagesView } from '@ingradient/edge-pages'
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
  deleteConfirmDesc: (n: number) => `Delete ${n} images? This cannot be undone.`,
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

export function ImagesContent(): JSX.Element {
  const [selectedIds] = useState<Set<string>>(new Set())

  return (
    <ImagesView
      groupedImages={SAMPLE_IMAGE_ITEMS}
      groupMap={new Map()}
      sequenceGroupMap={new Map()}
      groupSettings={null}
      classes={SAMPLE_CLASSES_FULL}
      loading={false}
      loadingMore={false}
      hasMore={false}
      isOnline={false}
      isDeleting={false}
      datePreset="all"
      fromDate=""
      toDate=""
      filterOpen={false}
      selectedImageIds={selectedIds}
      selectionMode={false}
      modalOpen={false}
      modalActiveImage={null}
      modalImageSrc={null}
      modalEditMode="cursor"
      modalCanvasContent={null}
      modalHintText={null}
      showModalToolbar={false}
      showModalOverlayControls={false}
      modalAnnotationsVisible
      modalIsFullscreen={false}
      modalBboxCount={0}
      pendingDelete={null}
      labels={IMAGES_LABELS}
      getDisplayedGroupMembers={(img) => [img]}
      onLoadMore={noop}
      onSetDatePreset={noop}
      onSetFromDate={noop}
      onSetToDate={noop}
      onToggleFilter={noop}
      onSelectAll={noop}
      onClearSelection={noop}
      onToggleImageSelection={noop}
      onCloseModal={noop}
      onSetModalEditMode={noop}
      onSetModalAnnotationsVisible={noop}
      onToggleModalFullscreen={noop}
      onConfirmDelete={noop}
      onCancelDelete={noop}
      onDeleteGroup={noop}
      onRetryReload={noop}
      onImageCellClick={noop}
    />
  )
}
