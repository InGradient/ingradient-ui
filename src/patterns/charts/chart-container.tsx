import React from 'react'
import styled from 'styled-components'
import { Skeleton } from '../../components/feedback'
import { Inline, Stack, surfaceCard, Text } from '../../primitives'

const ChartCard = styled.div`
  ${surfaceCard}
  border-radius: var(--ig-radius-xl);
  padding: var(--ig-space-8);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-6);
`

const ChartFrame = styled.div<{ $height: number }>`
  width: 100%;
  height: ${(p) => `${p.$height}px`};
  min-width: var(--ig-popup-sm);
  min-height: ${(p) => `${p.$height}px`};
`

const EMPTY_STYLE = { padding: 'var(--ig-space-12)' }
const LOADING_STYLE = { display: 'grid' as const, gap: 'var(--ig-space-4)' }

export function ChartContainer({
  title,
  description,
  height = 260,
  loading = false,
  empty = false,
  emptyMessage = 'No chart data available.',
  legend,
  headerExtra,
  children,
}: {
  title?: string
  description?: string
  height?: number
  loading?: boolean
  empty?: boolean
  emptyMessage?: string
  legend?: React.ReactNode
  headerExtra?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <ChartCard>
      {(title || description || headerExtra || legend) ? (
        <Inline justify="space-between" align="flex-start" gap="var(--ig-space-5)" wrap="wrap" data-ig-chart-head>
          <Stack gap="var(--ig-space-1)">
            {title ? <Text as="h3" size="var(--ig-font-size-md)" weight="bold">{title}</Text> : null}
            {description ? <Text as="p" size="var(--ig-font-size-xs)" tone="muted" style={{ lineHeight: 'var(--ig-line-height-relaxed)' }}>{description}</Text> : null}
          </Stack>
          {(headerExtra || legend) ? (
            <Inline gap="var(--ig-space-4)" wrap="wrap">
              {headerExtra}
              {legend}
            </Inline>
          ) : null}
        </Inline>
      ) : null}
      <ChartFrame $height={height}>
        {loading ? <div style={LOADING_STYLE}><Skeleton $height="var(--ig-icon-lg)" /><Skeleton $height={`${Math.max(180, height - 42)}px`} /></div> : empty ? <Text align="center" tone="muted" size="var(--ig-font-size-md)" style={EMPTY_STYLE}>{emptyMessage}</Text> : children}
      </ChartFrame>
    </ChartCard>
  )
}
