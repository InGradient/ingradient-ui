import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { ImagesView } from './ImagesView'
import type { ImagesViewProps } from './types'
vi.mock('./EdgeImagesGridView', () => ({ EdgeImagesGridView: () => <div>Grid</div> }))
const noop = () => undefined
const image = { id: 'one', label: 'one.png', src: '', fullSrc: '' }
function props(overrides: Partial<ImagesViewProps> = {}): ImagesViewProps {
  return {
    groupedImages: [image], groupMap: new Map(), sequenceGroupMap: new Map(), groupSettings: null, classes: [],
    loading: false, loadingMore: false, hasMore: false, isOnline: false, isDeleting: false,
    datePreset: 'all', fromDate: '', toDate: '', filterOpen: false, selectedImageIds: new Set(['one']), selectionMode: false,
    modalOpen: false, modalActiveImage: null, modalImageSrc: null, modalEditMode: 'cursor', showModalToolbar: false, showModalOverlayControls: false,
    modalAnnotationsVisible: true, modalIsFullscreen: false, modalBboxCount: 0, pendingDelete: null,
    labels: { filterTitle: 'Filter', selectAll: 'Select all', deleteSelected: (count) => `Delete (${count})`, empty: 'Empty', emptyOffline: 'Offline', retry: 'Retry', deleteConfirmTitle: 'Confirm deletion', deleteConfirmDesc: (count) => `Delete ${count}?`, deleteConfirm: 'Confirm', cancel: 'Cancel', loading: 'Loading', loadingMore: 'Loading more', dateFilter: { title: 'Date', all: 'All', today: 'Today', last7: 'Last 7', last30: 'Last 30', custom: 'Custom', from: 'From', to: 'To' }, grid: { uploading: 'Uploading', conversionPending: 'Pending', uploadFailed: () => 'Failed', deleteGroup: 'Delete group' }, modal: { cursorMode: 'Cursor', bboxMode: 'BBox', hintDraw: '', hintNoClass: '', hintSelect: '', close: 'Close', showAnnotations: 'Show', hideAnnotations: 'Hide', enterFullscreen: 'Expand', exitFullscreen: 'Collapse', bboxCount: String } },
    getDisplayedGroupMembers: (item) => [item], onLoadMore: noop, onSetDatePreset: noop, onSetFromDate: noop, onSetToDate: noop, onToggleFilter: noop,
    onSelectAll: noop, onClearSelection: noop, onToggleImageSelection: noop, onCloseModal: noop, onSetModalEditMode: noop,
    onSetModalAnnotationsVisible: noop, onToggleModalFullscreen: noop, onConfirmDelete: noop, onCancelDelete: noop, onDeleteGroup: noop, onRetryReload: noop, onImageCellClick: noop,
    ...overrides,
  }
}

describe('ImagesView contracts', () => {
  it('separates toolbar requests from confirmation while retaining legacy fallback', () => {
    const request = vi.fn(); const confirm = vi.fn()
    const { rerender } = render(<ImagesView {...props({ onRequestDelete: request, onConfirmDelete: confirm })} />)
    fireEvent.click(screen.getByRole('button', { name: 'Delete (1)' }))
    expect(request).toHaveBeenCalledOnce(); expect(confirm).not.toHaveBeenCalled()
    rerender(<ImagesView {...props({ onRequestDelete: request, onConfirmDelete: confirm, pendingDelete: { count: 1 } })} />)
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    expect(confirm).toHaveBeenCalledOnce()
    rerender(<ImagesView {...props({ onConfirmDelete: confirm })} />)
    fireEvent.click(screen.getByRole('button', { name: 'Delete (1)' }))
    expect(confirm).toHaveBeenCalledTimes(2)
  })
  it('select-all checks membership, including grouped members, not equal set sizes', () => {
    const { rerender } = render(<ImagesView {...props({ selectedImageIds: new Set(['different']) })} />)
    expect(screen.getByRole('checkbox', { name: 'Select all' })).not.toBeChecked()
    rerender(<ImagesView {...props({ selectedImageIds: new Set(['one', 'two']), getDisplayedGroupMembers: () => [image, { ...image, id: 'two' }] })} />)
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toBeChecked()
  })
  it('gives date fields persistent labels and supports filter Escape', () => {
    const close = vi.fn()
    render(<ImagesView {...props({ filterOpen: true, datePreset: 'custom', onCloseFilter: close })} />)
    expect(screen.getByLabelText('From')).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText('To')).toHaveAttribute('type', 'date')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(close).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Filter' })).toHaveFocus()
  })
  it('uses a named dialog for inspector with navigation and Escape', () => {
    const close = vi.fn(); const navigate = vi.fn()
    render(<ImagesView {...props({ modalOpen: true, modalActiveImage: image, modalImageSrc: 'fixture.png', onCloseModal: close, onModalSwipeNavigate: navigate })} />)
    const dialog = screen.getByRole('dialog', { name: 'one.png' })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next image' }))
    expect(navigate).toHaveBeenCalledWith(1)
    fireEvent.keyDown(within(dialog).getByRole('button', { name: 'Previous image' }), { key: 'ArrowLeft' })
    expect(navigate).toHaveBeenCalledWith(-1)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(close).toHaveBeenCalledOnce()
  })
})
