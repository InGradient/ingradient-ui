import React from 'react'
import styled from 'styled-components'
import { EmptyStateText, Skeleton } from '../feedback'
import { surfaceCard } from '../../primitives'

const ChartCard = styled.div`
  ${surfaceCard}
  border-radius: 22px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const ChartHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

const ChartCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ChartTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--ig-color-text-primary);
`

const ChartDescription = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ig-color-text-muted);
`

const ChartFrame = styled.div<{ $height: number }>`
  width: 100%;
  height: ${(p) => `${p.$height}px`};
  min-height: 0;
`

export function ChartContainer({
  title,
  description,
  height = 260,
  loading = false,
  empty = false,
  emptyMessage = 'No chart data available.',
  legend,
  children,
}: {
  title: string
  description?: string
  height?: number
  loading?: boolean
  empty?: boolean
  emptyMessage?: string
  legend?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <ChartCard>
      <ChartHead>
        <ChartCopy>
          <ChartTitle>{title}</ChartTitle>
          {description ? <ChartDescription>{description}</ChartDescription> : null}
        </ChartCopy>
        {legend}
      </ChartHead>
      <ChartFrame $height={height}>
        {loading ? <div style={{ display: 'grid', gap: 10 }}><Skeleton $height="18px" /><Skeleton $height={`${Math.max(180, height - 42)}px`} /></div> : empty ? <EmptyStateText>{emptyMessage}</EmptyStateText> : children}
      </ChartFrame>
    </ChartCard>
  )
}
