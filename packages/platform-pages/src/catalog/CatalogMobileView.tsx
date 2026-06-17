import { GalleryFilterPanel } from './gallery'
import {
  DownloadIcon,
  FilterIcon,
  GridIcon,
  MobileBottomToolbar,
  MobileDropdown,
  MobileShell,
  SortIcon,
  TableIcon,
  UploadIcon,
} from '@ingradient/ui/components'
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
      <MobileShell
        topBar={
          <MobileDropdown
            options={datasets.datasets.map((d) => ({ id: d.id, name: d.name }))}
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
          <MobileBottomToolbar
            actions={[
              {
                key: 'view',
                label: 'View',
                icon: toolbar.viewMode === 'grid' ? <GridIcon /> : <TableIcon />,
                active: toolbar.viewMode === 'grid',
                onClick: () =>
                  toolbar.onChangeViewMode(toolbar.viewMode === 'grid' ? 'table' : 'grid'),
              },
              {
                key: 'filter',
                label: 'Filter',
                icon: <FilterIcon />,
                active: toolbar.hasActiveFilter,
                onClick: () =>
                  mobile.onSetBottomSheet(mobile.bottomSheet === 'filter' ? null : 'filter'),
              },
              {
                key: 'sort',
                label: 'Sort',
                icon: <SortIcon />,
                onClick: () =>
                  mobile.onSetBottomSheet(mobile.bottomSheet === 'sort' ? null : 'sort'),
              },
              {
                key: 'export',
                label: 'Export',
                icon: <DownloadIcon />,
                disabled: images.images.length === 0,
                onClick: toolbar.onExport,
              },
              {
                key: 'upload',
                label: 'Upload',
                icon: <UploadIcon />,
                onClick: toolbar.onUpload,
              },
            ]}
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
