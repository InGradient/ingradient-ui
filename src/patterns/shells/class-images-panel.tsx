import type { ReactNode } from 'react'
import { Box, Stack, Text } from '../../primitives'

const MAIN_STYLE = {
  flex: 1,
  background: 'var(--ig-color-surface-panel)',
  borderRadius: 'var(--ig-radius-xl)',
  border: '1px solid var(--ig-color-border-subtle)',
  overflow: 'hidden' as const,
}

const EMPTY_STYLE = {
  flex: 1,
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  padding: 'var(--ig-space-11)',
  textAlign: 'center' as const,
}

const LOADING_STYLE = {
  padding: 'var(--ig-space-9)',
  textAlign: 'center' as const,
}

const GRID_STYLE = { flex: 1, overflow: 'auto' as const }

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
      <Stack as="main" gap={0} style={MAIN_STYLE}>
        <Text tone="soft" size="14px" style={EMPTY_STYLE}>{noSelectionText}</Text>
      </Stack>
    )
  }
  return (
    <Stack as="main" gap={0} style={MAIN_STYLE}>
      {chipsRow}
      {imagesLoading ? (
        <Text tone="muted" size="14px" style={LOADING_STYLE}>{imagesLoadingText}</Text>
      ) : imagesEmpty ? (
        <Text tone="soft" size="14px" style={EMPTY_STYLE}>{imagesEmptyText}</Text>
      ) : (
        <Box style={GRID_STYLE}>{grid}</Box>
      )}
    </Stack>
  )
}
