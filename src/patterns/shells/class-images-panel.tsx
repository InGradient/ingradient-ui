import type { ReactNode } from 'react'
import styled from 'styled-components'
import { stateCenteredLayout, stateTitleText } from '../../primitives'

const Main = styled.main<{ $flush: boolean }>`
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(p) => (p.$flush ? 'transparent' : 'var(--ig-color-surface-panel)')};
  border-radius: ${(p) => (p.$flush ? 0 : 'var(--ig-radius-xl)')};
  border: ${(p) => (p.$flush ? 'none' : '1px solid var(--ig-color-border-subtle)')};
  overflow: hidden;
`

const EmptyArea = styled.div`
  ${stateTitleText}
  ${stateCenteredLayout}
  padding: 24px;
`

const LoadingArea = styled.div`
  ${stateTitleText}
  ${stateCenteredLayout}
  padding: 20px;
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
  flush?: boolean
  noSelectionText?: string
  imagesLoadingText?: string
  imagesEmptyText?: string
}

export function ClassImagesPanel({
  selectedClassId, chipsRow,
  imagesLoading, imagesEmpty, grid, flush = false,
  noSelectionText = 'Select a class to see linked datasets and images.',
  imagesLoadingText = 'Loading images…',
  imagesEmptyText = 'No images with this class in the selected datasets.',
}: ClassImagesPanelProps) {
  if (!selectedClassId) {
    return (
      <Main $flush={flush}>
        {chipsRow}
        <EmptyArea>{noSelectionText}</EmptyArea>
      </Main>
    )
  }
  return (
    <Main $flush={flush}>
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
