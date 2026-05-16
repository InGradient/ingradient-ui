import type { CSSProperties, ReactNode } from 'react'
import { Alert, EmptyState, Spinner } from '@ingradient/ui/components'
import { GalleryImagesTable } from '@ingradient/ui/patterns'
import { Stack } from '@ingradient/ui/primitives'
import { CatalogGridView } from './CatalogGridView'
import { TableWrap } from './CatalogView.styles'
import type { CatalogImagesPaneProps, CatalogViewMode } from './types'

const ALERT_STYLE: CSSProperties = { margin: 'var(--ig-space-7)' }
const LOADING_STYLE: CSSProperties = { padding: 'var(--ig-space-12)' }
const PERMISSION_DENIED_TEXT = "You don't have permission to view images."
const LOADING_TEXT = 'Loading images…'
const EMPTY_TITLE = 'No images'
const EMPTY_DESC = 'Upload images or select a different dataset.'
const STATS_EMPTY_TITLE = 'No data'
const STATS_EMPTY_DESC = 'Stats are available when at least one image is uploaded.'

interface CatalogBodyProps {
  permissionDenied?: boolean
  error?: string | null
  viewMode: CatalogViewMode
  imagesPane: CatalogImagesPaneProps
  dragOverGrid?: boolean
  statsContent?: ReactNode
}

export function CatalogBody({
  permissionDenied,
  error,
  viewMode,
  imagesPane,
  dragOverGrid,
  statsContent,
}: CatalogBodyProps) {
  if (permissionDenied) {
    return (
      <Alert $tone="warning" style={ALERT_STYLE}>
        {PERMISSION_DENIED_TEXT}
      </Alert>
    )
  }
  if (error) {
    return (
      <Alert $tone="danger" style={ALERT_STYLE}>
        {error}
      </Alert>
    )
  }
  if (imagesPane.loading) {
    return (
      <Stack gap={3} align="center" style={LOADING_STYLE}>
        <Spinner size="lg" />
        <span>{LOADING_TEXT}</span>
      </Stack>
    )
  }
  if (imagesPane.images.length === 0) {
    if (viewMode === 'stats') {
      return <EmptyState title={STATS_EMPTY_TITLE} description={STATS_EMPTY_DESC} />
    }
    return <EmptyState title={EMPTY_TITLE} description={EMPTY_DESC} />
  }
  if (viewMode === 'table') {
    return (
      <TableWrap>
        <GalleryImagesTable
          images={imagesPane.images}
          selectedIds={imagesPane.selectedImageIds}
          datasetNameById={imagesPane.datasetNameById}
          onToggleSelect={imagesPane.onToggleSelect}
          onOpenMenu={imagesPane.onOpenMenu}
          onRowClick={(id) => imagesPane.onOpenDetail(id)}
        />
      </TableWrap>
    )
  }
  if (viewMode === 'stats') {
    return statsContent ?? null
  }
  return (
    <CatalogGridView
      images={imagesPane.images}
      selectedImageIds={imagesPane.selectedImageIds}
      hoverImageId={imagesPane.hoverImageId}
      datasetNameById={imagesPane.datasetNameById}
      onToggleSelect={imagesPane.onToggleSelect}
      onOpenDetail={imagesPane.onOpenDetail}
      onOpenMenu={imagesPane.onOpenMenu}
      dragOverGrid={dragOverGrid}
    />
  )
}
