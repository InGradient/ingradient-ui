import type { CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'
import { Alert, EmptyState, Spinner } from '@ingradient/ui/components'
import { GalleryImagesTable } from './gallery'
import { Stack, stateTitleText } from '@ingradient/ui/primitives'
import { CatalogGridView } from './CatalogGridView'
import { TableWrap } from './CatalogView.styles'
import type { CatalogImagesPaneProps, CatalogViewMode } from './types'

const ALERT_STYLE: CSSProperties = { margin: 'var(--ig-space-7)' }
const PERMISSION_DENIED_TEXT = "You don't have permission to view images."
const LOADING_TEXT = 'Loading images…'
const EMPTY_TITLE = 'No images'
const EMPTY_DESC = 'Upload images or select a different dataset.'
const STATS_EMPTY_TITLE = 'No data'
const STATS_EMPTY_DESC = 'Stats are available when at least one image is uploaded.'

const EmptyStateWrap = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: var(--ig-popup-md);
  display: grid;
  place-items: center;
  padding: var(--ig-space-7);
`

const LoadingText = styled.span`
  ${stateTitleText}
`

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
      <EmptyStateWrap>
        <Stack gap={3} align="center">
          <Spinner size="lg" />
          <LoadingText>{LOADING_TEXT}</LoadingText>
        </Stack>
      </EmptyStateWrap>
    )
  }
  if (imagesPane.images.length === 0) {
    if (viewMode === 'stats') {
      return (
        <EmptyStateWrap>
          <EmptyState
            title={STATS_EMPTY_TITLE}
            description={STATS_EMPTY_DESC}
            data-ig-slot="CatalogBody.EmptyStatsState"
          />
        </EmptyStateWrap>
      )
    }
    return (
      <EmptyStateWrap>
        <EmptyState
          title={EMPTY_TITLE}
          description={EMPTY_DESC}
          data-ig-slot="CatalogBody.EmptyImagesState"
        />
      </EmptyStateWrap>
    )
  }
  if (viewMode === 'table') {
    return (
      <TableWrap>
        <GalleryImagesTable
          images={imagesPane.images}
          selectedIds={imagesPane.selectedImageIds}
          datasetNameById={imagesPane.datasetNameById}
          openMenuId={imagesPane.openMenuId}
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
