import React from 'react'
import styled from 'styled-components'
import { Inline, Stack, surfaceCard, Text } from '@ingradient/ui/primitives'

const Root = styled.div<{ $span: number }>`
  ${surfaceCard}
  border-radius: var(--ig-radius-xl);
  padding: var(--ig-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  grid-column: span ${(p) => p.$span};
  min-width: 0;
`

const TITLE_BLOCK_STYLE = { gap: 'var(--ig-space-2px)' }
const BODY_STYLE = { flex: 1, minHeight: 0 }

export interface DashboardWidgetProps {
  title: React.ReactNode
  titleAs?: 'h2' | 'h3' | 'h4'
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  span?: number
  children: React.ReactNode
  className?: string
}

export function DashboardWidget({
  title, titleAs = 'h4', subtitle, actions, span = 1, children, className,
}: DashboardWidgetProps) {
  return (
    <Root $span={span} className={className}>
      <Inline justify="space-between" gap="var(--ig-space-3)">
        <Stack gap={0} style={TITLE_BLOCK_STYLE}>
          <Text as={titleAs} size="var(--ig-font-size-md)" weight="semibold">{title}</Text>
          {subtitle ? <Text size="var(--ig-font-size-xs)" tone="muted">{subtitle}</Text> : null}
        </Stack>
        {actions ? <Inline gap="var(--ig-space-2)">{actions}</Inline> : null}
      </Inline>
      <Stack gap={0} style={BODY_STYLE}>{children}</Stack>
    </Root>
  )
}
