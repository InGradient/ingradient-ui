import type { ReactNode } from 'react'
import styled from 'styled-components'

const Main = styled.main`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--ig-color-surface-panel);
  border-radius: var(--ig-radius-xl);
  border: 1px solid var(--ig-color-border-subtle);
  overflow: hidden;
`

const EmptyArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ig-color-text-soft);
  font-size: 14px;
  padding: 24px;
  text-align: center;
`

const LoadingArea = styled.div`
  padding: 20px;
  color: var(--ig-color-text-muted);
  font-size: 14px;
  text-align: center;
`

const GridArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`

export interface ClassImagesPanelProps {
  /** null/undefined → "Select a class…" empty state */
  selectedClassId?: string | null
  chipsRow?: ReactNode
  imagesLoading?: boolean
  imagesEmpty?: boolean
  grid?: ReactNode
  noSelectionText?: string
  imagesLoadingText?: string
  imagesEmptyText?: string
}

export function ClassImagesPanel({
  selectedClassId, chipsRow,
  imagesLoading, imagesEmpty, grid,
  noSelectionText = 'Select a class to see linked datasets and images.',
  imagesLoadingText = 'Loading images…',
  imagesEmptyText = 'No images with this class in the selected datasets.',
}: ClassImagesPanelProps) {
  if (!selectedClassId) {
    return (
      <Main>
        <EmptyArea>{noSelectionText}</EmptyArea>
      </Main>
    )
  }
  return (
    <Main>
      {chipsRow}
      {imagesLoading ? (
        <LoadingArea>{imagesLoadingText}</LoadingArea>
      ) : imagesEmpty ? (
        <EmptyArea>{imagesEmptyText}</EmptyArea>
      ) : (
        <GridArea>{grid}</GridArea>
      )}
    </Main>
  )
}
