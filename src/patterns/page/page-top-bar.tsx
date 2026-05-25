import React from 'react'
import { Inline, Stack, Text } from '../../primitives'

const TITLE_STYLE = { overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const }

const BAR_STYLE = {
  minHeight: 72,
  padding: '0 var(--ig-space-7)',
  background: 'var(--ig-color-surface-header)',
  borderBottom: '1px solid var(--ig-color-border-subtle)',
  flexShrink: 0,
}

const TITLE_BLOCK_STYLE = { minWidth: 0, flex: 1, gap: 2 }

export interface PageTopBarProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  rightSlot?: React.ReactNode
  className?: string
}

export function PageTopBar({ title, subtitle, rightSlot, className }: PageTopBarProps) {
  return (
    <Inline as="header" gap={5} className={className} style={BAR_STYLE}>
      <Stack gap={0} style={TITLE_BLOCK_STYLE}>
        <Text as="h1" size="var(--ig-font-size-lg)" weight={600} style={TITLE_STYLE}>{title}</Text>
        {subtitle ? <Text as="p" tone="muted" size="var(--ig-font-size-xs)" style={TITLE_STYLE}>{subtitle}</Text> : null}
      </Stack>
      {rightSlot ? <Inline gap={3} style={{ flexShrink: 0 }}>{rightSlot}</Inline> : null}
    </Inline>
  )
}
