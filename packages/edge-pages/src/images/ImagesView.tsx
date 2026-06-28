import { chartHeights } from '@ingradient/ui'
import { iconSizeNumbers } from '@ingradient/ui'
import { useRef } from 'react'
import {
  Button, Checkbox, ConfirmDialog, DialogCloseButton, EmptyState, FilterPopover, FilterPopoverSection,
} from '@ingradient/ui'
import { DatePickerField, DropdownSelect, EyeIcon, EyeOffIcon, FilterIcon, ExpandIcon, CollapseIcon, PointerIcon, SquareIcon, MenuIconButton } from '@ingradient/ui/components'
import {
  ImagesFilterDateLabel, ImagesFilterDateRow,
  ImagesFilterWrap,
  ImagesWrapper,
  SelectionToolbar,
  ModalBBoxCanvasWrap, ModalBBoxToolbar,
  ModalFilename, ModalHeader, ModalHeaderCenter,
  ModalHeaderLeft,
  ModalToolbarSpacer, ModalBboxCount,
  ModalHint, ModalInner, ModalOverlay,
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

  const isAllSelected = groupedImages.length > 0 && selectedImageIds.size === groupedImages.length
  const touchStartY = useRef<number | null>(null)

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
            title={labels.selectAll}
          />
          <div style={{ flex: 1 }} />
          <ImagesFilterWrap>
            <MenuIconButton
              type="button"
              $active={datePreset !== 'all'}
              title={labels.filterTitle}
              aria-label={labels.filterTitle}
              onClick={onToggleFilter}
            >
              <FilterIcon size={iconSizeNumbers.md} />
            </MenuIconButton>
            {filterOpen && (
              <FilterPopover
                width={chartHeights.lg}
                style={{ position: 'absolute', top: 'calc(100% + var(--ig-space-2))', right: 0 }}
              >
                <FilterPopoverSection title={labels.dateFilter.title}>
                  <DropdownSelect
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
                        <ImagesFilterDateLabel>{labels.dateFilter.from}</ImagesFilterDateLabel>
                        <DatePickerField value={fromDate} onChange={onSetFromDate} />
                      </ImagesFilterDateRow>
                      <ImagesFilterDateRow>
                        <ImagesFilterDateLabel>{labels.dateFilter.to}</ImagesFilterDateLabel>
                        <DatePickerField value={toDate} onChange={onSetToDate} />
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
            onClick={onConfirmDelete}
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
          <ModalOverlay
            onClick={onCloseModal}
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
            <ModalInner onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalHeaderCenter>
                  <ModalFilename title={modalActiveImage.label}>
                    {modalActiveImage.label}
                  </ModalFilename>
                </ModalHeaderCenter>
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
                <DialogCloseButton
                  onClick={(e) => { e.stopPropagation(); onCloseModal() }}
                  title={labels.modal.close}
                  aria-label={labels.modal.close}
                />
              </ModalHeader>
              <ModalBBoxCanvasWrap>
                {modalCanvasContent}
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
          </ModalOverlay>
        )}
      </ImagesWrapper>
    </>
  )
}
