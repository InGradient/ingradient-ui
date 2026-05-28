import React from 'react'
import styled from 'styled-components'
import { Inline, Stack, Text } from '../../primitives'
import { ColorSwatch } from '../data-display/color-swatch'

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

export interface ProgressSegment {
  label: string
  value: number
  color: string
}

export interface SegmentedProgressBarProps {
  segments: ProgressSegment[]
  total?: number
  showLegend?: boolean
  className?: string
}

/**
 * Multi-segment progress bar with optional legend.
 * 각 세그먼트는 색 + 라벨 + 값. total 미지정 시 segments 의 value 합산.
 * Labeling progress / 분석 단계별 진척 / 분포 시각화 등에 generic.
 */
export function SegmentedProgressBar({
  segments, total, showLegend = true, className,
}: SegmentedProgressBarProps) {
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
              <Text as="strong" weight="bold" tabularNums>{s.value.toLocaleString()}</Text>
            </Inline>
          ))}
        </Inline>
      ) : null}
    </Stack>
  )
}
