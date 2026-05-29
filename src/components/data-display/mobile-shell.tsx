import type { ReactNode } from 'react'
import { Box, Stack } from '../../primitives'

const ROOT_STYLE = {
  height: '100%',
  width: '100%',
  background: 'var(--ig-color-bg-canvas)',
  color: 'var(--ig-color-text-primary)',
  overflow: 'hidden' as const,
}

const TOP_BAR_STYLE = {
  padding: 'var(--ig-space-4) var(--ig-space-6)',
  background: 'var(--ig-color-surface-raised)',
  borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  flexShrink: 0,
  position: 'relative' as const,
  zIndex: 'var(--ig-z-header)' as unknown as number,
}

const BODY_STYLE = { flex: 1, overflow: 'hidden' as const }

const BOTTOM_BAR_STYLE = {
  flexShrink: 0,
  position: 'sticky' as const,
  bottom: 0,
  zIndex: 'var(--ig-z-sticky)' as unknown as number,
}

export interface MobileShellProps {
  topBar: ReactNode
  body: ReactNode
  bottomBar?: ReactNode
}

export function MobileShell({ topBar, body, bottomBar }: MobileShellProps) {
  return (
    <Stack gap={0} style={ROOT_STYLE}>
      <Box style={TOP_BAR_STYLE}>{topBar}</Box>
      <Stack gap={0} style={BODY_STYLE}>{body}</Stack>
      {bottomBar ? <Box style={BOTTOM_BAR_STYLE}>{bottomBar}</Box> : null}
    </Stack>
  )
}
