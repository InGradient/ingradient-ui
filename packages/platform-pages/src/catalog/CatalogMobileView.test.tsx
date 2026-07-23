import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { emptyGalleryFilterPanelState } from './gallery'
import { CatalogMobileView } from './CatalogMobileView'

describe('CatalogMobileView', () => {
  it('renders the sort sheet and closes it after selecting an option', () => {
    const onSortChange = vi.fn()
    const onSetBottomSheet = vi.fn()

    render(
      <CatalogMobileView
        page={{ title: 'Catalog', subtitle: 'Images' }}
        datasets={{
          datasets: [], selectedIds: new Set(),
          onSelectAll: vi.fn(), onToggleSelect: vi.fn(), onSelectCurrent: vi.fn(),
          onAddDataset: vi.fn(), onOpenDatasetMenu: vi.fn(),
          onCollapse: vi.fn(), onExpand: vi.fn(),
        }}
        toolbar={{
          viewMode: 'grid', onChangeViewMode: vi.fn(),
          searchValue: '', onSearchChange: vi.fn(),
          filterState: emptyGalleryFilterPanelState(), onFilterChange: vi.fn(),
          onFilterReset: vi.fn(), hasActiveFilter: false,
          sortValue: 'recent',
          sortOptions: [
            { value: 'recent', label: 'Most recent' },
            { value: 'name-asc', label: 'Name (A-Z)' },
          ],
          onSortChange,
          classes: [], members: [], totalCount: 0, loadedCount: 0,
          selectionCount: 0, allSelected: false,
          onToggleSelectAll: vi.fn(), onDelete: vi.fn(), onExport: vi.fn(), onUpload: vi.fn(),
        }}
        images={{
          images: [], selectedImageIds: new Set(), datasetNameById: {},
          onToggleSelect: vi.fn(), onOpenDetail: vi.fn(), onOpenMenu: vi.fn(),
        }}
        mobile={{
          datasetSelectorOpen: false,
          onSetDatasetSelectorOpen: vi.fn(),
          bottomSheet: 'sort',
          onSetBottomSheet,
        }}
      />,
    )

    fireEvent.click(screen.getByRole('option', { name: 'Name (A-Z)' }))
    expect(onSortChange).toHaveBeenCalledWith('name-asc')
    expect(onSetBottomSheet).toHaveBeenCalledWith(null)
  })
})
