import type { ReactNode } from 'react'
import { Box, Stack, Text } from '../primitives'

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

export interface SelectableGridPanelProps {
  /** 선택된 id — null/undefined 시 "선택 없음" empty 표시. */
  selectedId?: string | null
  /** Header 슬롯 — 보통 칩 row 또는 필터. */
  headerSlot?: ReactNode
  loading?: boolean
  empty?: boolean
  /** 그리드 슬롯 — 보통 ImageGrid 등. */
  gridSlot?: ReactNode
  /** 선택 없음 메시지. */
  noSelectionText?: string
  /** 로딩 메시지. */
  loadingText?: string
  /** 비어있음 메시지. */
  emptyText?: string
}

/**
 * Header (filter chips 등) + grid + empty/loading 상태 처리 panel.
 * 선택된 item 이 없으면 noSelectionText 만 표시.
 * Class images / dataset items / 일반 selectable grid context 에 generic.
 */
export function SelectableGridPanel({
  selectedId, headerSlot,
  loading, empty, gridSlot,
  noSelectionText = 'Select an item to see related entries.',
  loadingText = 'Loading…',
  emptyText = 'No matching entries.',
}: SelectableGridPanelProps) {
  if (!selectedId) {
    return (
      <Stack as="main" gap={0} style={MAIN_STYLE}>
        <Text tone="soft" size="14px" style={EMPTY_STYLE}>{noSelectionText}</Text>
      </Stack>
    )
  }
  return (
    <Stack as="main" gap={0} style={MAIN_STYLE}>
      {headerSlot}
      {loading ? (
        <Text tone="muted" size="14px" style={LOADING_STYLE}>{loadingText}</Text>
      ) : empty ? (
        <Text tone="soft" size="14px" style={EMPTY_STYLE}>{emptyText}</Text>
      ) : (
        <Box style={GRID_STYLE}>{gridSlot}</Box>
      )}
    </Stack>
  )
}
