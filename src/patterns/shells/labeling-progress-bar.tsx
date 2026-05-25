import React from 'react'
import styled from 'styled-components'
import { Inline, Stack, Text } from '../../primitives'
import { ColorSwatch } from '../../components/data-display/color-swatch'

const BAR_STYLE = {
  display: 'flex' as const,
  width: '100%',
  height: 24,
  borderRadius: 'var(--ig-radius-pill)',
  overflow: 'hidden' as const,
  background: 'var(--ig-color-progress-track)',
}

const Segment = styled.div<{ $width: number; $color: string }>`
  flex: 0 0 ${(p) => p.$width}%;
  background: ${(p) => p.$color};
  transition: flex-basis var(--ig-motion-normal);
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
    <Stack gap={3} className={className}>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={sum} aria-valuenow={segments[0]?.value ?? 0} style={BAR_STYLE}>
        {segments.map((s, i) => (
          <Segment key={i} $width={sum > 0 ? (s.value / sum) * 100 : 0} $color={s.color} title={`${s.label}: ${s.value}`} />
        ))}
      </div>
      {showLegend ? (
        <Inline gap={5}>
          {segments.map((s, i) => (
            <Inline as="span" key={i} gap={2}>
              <ColorSwatch $color={s.color} $size="xs" />
              <Text size="var(--ig-font-size-sm)" tone="secondary">{s.label}</Text>
              <Text as="strong" weight={700} tabularNums>{s.value.toLocaleString()}</Text>
            </Inline>
          ))}
        </Inline>
      ) : null}
    </Stack>
  )
}
