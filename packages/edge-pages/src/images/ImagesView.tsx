import { popupSizeNumbers } from '@ingradient/ui'
import { iconSizeNumbers } from '@ingradient/ui'
import { useEffect, useId, useRef } from 'react'
import {
  Button, Checkbox, ConfirmDialog, DialogShell, EmptyState, FilterPopover, FilterPopoverSection,
} from '@ingradient/ui'
import { TextField, DropdownSelect, EyeIcon, EyeOffIcon, FilterIcon, ExpandIcon, CollapseIcon, PointerIcon, SquareIcon, MenuIconButton } from '@ingradient/ui/components'
import {
  ImagesFilterDateLabel, ImagesFilterDateRow,
  ImagesFilterWrap,
  ImagesWrapper,
  SelectionToolbar,
  ModalBBoxCanvasWrap, ModalBBoxToolbar,
  ModalHeader, ModalHeaderLeft,
  ModalToolbarSpacer, ModalBboxCount,
  ModalHint, ModalInner,
} from './ImagesView.styles'
import { EdgeImagesGridView } from './EdgeImagesGridView'
import type { ImagesViewProps } from './types'
import type { ImagesDatePreset } from './image-helpers'

export function ImagesView(props: ImagesViewProps): JSX.Element {
  const {
    groupedImages, groupMap, sequenceGroupMap, groupSettings, classes,
    loadingMore, hasMore, isDeleting,
    datePreset, fromDate, toDate, filterOpen,
    selectedImageIds,
    modalOpen, modalActiveImage, modalEditMode,
    modalCanvasContent, modalHintText,
    showModalToolbar, showModalOverlayControls,
    modalAnnotationsVisible, modalIsFullscreen, modalBboxCount,
    pendingDelete,
    labels,
    getDisplayedGroupMembers,
    onLoadMore, onSetDatePreset, onSetFromDate, onSetToDate, onToggleFilter,
    onSelectAll, onToggleImageSelection,
    onConfirmDelete, onCancelDelete, onDeleteGroup, onImageCellClick,
    onCloseModal, onSetModalEditMode, onModalSwipeNavigate,
    onSetModalAnnotationsVisible, onToggleModalFullscreen,
  } = props
  void onToggleImageSelection

  const displayedIds = new Set(groupedImages.flatMap((image) => getDisplayedGroupMembers(image).map((member) => member.id)))
  const isAllSelected = displayedIds.size > 0 && [...displayedIds].every((id) => selectedImageIds.has(id))
  const touchStartY = useRef<number | null>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!modalOpen || !onModalSwipeNavigate) return
    const navigate = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !(event.target instanceof HTMLElement)) return
      const dialog = modalContentRef.current?.closest('[role="dialog"]')
      if (!dialog?.contains(event.target) || event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        onModalSwipeNavigate(event.key === 'ArrowRight' ? 1 : -1)
      }
    }
    window.addEventListener('keydown', navigate)
    return () => window.removeEventListener('keydown', navigate)
  }, [modalOpen, onModalSwipeNavigate])
  const filterRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const filterId = useId()
  const fromId = useId()
  const toId = useId()
  const closeFilter = props.onCloseFilter ?? onToggleFilter
  useEffect(() => {
    if (!filterOpen) return
    const childListbox = () => Array.from(document.querySelectorAll('[role="listbox"]')).find((element) => element.getAttribute('aria-label') === `${labels.dateFilter.title} options`)
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !filterRef.current?.contains(event.target) && !childListbox()?.contains(event.target)) closeFilter()
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || childListbox()) return
      event.preventDefault()
      closeFilter()
      filterButtonRef.current?.focus()
    }
    document.addEventListener('pointerdown', outside)
    window.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      window.removeEventListener('keydown', escape)
    }
  }, [filterOpen, closeFilter, labels.dateFilter.title])

  return (
    <>
      {pendingDelete !== null && (
        <ConfirmDialog
          title={labels.deleteConfirmTitle}
          description={labels.deleteConfirmDesc(pendingDelete.count)}
          confirmLabel={labels.deleteConfirm}
          cancelLabel={labels.cancel}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}
      <ImagesWrapper>
        <SelectionToolbar>
          <Checkbox
            checked={isAllSelected}
            onChange={onSelectAll}
            label={labels.selectAll}
          />
          {props.onSetSelectionMode && <Checkbox
            label={props.selectionModeLabel ?? labels.selectAll}
            checked={props.selectionMode}
            onChange={(event) => props.onSetSelectionMode?.(event.target.checked)}
          />}
          <div style={{ flex: 1 }} />
          <ImagesFilterWrap ref={filterRef}>
            <MenuIconButton
              type="button"
              $active={datePreset !== 'all'}
              title={labels.filterTitle}
              aria-label={labels.filterTitle}
              ref={filterButtonRef}
              aria-expanded={filterOpen}
              aria-controls={filterOpen ? filterId : undefined}
              onClick={onToggleFilter}
            >
              <FilterIcon size={iconSizeNumbers.md} />
            </MenuIconButton>
            {filterOpen && (
              <FilterPopover
                id={filterId}
                aria-label={labels.filterTitle}
                width={popupSizeNumbers.smNarrow}
                style={{ position: 'absolute', top: 'calc(100% + var(--ig-space-2))', right: 0 }}
              >
                <FilterPopoverSection title={labels.dateFilter.title}>
                  <DropdownSelect
                    aria-label={labels.dateFilter.title}
                    value={datePreset}
                    options={[
                      { value: 'all', label: labels.dateFilter.all },
                      { value: 'today', label: labels.dateFilter.today },
                      { value: 'last7', label: labels.dateFilter.last7 },
                      { value: 'last30', label: labels.dateFilter.last30 },
                      { value: 'custom', label: labels.dateFilter.custom },
                    ]}
                    onChange={(value) => onSetDatePreset(value as ImagesDatePreset)}
                  />
                  {datePreset === 'custom' && (
                    <>
                      <ImagesFilterDateRow>
                        <ImagesFilterDateLabel as="label" htmlFor={fromId}>{labels.dateFilter.from}</ImagesFilterDateLabel>
                        <TextField type="date" id={fromId} value={fromDate} onChange={(event) => onSetFromDate(event.target.value)} />
                      </ImagesFilterDateRow>
                      <ImagesFilterDateRow>
                        <ImagesFilterDateLabel as="label" htmlFor={toId}>{labels.dateFilter.to}</ImagesFilterDateLabel>
                        <TextField type="date" id={toId} value={toDate} onChange={(event) => onSetToDate(event.target.value)} />
                      </ImagesFilterDateRow>
                    </>
                  )}
                </FilterPopoverSection>
              </FilterPopover>
            )}
          </ImagesFilterWrap>
          <Button
            size="sm"
            variant="secondary"
            disabled={selectedImageIds.size === 0 || isDeleting}
            onClick={props.onRequestDelete ?? onConfirmDelete}
          >
            {isDeleting ? labels.deleteSelected(selectedImageIds.size) : labels.deleteSelected(selectedImageIds.size)}
          </Button>
        </SelectionToolbar>
        {groupedImages.length === 0 ? (
          <EmptyState>{labels.empty}</EmptyState>
        ) : (
          <EdgeImagesGridView
            items={groupedImages}
            selectedIds={selectedImageIds}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
            groupMap={groupMap}
            sequenceGroupMap={sequenceGroupMap}
            groupSettings={groupSettings}
            selectedDatasetClasses={classes}
            labels={labels.grid}
            getDisplayedGroupMembers={getDisplayedGroupMembers}
            onCellClick={onImageCellClick}
            onDeleteGroupRequest={onDeleteGroup}
          />
        )}
        {modalOpen && modalActiveImage && (
          <DialogShell title={modalActiveImage.label} onClose={onCloseModal}
            width={modalIsFullscreen ? '100vw' : 'min(var(--ig-popup-3xl-mid), 95vw)'}
            height={modalIsFullscreen ? '100dvh' : '85dvh'}>
          <ModalInner ref={modalContentRef}
            onTouchStart={(e) => { touchStartY.current = e.touches[0]?.clientY ?? null }}
            onTouchEnd={(e) => {
              if (touchStartY.current === null) return
              const dy = touchStartY.current - (e.changedTouches[0]?.clientY ?? 0)
              if (Math.abs(dy) > 40 && onModalSwipeNavigate) {
                onModalSwipeNavigate(dy > 0 ? 1 : -1)
              }
              touchStartY.current = null
            }}
          >
              <ModalHeader>
                {onModalSwipeNavigate && <>
                  <Button size="sm" variant="secondary" onClick={() => onModalSwipeNavigate(-1)}>{props.modalPreviousLabel ?? 'Previous image'}</Button>
                  <Button size="sm" variant="secondary" onClick={() => onModalSwipeNavigate(1)}>{props.modalNextLabel ?? 'Next image'}</Button>
                </>}
                <ModalHeaderLeft>
                  {showModalOverlayControls && (
                    <>
                      <MenuIconButton
                        type="button"
                        $active={modalAnnotationsVisible}
                        onClick={(e) => { e.stopPropagation(); onSetModalAnnotationsVisible(!modalAnnotationsVisible) }}
                        title={modalAnnotationsVisible ? labels.modal.hideAnnotations : labels.modal.showAnnotations}
                        aria-label={modalAnnotationsVisible ? labels.modal.hideAnnotations : labels.modal.showAnnotations}
                      >
                        {modalAnnotationsVisible ? <EyeIcon size={iconSizeNumbers.md} /> : <EyeOffIcon size={iconSizeNumbers.md} />}
                      </MenuIconButton>
                      <MenuIconButton
                        type="button"
                        $active={modalIsFullscreen}
                        onClick={(e) => { e.stopPropagation(); onToggleModalFullscreen() }}
                        title={modalIsFullscreen ? labels.modal.exitFullscreen : labels.modal.enterFullscreen}
                        aria-label={modalIsFullscreen ? labels.modal.exitFullscreen : labels.modal.enterFullscreen}
                      >
                        {modalIsFullscreen ? <CollapseIcon size={iconSizeNumbers.md} /> : <ExpandIcon size={iconSizeNumbers.md} />}
                      </MenuIconButton>
                    </>
                  )}
                </ModalHeaderLeft>

              </ModalHeader>
              <ModalBBoxCanvasWrap>
                {modalCanvasContent ?? (props.modalImageSrc && <img src={props.modalImageSrc} alt={modalActiveImage.label} style={{ width: '100%', height: '100%', minHeight: 0, objectFit: 'contain' }} />)}
              </ModalBBoxCanvasWrap>
              {modalHintText && <ModalHint>{modalHintText}</ModalHint>}
              {showModalToolbar && (
                <ModalBBoxToolbar>
                  <MenuIconButton
                    type="button"
                    $active={modalEditMode === 'cursor'}
                    onClick={() => onSetModalEditMode('cursor')}
                    title={labels.modal.cursorMode}
                    aria-label={labels.modal.cursorMode}
                  >
                    <PointerIcon size={iconSizeNumbers.md} />
                  </MenuIconButton>
                  <MenuIconButton
                    type="button"
                    $active={modalEditMode === 'bbox'}
                    onClick={() => onSetModalEditMode('bbox')}
                    title={labels.modal.bboxMode}
                    aria-label={labels.modal.bboxMode}
                  >
                    <SquareIcon size={iconSizeNumbers.md} />
                  </MenuIconButton>
                  <ModalToolbarSpacer />
                  <ModalBboxCount>· {labels.modal.bboxCount(modalBboxCount)}</ModalBboxCount>
                </ModalBBoxToolbar>
              )}
            </ModalInner>
          </DialogShell>
        )}
      </ImagesWrapper>
    </>
  )
}
