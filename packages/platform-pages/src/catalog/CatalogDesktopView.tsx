import type { ReactNode } from 'react'
import { CatalogShell, DatasetListPanel, PagePrimaryHeader } from '@ingradient/ui/patterns'
import { CatalogBody } from './CatalogBody'
import { CatalogRightSidebar } from './CatalogRightSidebar'
import { CatalogToolbarRow } from './CatalogToolbarRow'
import { ContentArea, DragOverFull } from './CatalogView.styles'
import type {
  CatalogDatasetsPaneProps,
  CatalogImagesPaneProps,
  CatalogPagePaneProps,
  CatalogRightSidebarPaneProps,
  CatalogToolbarPaneProps,
} from './types'

interface Props {
  page: CatalogPagePaneProps
  datasets: CatalogDatasetsPaneProps
  toolbar: CatalogToolbarPaneProps
  images: CatalogImagesPaneProps
  rightSidebar: CatalogRightSidebarPaneProps | null
  statsContent?: ReactNode
}

const STORAGE_KEY = 'ig-catalog-shell'

export function CatalogDesktopView({
  page,
  datasets,
  toolbar,
  images,
  rightSidebar,
  statsContent,
}: Props) {
  return (
    <>
      <PagePrimaryHeader
        title={page.title}
        subtitle={page.subtitle}
        rightSlot={page.projectName ?? undefined}
      />
      <ContentArea>
        {page.dragOverFull ? <DragOverFull>Drop images here to upload</DragOverFull> : null}
        <CatalogShell
          storageKey={STORAGE_KEY}
          sidebarCollapsed={datasets.sidebarCollapsed}
          rightSidebar={
            rightSidebar ? <CatalogRightSidebar {...rightSidebar} /> : undefined
          }
          leftSidebar={
            <DatasetListPanel
              datasets={datasets.datasets.map((d) => ({
                id: d.id,
                name: d.name,
                task_type: d.task_type,
              }))}
              selectedIds={datasets.selectedIds}
              currentId={datasets.currentId}
              loading={datasets.loading}
              noProject={datasets.noProject}
              dragOverDatasetId={datasets.dragOverDatasetId}
              onSelectAll={datasets.onSelectAll}
              onToggleSelect={datasets.onToggleSelect}
              onSelectCurrent={datasets.onSelectCurrent}
              onAddDataset={datasets.onAddDataset}
              onOpenDatasetMenu={datasets.onOpenDatasetMenu}
              onCollapse={datasets.onCollapse}
            />
          }
          toolbar={
            <CatalogToolbarRow
              {...toolbar}
              sidebarCollapsed={!!datasets.sidebarCollapsed}
              onExpandSidebar={datasets.onExpand}
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
        />
      </ContentArea>
    </>
  )
}
