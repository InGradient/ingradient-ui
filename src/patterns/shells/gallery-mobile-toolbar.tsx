import type { ReactNode } from 'react'
import styled from 'styled-components'
import {
  DownloadIcon, FilterIcon, GridIcon, SortIcon, TableIcon, UploadIcon,
} from '../../components/icons/catalog-icons'

const Bar = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 var(--ig-space-3);
  padding-bottom: env(safe-area-inset-bottom, var(--ig-space-0));
  background: var(--ig-color-surface-header);
  border-top: 1px solid var(--ig-color-border-subtle);
  backdrop-filter: blur(14px);
  z-index: 10;
`

const ToolBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 48px;
  height: 48px;
  padding: 0 var(--ig-space-2);
  border: none;
  background: none;
  color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)')};
  cursor: pointer;
  border-radius: var(--ig-radius-xs);
  -webkit-tap-highlight-color: transparent;
  transition: color 0.15s, background 0.15s;
  &:hover:not(:disabled) { color: var(--ig-color-text-primary); background: var(--ig-color-white-07); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  svg { width: 20px; height: 20px; flex-shrink: 0; }
  span { font-size: 10px; line-height: 1; white-space: nowrap; }
`

export type GalleryMobileViewMode = 'grid' | 'table' | 'stats'

export interface GalleryMobileToolbarProps {
  viewMode: GalleryMobileViewMode
  onToggleView: () => void
  hasActiveFilter?: boolean
  hasActiveSort?: boolean
  onFilterClick?: () => void
  onSortClick?: () => void
  canExport?: boolean
  onExportClick?: () => void
  onUploadClick?: () => void
  /** 추가 button 을 우측에 끼워 넣음 (예: bulk action) */
  extraSlot?: ReactNode
}

export function GalleryMobileToolbar({
  viewMode, onToggleView,
  hasActiveFilter, hasActiveSort,
  onFilterClick, onSortClick,
  canExport = true, onExportClick, onUploadClick,
  extraSlot,
}: GalleryMobileToolbarProps) {
  return (
    <Bar>
      <ToolBtn type="button" $active={viewMode === 'grid'} onClick={onToggleView} title="Toggle view mode">
        {viewMode === 'grid' ? <GridIcon /> : <TableIcon />}
        <span>View</span>
      </ToolBtn>
      <ToolBtn type="button" $active={hasActiveFilter} onClick={onFilterClick} title="Filter">
        <FilterIcon />
        <span>Filter</span>
      </ToolBtn>
      <ToolBtn type="button" $active={hasActiveSort} onClick={onSortClick} title="Sort">
        <SortIcon />
        <span>Sort</span>
      </ToolBtn>
      <ToolBtn type="button" disabled={!canExport} onClick={onExportClick} title="Export">
        <DownloadIcon />
        <span>Export</span>
      </ToolBtn>
      <ToolBtn type="button" onClick={onUploadClick} title="Upload">
        <UploadIcon />
        <span>Upload</span>
      </ToolBtn>
      {extraSlot}
    </Bar>
  )
}
