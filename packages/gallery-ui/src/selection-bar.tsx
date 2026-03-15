import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { portalGhostButton, portalPrimaryButton } from '@ingradient/ui'

// --- SelectionBar ---
const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
  width: 100%;
`
const BarRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`
const Btn = styled.button`
  ${portalPrimaryButton}
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  pointer-events: auto;
`
const DeleteBtn = styled(Btn)`
  ${portalGhostButton}
  border-color: rgba(224, 92, 92, 0.45);
  background: rgba(120, 28, 28, 0.18);
  color: #ffb4b4;

  &:hover:not(:disabled) {
    border-color: rgba(255, 138, 138, 0.7);
    background: rgba(152, 36, 36, 0.3);
    color: #ffd0d0;
  }
`
const SelectAllLink = styled.button`
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  color: var(--portal-accent-soft);
  cursor: pointer;
  font-size: inherit;
  text-decoration: underline;
  &:hover { color: var(--portal-text-primary); }
  &:disabled { color: var(--portal-text-soft); cursor: default; text-decoration: none; }
`
const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.18);
  border-top-color: var(--portal-text-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
  margin-right: 6px;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
const BarLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--portal-text-primary);
  font-size: inherit;
  user-select: none;
`
const BarCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  accent-color: var(--portal-accent);
  cursor: pointer;
  flex-shrink: 0;
`
const CountWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

export interface SelectionBarProps {
  selectedCount: number
  totalCount?: number
  loadedCount?: number
  itemLabel?: string
  onClearSelection: () => void
  onDelete: () => void
  onSelectAll?: () => void
  onSelectAllEntire?: () => void
  onUploadClick?: () => void
  /** Rendered immediately to the left of the total/selection count label. */
  leftOfCount?: React.ReactNode
  /** Rendered immediately to the left of the Upload button. */
  leftOfUpload?: React.ReactNode
  /** Rendered immediately to the right of the total/selection count label. */
  rightOfCount?: React.ReactNode
  isSelectingEntire?: boolean
  isDeleting?: boolean
}

export function SelectionBar({
  selectedCount,
  totalCount,
  loadedCount = 0,
  itemLabel,
  onClearSelection,
  onDelete,
  onSelectAll,
  onSelectAllEntire,
  onUploadClick,
  leftOfCount,
  leftOfUpload,
  rightOfCount,
  isSelectingEntire = false,
  isDeleting = false,
}: SelectionBarProps) {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const el = selectAllCheckboxRef.current
    if (!el) return
    el.indeterminate = selectedCount > 0 && selectedCount < loadedCount
  }, [selectedCount, loadedCount])

  const showBar =
    selectedCount > 0 ||
    (loadedCount > 0 && onSelectAll != null) ||
    (totalCount != null && totalCount > 0 && onSelectAllEntire != null) ||
    onUploadClick != null ||
    leftOfCount != null ||
    rightOfCount != null ||
    leftOfUpload != null
  if (!showBar) return null

  const showCheckbox =
    loadedCount > 0 &&
    onSelectAll != null &&
    totalCount != null &&
    totalCount > 0
  const countText =
    selectedCount === 0
      ? itemLabel
        ? `${totalCount ?? 0} ${itemLabel}`
        : `${totalCount ?? 0} total`
      : totalCount != null && selectedCount < totalCount
        ? itemLabel
          ? `${selectedCount} of ${totalCount} ${itemLabel} selected`
          : `${selectedCount} of ${totalCount} selected`
        : itemLabel
          ? `${selectedCount} ${itemLabel} selected`
          : `${selectedCount} selected`

  return (
    <Bar>
      {!showCheckbox && leftOfCount}
      {showCheckbox && (
        <CountWrap>
          {leftOfCount}
          <BarLabel>
            <BarCheckbox
              ref={selectAllCheckboxRef}
              data-testid="select-all-loaded"
              checked={selectedCount === loadedCount && loadedCount > 0}
              onChange={(e) => {
                if (selectedCount > 0 && selectedCount < loadedCount) {
                  onClearSelection()
                  return
                }
                if (e.target.checked) onSelectAll!()
                else onClearSelection()
              }}
              aria-label="Select all loaded"
            />
            <span data-testid="selection-count">{countText}</span>
            {rightOfCount}
          </BarLabel>
        </CountWrap>
      )}
      {selectedCount > 0 && (
        <>
          {totalCount != null && onSelectAllEntire && selectedCount < totalCount && (
            <>
              <span>—</span>
              <SelectAllLink type="button" onClick={onSelectAllEntire} disabled={isSelectingEntire}>
                {isSelectingEntire ? 'Loading…' : `Select all ${totalCount}`}
              </SelectAllLink>
            </>
          )}
          <DeleteBtn type="button" onClick={onDelete} disabled={isDeleting}>
            {isDeleting && <Spinner />}
            Delete
          </DeleteBtn>
        </>
      )}
      {(leftOfUpload || onUploadClick) && (
        <BarRight>
          {leftOfUpload}
          {onUploadClick && (
            <Btn type="button" onClick={onUploadClick}>Upload</Btn>
          )}
        </BarRight>
      )}
    </Bar>
  )
}
