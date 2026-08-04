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
import { Stack, Text } from '@ingradient/ui/primitives'
import { SortOptionList } from '@ingradient/ui/patterns'
import { CatalogBody } from './CatalogBody'
import { MobileBottomSheet } from './CatalogView.styles'
import type {
  CatalogDatasetsPaneProps,
  CatalogImagesPaneProps,
  CatalogMobilePaneProps,
  CatalogPagePaneProps,
  CatalogMobileViewMode,
  CatalogToolbarPaneProps,
} from './types'

interface Props {
  page: CatalogPagePaneProps
  datasets: CatalogDatasetsPaneProps
  toolbar: CatalogToolbarPaneProps<CatalogMobileViewMode>
  images: CatalogImagesPaneProps
  mobile: CatalogMobilePaneProps
}

export function CatalogMobileView({
  page,
  datasets,
  toolbar,
  images,
  mobile,
}: Props) {
  const defaultSortValue = toolbar.sortOptions[0]?.value

  return (
    <>
      <MobileShell
        topBar={
          <MobileDropdown
            options={datasets.datasets.map((d) => ({ id: d.id, name: d.name }))}
            currentId={datasets.currentId}
            loading={datasets.loading}
            listboxAriaLabel="Datasets"
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
                active:
                  mobile.bottomSheet === 'sort' ||
                  (!!defaultSortValue && toolbar.sortValue !== defaultSortValue),
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
        <MobileBottomSheet as="section" aria-label="Filter images" data-ig-slot="CatalogMobile.FilterSheet">
          <GalleryFilterPanel
            state={toolbar.filterState}
            onChange={toolbar.onFilterChange}
            classItems={toolbar.classes.map((c) => ({ id: c.id, label: c.name, color: c.color }))}
            memberItems={toolbar.members.map((m) => ({ id: m.id, label: m.name }))}
            patternItems={toolbar.patternItems ?? []}
            showPatterns={!!toolbar.patternItems?.length}
            onReset={toolbar.onFilterReset}
            onSelectAllPatterns={() =>
              toolbar.onFilterChange({
                ...toolbar.filterState,
                selectedPatternIds: new Set((toolbar.patternItems ?? []).map((item) => item.id)),
              })
            }
            onResetPatterns={() =>
              toolbar.onFilterChange({
                ...toolbar.filterState,
                selectedPatternIds: new Set(),
              })
            }
          />
        </MobileBottomSheet>
      ) : null}
      {mobile.bottomSheet === 'sort' ? (
        <MobileBottomSheet as="section" aria-label="Sort images" data-ig-slot="CatalogMobile.SortSheet">
          <Stack gap="var(--ig-space-4)">
            <Text as="h2" size="var(--ig-font-size-lg)" weight="semibold">
              Sort images
            </Text>
            <SortOptionList
              ariaLabel="Sort images"
              options={toolbar.sortOptions}
              value={toolbar.sortValue}
              onChange={(value) => {
                toolbar.onSortChange(value)
                mobile.onSetBottomSheet(null)
              }}
            />
          </Stack>
        </MobileBottomSheet>
      ) : null}
    </>
  )
}
