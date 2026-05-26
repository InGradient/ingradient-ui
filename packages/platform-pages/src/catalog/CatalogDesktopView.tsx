import type { ReactNode } from 'react'
import { DatasetListPanel, PagePrimaryHeader } from '@ingradient/ui/patterns'
import { ResizableColumnsLayout, type ResizableColumn } from '@ingradient/ui/components'
import { Stack, Box } from '@ingradient/ui/primitives'
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

const CENTER_STYLE = { flex: 1, minWidth: 0, minHeight: 0, height: '100%' }
const SLOT_STYLE = { flex: '0 0 auto' as const }
const BODY_STYLE = { flex: 1, minHeight: 0, overflow: 'auto' as const, position: 'relative' as const }
const ROOT_STYLE = { background: 'var(--ig-color-bg-canvas)' }

export function CatalogDesktopView({
  page,
  datasets,
  toolbar,
  images,
  rightSidebar,
  statsContent,
}: Props) {
  const columns: ResizableColumn[] = [
    {
      width: 320,
      resizable: true,
      minWidth: 220,
      maxWidth: 480,
      collapsed: datasets.sidebarCollapsed,
    },
    { width: 'auto' },
    {
      width: 320,
      resizable: true,
      minWidth: 220,
      maxWidth: 480,
      background: 'var(--ig-color-surface-panel)',
      hidden: !rightSidebar,
    },
  ]

  return (
    <>
      <PagePrimaryHeader
        title={page.title}
        subtitle={page.subtitle}
        rightSlot={page.projectName ?? undefined}
      />
      <ContentArea>
        {page.dragOverFull ? <DragOverFull>Drop images here to upload</DragOverFull> : null}
        <ResizableColumnsLayout storageKey={STORAGE_KEY} columns={columns} style={ROOT_STYLE}>
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
          <Stack gap={0} style={CENTER_STYLE}>
            <Box style={SLOT_STYLE}>
              <CatalogToolbarRow
                {...toolbar}
                sidebarCollapsed={!!datasets.sidebarCollapsed}
                onExpandSidebar={datasets.onExpand}
              />
            </Box>
            <Box style={BODY_STYLE}>
              <CatalogBody
                permissionDenied={page.permissionDenied}
                error={page.error}
                viewMode={toolbar.viewMode}
                imagesPane={images}
                dragOverGrid={page.dragOverGrid}
                statsContent={statsContent}
              />
            </Box>
          </Stack>
          {rightSidebar ? <CatalogRightSidebar {...rightSidebar} /> : <div />}
        </ResizableColumnsLayout>
      </ContentArea>
    </>
  )
}
