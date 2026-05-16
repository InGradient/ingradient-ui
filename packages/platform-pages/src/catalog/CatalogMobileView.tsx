import {
  CatalogMobileShell,
  DatasetSelectorMobile,
  GalleryFilterPanel,
  GalleryMobileToolbar,
} from '@ingradient/ui/patterns'
import { CatalogBody } from './CatalogBody'
import { MobileBottomSheet } from './CatalogView.styles'
import type {
  CatalogDatasetsPaneProps,
  CatalogImagesPaneProps,
  CatalogMobilePaneProps,
  CatalogPagePaneProps,
  CatalogToolbarPaneProps,
} from './types'

interface Props {
  page: CatalogPagePaneProps
  datasets: CatalogDatasetsPaneProps
  toolbar: CatalogToolbarPaneProps
  images: CatalogImagesPaneProps
  mobile: CatalogMobilePaneProps
  statsContent?: import('react').ReactNode
}

export function CatalogMobileView({
  page,
  datasets,
  toolbar,
  images,
  mobile,
  statsContent,
}: Props) {
  return (
    <>
      <CatalogMobileShell
        topBar={
          <DatasetSelectorMobile
            datasets={datasets.datasets.map((d) => ({ id: d.id, name: d.name }))}
            currentId={datasets.currentId}
            loading={datasets.loading}
            open={mobile.datasetSelectorOpen}
            onToggle={mobile.onSetDatasetSelectorOpen}
            onSelect={(id) => datasets.onSelectCurrent(id)}
          />
        }
        body={
          <CatalogBody
            permissionDenied={page.permissionDenied}
            error={page.error}
            viewMode={toolbar.viewMode}
            imagesPane={images}
            dragOverGrid={page.dragOverGrid}
            statsContent={statsContent}
          />
        }
        bottomBar={
          <GalleryMobileToolbar
            viewMode={toolbar.viewMode === 'grid' ? 'grid' : 'table'}
            onToggleView={() =>
              toolbar.onChangeViewMode(toolbar.viewMode === 'grid' ? 'table' : 'grid')
            }
            hasActiveFilter={toolbar.hasActiveFilter}
            onFilterClick={() =>
              mobile.onSetBottomSheet(mobile.bottomSheet === 'filter' ? null : 'filter')
            }
            onSortClick={() =>
              mobile.onSetBottomSheet(mobile.bottomSheet === 'sort' ? null : 'sort')
            }
            canExport={images.images.length > 0}
            onExportClick={toolbar.onExport}
            onUploadClick={toolbar.onUpload}
          />
        }
      />
      {mobile.bottomSheet === 'filter' ? (
        <MobileBottomSheet>
          <GalleryFilterPanel
            state={toolbar.filterState}
            onChange={toolbar.onFilterChange}
            classItems={toolbar.classes.map((c) => ({ id: c.id, label: c.name, color: c.color }))}
            memberItems={toolbar.members.map((m) => ({ id: m.id, label: m.name }))}
            onReset={toolbar.onFilterReset}
          />
        </MobileBottomSheet>
      ) : null}
    </>
  )
}
