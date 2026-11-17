import styled from 'styled-components'
import type { ReactNode } from 'react'
import { PagePrimaryHeader } from '@ingradient/ui/patterns'
import { DatasetListPanel } from './dataset-list-panel'
import { ResizableColumnsLayout, type ResizableColumn } from '@ingradient/ui/components'
import { Stack, Box } from '@ingradient/ui/primitives'
import { layoutSizeNumbers } from '@ingradient/ui/tokens'
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

const CenterBox = styled(Stack)`
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
`
const SlotBox = styled(Box)`
  flex: 0 0 auto;
`
const BodyBox = styled(Box)`
  flex: 1;
  min-height: 0;
  overflow: auto;
  position: relative;
`
const RootBox = styled(ResizableColumnsLayout)`
  background: var(--ig-color-bg-canvas);
`

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
      width: layoutSizeNumbers.sidePanel,
      resizable: true,
      minWidth: layoutSizeNumbers.sidePanelMin,
      maxWidth: layoutSizeNumbers.sidePanelMax,
      collapsed: datasets.sidebarCollapsed,
    },
    { width: 'auto' },
    {
      width: layoutSizeNumbers.sidePanel,
      resizable: true,
      minWidth: layoutSizeNumbers.sidePanelMin,
      maxWidth: layoutSizeNumbers.sidePanelMax,
      background: 'var(--ig-color-surface-panel)',
      dividerBefore: 'strong',
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
        <RootBox storageKey={STORAGE_KEY} columns={columns}>
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
          <CenterBox gap="var(--ig-space-0)">
            <SlotBox>
              <CatalogToolbarRow
                {...toolbar}
                sidebarCollapsed={!!datasets.sidebarCollapsed}
                onExpandSidebar={datasets.onExpand}
              />
            </SlotBox>
            <BodyBox>
              <CatalogBody
                permissionDenied={page.permissionDenied}
                error={page.error}
                viewMode={toolbar.viewMode}
                imagesPane={images}
                dragOverGrid={page.dragOverGrid}
                statsContent={statsContent}
              />
            </BodyBox>
          </CenterBox>
          {rightSidebar ? <CatalogRightSidebar {...rightSidebar} /> : <div />}
        </RootBox>
      </ContentArea>
    </>
  )
}
