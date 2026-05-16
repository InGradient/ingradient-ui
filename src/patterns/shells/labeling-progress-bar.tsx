import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

const Bar = styled.div`
  display: flex;
  width: 100%;
  height: 24px;
  border-radius: var(--ig-radius-pill);
  overflow: hidden;
  background: var(--ig-color-progress-track);
`

const Segment = styled.div<{ $width: number; $color: string }>`
  flex: 0 0 ${(p) => p.$width}%;
  background: ${(p) => p.$color};
  transition: flex-basis var(--ig-motion-normal);
`

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-5);
`

const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-secondary);
`

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.$color};
`

const Value = styled.strong`
  color: var(--ig-color-text-primary);
  font-variant-numeric: tabular-nums;
`

export interface LabelingSegment {
  label: string
  value: number
  color: string
}

export interface LabelingProgressBarProps {
  segments: LabelingSegment[]
  total?: number
  showLegend?: boolean
  className?: string
}

export function LabelingProgressBar({
  segments, total, showLegend = true, className,
}: LabelingProgressBarProps) {
  const sum = total ?? segments.reduce((acc, s) => acc + s.value, 0)
  return (
    <Wrap className={className}>
      <Bar role="progressbar" aria-valuemin={0} aria-valuemax={sum} aria-valuenow={segments[0]?.value ?? 0}>
        {segments.map((s, i) => (
          <Segment key={i} $width={sum > 0 ? (s.value / sum) * 100 : 0} $color={s.color} title={`${s.label}: ${s.value}`} />
        ))}
      </Bar>
      {showLegend ? (
        <Legend>
          {segments.map((s, i) => (
            <LegendItem key={i}>
              <Dot $color={s.color} />
              {s.label} <Value>{s.value.toLocaleString()}</Value>
            </LegendItem>
          ))}
        </Legend>
      ) : null}
    </Wrap>
  )
}
