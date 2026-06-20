import { iconSizeNumbers } from '@ingradient/ui'
import {
  Button,
  FilterIcon,
  FilterPopoverTrigger,
  GridIcon,
  IconButton,
  MenuIcon,
  ModeSwitcher,
  SearchField,
  SortIcon,
  StatsIcon,
  TableIcon,
} from '@ingradient/ui/components'
import { SortPopoverTrigger } from '@ingradient/ui/patterns'
import { GalleryFilterPanel, GalleryToolbar } from './gallery'
import { DangerDimButton } from './CatalogView.styles'
import type { CatalogToolbarPaneProps, CatalogViewMode } from './types'

interface Props extends CatalogToolbarPaneProps {
  sidebarCollapsed: boolean
  onExpandSidebar: () => void
}

const VIEW_OPTIONS = [
  { value: 'grid' as CatalogViewMode, label: 'Grid', icon: <GridIcon size={iconSizeNumbers.md} /> },
  { value: 'table' as CatalogViewMode, label: 'Table', icon: <TableIcon size={iconSizeNumbers.md} /> },
  { value: 'stats' as CatalogViewMode, label: 'Stats', icon: <StatsIcon size={iconSizeNumbers.md} /> },
]

export function CatalogToolbarRow({
  sidebarCollapsed,
  onExpandSidebar,
  viewMode,
  onChangeViewMode,
  searchValue,
  onSearchChange,
  filterState,
  onFilterChange,
  onFilterReset,
  hasActiveFilter,
  filterDefaultOpen,
  sortValue,
  sortOptions,
  onSortChange,
  sortDefaultOpen,
  classes,
  members,
  patternItems,
  totalCount,
  loadedCount,
  selectionCount,
  allSelected,
  uploadProgress,
  onToggleSelectAll,
  onDelete,
  onExport,
  onUpload,
}: Props) {
  return (
    <GalleryToolbar
      leftStart={sidebarCollapsed ? (
        <IconButton variant="secondary" size="sm" aria-label="Expand sidebar" onClick={onExpandSidebar}>
          <MenuIcon size={iconSizeNumbers.lg} />
        </IconButton>
      ) : undefined}
      search={
        <SearchField
          placeholder="Search file name"
          size="sm"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ maxWidth: 220 }}
        />
      }
      filters={
        <>
          <FilterPopoverTrigger
            label="Filter"
            iconOnly
            icon={<FilterIcon size={iconSizeNumbers.lg} />}
            active={hasActiveFilter}
            defaultOpen={filterDefaultOpen}
            panel={
              <GalleryFilterPanel
                state={filterState}
                onChange={onFilterChange}
                classItems={classes.map((c) => ({ id: c.id, label: c.name, color: c.color }))}
                memberItems={members.map((m) => ({ id: m.id, label: m.name }))}
                patternItems={patternItems ?? []}
                showPatterns={!!patternItems?.length}
                onReset={onFilterReset}
                onSelectAllPatterns={() =>
                  onFilterChange({
                    ...filterState,
                    selectedPatternIds: new Set((patternItems ?? []).map((p) => p.id)),
                  })
                }
                onResetPatterns={() =>
                  onFilterChange({ ...filterState, selectedPatternIds: new Set() })
                }
              />
            }
          />
          <SortPopoverTrigger
            iconOnly
            icon={<SortIcon size={iconSizeNumbers.lg} />}
            value={sortValue}
            onChange={onSortChange}
            options={sortOptions}
            defaultOpen={sortDefaultOpen}
          />
        </>
      }
      viewMode={
        <ModeSwitcher
          size="sm"
          shape="pill"
          iconOnly
          value={viewMode}
          onChange={(v) => onChangeViewMode(v as CatalogViewMode)}
          options={VIEW_OPTIONS}
        />
      }
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            data-ig-component="CatalogToolbarRow.ExportButton"
          >
            Export
          </Button>
          <Button
            variant="solid"
            size="sm"
            onClick={onUpload}
            data-ig-component="CatalogToolbarRow.UploadButton"
          >
            Upload
          </Button>
        </>
      }
      itemLabel="image"
      selectionCount={selectionCount}
      totalCount={totalCount}
      loadedCount={loadedCount}
      allSelected={allSelected}
      uploadProgress={uploadProgress}
      selectionActions={
        <DangerDimButton
          type="button"
          onClick={onDelete}
          data-ig-component="CatalogToolbarRow.DeleteButton"
        >
          Delete
        </DangerDimButton>
      }
      onToggleSelectAll={onToggleSelectAll}
    />
  )
}
