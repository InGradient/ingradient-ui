import type { ReactNode } from 'react'
import { Box, Stack, Text } from '@ingradient/ui/primitives'

const MAIN_BASE_STYLE = {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  height: '100%',
  overflow: 'hidden' as const,
}

const MAIN_PANEL_STYLE = {
  ...MAIN_BASE_STYLE,
  background: 'var(--ig-color-surface-panel)',
  borderRadius: 'var(--ig-radius-xl)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
}

const MAIN_FLUSH_STYLE = {
  ...MAIN_BASE_STYLE,
  background: 'transparent',
  borderRadius: 0,
  border: 'none',
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
  /** flush 시 패널 표면(배경/테두리/라운드) 제거 — shell 컬럼 내부용. */
  flush?: boolean
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
  loading, empty, gridSlot, flush = false,
  noSelectionText = 'Select an item to see related entries.',
  loadingText = 'Loading…',
  emptyText = 'No matching entries.',
}: SelectableGridPanelProps) {
  const mainStyle = flush ? MAIN_FLUSH_STYLE : MAIN_PANEL_STYLE
  if (!selectedId) {
    return (
      <Stack as="main" gap={0} style={mainStyle}>
        <Text tone="soft" size="var(--ig-font-size-md)" style={EMPTY_STYLE}>{noSelectionText}</Text>
      </Stack>
    )
  }
  return (
    <Stack as="main" gap={0} style={mainStyle}>
      {headerSlot}
      {loading ? (
        <Text tone="muted" size="var(--ig-font-size-md)" style={LOADING_STYLE}>{loadingText}</Text>
      ) : empty ? (
        <Text tone="soft" size="var(--ig-font-size-md)" style={EMPTY_STYLE}>{emptyText}</Text>
      ) : (
        <Box style={GRID_STYLE}>{gridSlot}</Box>
      )}
    </Stack>
  )
}
